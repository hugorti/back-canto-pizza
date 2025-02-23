import prismaClient from "../../prisma";

class ListByRequestService {
    async execute() {
        const requests = await prismaClient.request.findMany({
            include: {
                items: {
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
                        return_request: {
                            select: {
                                qtdEst: true,
                                priceTotal: true,
                                created_at: true,
                            },
                        },
                    },
                },
               
            },
        });

        return requests;
    }
}

export { ListByRequestService };
