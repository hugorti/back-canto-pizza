import prismaClient from "../../prisma";

interface MovimentRequest {
    ingredient_id: string;
    qtdEst: string; // Quantidade a ser retirada (como string)
    updated_user: string;
    updated_at?: Date;
}

class CreateMovimentExitService {
    async execute({
        ingredient_id,
        qtdEst,
        updated_user,
        updated_at,
    }: MovimentRequest) {
        if (!ingredient_id) {
            throw new Error("ID do ingrediente é obrigatório!");
        }

        // Converter `qtdEst` para número
        const removeQtdEst = parseFloat(qtdEst.replace(",", "."));
        if (isNaN(removeQtdEst) || removeQtdEst <= 0) {
            throw new Error("A quantidade a ser retirada deve ser um número válido maior que zero!");
        }

        // Buscar ingrediente no banco
        const ingredient = await prismaClient.ingredient.findUnique({
            where: { id: ingredient_id },
        });

        if (!ingredient) {
            throw new Error("Ingrediente não encontrado!");
        }

        // Converter quantidade e preço total para número
        const currentQtdEst = ingredient.qtdEst ? parseFloat(ingredient.qtdEst.replace(",", ".")) : 0;
        const currentPriceTotal = ingredient.priceTotal ? parseFloat(ingredient.priceTotal.replace(",", ".")) : 0;
        const priceUnit = ingredient.priceUnit ? parseFloat(ingredient.priceUnit.replace(",", ".")) : 0;

        if (removeQtdEst > currentQtdEst) {
            throw new Error("Quantidade insuficiente em estoque!");
        }

        if (!priceUnit || !currentPriceTotal) {
            throw new Error("Não é possível gerar uma saída em uma MP que não tem saldo.");
        }
        
        // Calcular nova quantidade e preço total
        const updatedQtdEst = currentQtdEst - removeQtdEst;
        const updatedPriceTotal = updatedQtdEst * priceUnit;

        // Garantir que `updated_at` seja uma data válida
        const validUpdatedAt = updated_at ? new Date(updated_at) : new Date();

        // Determina quantas casas decimais o usuário digitou
        const decimalPlaces = qtdEst.includes('.') ? qtdEst.split('.')[1].length : 0;

        // Registrar a movimentação de saída
        await prismaClient.moviment.create({
            data: {
                ingredient_id,
                type: false, // Saída
                qtdEst: (-removeQtdEst).toFixed(decimalPlaces).replace(".", ","), 
                priceUnit: (-priceUnit).toFixed(2).replace(".", ","),
                priceTotal: (-removeQtdEst * priceUnit).toFixed(2).replace(".", ","), // Define o valor total como negativo
                updated_user,
                updated_at: validUpdatedAt,
            },
        });

        // Atualizar os dados do ingrediente
        const updatedIngredient = await prismaClient.ingredient.update({
            where: { id: ingredient_id },
            data: {
                qtdEst: updatedQtdEst.toFixed(decimalPlaces).replace(".", ","), 
                priceTotal: updatedPriceTotal.toFixed(2).replace(".", ","),
                updated_user,
            },
        });

        return updatedIngredient;
    }
}

export { CreateMovimentExitService };
