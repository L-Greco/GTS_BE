import mongoose from "mongoose"
import bcrypt from "bcrypt"

const { model, Schema } = mongoose

const UserSchema = new Schema(
    {
        profile: {
            username: { type: String },
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            email: { type: String, required: true, unique: true },

            avatar: { type: String, default: "https://source.unsplash.com/random" },
        },
        accountSettings: {
            preferredEditorLanguage: { type: String },
            preferredEditorTheme: { type: String },
            preferredApplicationLanguage: { type: String }
        },
        password: { type: String },
        refreshToken: { type: String },
        providerId: { type: String },
        newUser: { type: Boolean, default: true }
        //   folders:[folderSchema]

    },
    { timestamps: true }
)

UserSchema.methods.toJSON = function () {
    const user = this;
    const userObj = user.toObject();
    delete userObj.refreshToken;
    delete userObj.password;
    delete userObj.__v;

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
                return null;
            }
        } else {
            return null;
        }
    }
);

export default model("User", UserSchema);