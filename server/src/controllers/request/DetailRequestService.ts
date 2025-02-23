import { Request, Response } from "express";
import { DetailRequestService } from "../../services/request/DetailRequestService";

class DetailRequestController {
    async handle(req: Request, res: Response) {
        const codreq = req.query.codreq as string;  // Acessando o parâmetro codreq da query string

        const RequestService = new DetailRequestService();

        try {
            if (!codreq) {
                return res.status(400).json({ error: "O parâmetro 'codreq' é obrigatório." });
            }

            // Chama o serviço passando o codreq para buscar a devolução
            const returnRequest = await RequestService.execute(Number(codreq)); // Convertendo para número
            
            if (!returnRequest) {
                return res.status(404).json({ error: "Devolução não encontrada para o código fornecido." });
            }

            // Retorna a resposta com os dados da devolução
            return res.json(returnRequest);
        } catch (error) {
            // Caso ocorra algum erro, retorna um status 400 e a mensagem de erro
            return res.status(400).json({ error: error.message });
        }
    }
}

export { DetailRequestController };
