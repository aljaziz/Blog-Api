import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface UserType {
    username: string;
    email: string;
    password: string;
    role: "admin" | "user";
    firstName?: string;
    lastName?: string;
    socialLinks: {
        website?: string;
        facebook?: string;
        instagram?: string;
        linkedin?: string;
        x?: string;
        youtube?: string;
    };
}

const userSchema = new Schema<UserType>(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            maxLength: [20, "Username must be less than 20 charactars"],
            unique: [true, "Username must be unique"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            maxLength: [250, "Email must be less than 250 charactars"],
            unique: [true, "Email must be unique"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            select: false,
        },
        role: {
            type: String,
            required: [true, "Role is required"],
            enum: {
                values: ["admin", "user"],
                message: "{VALUE} is not supported",
            },
            default: "user",
        },
        firstName: {
            type: String,
            maxLength: [20, "First name must be less than 20 characters"],
        },
        lastName: {
            type: String,
            maxLength: [20, "Last name must be less than 20 characters"],
        },
        socialLinks: {
            type: new Schema(
                {
                    website: {
                        type: String,
                        maxLength: [
                            100,
                            "Website address must be less than 100 chatacters",
                        ],
                    },
                    facebook: {
                        type: String,
                        maxLength: [
                            100,
                            "Facebook profile url must be less than 100 chatacters",
                        ],
                    },
                    instagram: {
                        type: String,
                        maxLength: [
                            100,
                            "Instagram profile url must be less than 100 chatacters",
                        ],
                    },
                    x: {
                        type: String,
                        maxLength: [
                            100,
                            "X profile url must be less than 100 chatacters",
                        ],
                    },
                    linkedin: {
                        type: String,
                        maxLength: [
                            100,
                            "LinkedIn profile url must be less than 100 chatacters",
                        ],
                    },
                    youtube: {
                        type: String,
                        maxLength: [
                            100,
                            "Youtube channel url must be less than 100 chatacters",
                        ],
                    },
                },
                { _id: false }
            ),
            default: {},
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

export default mongoose.model<UserType>("User", userSchema);
