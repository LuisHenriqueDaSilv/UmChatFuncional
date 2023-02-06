import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response, Router } from 'express';
import { body, validationResult,  } from 'express-validator';

import prisma from '../services/prisma';

import formDataHandler from '../services/formDataHandler';
import verifyTokenMiddleware from '../middlewares/verifyToken'


interface CreateAccountBody {
    username: string,
    password: string
};

interface UserSearch {
    username: string,
    imageUrl: string,
    id: string
}

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;

export class UserController {


    router = Router();
    constructor() {

        this.router.post(
            '/authenticate/', 
            formDataHandler.single('image'), 
            body("username").isLength({max: 25, min: 3}).withMessage("Um bom nome de usuário deve ter entre 3 e 25 letras!"),
            body("password").isLength(({max: 50, min:5})).withMessage("Uma boa senha deve ter entre 5 e 50 letras!"),
            this.create
        );

        this.router.get(
            '/user/', 
            verifyTokenMiddleware,
            this.read
        )

        this.router.get(
            '/search/users',
            verifyTokenMiddleware,
            this.readMany
        )

    }

    async create(request: Request, response: Response) {

        try {

            // @ts-ignore
            if (request.fileAccepted === false) {
                throw "Imagem de perfil inválida!";
            }

            const expressValidationResults = validationResult(request);
            if(!expressValidationResults.isEmpty()){
                // @ts-ignore
                throw expressValidationResults.errors[0].msg;
            }

            const {
                password,
                username
            } = request.body as CreateAccountBody;

            let userAccount = await prisma.user.findFirst({
                where: { username },
            });

            if(!userAccount){
                const encryptedPassword = bcrypt.hashSync(password, 10);
                userAccount = await prisma.user.create({
                    data: {
                        username,
                        encryptedPassword,
                        imageName: request.file?.filename || 'default.jpg'
                    }
                });
            } else {

                const passwordAreCorrect = bcrypt.compareSync(password, userAccount.encryptedPassword);
                if(!passwordAreCorrect){
                    throw "O nome de usuário informado já está em uso e com outra senha!"
                };

                if(request.file?.filename){
                    await prisma.user.update({
                        where: {
                            username: username
                        },
                        data: {
                            imageName: request.file?.filename
                        }
                    })
                }

            }

            const jwtToken = jwt.sign(
                {
                    id: userAccount.id
                },
                JWT_SECRET_KEY,
                {
                    expiresIn: '24h'
                }
            );

            response.json({
                status: 'ok',
                jwt: jwtToken,
                user: {
                    username: userAccount.username,
                    imageUrl: `http://localhost:3000/images/${request.file?.filename || userAccount.imageName}`,
                    id: userAccount.id
                }
            });

        } catch (error) {

            // @ts-ignore
            if (request.file) {
                fs.unlinkSync(
                    path.join(request.file?.path)
                );
            };

            response.json({
                status: 'error',
                message: String(error)
            }).statusCode = 400;
        }

    }

    async read(request: Request, response: Response){

        try {            
            //@ts-ignore
            const userId = request.userId as string
    
            const user = await prisma.user.findFirst({
                where: {
                    id: userId
                },
                select: {
                    username: true,
                    imageName: true,
                    id: true
                }
            })
    
            if(!user){
                throw "Nenhum usuario encontrado"
            }else {
                response.json({
                    status: 'ok',
                    user: {
                        username: user.username,
                        imageUrl: `http://localhost:3000/images/${user.imageName}`,
                        id: user.id
                    }
                })
            }
        } catch (error) {
            return response.json({
                status: 'error',
                message: error
            }).statusCode = 400
        }
        
    }

    async readMany(request:Request, response:Response){

        try {

            const searchQuery = request.query.s as string

            if(!searchQuery){
                throw "Parametros de busca não informado"
            }
            
            const users = await prisma.user.findMany({
                where: {
                    username: {
                        contains: searchQuery
                    }
                },
                select: {
                    username:true,
                    imageName:true,
                    id:true,
                }
            }) 

            const usersData = [] as UserSearch[]
            users.forEach((user) => {
                usersData.push({
                    username: user.username,
                    imageUrl: `http://localhost:3000/images/${user.imageName}`,
                    id: user.id
                })
            })

            return response.json({
                status: 'ok',
                usersData,
            })

        } catch(error){
            return response.json({
                'status': 'error',
                message: error
            }).statusCode = 400
        }

    }

}