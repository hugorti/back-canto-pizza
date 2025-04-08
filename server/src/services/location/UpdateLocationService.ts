import prismaClient from "../../prisma";

interface UpdateLocationRequest {
  location_id: string;
  name: string;
  updated_user: string | null;
  permission_user_id: string;
}

class UpdateLocationService {
  async execute({ location_id, name, updated_user, permission_user_id }: UpdateLocationRequest) {
    if (!name) {
      throw new Error("O nome do local é obrigatório!");
    }

    if (name.length <= 2) {
      throw new Error("O nome do local deve ter mais de 2 caracteres!");
    }

    // Verificar se o local existe
    const location = await prismaClient.location.findUnique({
      where: { id: location_id },
    });

    if (!location) {
      throw new Error("Local não encontrado!");
    }

    // Impedir atualização se o nome for o mesmo
    if (location.name === name) {
      throw new Error("O novo nome do local deve ser diferente do atual!");
    }

    // Verificar permissões do usuário
    const user = await prismaClient.user.findUnique({
      where: { id: permission_user_id },
      include: { role: true },
    });

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    const userRoleType = user.role.type;
    if (![0, 1].includes(userRoleType)) {
      throw new Error("Você não tem permissão para atualizar um local!");
    }

    // Atualizar o local
    const updatedLocation = await prismaClient.location.update({
      where: { id: location_id },
      data: {
        name,
        updated_user,
        updated_at: new Date(),
      },
    });

    return updatedLocation;
  }
}

export { UpdateLocationService };
