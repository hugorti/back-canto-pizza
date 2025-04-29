import prismaClient from "../../prisma";

interface ProductRequest {
  name: string;
  unit: string;
  description?: string;
  expired_at?: Date | string; // Accept both Date object and ISO string
  created_user: string | null;
  permission_user_id: string;
  location_id: string;
}

class CreateIngredientService {
  async execute({
    name,
    unit,
    description,
    expired_at,
    created_user,
    permission_user_id,
    location_id,
  }: ProductRequest) {
    if (!name) {
      throw new Error("Insira um nome para o ingrediente!");
    }

    if (name.length <= 3) {
      throw new Error("O nome do ingrediente deve ter mais de 3 caracteres!");
    }

    // Verify user permissions
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

    // Verify if location exists
    const locationExists = await prismaClient.location.findUnique({
      where: { id: location_id },
    });

    if (!locationExists) {
      throw new Error("Local não encontrado!");
    }

    // Check for duplicate ingredient name in the same location
    const ingredientExistsInLocation = await prismaClient.ingredient.findFirst({
      where: { 
        name,
        location_id 
      },
    });

    if (ingredientExistsInLocation) {
      throw new Error("Já existe um ingrediente com este nome no local selecionado!");
    }

    // Handle expired_at conversion if it's a string
    let expiredAtDate: Date | undefined;
    if (expired_at) {
      expiredAtDate = typeof expired_at === 'string' ? new Date(expired_at) : expired_at;
      
      // Validate the date
      if (isNaN(expiredAtDate.getTime())) {
        throw new Error("Data de validade inválida!");
      }
    }

    // Create the ingredient
    const ingredient = await prismaClient.ingredient.create({
      data: {
        name,
        unit,
        description,
        expired_at: expiredAtDate,
        created_user,
        location: { connect: { id: location_id } },
      },
    });

    return ingredient;
  }
}

export { CreateIngredientService };