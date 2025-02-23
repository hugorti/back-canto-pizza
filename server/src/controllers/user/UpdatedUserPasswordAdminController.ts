import { Request, Response } from "express";
import { UpdatedUserPasswordAdminService } from "../../services/user/UpdateUserPasswordAdminService";

class UpdatedUserPasswordAdminController {
    async handle(req: Request, res: Response) {
        const { email, new_password } = req.body;
        
        // Aqui, 'permission_user_id' é obtido de algum lugar, por exemplo, do usuário autenticado
        const permission_user_id = req.user_id;  // Supondo que o ID do usuário logado esteja em 'req.user_id'

        // Chama o serviço de atualização de senha, passando o e-mail e a nova senha
        const updateUserPasswordAdminService = new UpdatedUserPasswordAdminService();

        try {
            const updatedUser = await updateUserPasswordAdminService.execute({
                email,
                new_password,
                permission_user_id
            });

            return res.json(updatedUser);

        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { UpdatedUserPasswordAdminController };
