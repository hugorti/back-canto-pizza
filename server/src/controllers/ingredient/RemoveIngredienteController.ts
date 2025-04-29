import { Request, Response } from "express";
import { RemoveIngredientService } from "../../services/ingredient/RemoveIngredienteService";

class RemoveIngredientController {
    async handle(req: Request, res: Response) {
        const { ingredient_id } = req.query;

        // Obter o ID do usuário logado a partir do middleware
        const permission_user_id = req.user_id as string;

        const removeService = new RemoveIngredientService();

        try {
            const result = await removeService.execute({
                ingredient_id: ingredient_id as string,
                permission_user_id: permission_user_id
            });

            return res.json(result);

        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { RemoveIngredientController };