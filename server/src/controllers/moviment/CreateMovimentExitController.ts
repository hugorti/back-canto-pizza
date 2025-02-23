import { Request, Response } from "express";
import { CreateMovimentExitService } from "../../services/moviment/CreateMovimentExitService";

class CreateMovimentExitController {
    async handle(req: Request, res: Response) {
        const { ingredient_id, qtdEst, updated_at } = req.body;
        const updated_user = req.user_name;

        const removeMovimentService = new CreateMovimentExitService();

        try {
            const updatedIngredient = await removeMovimentService.execute({
                ingredient_id,
                qtdEst,
                updated_user,
                updated_at,  // Enviando a data de atualização opcional
            });

            return res.json(updatedIngredient);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { CreateMovimentExitController };
