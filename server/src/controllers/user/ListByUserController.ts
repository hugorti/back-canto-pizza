import { Request, Response } from "express";
import { ListByUserService } from "../../services/user/ListByUserService";

class ListByUserController{
    async handle(req: Request, res: Response){
        const listByUserService = new ListByUserService()

        try {
            const users = await listByUserService.execute()
            return res.json(users)

        }catch (err) {
            return res.status(500).json({error: err.message})
        }
    }
}

export {ListByUserController}