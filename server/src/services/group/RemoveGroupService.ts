import prismaClient from "../../prisma";

interface GroupRequest {
    group_id: string;
    permission_user_id: string;
}

class RemoveGroupService {
    async execute({ group_id, permission_user_id }: GroupRequest) {
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

        // Verificar se o usuário tem permissão (Administrador ou Gerente)
        if (requestingUser?.role?.type !== 0 && requestingUser?.role?.type !== 1) {
            throw new Error("Permissão negada! Somente administradores podem excluir grupos.");
        }

        // Verificar se o grupo existe antes de tentar excluir
        const groupExists = await prismaClient.group.findUnique({
            where: {
                id: group_id,
            }
        });

        if (!groupExists) {
            throw new Error("Grupo não encontrado.");
        }

        // Verificar se existem produtos vinculados ao grupo
        const productsCount = await prismaClient.product.count({
            where: {
                group_id: group_id,
            },
        });

        if (productsCount > 0) {
            throw new Error("Não é possível excluir um grupo com produtos vinculados.");
        }

        // Excluir o grupo
        const deletedGroup = await prismaClient.group.delete({
            where: {
                id: group_id,
            },
            select: {
                name: true,
            },
        });

        return deletedGroup;
    }
}

export { RemoveGroupService };
