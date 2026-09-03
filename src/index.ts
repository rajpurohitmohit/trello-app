import express from "express";
import userRoutes from "./routes/userRoutes";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/users", userRoutes);


app.listen(PORT);
console.log(`App running on port ${PORT}`);