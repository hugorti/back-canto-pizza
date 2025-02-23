import prismaClient from "../../prisma";


class ListByRoleService {
    async execute(){
        const role = await prismaClient.role.findMany()
        return role;
    }
}

export { ListByRoleService }