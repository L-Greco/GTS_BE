import { Router } from "express";
import SnippetModel from "./schema.js"
import createError from "http-errors"
import { JWTMiddleWare } from "../../auth/tools.js";

const SnippetRouter = Router()


SnippetRouter.post("/", JWTMiddleWare, async (req, res, next) => {
    try {

        const newSnippet = await new SnippetModel({ ...req.body, userId: req.user._id }).save()
        res.status(201).send(newSnippet)
    } catch (error) {
        if (error.message.includes("validation")) {
            next(createError(400, { message: error.message }))
        }
        next(error)


    }
})

SnippetRouter.get("/home", JWTMiddleWare, async (req, res, next) => {
    try {
        console.time("mongo")
        const homeSnippets = await SnippetModel.find({
            $and:
                [
                    // { "parent.folder": { $eq: "none" } },
                    // { "userId": req.user._id }
                    { "parent": { $eq: "home" } },
                    { "userId": req.user._id }
                ]
        }

        )
        console.timeEnd("mongo") // 2 snippets with the filtering ===> mongo: 63.642ms 
        //  all the data  for 2 snippets ===>  mongo: 66.269ms
        res.status(200).send(homeSnippets)
    } catch (error) {
        next(error)
    }
})

// Routing for different folders
SnippetRouter.get("/folder/:folderName", JWTMiddleWare, async (req, res, next) => {
    try {
        console.time("mongo")
        const homeSnippets = await SnippetModel.find({
            $and:
                [
                    // { "parent.folder": { $eq: "none" } },
                    // { "userId": req.user._id }
                    { "parent": { $eq: req.params.folderName } },
                    { "userId": req.user._id }
                ]
        }

        )
        console.timeEnd("mongo") // 2 snippets with the filtering ===> mongo: 63.642ms 
        //  all the data  for 2 snippets ===>  mongo: 66.269ms
        res.status(200).send(homeSnippets)
    } catch (error) {
        next(error)
    }
})

SnippetRouter.get("/:id", JWTMiddleWare, async (req, res, next) => {
    try {

        const snippet = await SnippetModel.findById(req.params.id)
        if (req.user._id.toString() !== snippet.userId.toString()) {
            next(createError(403, { message: "forbidden snippet for this user" }))
        } else
            if (snippet) res.status(200).send(snippet)
            else next(createError(404, { message: "snippet not found" }))


    } catch (error) {
        next(error)
    }
})

export default SnippetRouter