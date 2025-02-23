import prismaClient from "../../prisma";
import { hash } from "bcryptjs";

interface UserRequest{
    name: string;
    email: string;
    user: string;
    contact: string;
    password: string;
    role_id: string;
    permission_user_id: string;
}

class CreateUserService{
    async execute({ name, email, user, password, contact, role_id, permission_user_id}: UserRequest){

        if (password.length <= 4) {
            throw new Error("A senha deve ter mais de 4 dígitos.");
        }

         // Verificar a role do usuário que está tentando criar o novo usuário
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
        throw new Error("Permission denied. Only ADMINISTRATOR can CREATE users.");
    }

        //verificar se ele enviou um email
        if(!email){
            throw new Error("Email incorrect!")
        }
        
         //verificar se ele enviou um usuario
        else if(!user){
            throw new Error("User incorrect!")
        }

         //Verificar se esse email ou usuario já está cadastrado na plataforma
        else {
            const userAlreadyExists = await prismaClient.user.findFirst({
                where: {
                    OR: [
                        { email: email },
                        { user: user }
                    ]
                }
            })

            if(userAlreadyExists){
                throw new Error("User already exists")
            }
        }
        

        const passwordHash = await hash(password, 8)

        const users = await prismaClient.user.create({
            data: {
                name: name,
                email: email,
                user: user,
                contact: contact,
                password: passwordHash,
                role: {
                    connect: { id: role_id } // Conecte ao ID da role existente
                  },
                permission_user: {
                    connect: {id: permission_user_id}
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                contact: true,
                user: true,
                permission_user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        return users
    }
}

export { CreateUserService }