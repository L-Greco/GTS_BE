import express from "express";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import cors from "cors";
import errorHandlers from "./errorHandlers.js";
import passport from "passport";
import oauth from "./auth/oauth.js"
import usersRouter from "./services/users/index.js";
import cookieParser from "cookie-parser";

const server = express();
const { PORT, MONGO_CONNECTION_ATLAS } = process.env;

// *********************** MIDDLEWARES *********************** //

server.use(express.json());
server.use(cookieParser());
server.use(cors())
server.use(passport.initialize())

// *********************** ROUTES *********************** //

server.use("/users", usersRouter)

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
