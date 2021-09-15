import mongoose from "mongoose";
const { Schema, model } = mongoose;

const snippetSchema = new Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId, ref: "User",
            required: true

        },
        title: {
            type: String

        },
        language: {
            type: String,

        },
        code: {
            type: String,

        },
        parent: {
            type: String
        },
        public: {
            type: Boolean,

        },
        queryParameters: {
            type: String
        }
    },
    { timestamps: true }
)

export default model("Snippet", snippetSchema)