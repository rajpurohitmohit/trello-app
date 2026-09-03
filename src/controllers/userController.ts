import bcrypt from "bcrypt"
import type {Request, Response} from "express";
import jsonwebtoken from "jsonwebtoken";
import {db} from "../../prisma/db";
import "dotenv/config";

const runtime = await db.connect({ url: process.env.DATABASE_URL! });
console.log(runtime);

const signup = async (req: Request, res: Response) => {
    const {username, password} = req.body;

    if(!username || !password){
        res.status(403).json({
            message: "Fields can't be empty",
        })
        return
    }

    const userFound = await db.orm.public.Users
    .select("username")
    .where({
        username: username
    })
    .first();

    if(userFound){
        res.status(403).json({
            message: "User already exists"
        })
        return
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createUser = await db.orm.public.Users
    .create({
        username: username,
        password: hashedPassword as any
    })

    res.json({
        id: createUser.user_id,
        message: "User Created Successfully",
    })
}


const login = async (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password){
        res.status(403).json({
            message: "Fields can't be empty",
        })
        return;
    }

    const userFound = await db.orm.public.Users
    .select("user_id", "username", "password")
    .where({
        username: username
    })
    .first();

    if(!userFound){
        res.status(403).json({
            message: "User Not Found"
        })
        return;
    }

    const matchPass = await bcrypt.compare(password, userFound.password);

    if(!matchPass){
        res.status(402).json({
            message: "Incorrect Password"
        })
        return;
    }

    const token = jsonwebtoken.sign(userFound.username, process.env.JWT_SECRET!);

    res.json({
        token
    });
}

export {
    signup,
    login
}