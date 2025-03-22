import mongoose, { Document, Schema } from 'mongoose';

export interface IListing extends Document {
  title: string;
  description: string;
  imageSrc: string[];
  createdAt: Date;
  updatedAt: Date;
  category: string;
  bathroomCount: number;
  roomCount: number;
  guestCount: number;
  location: string;
  userId: mongoose.Types.ObjectId;
  price: number;
}

// Define the Listing schema
const ListingSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageSrc: { type: [String], required: true },
    category: { type: String, required: true },
    bathroomCount: { type: Number, required: true },
    roomCount: { type: Number, required: true },
    guestCount: { type: Number, required: true },
    location: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    price: { type: Number, required: true },
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

// Export the model
export default mongoose.model<IListing>('Listing', ListingSchema);
