import prismaClient from "../../prisma";

class ListByIngredientsService {
    async execute() {
        const ingredients = await prismaClient.ingredient.findMany({
            include: {
                location: {
                    select: {
                        name: true,
                    }
                } // Inclui os dados do local associado
            },
            orderBy: {
                created_at: 'desc' // Ordena por data de criação (opcional)
            }
        });
        return ingredients;
    }
}

export { ListByIngredientsService };