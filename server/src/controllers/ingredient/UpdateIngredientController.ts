import { Request, Response } from "express";
import { UpdateIngredientService } from "../../services/ingredient/UpdateIngredientService";

class UpdateIngredientController {
  async handle(req: Request, res: Response) {
    const { ingredient_id, status, name, unit, description, expired_at, location_id } = req.body;
    const updated_user = req.user_name;
    const permission_user_id = req.user_id; // Obtém o ID do usuário autenticado

    const updateIngredientService = new UpdateIngredientService();

    try {
      const updatedIngredient = await updateIngredientService.execute({
        ingredient_id,
        status,
        name,
        unit,
        description,
        expired_at,
        updated_user,
        permission_user_id,
        location_id,
      });

      return res.json(updatedIngredient);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { UpdateIngredientController };
