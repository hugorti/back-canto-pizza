import prismaClient from "../../prisma";

interface MovimentRequest {
    ingredient_id: string;
    qtdEst: string; // Quantidade movimentada (como string)
    priceUnit: string; // Preço unitário (como string)
    priceTotal: string; // Preço total (como string)
    description?: string;
    updated_user: string;
    updated_at?: Date;
}

class CreateMovimentEntryService {
    async execute({
        ingredient_id,
        qtdEst,
        priceUnit,
        priceTotal,
        description,
        updated_user,
        updated_at,
    }: MovimentRequest) {
        if (!ingredient_id) {
            throw new Error("ID do ingrediente é obrigatório!");
        }

        // Converter `qtdEst` para número
        const newQtdEst = parseFloat(qtdEst.replace(",", "."));
        if (isNaN(newQtdEst) || newQtdEst <= 0) {
            throw new Error("A quantidade deve ser um número válido maior que zero!");
        }

        // Determina quantas casas decimais o usuário digitou
        const decimalPlaces = qtdEst.includes('.') ? qtdEst.split('.')[1].length : 0;

        // Buscar ingrediente no banco
        const ingredient = await prismaClient.ingredient.findUnique({
            where: { id: ingredient_id },
        });

        if (!ingredient) {
            throw new Error("Ingrediente não encontrado!");
        }

        // Converter preços para número
        const newPriceUnit = parseFloat(priceUnit.replace(",", "."));
        const newPriceTotal = parseFloat(priceTotal.replace(",", "."));

        if (isNaN(newPriceUnit) || newPriceUnit <= 0) {
            throw new Error("Preço unitário inválido!");
        }
        if (isNaN(newPriceTotal) || newPriceTotal < 0) {
            throw new Error("Preço total inválido!");
        }

        // Atualizar a quantidade de estoque
        const currentQtdEst = ingredient.qtdEst ? parseFloat(ingredient.qtdEst.replace(",", ".")) : 0;
        const updatedQtdEst = currentQtdEst + newQtdEst;

        // Atualizar o preço total somando o novo valor ao existente
        const currentPriceTotal = ingredient.priceTotal ? parseFloat(ingredient.priceTotal.replace(",", ".")) : 0;
        const updatedPriceTotal = currentPriceTotal + newPriceTotal;

        // Garantir que `updated_at` seja uma data válida
        const validUpdatedAt = updated_at ? new Date(updated_at) : new Date();

        // Registrar a movimentação de entrada, usando a formatação conforme a entrada do usuário
        await prismaClient.moviment.create({
            data: {
                ingredient_id,
                type: true, // Entrada
                qtdEst: newQtdEst.toFixed(decimalPlaces).replace(".", ","), // Usa as casas decimais conforme digitado
                priceUnit: newPriceUnit.toFixed(2).replace(".", ","),
                priceTotal: newPriceTotal.toFixed(2).replace(".", ","),
                description,
                updated_user,
                updated_at: validUpdatedAt,
            },
        });

        // Atualizar os dados do ingrediente com a mesma formatação para qtdEst
        const updatedIngredient = await prismaClient.ingredient.update({
            where: { id: ingredient_id },
            data: {
                qtdEst: updatedQtdEst.toFixed(decimalPlaces).replace(".", ","), // Usa as casas decimais conforme a entrada
                priceUnit: newPriceUnit.toFixed(2).replace(".", ","),
                priceTotal: updatedPriceTotal.toFixed(2).replace(".", ","),
                updated_user,
            },
        });

        return updatedIngredient;
    }
}

export { CreateMovimentEntryService };
