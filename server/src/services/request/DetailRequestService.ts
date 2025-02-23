import prismaClient from "../../prisma";

class DetailRequestService{
    async execute(codreq: number){

        const requests = await prismaClient.request.findFirst({
            where: {
                    codreq: codreq,  // Filtra pela codreq
            },
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

export {DetailRequestService}