import { Request, Response } from "express";
import { ListByMovimentService } from "../../services/moviment/ListByMovimentService";

class ListByMovimentController{
    async handle(req: Request, res: Response){
        const listByMovimentService = new ListByMovimentService()

        try {
            const moviments = await listByMovimentService.execute();
            return res.json(moviments);

        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export {ListByMovimentController}