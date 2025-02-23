import prismaClient from "../../prisma";

interface UserRequest{
    user_id: string;
    permission_user_id: string;
}

class RemoveUserService {
    async execute({user_id, permission_user_id}: UserRequest){

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
            throw new Error("Permission denied. Only ADMINISTRATOR can REMOVE users.");
        }

        // Verificar se o usuário está tentando deletar a si mesmo
        if (user_id === permission_user_id) {
            throw new Error("Você não pode deletar a si mesmo!.");
        }

         // Obter o usuário que será deletado
         const userToDelete = await prismaClient.user.findUnique({
            where: {
                id: user_id,
            },
        });

        // Verificar se o usuário a ser deletado é o "admin"
        if (userToDelete?.user === 'SUP') { // Substitua 'username' por outro identificador se necessário
            throw new Error("O usuário SUP não pode ser deletado.");
        }

        const users = await prismaClient.user.delete({
            where: {
                id: user_id,
            },
            select:{
                name: true,
                user: true,
                email: true,
                role:{
                    select:{
                        id: true,
                        name: true,
                    }
                },
                permission_user:{
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        return users;
    }
}

export {RemoveUserService}