import { Request, Response } from "express";
import { CreateProductIngredientService } from "../../services/product_ingredient/CreateProductIngredientService";

class CreateProductIngredientController {
  async handle(req: Request, res: Response) {
    const { product_id, ingredients } = req.body; // Recebe o array de ingredientes no body

    const permission_user_id = req.user_id; // Recupera o ID do usuário logado

    const createProductIngredientService = new CreateProductIngredientService();

    try {
      // Passa os dados para o serviço, incluindo o array de ingredientes
      const productIngredients = await createProductIngredientService.execute({
        product_id,
        ingredients,
        permission_user_id,
      });

      return res.json(productIngredients);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { CreateProductIngredientController };
