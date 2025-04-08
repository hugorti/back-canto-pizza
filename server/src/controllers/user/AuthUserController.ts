import { Request, Response } from "express";
import { AuthUserService } from "../../services/user/AuthUserService";

class AuthUserController {
    async handle(req: Request, res: Response) {
        const { email, user, password } = req.body;

        const authUserService = new AuthUserService();

        try {
            const auth = await authUserService.execute({
                email,
                user,
                password
            });

            return res.json(auth);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { AuthUserController };