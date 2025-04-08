import prismaClient from "../../prisma";

interface LocationRequest {
  name: string;
  created_user: string | null;
  permission_user_id: string;
}

class CreateLocationService {
  async execute({ name, permission_user_id, created_user }: LocationRequest) {
    if (!name || name.length < 3) {
      throw new Error("O nome do local deve ter pelo menos 3 caracteres.");
    }

    // Verificar se o usuário tem permissão para criar locais
    const requestingUser = await prismaClient.user.findUnique({
      where: { id: permission_user_id },
      include: { role: true },
    });

    if (!requestingUser) {
      throw new Error("Usuário não encontrado.");
    }

    // Apenas ADMINISTRADORES e MODERADORES podem criar locais
    if (![0, 1].includes(requestingUser.role.type)) {
      throw new Error("Permissão negada. Apenas ADMINISTRADORES e MODERADORES podem criar locais.");
    }

    // Verificar se o local já existe
    const locationExists = await prismaClient.location.findFirst({
      where: { name },
    });

    if (locationExists) {
      throw new Error("Já existe um local com esse nome.");
    }

    // Criar o local
    const location = await prismaClient.location.create({
      data: {
        name,
        created_user: created_user, // Registra quem criou o local
      },
      select: {
        id: true,
        name: true,
        created_user: true,
      },
    });

    return location;
  }
}

export { CreateLocationService };
