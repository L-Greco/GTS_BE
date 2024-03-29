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
const origin = process.env.FE_URL
// *********************** MIDDLEWARES *********************** //
const corsOptions = {
    origin: origin,
    preflightContinue: false,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
};

server.use(express.json());
server.use(cookieParser());// in order to read cookie sent from client

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
