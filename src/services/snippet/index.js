import { Router } from "express";
import SnippetModel from "./schema.js"
import createError from "http-errors"

const SnippetRouter = Router()


SnippetRouter.post("/", async (req, res, next) => {
    try {

        const newSnippet = await new SnippetModel({ ...req.body, userId: req.user._id }).save()
        res.status(201).send(newSnippet)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

SnippetRouter.get("/home", async (req, res, next) => {
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
        },
            { title: 1, language: 1 }
        )
        console.timeEnd("mongo") // 2 snippets with the filtering ===> mongo: 63.642ms 
        //  all the data  for 2 snippets ===>  mongo: 66.269ms
        res.status(200).send(homeSnippets)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

export default SnippetRouter