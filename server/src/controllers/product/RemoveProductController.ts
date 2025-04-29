import { Request, Response } from "express";
import { RemoveProductService } from "../../services/product/RemoveProductService";

class RemoveProductController {
    async handle(req: Request, res: Response) {
        const { product_id } = req.query;

        // Obter o ID do usuário logado a partir do middleware
        const permission_user_id = req.user_id as string;

        const removeService = new RemoveProductService();

        try {
            const result = await removeService.execute({
                product_id: product_id as string,
                permission_user_id: permission_user_id
            });

            return res.json(result);

        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { RemoveProductController };