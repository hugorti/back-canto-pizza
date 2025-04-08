import prismaClient from "../../prisma";

interface SalesRequest {
  qtd: string;
  product_id: string;
  created_user: string | null;
  permission_user_id: string;
}

class CreateSalesService {
  async execute({ qtd, product_id, created_user, permission_user_id }: SalesRequest) {
    // Converter qtd para número
    const qtdNumber = parseFloat(qtd);

    if (isNaN(qtdNumber) || qtdNumber <= 0) {
      throw new Error("A quantidade deve ser um número maior que 0.");
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

      // Garantir que qtdProd seja tratado como número
      const qtdProdNumber = parseFloat(qtdProd);

      if (isNaN(qtdProdNumber)) {
        throw new Error(`Quantidade inválida para o ingrediente ${ingredient_id}.`);
      }

      // Calcular a quantidade de ingredientes necessária
      const totalQtdEst = qtdNumber * qtdProdNumber;

      // Registrar a movimentação de saída para o ingrediente
      const moviment = await prismaClient.moviment.create({
        data: {
          type: false, // Define explicitamente como 'false' para saída
          qtdEst: totalQtdEst.toString(), // Convertendo para string
          description: `Venda do produto ${product.name} (ID: ${product_id})`,
          ingredient: { connect: { id: ingredient_id } }, // Conectar corretamente ao ingrediente
          updated_at: new Date(),
          created_user,
        },
      });
      

      // Atualizar o estoque do ingrediente, subtraindo a quantidade usada
      const ingredient = await prismaClient.ingredient.findUnique({
        where: { id: ingredient_id },
      });

      if (ingredient) {
        const updatedQtdEst = (parseFloat(ingredient.qtdEst) - totalQtdEst).toString();

        // Atualizar o estoque do ingrediente com a nova quantidade
        await prismaClient.ingredient.update({
          where: { id: ingredient_id },
          data: {
            qtdEst: updatedQtdEst, // Convertendo para string
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
