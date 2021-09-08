import jwt from "jsonwebtoken"
// edw dhmiourgw ena kainourgio promise oste na mporw meta na pw 
//  await generateJWT , to new Promise exei mesa tou mia callback me 2 parameters 
//  to resolve otan den uparxei error kai to reject otan uparxei error 
// oson afora to jwt library otan valoume thn callback mesa sto sign einai asynchronous
// i function , otan mesa sthn function den uparxei i callbakc tote einai syncrhonous
// dld apla  jwt.sign(payload, process.env.JWT_TOKEN_SECRET)


const generateJWT = payload =>
    new Promise((resolve, reject) =>
        jwt.sign(payload, process.env.JWT_TOKEN_SECRET, { expiresIn: "14 days" }), (err, token) => {
            if (err) reject(err)
            resolve(token)
        }
    )

const verifyToken = token => new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, decodedToken) => {
        if (err) reject(err)
        resolve(decodedToken)
    })
)

export const JWTgenerator = async (user) => {
    const accessToken = await generateJWT({ _id: user._id })
}