import prismaClient from "../../prisma";

interface ReturnRequestData {
  request_codreq: number; // ID da requisição original
  items: { id: string; qtdEst: string }[]; // Array de itens (com id e qtdEst)
  created_user: string; // Usuário que está registrando a devolução
}

class CreateReturnRequestService {
  async execute({ request_codreq, items, created_user }: ReturnRequestData) {
    if (!request_codreq) {
      throw new Error("ID da requisição é obrigatório!");
    }

    // Buscar a requisição original com seus itens
    const originalRequest = await prismaClient.request.findUnique({
      where: { codreq: request_codreq },
      include: {
        items: true, // Incluir os itens da requisição
      },
    });

    if (!originalRequest) {
      throw new Error("Requisição não encontrada!");
    }

    // Criar um array para armazenar os itens de devolução e os itens atualizados
    const returnRequests = [];
    const updatedItems = [];

    // Loop através dos itens para processar cada devolução
    for (const { id: item_id, qtdEst } of items) {
      // Verificar se o item_id existe na requisição
      const itemToReturn = originalRequest.items.find(item => item.id === item_id);
      if (!itemToReturn) {
        throw new Error(`Item não encontrado na requisição!`);
      }

      // Converter a quantidade devolvida para número
      const returnQtd = parseFloat(qtdEst.replace(",", "."));
      if (isNaN(returnQtd) || returnQtd <= 0) {
        throw new Error(`A quantidade devolvida deve ser um número válido maior que zero!`);
      }

      const requestedQtd = parseFloat(itemToReturn.qtdEst.replace(",", "."));
      const priceUnit = parseFloat(itemToReturn.priceUnit.toString().replace(",", ".")); // Garantindo que seja tratado como número

      // Verificar se já existe uma devolução para este item
      const existingReturnRequest = await prismaClient.returnRequest.findFirst({
        where: {
          request_codreq: request_codreq,
          item_id: item_id,
        },
      });

      // Calcular o total devolvido até o momento (incluindo a nova devolução)
      const totalDevolvidoAteAgora = existingReturnRequest
        ? parseFloat(existingReturnRequest.qtdEst.replace(",", ".")) + returnQtd
        : returnQtd;

      // Verificar se o total devolvido não excede a quantidade solicitada
      if (totalDevolvidoAteAgora > requestedQtd) {
        throw new Error(`A quantidade devolvida para o item não pode ser maior que a quantidade solicitada!`);
      }

      // Determina quantas casas decimais o usuário digitou
      const decimalPlaces = qtdEst.includes('.') ? qtdEst.split('.')[1].length : 0;

      // Atualizar o registro de devolução (soma com a devolução anterior)
      const returnRequest = await prismaClient.returnRequest.upsert({
        where: existingReturnRequest ? { id: existingReturnRequest.id } : { id: "" },
        update: {
          qtdEst: totalDevolvidoAteAgora.toFixed(decimalPlaces).replace(".", ","), // Soma a nova quantidade com a já existente
          priceTotal: (totalDevolvidoAteAgora * priceUnit).toFixed(2).replace(".", ","),
        },
        create: {
          request_codreq: request_codreq,  // ID da requisição
          item_id: item_id, // ID do item
          qtdEst: returnQtd.toFixed(decimalPlaces).replace(".", ","), // Quantidade devolvida
          priceTotal: (returnQtd * priceUnit).toFixed(2).replace(".", ","), // Preço total da devolução
          created_user: created_user, // Usuário que criou a devolução
        },
      });

      // Armazenar o item de devolução
      returnRequests.push(returnRequest);

      // Calcular a quantidade restante (baseada na quantidade original menos o total devolvido)
      const updatedQtdEst = requestedQtd - totalDevolvidoAteAgora;

      // Armazenar o item atualizado
      updatedItems.push({
        id: item_id,
        qtdEst: updatedQtdEst,
        priceTotal: updatedQtdEst * priceUnit,
      });
    }

    return {
      returnRequests, // Retorna os registros de devolução
      updatedItems, // Retorna os itens atualizados
    };
  }
}

export { CreateReturnRequestService };