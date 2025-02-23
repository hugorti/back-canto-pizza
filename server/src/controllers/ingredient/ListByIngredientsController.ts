import { Request, Response } from "express";
import { ListByIngredientsService } from "../../services/ingredient/ListByIngredientsService";

class ListByIngredientsController{
    async handle(req: Request, res: Response){
        const listByIngredientService = new ListByIngredientsService()

        try {
            const ingredients = await listByIngredientService.execute();
            return res.json(ingredients);

        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export {ListByIngredientsController}