import { Request, Response } from "express";
import { CreateProductService } from "../../services/product/CreateProductService";

class CreateProductController {
  async handle(req: Request, res: Response) {
    const { name, price, group_id, ingredients, location_id } = req.body; // Recebe a lista de ingredientes do body

    const created_user = req.user_name; // Recupera o usuário logado
    const permission_user_id = req.user_id; // Recupera o ID do usuário logado

    const createProductService = new CreateProductService();

    try {
      const product = await createProductService.execute({
        name,
        price,
        group_id,
        ingredients, // Passa a lista de ingredientes ao serviço
        created_user,
        location_id,
        permission_user_id,
      });

      return res.json(product);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { CreateProductController };
