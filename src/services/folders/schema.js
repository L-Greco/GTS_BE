import mongoose from "mongoose";
const { Schema, model } = mongoose;

const folderSchema = new Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId, ref: "User",
            required: true

        },
        name: {
            type: String,
            required: true

        },

        parent: {
            type: String,
            required: true,
            default: "home"
        },

    },
    { timestamps: true }
)

folderSchema.methods.toJSON = function () {
    const folder = this;
    const folderObj = folder.toObject();

    delete folderObj.__v;
    delete folderObj.updatedAt
    delete folderObj.createdAt
    delete folderObj.userId

    return folderObj;
};


export default model("Folder", folderSchema)