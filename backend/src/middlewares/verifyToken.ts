import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;


export default function verifyToken(
    request: Request,
    response: Response,
    next: NextFunction
) {
    try {

        if (!request.headers.authorization) {
            throw "Token invalido";
        };

        const [type, token] = request.headers.authorization.split(' ');

        if (type != "bearer") {
            throw "Token invalido";
        };

        try {
            const jwtStatus = jwt.verify(token, JWT_SECRET_KEY)
            //@ts-ignore
            request.userId = jwtStatus.id;
            next(null);
        } catch (error) {
            throw "Token invalido";
        };



    } catch (error) {
        response.json({
            status: 'error',
            message: error
        }).statusCode = 400;
    }
}

export function verifyTokenSocketio(authorization: any) {

    if (!authorization) {
        return "invalid";
    };

    const [type, token] = authorization.split(" ");

    if (type !== "bearer") {
        return "invalid";
    };

    try {
        const jwtResults = jwt.verify(token, JWT_SECRET_KEY) as { id: string };
        return jwtResults.id;
    } catch (error) {
        return "invalid";
    };

}