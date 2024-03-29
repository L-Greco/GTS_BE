import express from "express";
import passport from "passport";
import UserModel from "./schema.js"
import FolderModel from "../folders/schema.js"
import createError from "http-errors";
import bcrypt from "bcrypt"
import { JWTMiddleWare, JWTgenerator, refreshTokens, basicAuthMiddleware } from "../../auth/tools.js";


const usersRouter = express.Router();

usersRouter.get(
    "/wakingTheDyno",
    // this endpoint only to wake the heroku dyno before loggin in :/
    async (req, res, next) => {
        try {


            res.status(200).send("ok");
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
);
usersRouter.get(
    "/me",
    JWTMiddleWare,
    async (req, res, next) => {
        try {

            const dataToSend = req.user.accountSettings ? { ...req.user.profile, ...req.user.accountSettings } : req.user.profile
            res.status(200).send(req.user);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
);
usersRouter.get(
    "/updateMyFolders",
    JWTMiddleWare,
    async (req, res, next) => {
        try {
            const currentFolders = await FolderModel.find(
                { userId: req.user._id }
            )

            await UserModel.findByIdAndUpdate(req.user._id,
                {

                    "folders": currentFolders
                }
            )

            res.status(200).send(currentFolders);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
);

usersRouter.post(
    "/register",
    async (req, res, next) => {
        try {
            const newUser = await new UserModel(req.body).save();
            res.status(201).send(newUser);
        } catch (error) {
            if (error.name === "MongoError")
                res.send({
                    error: error.keyValue,
                    reason: "Duplicated key",
                    advice: "Change the key value",
                });
            else if (error.name === "ValidationError") res.send(error.message);
            else next(createError(400, { message: error.message }));
        }
    }
);

usersRouter.get(
    "/login",
    basicAuthMiddleware,
    async (req, res, next) => {
        try {
            if (req.user) {

                const { accessToken, refreshToken } = await JWTgenerator(req.user);
                res.cookie("accessToken", accessToken, {
                    secure: true,
                    sameSite: 'none',
                    httpOnly: true,
                    origin: process.env.FE_URL,
                    maxAge: 31536000
                });
                res.cookie("refreshToken", refreshToken, {
                    secure: true,
                    sameSite: 'none',
                    httpOnly: true,
                    origin: process.env.FE_URL,
                    maxAge: 31536000
                });

                res.status(200).send();

            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
);

usersRouter.put(
    "/edit",
    JWTMiddleWare,
    async (req, res, next) => {
        try {

            if (req.user.password !== req.body.password && req.body.password) {
                req.body.password = await bcrypt.hash(req.body.password, 10)
            }
            const updatedUser = await UserModel.findByIdAndUpdate(
                req.user._id,
                {

                    ...req.body,

                },
                { runValidators: true, new: true }
            );
            // console.log(updatedUser)
            // res.status(200).send(updatedUser);
            res.status(200).send("ok")
        } catch (error) {
            if (error.name === "MongoError")
                res.send({
                    error: error.keyValue,
                    reason: "Duplicated key",
                    advice: "Change the key value",
                });
            else if (error.name === "ValidationError") res.send(error.message);
            else next(createError(500, { message: error.message }));
        }
    }
);

usersRouter.delete(
    "/delete",
    JWTMiddleWare,
    async (req, res, next) => {
        try {
            const deletedUser = await UserModel.findByIdAndDelete(req.user._id);
            if (deletedUser) {
                res.clearCookie("accessToken");
                res.clearCookie("refreshToken");
                res.status(201).send("Profile deleted");
            }
            else next(createError(400, "Bad Request"));
        } catch (error) {
            next(createError(500, { message: error.message }));
        }
    }
);


usersRouter.post("/logout", async (req, res, next) => {
    try {
        res.cookie("accessToken", "", { expires: new Date(0) });
        res.cookie("refreshToken", "", { expires: new Date(0) });
        res.status(200).send();
    } catch (error) {
        console.log(error);
        next(error);
    }
});





usersRouter.post("/refreshToken", refreshTokens, async (req, res, next) => {
    // we go to this route when the access token is invalid so we create a new pair 
    // of tokens
    try {

        res.status(200).send("ok")
    } catch (error) {
        next(error)
    }
})

// Google Log In 
// scope needs to be defined, it says what information google is going to give us 
// this endpoint just redirects to google :)
usersRouter.get("/googleLogin", passport.authenticate("google", { scope: ["profile", "email"] }))




usersRouter.get(
    "/googleRedirect",
    passport.authenticate("google"),
    async (req, res, next) => {
        try {

            res.cookie("accessToken", req.user.tokens.accessToken, {
                secure: true,
                sameSite: 'none',
                httpOnly: true,
                origin: process.env.FE_URL,
                maxAge: 31536000
            });
            res.cookie("refreshToken", req.user.tokens.refreshToken, {
                sameSite: 'none',
                secure: true,
                httpOnly: true,
                origin: process.env.FE_URL,
                maxAge: 31536000
            });


            res.status(200).redirect(process.env.FE_URL + "/home");



        } catch (error) {
            next(error);
        }
    }
);
usersRouter.get("/githubLogin", passport.authenticate("github", { scope: ["profile", "email"] }))
usersRouter.get(
    "/githubRedirect",
    passport.authenticate("github"),
    async (req, res, next) => {
        try {

            res.cookie("accessToken", req.user.tokens.accessToken, {
                sameSite: 'none',
                secure: true,
                httpOnly: true,
                origin: process.env.FE_URL,
                maxAge: 31536000

            });
            res.cookie("refreshToken", req.user.tokens.refreshToken, {
                sameSite: 'none',
                secure: true,
                httpOnly: true,
                origin: process.env.FE_URL,
                maxAge: 31536000
            });


            res.redirect(302, process.env.FE_URL + "/home");



        } catch (error) {
            next(error);
        }
    }
);



export default usersRouter