import prismaClient from "../src/prisma";
import { hash } from "bcryptjs";

async function seed() {
    console.log("Starting seeding...");

    // Define the roles to be created
    const roles = [
        { name: 'SUP', type: 0, codrol: 0 },
        { name: 'ADMINISTRADOR', type: 1, codrol: 1 },
        { name: 'MODERADOR', type: 2, codrol: 2 },
        { name: 'USUARIO', type: 3, codrol: 3 },
        { name: 'EXECUTANTE', type: 4, codrol: 4}
    ];

    // Create roles if they do not exist
    for (const role of roles) {
        let existingRole = await prismaClient.role.findUnique({
            where: { name: role.name } // Use 'name' to check existence
        });

        if (!existingRole) {
            console.log(`Role '${role.name}' not found. Creating role...`);
            await prismaClient.role.create({
                data: {
                    name: role.name,
                    codrol: role.codrol,
                    type: role.type,
                },
            });
            console.log(`Role '${role.name}' created.`);
        } else {
            console.log(`Role '${role.name}' already exists.`);
        }
    }

    // Create a sample user for each role if not already created
    const passwordHash = await hash("admin@12t*", 8);

    const users = [
        { 
            user: 'hugo.ti',
            codusu: 0, 
            name: 'hugo.ti', 
            email: 'sup@domain.com', 
            password: passwordHash, 
            
            roleType: 0, // Use role type for connection
        },
    ];

    for (const userData of users) {
        let existingUser = await prismaClient.user.findUnique({
            where: { user: userData.user },
        });

        if (!existingUser) {
            console.log(`User '${userData.user}' not found. Creating user...`);
            const role = await prismaClient.role.findFirst({
                where: { type: userData.roleType } // Find the role by its type
            });

            if (role) {
                await prismaClient.user.create({
                    data: {
                        name: userData.name,
                        codusu: userData.codusu,
                        user: userData.user,
                        email: userData.email,
                        password: passwordHash,
                        role: {
                            connect: { id: role.id } // Connect using role's ID
                        }
                    }
                });
                console.log(`User '${userData.user}' created.`);
            } else {
                console.log(`Role with type '${userData.roleType}' not found for user '${userData.user}'.`);
            }
        } else {
            console.log(`User '${userData.user}' already exists.`);
        }
    }

    console.log("Seed completed: Users and Roles are set up.");
}

export default seed;
