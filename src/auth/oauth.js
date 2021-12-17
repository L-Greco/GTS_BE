import passport from "passport";
import GoogleStrategy from "passport-google-oauth20"
import GitHubStrategy from "passport-github2"
import UserModel from "../services/users/schema.js"
import { JWTgenerator } from "./tools.js"

passport.use("google", new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "/users/googleRedirect",
    proxy: true
}, // this callback function is going to be executed when we have 
    //  a response back from Google
    async (accessToken, refreshToken, profile, next) => {
        try {
            console.log(profile)
            // when we receive the profile we are going to check if it is 
            // an existant user in our db, if it is not we are going to create a new record

            const user = await UserModel.findOne({ providerId: profile.id })
            if (user) {
                const tokens = await JWTgenerator(user)
                next(null, { user, tokens })
            } else {
                const newUser = {
                    profile: {
                        userName: profile.displayName,
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        email: profile.emails[0].value,
                        avatar: profile.photos[0].value,
                    },
                    providerId: profile.id,
                    provider: "google"
                }
                const createdUser = new UserModel(newUser);
                const savedUser = await createdUser.save();

                const tokens = await JWTgenerator(savedUser);

                next(null, { savedUser, tokens });
            }
        } catch (error) {
            console.log(error)
            next(error)
        }

    }
))
passport.use("github", new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_SECRET,
    callbackURL: "/users/githubRedirect",
    proxy: true
},
    async (accessToken, refreshToken, profile, next) => {
        try {
            console.log(profile)
            // when we receive the profile we are going to check if it is 
            // an existant user in our db, if it is not we are going to create a new record

            const user = await UserModel.findOne({ providerId: profile.id })
            if (user) {
                const tokens = await JWTgenerator(user)
                next(null, { user, tokens })
            } else {
                const newUser = {
                    profile: {
                        userName: profile.username,

                    },
                    providerId: profile.id,
                    provider: "github"
                }
                const createdUser = new UserModel(newUser);
                const savedUser = await createdUser.save();

                const tokens = await JWTgenerator(savedUser);

                next(null, { savedUser, tokens });
            }
        } catch (error) {
            console.log(error)
            next(error)
        }

    }
))



passport.serializeUser(function (user, next) {
    // this is for req.user
    next(null, user);
});


export default {}