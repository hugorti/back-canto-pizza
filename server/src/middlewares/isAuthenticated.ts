import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface Payload{
    sub: string;
    name: string;
    role: number; // Inclui a role no Payload
}

export function isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
){
    const authToken = req.headers.authorization;

    if(!authToken){
        return res.status(401).end();
    }

    const [, token] = authToken.split(" ");

    try{
        // Verifica o token
        const { sub, name, role } = verify(
            token,
            process.env.JWT_SECRET
        ) as Payload;

        req.user_id = sub;
        req.user_name = name;
        req.user_role_type = role; // Adiciona a role na requisição

        return next();

    }catch(err){
        return res.status(401).end();
    }
}
