import mongoose from "mongoose";
// import { type } from "os";

const companionSchema = new mongoose.Schema(
    {
        name : {
            type: String,
            required: true,
        },
        img : {
            type: String,
            required: true,
        },
        owner: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            }
        ],
        background : {
            type: String,
            required: true,
            minlength : 15,
            maxlength : 500,
        },
        identity : {
            type: String,
            required: true,
            minlength : 15,
            maxlength : 500,
        },
        traits : [
            {
                type: String,
                trim: true,
                maxlength : 100,
            }
        ],
    },
    {timestamps: true,}
)    

const Companion = mongoose.model("Companion", companionSchema);

export default Companion;