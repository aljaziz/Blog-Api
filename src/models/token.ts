import mongoose, { Schema, Types } from "mongoose";

export interface TokenType {
    token: string;
    userId: Types.ObjectId;
}

const tokenSchema = new Schema<TokenType>({
    token: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
});

export default mongoose.model<TokenType>("Token", tokenSchema);
