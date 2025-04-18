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
  location_id: string; // Adicionando o ID do local
  ingredients: IngredientInput[];
}

class CreateProductService {
  async execute({
    name,
    price,
    created_user,
    permission_user_id,
    group_id,
    location_id, // Novo campo
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

    // Verificar se o produto já existe
    const productExists = await prismaClient.product.findFirst({
      where: { name },
    });

    if (productExists) {
      throw new Error("Produto já está cadastrado!");
    }

    // Verificar se o local existe
    const locationExists = await prismaClient.location.findUnique({
      where: { id: location_id },
    });

    if (!locationExists) {
      throw new Error("Local não encontrado!");
    }

    // Criar o produto e associar ao grupo e local
    const product = await prismaClient.product.create({
      data: {
        name,
        price,
        group: { connect: { id: group_id } }, // Conecta ao grupo existente
        location: { connect: { id: location_id } }, // Conecta ao local existente
        created_user,
      },
    });

    // Associar ingredientes ao produto e incluir o product_id
    for (const ingredient of ingredients) {
      await prismaClient.productIngredient.create({
        data: {
          product_id: product.id,
          ingredient_id: ingredient.ingredient_id,
          qtdProd: ingredient.qtdProd.toString(), // Garantir que seja string
        },
      });
    }

    // Recarregar o produto com as associações e incluir o product_id em cada ingrediente
    const productWithDetails = await prismaClient.product.findUnique({
      where: { id: product.id },
      include: {
        group: { select: { name: true } },
        location: { select: { name: true } }, // Incluir informações do local
        ProductIngredient: {
          select: {
            qtdProd: true,
            ingredient: { select: { id: true, name: true } },
            product_id: true, // Incluindo product_id nos ingredientes
          },
        },
      },
    });

    return productWithDetails;
  }
}

export { CreateProductService };
