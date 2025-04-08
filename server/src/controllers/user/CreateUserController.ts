import { Request, Response } from "express";
import { CreateUserService } from "../../services/user/CreateUserService";

class CreateUserController{
    async handle(req: Request, res: Response){
        const {name, email, password, contact, user, role_id, location_id} = req.body;
        const permission_user_id = req.user_id;

        const createUserService = new CreateUserService()

        const users = await createUserService.execute({
            name,
            email,
            user,
            contact,
            password,
            role_id,
            location_id,
            permission_user_id
        });

        return res.json(users)
    }
}

export {CreateUserController}