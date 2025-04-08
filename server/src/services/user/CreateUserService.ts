import prismaClient from "../../prisma";
import { hash } from "bcryptjs";

interface UserRequest {
  name: string;
  email: string;
  user: string;
  contact: string;
  password: string;
  role_id: string;
  permission_user_id: string;
  location_id: string; // Novo campo para associar ao local
}

class CreateUserService {
  async execute({
    name,
    email,
    user,
    password,
    contact,
    role_id,
    permission_user_id,
    location_id, // Novo parâmetro
  }: UserRequest) {
    if (password.length <= 4) {
      throw new Error("A senha deve ter mais de 4 dígitos.");
    }

    // Verificar a role do usuário que está tentando criar o novo usuário
    const requestingUser = await prismaClient.user.findUnique({
      where: { id: permission_user_id },
      include: { role: true },
    });

    if (!requestingUser) {
      throw new Error("Usuário não encontrado.");
    }

    // Verificar se o usuário tem a role "ADMINISTRADOR" ou "MODERADOR"
    if (![0, 1].includes(requestingUser.role.type)) {
      throw new Error("Permissão negada. Apenas ADMINISTRADORES e MODERADORES podem criar usuários.");
    }

    // Verificar se um e-mail foi enviado
    if (!email) {
      throw new Error("Email incorreto!");
    }

    // Verificar se um usuário foi enviado
    if (!user) {
      throw new Error("Usuário incorreto!");
    }

    // Verificar se o e-mail ou usuário já existe no banco de dados
    const userAlreadyExists = await prismaClient.user.findFirst({
      where: {
        OR: [{ email }, { user }],
      },
    });

    if (userAlreadyExists) {
      throw new Error("Usuário já existe.");
    }

    // Verificar se o local existe
    const locationExists = await prismaClient.location.findUnique({
      where: { id: location_id },
    });

    if (!locationExists) {
      throw new Error("Local não encontrado!");
    }

    // Hash da senha
    const passwordHash = await hash(password, 8);

    // Criar usuário e associá-lo a uma role e um local
    const users = await prismaClient.user.create({
      data: {
        name,
        email,
        user,
        contact,
        password: passwordHash,
        role: { connect: { id: role_id } }, // Conectando à role
        permission_user: { connect: { id: permission_user_id } },
        location: { connect: { id: location_id } }, // Associando ao local
      },
      select: {
        id: true,
        name: true,
        email: true,
        contact: true,
        user: true,
        permission_user: { select: { id: true, name: true } },
        location: { select: { id: true, name: true } }, // Retornando o local
      },
    });

    return users;
  }
}

export { CreateUserService };
