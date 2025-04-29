import prismaClient from "../../prisma";

interface ProductRequest {
    product_id: string;
    permission_user_id: string;
}

class RemoveProductService {
    async execute({ product_id, permission_user_id }: ProductRequest) {
        // Obter o usuário que está fazendo a solicitação
        const requestingUser = await prismaClient.user.findUnique({
            where: {
                id: permission_user_id,
            },
            include: {
                role: true,
            },
        });

        if (!requestingUser) {
            throw new Error("Usuário não encontrado.");
        }

        // Verificar se o usuário tem a role "ADMINISTRADOR" ou "MODERADOR"
        if (requestingUser?.role?.type !== 0 && requestingUser?.role?.type !== 1) {
            throw new Error("Permissão negada! Somente administradores e moderadores podem excluir produtos.");
        }

        // Verificar se o produto existe
        const productExists = await prismaClient.product.findUnique({
            where: {
                id: product_id,
            },
        });

        if (!productExists) {
            throw new Error("Produto não encontrado.");
        }

        // // Verificar se existem pedidos vinculados ao produto
        // const ordersCount = await prismaClient.orderProduct.count({
        //     where: {
        //         product_id: product_id
        //     }
        // });

        // if (ordersCount > 0) {
        //     throw new Error("Não é possível excluir este produto pois existem pedidos vinculados a ele.");
        // }

        // Primeiro, remover todos os ingredientes associados ao produto
        await prismaClient.productIngredient.deleteMany({
            where: {
                product_id: product_id
            }
        });

        // Depois, remover o produto
        const deletedProduct = await prismaClient.product.delete({
            where: {
                id: product_id,
            },
            select: {
                name: true,
                id: true,
            },
        });

        return { 
            message: `Produto '${deletedProduct.name}' removido com sucesso!`,
            product_id: deletedProduct.id
        };
    }
}

export { RemoveProductService };