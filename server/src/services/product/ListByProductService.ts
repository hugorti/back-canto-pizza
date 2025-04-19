import prismaClient from "../../prisma";


class ListByProductsService {
    async execute(){
        const product = await prismaClient.product.findMany({
            include:{
                location: {
                    select: { name: true }
                },
                group:{
                    select: { name: true }
                },
                ProductIngredient:{
                    select:{
                        qtdProd: true,
                        ingredient:{
                            select:{
                                id: true,
                                coding: true,
                                name: true,
                                unit: true,
                            }
                        }
                    }
                }
            }
        })
        return product;
    }
}
    
export { ListByProductsService }