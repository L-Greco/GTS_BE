import passport from "passport";
import GoogleStrategy from "passport-google-oauth20"

passport.use("google", new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URL
}, // this callback function is going to be executed when we have 
    //  a response back from Google
    async (accessToken, refreshToken, profile, next) => {
        try {
            console.log(profile)
            // when we receive the profile we are going to check if it is 
            // an existant user in our db, if it is not we are going to create a new record

        } catch (error) {

        }

    }
))


export default {}