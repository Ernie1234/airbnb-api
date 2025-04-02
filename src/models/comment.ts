import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  userId: mongoose.Types.ObjectId;
  listingId: mongoose.Types.ObjectId;
  content: string;
  rating: number;
}

// Define the Reservation schema
const CommentSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    listingId: {
      type: mongoose.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    content: {
      type: String,
      required: true,
      minlength: 10,
      maxLength: 5000,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
    toJSON: {
      transform: (doc, ret) => {
        const transformedRet = { ...ret };
        transformedRet.id = transformedRet._id; // Include id field
        delete transformedRet._id; // Remove _id field
        delete transformedRet.__v; // Remove version key
        return transformedRet;
      },
    },
  },
);

CommentSchema.index({ listingId: 1 });
CommentSchema.index({ userId: 1 });
CommentSchema.index({ rating: 1 });
CommentSchema.index({ createdAt: -1 });

// Export the model
export default mongoose.model<IComment>('Comment', CommentSchema);
