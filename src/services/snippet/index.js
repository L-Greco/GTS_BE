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

        const homeSnippets = await SnippetModel.find({ $and: [{ "parent.folder": { $eq: "none" } }, { "userId": req.user._id }] })
        res.status(200).send(homeSnippets)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

export default SnippetRouter