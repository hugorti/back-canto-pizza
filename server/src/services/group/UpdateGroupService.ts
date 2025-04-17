import prismaClient from "../../prisma";

interface UpdateGroupRequest {
  group_id: string;
  name: string;
  updated_user: string | null;
  permission_user_id: string;
}

class UpdateGroupService {
  async execute({ group_id, name, updated_user, permission_user_id }: UpdateGroupRequest) {
    if (!name) {
      throw new Error("O nome do grupo é obrigatório!");
    }

    if (name.length <= 2) {
      throw new Error("O nome do grupo deve ter mais de 2 caracteres!");
    }

    // Verificar se o grupo existe
    const group = await prismaClient.group.findUnique({
      where: { id: group_id },
    });

    if (!group) {
      throw new Error("Grupo não encontrado!");
    }

    // Impedir atualização se o nome for o mesmo
    if (group.name === name) {
      throw new Error("O novo nome do grupo deve ser diferente do atual!");
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
      throw new Error("Você não tem permissão para atualizar um grupo!");
    }

    // Atualizar o grupo
    const updatedGroup = await prismaClient.group.update({
      where: { id: group_id },
      data: {
        name,
        updated_user,
        updated_at: new Date(),
      },
    });

    return updatedGroup;
  }
}

export { UpdateGroupService };