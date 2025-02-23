import { Request, Response } from "express";
import { CreateGroupService } from "../../services/group/CreateGroupService";

class CreateGroupController {
    async handle(req: Request, res: Response){
        const { name } = req.body;

        const created_user = req.user_name;
        const permission_user_id = req.user_id;

        const createGroupService = new CreateGroupService();

        const group = await createGroupService.execute({
            name,
            created_user,
            permission_user_id
        })

        return res.json(group)
    }
}

export {CreateGroupController}