import jwt from "jsonwebtoken"
import atob from "atob"
import UserModel from "../services/users/schema.js"
import createError from "http-errors";
import crypto from "crypto"


// edw dhmiourgw ena kainourgio promise oste na mporw meta na pw 
//  await generateJWT , to new Promise exei mesa tou mia callback me 2 parameters 
//  to resolve otan den uparxei error kai to reject otan uparxei error 
// oson afora to jwt library otan valoume thn callback mesa sto sign einai asynchronous
// i function , otan mesa sthn function den uparxei i callback tote einai syncrhonous
// dld apla  jwt.sign(payload, process.env.JWT_TOKEN_SECRET)

const generateAccessToken = (payload) =>
    new Promise((resolve, reject) =>
        jwt.sign(
            payload,
            process.env.JWT_TOKEN_SECRET,
            { expiresIn: "1 min" },
            (err, token) => {
                if (err) reject(err);

                resolve(token);
            }
        )
    );

const generateRefreshToken = (payload) =>
    new Promise((resolve, reject) =>
        jwt.sign(
            payload,
            process.env.JWT_TOKEN_SECRET,
            { expiresIn: "2 min" },
            (err, token) => {
                if (err) reject(err);

                resolve(token);
            }
        )
    );

const verifyToken = token => new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, decodedToken) => {
        if (err) reject(err)
        resolve(decodedToken)
    })
)

export const JWTgenerator = async (user) => {
    const accessToken = await generateAccessToken({ _id: user._id });
    const refreshToken = await generateRefreshToken({ _id: user._id });

    user.refreshToken = refreshToken;

    await user.save()

    return { accessToken, refreshToken }
}
export const JWTMiddleWare = async (req, res, next) => {
    console.log(req.cookies)
    if (!req.cookies.accessToken) {
        next(createError(401, { message: "Provide Access Token" }));
    } else {
        try {
            const content = await verifyToken(req.cookies.accessToken);
            const user = await UserModel.findById(content._id).populate("folders", { _id: 1, name: 1, parent: 1 })

            if (user) {
                req.user = user;
                next();
            } else {
                next(createError(404, { message: "User not found" }));
            }
        } catch (error) {
            next(createError(401, { message: "AccessToken not valid" }));
        }
    }
};

export const refreshTokens = async (req, res, next) => {
    try {
        // 1. Is the actual refresh token still valid?
        const decoded = await verifyToken(req.cookies.refreshToken)

        // 2. If the token is valid we are going to find the user in db
        const user = await UserModel.findById(decoded._id)
        console.log(decoded)
        console.log(user)

        // 3. Once we have the user we can compare actualRefreshToken with the one stored in db
        if (user) {
            if (req.cookies.refreshToken === user.refreshToken) {
                // 4. If everything is fine we can generate the new pair of tokens
                const { accessToken, refreshToken } = await JWTgenerator(user)
                user.refreshToken = refreshToken
                await user.save()

                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                });
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                });
                next()
            }
        } else next(createError(404, { message: "User not found" }));


    } catch (error) {
        console.log(error)
        next(createError(401, { message: "Refresh Token Expired " }));

    }
}


export const basicAuthMiddleware = async (req, res, next) => {
    if (!req.headers.authorization) {
        next(createError(400, { message: "Authorization required" }));
    } else {
        const decoded = atob(req.headers.authorization.split(" ")[1]);
        const [email, password] = decoded.split(":");

        const user = await UserModel.checkCredentials(email, password);

        if (user) {
            req.user = user;
            next();
        } else {
            next(createError(400, { message: "Credentials wrong" }));
        }
    }
};

// export const refreshTokens = async actualRefreshToken => {
//     try {
//         // 1. Is the actual refresh token still valid?
//         const decoded = await verifyToken(actualRefreshToken)

//         // 2. If the token is valid we are going to find the user in db
//         const user = await UserModel.findById(decoded._id)
//         console.log(user)
// // 3. Once we have the user we can compare actualRefreshToken with the one stored in db
//         if (user)  {
//             if (actualRefreshToken === user.refreshToken) {
//             // 4. If everything is fine we can generate the new pair of tokens
//             const { accessToken, refreshToken } = await JWTgenerator(user)
//             return { accessToken, refreshToken }
//         }
//         } else return "User not found "


//     } catch (error) {
//         console.log(error)
//        return error
//     }
// }
export const encryptData = (message) => {
    const algorithm = "aes-256-cbc";
    const iv = new Buffer(crypto.randomBytes(16))
    const initVector = iv.toString('hex').slice(0, 16);
    const key = process.env.CRYPTO_SECRET
    const cipher = crypto.createCipheriv(algorithm, key.slice(0, 32), initVector);
    return cipher.update(message, "utf-8", "hex");

}

export const decryptData = (encryptedData) => {
    const algorithm = "aes-256-cbc";
    const iv = new Buffer(crypto.randomBytes(16))
    const initVector = iv.toString('hex').slice(0, 16);

    const decipher = crypto.createDecipheriv(algorithm, process.env.CRYPTO_SECRET.slice(0, 32), initVector);
    return decipher.update(encryptedData, "hex", "utf-8");

}



