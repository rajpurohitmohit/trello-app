import express from "express";
import {db} from "./prisma/db";
import bcrypt from "bcrypt";
import "dotenv/config";

const app = express();

app.post("/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password){
        res.status(403).json({
            message: "Fields can't be empty",
        })
    }

    const userFound = await db.orm.public.Users
    .select("username")
    .where({
        username: username
    })

    if(userFound){
        res.status(403).json({
            message: "User already exists"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createUser = await db.orm.public.Users
    .create({
        username: username,
        password: hashedPassword as any
    })

    res.json({
        id: createUser.userId,
        message: "User Created Successfully",
    })
})