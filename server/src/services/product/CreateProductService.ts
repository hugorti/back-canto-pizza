import prismaClient from "../../prisma";

interface IngredientInput {
  ingredient_id: string;
  qtdProd: string;
}

interface ProductRequest {
  name: string;
  price: string;
  created_user: string | null;
  permission_user_id: string;
  group_id: string;
  location_id: string;
  ingredients: IngredientInput[];
}

class CreateProductService {
  async execute({
    name,
    price,
    created_user,
    permission_user_id,
    group_id,
    location_id,
    ingredients,
  }: ProductRequest) {
    if (!name) {
      throw new Error("Insira um nome para o produto!");
    }

    if (name.length <= 3) {
      throw new Error("O nome do produto deve ter mais de 3 caracteres!");
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
        "Você não tem permissão! Apenas moderadores e administradores podem criar produtos."
      );
    }

    // Verificar se o local existe
    const locationExists = await prismaClient.location.findUnique({
      where: { id: location_id },
    });

    if (!locationExists) {
      throw new Error("Local não encontrado!");
    }

    // Verificar se já existe produto com mesmo nome NO MESMO LOCAL
    const productExistsInLocation = await prismaClient.product.findFirst({
      where: { 
        name,
        location_id 
      },
    });

    if (productExistsInLocation) {
      throw new Error("Já existe um produto com este nome no local selecionado!");
    }

    // Criar o produto e associar ao grupo e local
    const product = await prismaClient.product.create({
      data: {
        name,
        price,
        group: { connect: { id: group_id } },
        location: { connect: { id: location_id } },
        created_user,
      },
    });

    // Associar ingredientes ao produto
    for (const ingredient of ingredients) {
      await prismaClient.productIngredient.create({
        data: {
          product_id: product.id,
          ingredient_id: ingredient.ingredient_id,
          qtdProd: ingredient.qtdProd.toString(),
        },
      });
    }

    // Recarregar o produto com as associações
    const productWithDetails = await prismaClient.product.findUnique({
      where: { id: product.id },
      include: {
        group: { select: { name: true } },
        location: { select: { name: true } },
        ProductIngredient: {
          select: {
            qtdProd: true,
            ingredient: { select: { id: true, name: true } },
            product_id: true,
          },
        },
      },
    });

    return productWithDetails;
  }
}

export { CreateProductService };