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
      const priceUnit = parseFloat(itemToReturn.priceUnit.replace(",", "."));

      if (returnQtd > requestedQtd) {
        throw new Error(`A quantidade devolvida para o item não pode ser maior que a quantidade solicitada!`);
      }

      // Verificar se já existe uma devolução para este item
      const existingReturnRequest = await prismaClient.returnRequest.findFirst({
        where: {
          request_codreq: request_codreq,
          item_id: item_id,
        },
      });

      // Calcular o valor de devolução
      const itemReturnPrice = returnQtd * priceUnit;
      let totalDevolvido = itemReturnPrice;
      let updatedQtdEst = requestedQtd - returnQtd;

      if (existingReturnRequest) {
        // Se já existir uma devolução para o item, somamos a quantidade devolvida e atualizamos o total
        const existingQtdDevolvida = parseFloat(existingReturnRequest.qtdEst.replace(",", "."));
        totalDevolvido += existingQtdDevolvida * priceUnit;  // Soma o valor da devolução existente

        // Atualiza a quantidade restante
        updatedQtdEst = requestedQtd - (existingQtdDevolvida + returnQtd); 
      }

      // Atualizar o item da requisição
      await prismaClient.requestItem.update({
        where: { id: item_id },
        data: {
          qtdEst: updatedQtdEst.toFixed(2).replace(".", ","), // Atualiza quantidade restante
          priceTotal: (updatedQtdEst * priceUnit).toFixed(2).replace(".", ","), // Atualiza valor total
        },
      });
      
      // Determina quantas casas decimais o usuário digitou
      const decimalPlaces = qtdEst.includes('.') ? qtdEst.split('.')[1].length : 0;
      
      // Criar ou atualizar o registro de devolução
      const returnRequest = await prismaClient.returnRequest.upsert({
        where: {
          id: existingReturnRequest?.id || "", // Se existir, atualiza, senão cria um novo
        },
        update: {
          qtdEst: (returnQtd + (existingReturnRequest ? parseFloat(existingReturnRequest.qtdEst.replace(",", ".")) : 0)).toFixed(2).replace(".", ","),
          priceTotal: totalDevolvido.toFixed(2).replace(".", ","),
        },
        create: {
          request_codreq: request_codreq,  // ID da requisição
          item_id: item_id, // ID do item
          qtdEst: returnQtd.toFixed(decimalPlaces).replace(".", ","), // Quantidade devolvida
          priceTotal: itemReturnPrice.toFixed(2).replace(".", ","), // Preço total da devolução
          created_user: created_user, // Usuário que criou a devolução
        },
      });

      // Armazenar o item de devolução
      returnRequests.push(returnRequest);

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
