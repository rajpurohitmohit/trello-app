import express from "express";
import {db} from "./prisma/db";
import bcrypt from "bcrypt";
import "dotenv/config";
const PORT = 3000;

const app = express();
await db.connect({ url: process.env.DATABASE_URL! })

app.use(express.json());

app.post("/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

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
})

app.listen(PORT);
console.log("Running on port: ", PORT);