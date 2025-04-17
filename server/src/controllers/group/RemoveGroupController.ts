import { Request, Response } from "express";
import { RemoveGroupService } from "../../services/group/RemoveGroupService";

class RemoveGroupController {
  async handle(req: Request, res: Response) {
    const { group_id } = req.query;
    const permission_user_id = req.user_id; // ou de onde você pegar o ID

    const service = new RemoveGroupService();

    try {
      const group = await service.execute({
        group_id: String(group_id),
        permission_user_id,
      });

      return res.json(group);
    } catch (error: any) {
      return res.status(400).json({ error: error.message }); // <- aqui que o front consome
    }
  }
}

export { RemoveGroupController };
