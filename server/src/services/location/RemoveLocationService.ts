import prismaClient from "../../prisma";

interface LocationRequest {
    location_id: string;
    permission_user_id: string;
}

class RemoveLocationService {
    async execute({ location_id, permission_user_id }: LocationRequest) {
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

        // Verificar se o usuário tem a role "ADMINISTRADOR"
        if (requestingUser?.role?.type !== 0 && requestingUser?.role?.type !== 1) {
            throw new Error("Permissão negada! Somente administradores podem excluir locais.");
        }

        // Verificar se existem usuários vinculados ao local
        const usersCount = await prismaClient.user.count({
            where: {
                location_id: location_id
            }
        });

        // Verificar se existem ingredientes vinculados ao local
        const ingredientsCount = await prismaClient.ingredient.count({
            where: {
                location_id: location_id
            }
        });

        // Verificar se existem produtos vinculados ao local
        const productsCount = await prismaClient.product.count({
            where: {
                location_id: location_id
            }
        });

        if (usersCount > 0) {
            throw new Error("Não é possível excluir este local pois existem usuários vinculados a ele.");
        }

        if (ingredientsCount > 0) {
            throw new Error("Não é possível excluir este local pois existem ingredientes vinculados a ele.");
        }

        if (productsCount > 0) {
            throw new Error("Não é possível excluir este local pois existem produtos vinculados a ele.");
        }

        // Se não houver vínculos, prosseguir com a exclusão
        const location = await prismaClient.location.delete({
            where: {
                id: location_id,
            },
            select: {
                name: true,
            },
        });

        return location;
    }
}

export { RemoveLocationService };