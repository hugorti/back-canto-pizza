import { Request, Response } from "express";
import { UpdateUserService } from "../../services/user/UpdateUserService";

class UpdateUserController{
    async handle(req: Request, res: Response){
        const {user_id, name, user, email, password, role_id} = req.body;
        
        // Obter o ID do usuário logado a partir do middleware
        const permission_user_id = req.user_id;

        const updateUserService = new UpdateUserService();

        const users = await updateUserService.execute({
            user_id,
            name,
            user,
            email,
            password,
            role_id,
            permission_user_id
        })

        return res.json(users)
    }
}

export { UpdateUserController }