import mongoose from "mongoose"

const { model, Schema } = mongoose

const UserSchema = new Schema(
    {
        profile: {
            username: { type: String },
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            email: { type: String, required: true, unique: true },
            password: { type: String },
            avatar: { type: String, default: "https://source.unsplash.com/random" },
        },
        accountSettings: {
            preferredEditorLanguage: { type: String },
            preferredEditorTheme: { type: String },
            preferredApplicationLanguage: { type: String }
        },
        refreshToken: { type: String },
        providerId: { type: String }
        //   folders:[folderSchema]

    },
    { timestamps: true }
)

export default model("User", UserSchema);