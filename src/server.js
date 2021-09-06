import express from "express";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";

const server = express();
const { PORT, MONGO_CONNECTION_ATLAS } = process.env;
server.use(express.json());
mongoose
    .connect(MONGO_CONNECTION_ATLAS, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(
        server.listen(PORT, () => {
            console.table(listEndpoints(server));
            console.table({ "Running At Port Number": PORT });
        })
    );
