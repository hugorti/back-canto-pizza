import prismaClient from "../../prisma";

class ListByMovimentService {
    async execute() {
        const moviment = await prismaClient.moviment.findMany({
            select: {
                id: true,
                codmov: true,
                type: true,
                qtdEst: true,
                priceUnit: true,
                priceTotal: true,
                description: true,
                created_user: true,
                updated_user: true,
                created_at: true,
                updated_at: true,

                ingredient_id: true,
                ingredient: {
                    select: {
                        coding: true,
                        name: true,
                    }
                }
            }
        })
        return moviment;
    }
}

export { ListByMovimentService }