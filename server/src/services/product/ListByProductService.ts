import prismaClient from "../../prisma";


class ListByProductsService {
    async execute(){
        const product = await prismaClient.product.findMany({
            include:{
                group:{
                    select: {
                        name: true
                    }
                },
                ProductIngredient:{
                    select:{
                        qtdProd: true,
                        ingredient:{
                            select:{
                                coding: true,
                                name: true
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