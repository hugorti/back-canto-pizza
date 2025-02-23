import prismaClient from "../../prisma";

class ListByReturnRequestService {
    async execute(codreq: number) {
        const returnRequest = await prismaClient.returnRequest.findMany({
            where: {
                request: {  // Relacionamento com a requisição
                    codreq: codreq,  // Filtra pela codreq
                },
            },
            include: {
                request: {  // Inclui os dados da requisição associada
                    select: {
                        codreq: true,
                        description: true,  // Outros campos de Request
                    },
                },
                item: {  // Relacionamento com os itens da devolução
                    select: {
                        id: true,
                        ingredient_id: true,
                        qtdEst: true,
                        priceUnit: true,
                        priceTotal: true,
                        created_at: true,
                        ingredient: {
                            select: {
                                coding: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        return returnRequest;
    }
}

export { ListByReturnRequestService };
