import prismaClient from "../../prisma";

interface SalesRequest {
  qtd: number;
  product_id: string;
  created_user: string | null;
  permission_user_id: string;
}

class CreateSalesService {
  async execute({ qtd, product_id, created_user, permission_user_id }: SalesRequest) {
    if (!qtd || qtd <= 0) {
      throw new Error("A quantidade deve ser maior que 0.");
    }

    const user = await prismaClient.user.findUnique({
      where: { id: permission_user_id },
      include: { role: true },
    });

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    // Verificar se o produto existe
    const product = await prismaClient.product.findUnique({
      where: { id: product_id },
    });

    if (!product) {
      throw new Error("Produto não encontrado.");
    }

    // Buscar os ingredientes associados ao produto
    const productIngredients = await prismaClient.productIngredient.findMany({
      where: { product_id },
    });

    if (!productIngredients || productIngredients.length === 0) {
      throw new Error(
        `Nenhum ingrediente associado encontrado para o produto ${product.name} (ID: ${product_id}).`
      );
    }

    // Registrar movimentos para cada ingrediente e ajustar o estoque
    const movimentPromises = productIngredients.map(async (productIngredient) => {
      const { ingredient_id, qtdProd } = productIngredient;

      // Calcular a quantidade de ingredientes necessária
      const totalQtdEst = qtd * qtdProd;

      // Registrar a movimentação de saída para o ingrediente
      const moviment = await prismaClient.moviment.create({
        data: {
          type: false, // Define explicitamente como 'false' para saída
          qtdEst: totalQtdEst,
          description: `Venda do produto ${product.name} (ID: ${product_id})`,
          ingredient_id, // Associar ao ingrediente correto
          created_user,
        },
      });

      // Atualizar o estoque do ingrediente, subtraindo a quantidade usada
      const ingredient = await prismaClient.ingredient.findUnique({
        where: { id: ingredient_id },
      });

      if (ingredient) {
        const updatedQtdEst = ingredient.qtdEst - totalQtdEst;

        // Atualizar o estoque do ingrediente com a nova quantidade
        await prismaClient.ingredient.update({
          where: { id: ingredient_id },
          data: {
            qtdEst: updatedQtdEst, // Subtrai a quantidade do estoque
          },
        });
      }

      return moviment;
    });

    // Registrar todas as movimentações e atualizar o estoque em paralelo
    const moviments = await Promise.all(movimentPromises);

    return {
      message: "Movimentações registradas e estoque atualizado com sucesso!",
      moviments,
    };
  }
}

export { CreateSalesService };
