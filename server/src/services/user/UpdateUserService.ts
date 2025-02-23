import prismaClient from "../../prisma";
import { hash } from "bcryptjs";

interface UserRequest {
    user_id: string;
    name: string;
    user: string;
    email: string;
    password: string;
    role_id: string;
    permission_user_id: string;
}

class UpdateUserService {
    async execute({ user_id, name, user, email, password, role_id, permission_user_id }: UserRequest) {

        // Obter o usuário logado
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
            throw new Error("Permission denied. Only ADMINISTRATOR can update users.");
        }

        // Verificar se o usuário que está sendo atualizado é o admin
        const userToUpdate = await prismaClient.user.findUnique({
            where: {
                id: user_id,
            },
        });

        if (userToUpdate?.user === 'SUP') {
            throw new Error("Usuário SUP não pode ser editado.");
        }

        // Hash da nova senha
        const passwordHash = await hash(password, 8);

        // Atualizar o usuário
        const updatedUser = await prismaClient.user.update({
            where: {
                id: user_id,
            },
            data: {
                name: name,
                email: email,
                user: user,
                password: passwordHash,
                role_id: role_id,
                permission_user_id: permission_user_id // Usar o ID do usuário logado
            },
            select: {
                id: true,
                name: true,
                email: true,
                user: true,
                role: true,
                permission_user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        return updatedUser;
    }
}

export { UpdateUserService };