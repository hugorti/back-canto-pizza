import { Request, Response } from "express";
import { RemoveUserService } from "../../services/user/RemoveUserService";

class RemoveUserController{
    async handle(req: Request, res: Response){
        const {user_id} = req.query;

         // Obter o ID do usuário logado a partir do middleware
         const permission_user_id = req.user_id as string;

        const removeService = new RemoveUserService()

        try{
            const result = await removeService.execute({
                user_id: user_id as string,
                permission_user_id: permission_user_id
            });

            return res.json(result)

        }catch(error){
            return res.status(400).json({ error: error.message });
        }
    }
}

export {RemoveUserController}