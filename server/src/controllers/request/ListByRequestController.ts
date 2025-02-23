import { Request, Response } from "express";
import { ListByRequestService } from "../../services/request/ListByRequestService";

class ListByRequestController {
    async handle(req: Request, res: Response) {
        const listByRequestService = new ListByRequestService();

        try {
            // Chama o serviço para obter as requisições
            const requests = await listByRequestService.execute();
            
            // Retorna a resposta com as requisições
            return res.json(requests);
        } catch (error) {
            // Caso ocorra algum erro, retorna um status 400 e a mensagem de erro
            return res.status(400).json({ error: error.message });
        }
    }
}

export { ListByRequestController };
