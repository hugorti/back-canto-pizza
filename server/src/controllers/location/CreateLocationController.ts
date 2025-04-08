import { Request, Response } from "express";
import { CreateLocationService } from "../../services/location/CreateLocationService";

class CreateLocationController {
  async handle(req: Request, res: Response) {
    const { name } = req.body;
    const created_user = req.user_name
    const permission_user_id = req.user_id; // Obtém o ID do usuário autenticado

    const createLocationService = new CreateLocationService();

    try {
      const location = await createLocationService.execute({
        name,
        created_user,
        permission_user_id,
      });

      return res.status(201).json(location);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { CreateLocationController };
