import mongoose from "mongoose";
const { Schema, model } = mongoose;

const snippetSchema = new Schema(
    {
        userId: {
            type: String,
            // required: true,
        },
        title: {
            type: String,
            required: true,
        },
        language: {
            type: String,
            required: false,
        },
        code: {
            type: String,
            required: false
        },
        parent: {
            type: String,
            required: true
        },
        public: {
            type: Boolean,
            required: false
        }
    },
    { timestamps: true }
)

export default model("Snippet", snippetSchema)