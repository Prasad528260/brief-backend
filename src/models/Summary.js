import mongoose from "mongoose";
import { Schema } from "mongoose";

const summarySchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    summary: {
      overview: {
        type: String,
        required: true,
      },

      topics: {
        type: [
          {
            topic: {
              type: String,
              required: true,
            },
            discussion: {
              type: String,
              required: true,
            },
          },
        ],
        default: [],
      },

      highlights: {
        type: [
          {
            text: {
              type: String,
              required: true,
            },
            author: {
              type: String,
              default: "Unknown",
            },
          },
        ],
        default: [],
      },
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: false,
    },
  }
);

// index AFTER schema definition
summarySchema.index({ userId: 1, createdAt: -1 });

const Summary = mongoose.model("Summary", summarySchema);

export default Summary;
