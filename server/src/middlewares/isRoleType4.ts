import { Request, Response, NextFunction } from "express";

export function isRoleType4(
    req: Request,
    res: Response,
    next: NextFunction
){
    if(req.user_role_type == 4 ){
        return res.status(403).json({ error: "Access denied" });
    }

    return next();
}
