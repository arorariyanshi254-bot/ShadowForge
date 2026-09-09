import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: [true, "Project name is required"],
            trim: true,
        },
        targetUrl: {
            type: String,
            required: [true, "Target URL is required"],
            trim: true,
        },
        method: {
            type: String,
            default: "GET",
        },
        headers: [
            {
                key: String,
                value: String,
            },
        ],
        status: {
            type: String,
            enum: ["Configured", "Captured", "Schema Ready", "Mock Ready", "Active"],
            default: "Configured",
        },
        faultConfig: {
            type: Object,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Map _id to id when sending JSON response for compatibility
projectSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
