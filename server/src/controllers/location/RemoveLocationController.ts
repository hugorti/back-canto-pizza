import { Request, Response } from "express";
import { RemoveLocationService } from "../../services/location/RemoveLocationService";
class RemoveLocationController{
    async handle(req: Request, res: Response){
        const {location_id} = req.query;

         // Obter o ID do usuário logado a partir do middleware
         const permission_user_id = req.user_id as string;

        const removeService = new RemoveLocationService()

        try{
            const result = await removeService.execute({
                location_id: location_id as string,
                permission_user_id: permission_user_id
            });

            return res.json(result)

        }catch(error){
            return res.status(400).json({ error: error.message });
        }
    }
}

export {RemoveLocationController}