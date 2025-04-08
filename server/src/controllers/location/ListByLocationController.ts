import { Request, Response } from "express";
import { ListByLocationService } from "../../services/location/ListByLocationService";

class ListByLocationController{
    async handle(req: Request, res: Response){
        const listByLocationService = new ListByLocationService()

        try {
            const roles = await listByLocationService.execute();
            return res.json(roles);

        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export {ListByLocationController}