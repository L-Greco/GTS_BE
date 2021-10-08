import { Router } from "express";
import FolderModel from "./schema.js"
import UserModel from "../users/schema.js"
import SnippetModel from "../snippet/schema.js"
import createError from "http-errors"
import { JWTMiddleWare } from "../../auth/tools.js";

const FolderRouter = Router()


FolderRouter.post("/", JWTMiddleWare, async (req, res, next) => {
    try {
        const folder = await new FolderModel({ ...req.body, userId: req.user._id }).save()
        await UserModel.findByIdAndUpdate(req.user._id,
            {
                $push: { folders: folder._id }
            })
        res.status(201).send(folder)
    } catch (error) {
        if (error.message.toLowerCase().includes("validation")) {
            next(createError(400, { message: error.message }))
        }
        next(error)


    }
})
FolderRouter.get("/home", JWTMiddleWare, async (req, res, next) => {
    try {
        const folders = await FolderModel.find({
            $and:
                [

                    { "parent.home": true },
                    { "userId": req.user._id }
                ]
        })


        res.status(200).send(folders)
    } catch (error) {
        if (error.message.toLowerCase().includes("validation")) {
            next(createError(400, { message: error.message }))
        }
        next(error)


    }
})
FolderRouter.get("/:parentName", JWTMiddleWare, async (req, res, next) => {
    try {
        const folders = await FolderModel.find({
            $and:
                [

                    { "parent.folderId": { $eq: req.params.parentName } },
                    { "userId": req.user._id }
                ]
        })


        res.status(200).send(folders)
    } catch (error) {
        if (error.message.toLowerCase().includes("validation")) {
            next(createError(400, { message: error.message }))
        }
        next(error)


    }
})



FolderRouter.put("/edit/:folderId", JWTMiddleWare, async (req, res, next) => {
    try {

        const updatedFolder = await FolderModel.findByIdAndUpdate(
            req.params.folderId,
            {
                ...req.body,

            },
            { runValidators: true, new: true }
        );
        res.status(201).send(updatedFolder)
    } catch (error) {
        next(error)
    }
})
FolderRouter.delete("/deleteAndSnippets/:folderId", JWTMiddleWare, async (req, res, next) => {
    try {
        const updatedFolder = await FolderModel.findByIdAndDelete(req.params.folderId);
        const deleteSnipps = await SnippetModel.deleteMany({ "parent.folderId": req.params.folderId })
        const moveFolders = await FolderModel.updateMany(
            {
                "parent.folderId": req.params.folderId
            },
            {
                "parent.home": true,
                "parent.folderId": null
            }
        )
        res.status(200).send("folder deleted!")
    } catch (error) {
        next(error)
    }
})
FolderRouter.delete("/delete/:folderId", JWTMiddleWare, async (req, res, next) => {
    try {
        const updatedFolder = await FolderModel.findByIdAndDelete(req.params.folderId);
        res.status(200).send("folder deleted!")
    } catch (error) {
        next(error)
    }
})

export default FolderRouter