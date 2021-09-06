import express from "express";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import cors from "cors";
import errorHandlers from "./errorHandlers.js";

const server = express();
const { PORT, MONGO_CONNECTION_ATLAS } = process.env;
server.use(express.json());

server.use(cors())

server.use(errorHandlers)

mongoose
    .connect(MONGO_CONNECTION_ATLAS, {
        // useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useFindAndModify: false,
    })
    .then(
        server.listen(PORT, () => {
            console.table(listEndpoints(server));
            console.table({ "Running At Port Number": PORT });
        })
    );
