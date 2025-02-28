import prismaClient from "../../prisma";

interface RequestItem {
    ingredient_id: string;
    qtdEst: string;
}

interface RequestData {
    items: RequestItem[];
    description?: string;
    created_user: string;
}

class CreateRequestService {
    async execute({ items, description, created_user }: RequestData) {
        if (!items || items.length === 0) {
            throw new Error("É necessário adicionar pelo menos um ingrediente!");
        }

        // Iniciar uma transação
        const request = await prismaClient.$transaction(async (prisma) => {
            // Criar a requisição principal
            const createdRequest = await prisma.request.create({
                data: {
                    description,
                    created_user,
                },
            });

            // Criar os itens associados à requisição principal
            const requestItemsList = await Promise.all(
                items.map(async (item) => {
                    const { ingredient_id, qtdEst } = item;

                    if (!ingredient_id) {
                        throw new Error("ID do ingrediente é obrigatório!");
                    }

                    // Converter `qtdEst` para número
                    const requestedQtd = parseFloat(qtdEst.replace(",", "."));
                    if (isNaN(requestedQtd) || requestedQtd <= 0) {
                        throw new Error("A quantidade deve ser um número válido maior que zero!");
                    }

                    // Buscar ingrediente no banco
                    const ingredient = await prisma.ingredient.findUnique({
                        where: { id: ingredient_id },
                    });

                    if (!ingredient) {
                        throw new Error(`Ingrediente com ID ${ingredient_id} não encontrado!`);
                    }

                    // Garantir que `priceUnit` seja tratado como string e convertido corretamente
                    const priceUnit = parseFloat(String(ingredient.priceUnit).replace(",", "."));
                    if (isNaN(priceUnit)) {
                        throw new Error(`O preço unitário do ingrediente ${ingredient_id} não é válido!`);
                    }

                    const priceTotal = requestedQtd * priceUnit;

                    // Determina quantas casas decimais o usuário digitou
                    const decimalPlaces = qtdEst.includes('.') ? qtdEst.split('.')[1].length : 0;

                    // Criar o item da requisição
                    const requestItem = await prisma.requestItem.create({
                        data: {
                            ingredient_id,
                            qtdEst: requestedQtd.toFixed(decimalPlaces).replace(".", ","),
                            priceUnit: priceUnit.toFixed(2).replace(".", ","),
                            priceTotal: priceTotal.toFixed(2).replace(".", ","),
                            request_id: createdRequest.id, // Relacionar o item à requisição criada
                        },
                    });

                    return requestItem; // Retorna cada item
                })
            );

            return { request: createdRequest, items: requestItemsList }; // Retorna a requisição e seus itens
        });

        return request;
    }
}

export { CreateRequestService };
