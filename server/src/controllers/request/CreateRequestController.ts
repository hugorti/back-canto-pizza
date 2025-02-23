import { Request, Response } from "express";
import { CreateRequestService } from "../../services/request/CreateRequestService";

class CreateRequestController {
    async handle(req: Request, res: Response) {
        const { items, description } = req.body;
        const created_user = req.user_name; // Usando o nome do usuário que está fazendo a requisição

        const createRequestService = new CreateRequestService();

        try {
            // Chama o serviço de criação de requisição, passando os itens, descrição e usuário
            const requestRecord = await createRequestService.execute({
                items,
                description,
                created_user,
            });

            // Retorna os itens criados em formato JSON
            return res.json(requestRecord);
        } catch (error) {
            // Caso haja um erro, retorna uma mensagem de erro com o código 400
            return res.status(400).json({ error: error.message });
        }
    }
}

export { CreateRequestController };
