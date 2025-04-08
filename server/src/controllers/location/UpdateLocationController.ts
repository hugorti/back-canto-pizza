import { Request, Response } from "express";
import { UpdateLocationService } from "../../services/location/UpdateLocationService";

class UpdateLocationController {
  async handle(req: Request, res: Response) {
    const {location_id, name } = req.body;
    const updated_user = req.user_name;
    const permission_user_id = req.user_id; // Obtém o ID do usuário autenticado

    const updateLocationService = new UpdateLocationService();

    try {
      const updatedLocation = await updateLocationService.execute({
        location_id,
        name,
        updated_user,
        permission_user_id,
      });

      return res.json(updatedLocation);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { UpdateLocationController };
