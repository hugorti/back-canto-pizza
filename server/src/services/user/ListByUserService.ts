import prismaClient from "../../prisma";

class ListByUserService{
    async execute(){
        const users = await prismaClient.user.findMany({
            select: {
                codusu: true,
                name: true,
                user: true,
                email: true,
                contact: true,
                created_at: true,
                updated_at: true,
                role: {
                    select: {
                        codrol: true,
                        name: true
                    }
                },
                permission_user: {
                    select: {
                        name: true
                    }
                }
            }
            
        })

        return users
    }
}

export { ListByUserService }