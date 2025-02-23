import { Request, Response } from "express";
import { CreateIngredientService } from "../../services/ingredient/CreateIngredientService";

class CreateIngredientController {
    async handle(req: Request, res: Response){
        const { name, unit, description, expired_at } = req.body;

        const created_user = req.user_name;
        const permission_user_id = req.user_id;

        const createIngredientService = new CreateIngredientService();

        const ingredient = await createIngredientService.execute({
            name,
            unit, 
            description, 
            expired_at,
            created_user,
            permission_user_id
        })

        return res.json(ingredient)
    }
}

export {CreateIngredientController}