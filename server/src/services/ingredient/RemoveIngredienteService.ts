import prismaClient from "../../prisma";

interface IngredientRequest {
  ingredient_id: string;
  permission_user_id: string;
}

class RemoveIngredientService {
  async execute({ ingredient_id, permission_user_id }: IngredientRequest) {
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

    // Verificar se o usuário tem permissão (Administrador ou Moderador)
    const userRoleType = requestingUser.role.type;
    if (![0, 1].includes(userRoleType)) {
      throw new Error("Permissão negada! Somente administradores e moderadores podem excluir ingredientes.");
    }

    // Verificar se o ingrediente existe
    const ingredientExists = await prismaClient.ingredient.findUnique({
      where: {
        id: ingredient_id,
      },
    });

    if (!ingredientExists) {
      throw new Error("Ingrediente não encontrado.");
    }

    // Verificar se existem produtos vinculados ao ingrediente
    const productsWithIngredient = await prismaClient.productIngredient.count({
      where: {
        ingredient_id: ingredient_id,
      },
    });

    if (productsWithIngredient > 0) {
      throw new Error("Não é possível excluir este ingrediente pois ele está vinculado a produtos.");
    }

    // Se não houver vínculos, prosseguir com a exclusão
    const deletedIngredient = await prismaClient.ingredient.delete({
      where: {
        id: ingredient_id,
      },
    });

    return {
      message: "Ingrediente removido com sucesso!",
      deletedIngredient,
    };
  }
}

export { RemoveIngredientService };