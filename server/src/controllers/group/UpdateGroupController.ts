import { Request, Response } from "express";
import { UpdateGroupService } from "../../services/group/UpdateGroupService";

class UpdateGroupController {
  async handle(req: Request, res: Response) {
    const {group_id, name } = req.body;
    const updated_user = req.user_name;
    const permission_user_id = req.user_id; // Obtém o ID do usuário autenticado

    const updateGroupService = new UpdateGroupService();

    try {
      const updateGroup = await updateGroupService.execute({
        group_id,
        name,
        updated_user,
        permission_user_id,
      });

      return res.json(updateGroup);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { UpdateGroupController };
