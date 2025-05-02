import prismaClient from "../../prisma";

interface UpdateIngredientRequest {
  ingredient_id: string;
  name?: string;
  unit?: string;
  description?: string;
  expired_at?: Date;
  updated_user: string | null;
  permission_user_id: string;
  location_id?: string;
  status?: boolean; // ✅ NOVO CAMPO ADICIONADO
}

class UpdateIngredientService {
  async execute({
    ingredient_id,
    name,
    unit,
    description,
    expired_at,
    updated_user,
    permission_user_id,
    location_id,
    status, // ✅ NOVO PARÂMETRO
  }: UpdateIngredientRequest) {
    // Verificar se o ingrediente existe
    const ingredient = await prismaClient.ingredient.findUnique({
      where: { id: ingredient_id },
      include: { location: true },
    });

    if (!ingredient) {
      throw new Error("Ingrediente não encontrado!");
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
      throw new Error("Você não tem permissão para atualizar ingredientes!");
    }

    // Validações para o nome, se foi fornecido
    if (name) {
      if (name.length <= 3) {
        throw new Error("O nome do ingrediente deve ter mais de 3 caracteres!");
      }

      // Verificar se já existe ingrediente com mesmo nome NO MESMO LOCAL
      const ingredientExistsInLocation = await prismaClient.ingredient.findFirst({
        where: { 
          name,
          location_id: location_id ?? ingredient.location_id,
          NOT: { id: ingredient_id }
        },
      });

      if (ingredientExistsInLocation) {
        throw new Error("Já existe um ingrediente com este nome no local selecionado!");
      }
    }

    // Atualizar o ingrediente
    const updatedIngredient = await prismaClient.ingredient.update({
      where: { id: ingredient_id },
      data: {
        name: name !== undefined ? name : ingredient.name,
        unit: unit !== undefined ? unit : ingredient.unit,
        description: description !== undefined ? description : ingredient.description,
        expired_at: expired_at !== undefined ? new Date(expired_at) : ingredient.expired_at,
        updated_user,
        updated_at: new Date(),
        location_id: location_id !== undefined ? location_id : ingredient.location_id,
        status: status !== undefined ? status : ingredient.status, // ✅ Atualiza o status
      },
    });

    return updatedIngredient;
  }
}

export { UpdateIngredientService };