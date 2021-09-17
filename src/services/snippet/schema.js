import mongoose from "mongoose";
const { Schema, model } = mongoose;

const snippetSchema = new Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId, ref: "User",
            required: true

        },
        title: {
            type: String,
            required: true

        },
        language: {
            type: String,
            required: true

        },
        code: {
            type: String,
            required: true

        },
        parent: {
            type: String,
            required: true
        },
        public: {
            type: Boolean,

        },
        queryParameters: {
            type: String
        },
        comments: {
            type: String
        }
    },
    { timestamps: true }
)

snippetSchema.methods.toJSON = function () {
    const snippet = this;
    const snippetObj = snippet.toObject();

    delete snippetObj.__v;
    delete snippetObj.updatedAt
    delete snippetObj.createdAt
    delete snippetObj.userId

    return snippetObj;
};


export default model("Snippet", snippetSchema)