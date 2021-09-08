import Jwt from "jsonwebtoken";
const secret = process.env.JWT_TOKEN_SECRET

console.time("jwt")
const token = Jwt.sign({ name: "Kostas", surname: "Makaronas" }, secret, { expiresIn: 1 })
console.timeEnd("jwt")
console.log(token)
let aaa
const verified = setTimeout(() => {
    aaa = Jwt.verify(token, secret)
    console.log(aaa)
}
    , 1000)
