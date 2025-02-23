import prismaClient from "../../prisma";
import { hash, compare } from "bcryptjs";

interface UserRequest {
    email: string;            // E-mail fornecido
    new_password: string;     // Nova senha
    permission_user_id: string; // ID do usuário logado
}

class UpdatedUserPasswordAdminService {
    async execute({ email, new_password, permission_user_id }: UserRequest) {
        
        if (new_password.length <= 4) {
            throw new Error("A senha deve ter mais de 4 dígitos.");
        }

        // Buscar o usuário pelo e-mail fornecido (quem vai ter a senha alterada)
        const userToUpdate = await prismaClient.user.findUnique({
            where: {
                email: email,  // Busca o usuário pelo e-mail fornecido
            },
            include: {
                role: true, // Inclui a role para ser verificada
            }
        });

        if (!userToUpdate) {
            throw new Error("Usuário não encontrado.");
        }

        // Buscar o usuário logado (quem está tentando alterar a senha)
        const userToAuth = await prismaClient.user.findUnique({
            where: {
                id: permission_user_id,  // Busca o usuário logado pelo ID
            },
            include: {
                role: true, // Inclui a role para ser verificada
            }
        });

        if (!userToAuth) {
            throw new Error("Usuário logado não encontrado.");
        }

        // Impedir alteração de senha de usuário 'SUP' (admin)
        if (userToUpdate.user === 'SUP') {
            throw new Error("Usuário SUP não pode ser editado.");
        }

        // Verificar se o usuário logado é um administrador (role.type === 1)
        if (userToAuth.role.type !== 0 && userToAuth.role.type !== 1) {
            throw new Error("Apenas administradores podem alterar a senha.");
        }

        // Verificar se o usuário está ativo (status == true)
        if (userToUpdate.status !== true) {
            throw new Error("Usuário desativado! Não é possível alterar a senha.");
        }

        // Verificar se a nova senha é igual à senha atual
        const isSamePassword = await compare(new_password, userToUpdate.password);
        if (isSamePassword) {
            throw new Error("A nova senha não pode ser igual à senha atual.");
        }

        // Gerar o hash da nova senha
        const newPasswordHash = await hash(new_password, 8);

        // Atualizar a senha do usuário
        const updatedUser = await prismaClient.user.update({
            where: {
                email: email,  // Atualiza o usuário com base no e-mail
            },
            data: {
                password: newPasswordHash,  // Atualiza a senha
            },
            select: {
                id: true,
                email: true,
                user: true,  // Retorna o nome de usuário, você pode ajustar conforme necessário
            },
        });

        return updatedUser;
    }
}

export { UpdatedUserPasswordAdminService };