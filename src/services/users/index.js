import express from "express";
import passport from "passport";
const usersRouter = express.Router();

// Google Log In 
// scope needs to be defined, it says what information google is going to give us 
// this endpoint just redirects to google :)
usersRouter.get("/googleLogin", passport.authenticate("google", { scope: ["profile", "email"] }))



usersRouter.get("/googleRedirect", passport.authenticate("google"), async (req, res, next) => {
    try {
        res.send("ok")
    } catch (error) {
        console.log(error);
        next(error);
    }
})



export default usersRouter