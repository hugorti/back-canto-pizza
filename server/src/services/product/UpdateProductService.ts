import prismaClient from "../../prisma";

interface IngredientUpdate {
  ingredient_id: string;
  qtdProd: string;
}

interface UpdateProductRequest {
  product_id: string;
  name: string;
  status: boolean;
  price: string;
  location_id: string;
  group_id: string;
  ingredients?: IngredientUpdate[];
  updated_user: string | null;
  permission_user_id: string;
}

class UpdateProductService {
  async execute({
    product_id,
    name,
    status,
    price,
    location_id,
    group_id,
    ingredients,
    updated_user,
    permission_user_id
  }: UpdateProductRequest) {
    // Validações básicas (mantidas as mesmas)
    if (!name) throw new Error("O nome do produto é obrigatório!");
    if (name.length <= 2) throw new Error("O nome do produto deve ter mais de 2 caracteres!");
    if (!price) throw new Error("O preço do produto é obrigatório!");

    // Verificar existências (mantidas as mesmas)
    const product = await prismaClient.product.findUnique({
      where: { id: product_id },
      include: { ProductIngredient: true }
    });
    if (!product) throw new Error("Produto não encontrado!");

    const locationExists = await prismaClient.location.findUnique({ where: { id: location_id } });
    if (!locationExists) throw new Error("Local não encontrado!");

    const groupExists = await prismaClient.group.findUnique({ where: { id: group_id } });
    if (!groupExists) throw new Error("Grupo não encontrado!");

    // Verificar permissões (mantidas as mesmas)
    const user = await prismaClient.user.findUnique({
      where: { id: permission_user_id },
      include: { role: true },
    });
    if (!user) throw new Error("Usuário não encontrado.");
    if (![0, 1].includes(user.role.type)) throw new Error("Você não tem permissão para atualizar um produto!");

    // Verificar nome duplicado (mantido o mesmo)
    const productWithSameName = await prismaClient.product.findFirst({
      where: { name, NOT: { id: product_id } }
    });
    if (productWithSameName) throw new Error("Já existe um produto com este nome!");

    // Se ingredients não foi fornecido, manter os existentes
    const shouldUpdateIngredients = ingredients !== undefined;
    let validIngredients: IngredientUpdate[] = [];

    if (shouldUpdateIngredients) {
      // Verificar e filtrar ingredientes válidos
      validIngredients = (ingredients || []).filter(i => {
        return i && 
               i.ingredient_id && 
               typeof i.ingredient_id === 'string' && 
               i.qtdProd !== undefined && 
               !isNaN(parseFloat(i.qtdProd));
      });

      // Verificar ingredientes no banco de dados
      if (validIngredients.length > 0) {
        const ingredientIds = validIngredients.map(i => i.ingredient_id);
        const existingIngredients = await prismaClient.ingredient.findMany({
          where: { id: { in: ingredientIds } }
        });
        
        if (existingIngredients.length !== ingredientIds.length) {
          const missingIds = ingredientIds.filter(id => 
            !existingIngredients.some(ing => ing.id === id)
          );
          throw new Error(`Ingredientes não encontrados: ${missingIds.join(', ')}`);
        }
      }
    }

    const updatedProduct = await prismaClient.$transaction(async (prisma) => {
      // 1. Atualiza informações básicas do produto
      const updatedProduct = await prisma.product.update({
        where: { id: product_id },
        data: {
          name,
          status,
          price,
          location_id: location_id,
          group_id: group_id,
          updated_user,
          updated_at: new Date(),
        },
      });
    
      // 2. Se ingredients foi fornecido, atualizar a lista de ingredientes
      if (shouldUpdateIngredients) {
        // Primeiro obter todos os ingredientes atuais do produto
        const currentProductIngredients = await prisma.productIngredient.findMany({
          where: { product_id }
        });

        // Para cada ingrediente enviado no payload
        for (const ingredient of validIngredients) {
          // Verificar se já existe uma relação para este ingrediente
          const existingRelation = currentProductIngredients.find(
            pi => pi.ingredient_id === ingredient.ingredient_id
          );

          if (existingRelation) {
            // Atualizar a quantidade existente
            await prisma.productIngredient.update({
              where: { id: existingRelation.id },
              data: { qtdProd: ingredient.qtdProd }
            });
          } else {
            // Criar nova relação
            await prisma.productIngredient.create({
              data: {
                product_id,
                ingredient_id: ingredient.ingredient_id,
                qtdProd: ingredient.qtdProd
              }
            });
          }
        }
      }
    
      // 3. Retornar o produto com todos os relacionamentos atualizados
      return await prisma.product.findUnique({
        where: { id: updatedProduct.id },
        include: {
          location: { select: { name: true } },
          group: { select: { name: true } },
          ProductIngredient: {
            include: {
              ingredient: {
                select: { id: true, name: true, coding: true, unit: true }
              }
            }
          }
        }
      });
    });

    return updatedProduct;
  }
}

export { UpdateProductService };