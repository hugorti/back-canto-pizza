import { Request, Response } from "express";
import { CreateSalesService } from "../../services/sales/CreateSalesService";

class CreateSalesController {
  async handle(req: Request, res: Response) {
    const { qtd, product_id } = req.body; // Recebe a lista de ingredientes do body

    const created_user = req.user_name; // Recupera o usuário logado
    const permission_user_id = req.user_id; // Recupera o ID do usuário logado

    const createSalesService = new CreateSalesService();

    try {
      const sales = await createSalesService.execute({
        qtd,
        product_id,
        created_user,
        permission_user_id,
      });

      return res.json(sales);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { CreateSalesController };
