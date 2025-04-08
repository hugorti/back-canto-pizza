import prismaClient from "../../prisma";

interface LocationRequest{
    location_id: string;
    permission_user_id: string;
}

class RemoveLocationService {
    async execute({location_id, permission_user_id}: LocationRequest){

         // Obter o usuário que está fazendo a solicitação
         const requestingUser = await prismaClient.user.findUnique({
            where: {
                id: permission_user_id,
            },
            include: {
                role: true,
            },
        });

        if (!requestingUser) {
            throw new Error("Usuário não encontrado.");
        }

        // Verificar se o usuário tem a role "ADMINISTRADOR"
        if (requestingUser?.role?.type !== 0 && requestingUser?.role?.type !== 1) {
            throw new Error("Permissão negada! Somente administradores podem excluir locais.");
        }

        const location = await prismaClient.location.delete({
            where: {
                id: location_id,
            },
            select:{
                name: true,
                
                },
        })

        return location;
    }
}

export {RemoveLocationService}