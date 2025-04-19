import prismaClient from "../../prisma";

interface DeleteProductIngredientRequest {
  product_id: string;
  ingredient_id: string;
  permission_user_id: string;
}

class RemoveProductIngredientService {
  async execute({
    product_id,
    ingredient_id,
    permission_user_id
  }: DeleteProductIngredientRequest) {
    // Validações básicas
    if (!product_id) {
      throw new Error("O ID do produto é obrigatório!");
    }

    if (!ingredient_id) {
      throw new Error("O ID do ingrediente é obrigatório!");
    }

    // Verificar permissões do usuário
    const user = await prismaClient.user.findUnique({
      where: { id: permission_user_id },
      include: { role: true },
    });

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    if (![0, 1].includes(user.role.type)) {
      throw new Error("Você não tem permissão para remover vínculos de ingredientes!");
    }

    // Verificar se o produto existe
    const productExists = await prismaClient.product.findUnique({
      where: { id: product_id },
    });

    if (!productExists) {
      throw new Error("Produto não encontrado!");
    }

    // Verificar se o ingrediente existe
    const ingredientExists = await prismaClient.ingredient.findUnique({
      where: { id: ingredient_id },
    });

    if (!ingredientExists) {
      throw new Error("Ingrediente não encontrado!");
    }

    // Verificar se a associação existe
    const productIngredient = await prismaClient.productIngredient.findFirst({
      where: {
        product_id,
        ingredient_id,
      },
    });

    if (!productIngredient) {
      throw new Error("Este ingrediente não está vinculado ao produto informado!");
    }

    // Remover a associação
    await prismaClient.productIngredient.delete({
      where: {
        id: productIngredient.id // Usando o ID único da relação
      },
    });

    return { 
      message: "Ingrediente desvinculado do produto com sucesso!",
      deletedAssociation: {
        product_id,
        ingredient_id
      }
    };
  }
}

export { RemoveProductIngredientService };