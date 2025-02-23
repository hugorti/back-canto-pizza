import prismaClient from "../../prisma";


class ListByGroupsService {
    async execute(){
        const groups = await prismaClient.group.findMany()
        return groups;
    }
}
    
export { ListByGroupsService }