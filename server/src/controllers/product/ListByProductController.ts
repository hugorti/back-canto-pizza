import { Request, Response } from "express";
import { ListByProductsService } from "../../services/product/ListByProductService";

class ListByProductController{
    async handle(req: Request, res: Response){
        const listByProductervice = new ListByProductsService()

        try {
            const product = await listByProductervice.execute();
            return res.json(product);

        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export {ListByProductController}