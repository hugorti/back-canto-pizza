import { Request, Response } from "express";
import { RemoveProductIngredientService } from "../../services/product_ingredient/RemoveProductIngredientService";

class RemoveProductIngredientController {
    async handle(req: Request, res: Response) {
        const { product_id, ingredient_id } = req.query;

        // Obter o ID do usuário logado a partir do middleware
        const permission_user_id = req.user_id as string;

        const deleteService = new RemoveProductIngredientService();

        try {
            const result = await deleteService.execute({
                product_id: product_id as string,
                ingredient_id: ingredient_id as string,
                permission_user_id
            });

            return res.json(result);

        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { RemoveProductIngredientController };