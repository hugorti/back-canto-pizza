import { Request, Response } from "express";
import { UpdateProductService } from "../../services/product/UpdateProductService";

class UpdateProductController {
  async handle(req: Request, res: Response) {
    const { 
      product_id,
      name, 
      status, 
      price,
      location_id,
      group_id,
      ingredients // Adicionado o array de ingredientes
    } = req.body;
    
    const updated_user = req.user_name;
    const permission_user_id = req.user_id;

    const updateProductService = new UpdateProductService();

    try {
      const product = await updateProductService.execute({
        product_id,
        name,
        price,
        group_id,
        updated_user,
        ingredients, // Passa a lista de ingredientes ao serviço
        status,
        location_id,
        permission_user_id,
      });

      return res.json(product);
    } catch (error: any) {
      return res.status(400).json({ 
        error: error.message || 'Erro ao atualizar produto' 
      });
    }
  }
}

export { UpdateProductController };