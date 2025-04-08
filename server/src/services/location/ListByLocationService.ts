import prismaClient from "../../prisma";


class ListByLocationService {
    async execute(){
        const location = await prismaClient.location.findMany()
        return location;
    }
}

export { ListByLocationService }