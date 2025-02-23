import prismaClient from "../../prisma";

interface ProductRequest {
    name: string;
    unit: string;
    description?: string;
    expired_at?: Date;
    created_user: string | null;
    permission_user_id: string;
}

class CreateIngredientService {
    async execute({name, unit, description, expired_at, created_user, permission_user_id}: ProductRequest){
        if (!name) {
            throw new Error("Insira um nome para o grupo!");
        }

        if (name.length <= 3) {
            throw new Error("O grupo deve ter mais de 3 caracteres!");
        }

        // Verificar permissões do usuário
        const user = await prismaClient.user.findUnique({
            where: {
                id: permission_user_id,
            },
            include: {
                role: true, // Inclui a role do usuário na consulta
            },
        });

        if (!user) {
            throw new Error("Usuário não encontrado.");
        }

        // Verificar se a role do usuário tem type 1 ou 2
        const userRoleType = user.role.type;

        if (![0, 1].includes(userRoleType)) {
            throw new Error("Você não tem permissão! Apenas moderadores e administradores podem criar ingredientes.");
        }

        // Verificar se o nome já existe no banco de dados
        const ingredientExists = await prismaClient.ingredient.findFirst({
            where: {
                name: name,
            },
        });

        if (ingredientExists) {
            throw new Error("Ingrediente já está cadastrado!");
        }

        const ingredient = await prismaClient.ingredient.create({
            data: {
                name,
                unit, 
                description, 
                expired_at,
                created_user: created_user
            }
        });

        return ingredient
    }
}

export {CreateIngredientService}