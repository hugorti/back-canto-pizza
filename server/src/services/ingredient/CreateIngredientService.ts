import prismaClient from "../../prisma";

interface ProductRequest {
  name: string;
  unit: string;
  description?: string;
  expired_at?: Date;
  created_user: string | null;
  permission_user_id: string;
  location_id: string; // Novo campo para associar ao local
}

class CreateIngredientService {
  async execute({
    name,
    unit,
    description,
    expired_at,
    created_user,
    permission_user_id,
    location_id, // Novo parâmetro
  }: ProductRequest) {
    if (!name) {
      throw new Error("Insira um nome para o ingrediente!");
    }

    if (name.length <= 3) {
      throw new Error("O nome do ingrediente deve ter mais de 3 caracteres!");
    }

    // Verificar permissões do usuário
    const user = await prismaClient.user.findUnique({
      where: { id: permission_user_id },
      include: { role: true },
    });

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    const userRoleType = user.role.type;
    if (![0, 1].includes(userRoleType)) {
      throw new Error("Você não tem permissão! Apenas moderadores e administradores podem criar ingredientes.");
    }

    // Verificar se o nome já existe no banco de dados
    const ingredientExists = await prismaClient.ingredient.findFirst({
      where: { name },
    });

    if (ingredientExists) {
      throw new Error("Ingrediente já está cadastrado!");
    }

    // Verificar se o local existe
    const locationExists = await prismaClient.location.findUnique({
      where: { id: location_id },
    });

    if (!locationExists) {
      throw new Error("Local não encontrado!");
    }

    // Criar o ingrediente e associar ao local
    const ingredient = await prismaClient.ingredient.create({
      data: {
        name,
        unit,
        description,
        expired_at,
        created_user,
        location: { connect: { id: location_id } }, // Associando ao local
      },
    });

    return ingredient;
  }
}

export { CreateIngredientService };
