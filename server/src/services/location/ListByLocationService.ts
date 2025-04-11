import prismaClient from "../../prisma";

class ListByLocationService {
  async execute() {
    const locations = await prismaClient.location.findMany({
      include: {
        _count: {
          select: { User: true }, // conta quantos usuários estão vinculados a cada local
        },
      },
    });

    return locations.map(loc => ({
      ...loc,
      userCount: loc._count.User,
    }));
  }
}

export { ListByLocationService };
