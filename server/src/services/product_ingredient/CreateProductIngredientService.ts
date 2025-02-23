import prismaClient from "../../prisma";

interface IngredientInput {
  ingredient_id: string;
  qtdProd: string;
}

interface ProductIngredientRequest {
  product_id: string;
  ingredients: IngredientInput[];
  permission_user_id: string;
}

class CreateProductIngredientService {
  async execute({
    product_id,
    ingredients,
    permission_user_id,
  }: ProductIngredientRequest) {
    if (!product_id) {
      throw new Error("O ID do produto é obrigatório!");
    }

    if (!ingredients || ingredients.length === 0) {
      throw new Error("É necessário informar pelo menos um ingrediente!");
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
      throw new Error(
        "Você não tem permissão! Apenas moderadores e administradores podem criar vínculos."
      );
    }

    // Verificar se o produto existe
    const productExists = await prismaClient.product.findUnique({
      where: { id: product_id },
    });

    if (!productExists) {
      throw new Error("Produto não encontrado!");
    }

    // Iterar sobre os ingredientes para validar e criar as associações
    const createdAssociations = [];
    for (const ingredient of ingredients) {
      const { ingredient_id, qtdProd } = ingredient;

      if (!ingredient_id) {
        throw new Error("O ID do ingrediente é obrigatório!");
      }

      // Verifica se a quantidade foi informada e se é maior que zero
      if (!qtdProd || parseFloat(qtdProd) <= 0) {
        throw new Error("A quantidade deve ser maior que zero!");
      }

      // Verificar se o ingrediente existe
      const ingredientExists = await prismaClient.ingredient.findUnique({
        where: { id: ingredient_id },
      });

      if (!ingredientExists) {
        throw new Error(`Ingrediente com ID ${ingredient_id} não encontrado!`);
      }

      // Verificar se a associação já existe
      const associationExists = await prismaClient.productIngredient.findFirst({
        where: {
          product_id,
          ingredient_id,
        },
      });

      if (associationExists) {
        throw new Error(
          `A associação entre o produto e o ingrediente ${ingredient_id} já existe!`
        );
      }

      // Criar a associação convertendo qtdProd para string
      const productIngredient = await prismaClient.productIngredient.create({
        data: {
          product_id,
          ingredient_id,
          qtdProd: qtdProd.toString(),
        },
      });

      createdAssociations.push(productIngredient);
    }

    return createdAssociations;
  }
}

export { CreateProductIngredientService };
