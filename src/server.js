import express from "express";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import cors from "cors";
import errorHandlers from "./errorHandlers.js";
import passport from "passport";
import oauth from "./auth/oauth.js"
import usersRouter from "./services/users/index.js";
import cookieParser from "cookie-parser";
import SnippetRouter from "./services/snippet/index.js";
import { JWTMiddleWare } from "./auth/tools.js";
import FolderRouter from "./services/folders/index.js";

const server = express();
const { PORT, MONGO_CONNECTION_ATLAS } = process.env;

// *********************** MIDDLEWARES *********************** //
const corsOptions = {
    origin: process.env.FE_URL,
    preflightContinue: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
};

server.use(express.json());
server.use(cookieParser());// in order to read cookie sent from client
server.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", true);

    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});
server.use(cors(corsOptions))
server.use(passport.initialize())

// *********************** ROUTES *********************** //

server.use("/users", usersRouter)
server.use("/snippets", JWTMiddleWare, SnippetRouter)
server.use("/folders", JWTMiddleWare, FolderRouter)

// *********************** ERROR HANDLERS *********************** //
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
