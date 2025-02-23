import { Request, Response } from "express";
import { CreateMovimentEntryService } from "../../services/moviment/CreateMovimentEntryService";

class CreateMovimentEntryController {
    async handle(req: Request, res: Response) {
        const { ingredient_id, qtdEst, priceUnit, priceTotal, description, updated_at } = req.body;
        const updated_user = req.user_name;

        const createMovimentService = new CreateMovimentEntryService();

        try {
            const updatedIngredient = await createMovimentService.execute({
                ingredient_id,
                qtdEst,
                priceUnit,
                priceTotal,
                description,
                updated_user,
                updated_at,  // Enviando a data de atualização opcional
            });

            return res.json(updatedIngredient);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { CreateMovimentEntryController };
