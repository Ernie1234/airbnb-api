import mongoose, { Document, Schema } from 'mongoose';

export interface IReservation extends Document {
  userId: mongoose.Types.ObjectId;
  listingId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Reservation schema
const ReservationSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    listingId: { type: mongoose.Types.ObjectId, ref: 'Listing', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
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
export default mongoose.model<IReservation>('Reservation', ReservationSchema);
