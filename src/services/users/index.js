import express from "express";
import passport from "passport";
import UserModel from "./schema.js"
import { JWTMiddleWare, JWTgenerator, refreshTokens } from "../../auth/tools.js";
const usersRouter = express.Router();


usersRouter.get("/refreshToken/:endpointToReach", refreshTokens, async (req, res, next) => {
    // we go to this route when the access token is invalid so we create a new pair 
    // of tokens
    try {

        res.status(200).redirect(process.env.FE_URL + "/" + req.params.endpointToReach) //here redirects to logout
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
                httpOnly: true,
            });
            res.cookie("refreshToken", req.user.tokens.refreshToken, {
                httpOnly: true,
            });

            res.status(200).redirect(process.env.FE_URL);


        } catch (error) {
            next(error);
        }
    }
);



export default usersRouter