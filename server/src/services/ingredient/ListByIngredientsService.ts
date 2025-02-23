import prismaClient from "../../prisma";


class ListByIngredientsService {
    async execute(){
        const role = await prismaClient.ingredient.findMany()
        return role;
    }
}
    
export { ListByIngredientsService }