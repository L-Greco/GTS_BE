import mongoose from "mongoose"
import bcrypt from "bcrypt"
import createError from "http-errors";
const { model, Schema } = mongoose

const UserSchema = new Schema(
    {
        profile: {
            userName: { type: String },
            firstName: { type: String },
            lastName: { type: String },
            email: { type: String, unique: true },

            avatar: { type: String },
        },
        accountSettings: {
            preferredEditorLanguage: { type: String, default: "javascript" },
            preferredEditorTheme: { type: String, default: "tomorrow-night-bright" },
            preferredApplicationLanguage: { type: String, default: "english" }
        },
        folders: [{ type: Schema.Types.ObjectId, ref: "Folder" }],
        password: { type: String },
        refreshToken: { type: String },
        providerId: { type: String },
        provider: { type: String },
        newUser: { type: Boolean, default: true }


    },
    { timestamps: true }
)

UserSchema.methods.toJSON = function () {
    const user = this;
    const userObj = user.toObject();
    delete userObj.refreshToken;
    delete userObj.password;
    delete userObj.__v;
    delete userObj.providerId
    delete userObj.updatedAt
    delete userObj.createdAt


    return userObj;
};

UserSchema.pre("save", async function () {
    const newUser = this;

    if (newUser.isModified("password")) {
        newUser.password = await bcrypt.hash(newUser.password, 10);
    }
});





UserSchema.static(
    "checkCredentials",
    async function checkCredentials(email, password) {
        const user = await this.findOne({ "profile.email": email })
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {

                return user;
            } else {


                return 400;
            }
        } else {

            return 404
        }
    }
);

export default model("User", UserSchema);