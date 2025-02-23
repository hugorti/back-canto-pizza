import { Request, Response } from "express";
import { CreateReturnRequestService } from "../../services/request/CreateReturnRequestService";

class CreateReturnRequestController {
  async handle(req: Request, res: Response) {
    const { request_codreq, items } = req.body; // Agora recebemos um array de items
    const created_user = req.user_name; // Usuário que está criando a devolução

    const createReturnRequestService = new CreateReturnRequestService();

    try {
      // Chama o serviço para criar a devolução
      const returnRequest = await createReturnRequestService.execute({
        request_codreq,
        items, // Envia o array de itens
        created_user,
      });

      // Retorna os registros de devolução e os itens atualizados
      return res.json(returnRequest);
    } catch (error) {
      // Se ocorrer algum erro, retorna um erro 400 com a mensagem
      return res.status(400).json({ error: error.message });
    }
  }
}

export { CreateReturnRequestController };
