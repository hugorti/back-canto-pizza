import prismaClient from "../../prisma";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

interface AuthRequest {
  email: string;
  user: string;
  password: string;
}

class AuthUserService {
  async execute({ email, user, password }: AuthRequest) {
    // Verificar se o usuário existe
    const users = await prismaClient.user.findFirst({
      where: {
        OR: [
          { email: email },
          { user: { equals: user, mode: "insensitive" } } // Torna a comparação insensível a maiúsculas
        ]
      },
      include: {
        role: true
      }
    });
    
    

    if (!users) {
      throw new Error("User/Password incorrect");
    }

    // Verificar se a senha está correta
    const passwordCompare = await compare(password, users.password);

    if (!passwordCompare) {
      throw new Error("User/Password incorrect");
    }

    // Gerar o token com a role do usuário
    const token = sign(
      {
        name: users.name,
        email: users.email,
        user: users.user,
        role: {
            type: users.role.type,
        }
      },
      process.env.JWT_SECRET,
      {
        subject: users.id,
        expiresIn: '30d'
      }
    );

    return {
      id: users.id,
      name: users.name,
      email: users.email,
      user: users.user,
      role: {
        type: users.role.type,
      },
      token: token
    };
  }
}

export { AuthUserService };
