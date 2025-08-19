import mongoose, { Schema, Document } from "mongoose";

export interface ContactType extends Document {
  name: string;
  email: string;
  message: string;
  date: Date;
}

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Contacts = mongoose.model<ContactType>("Contact", contactSchema);

export default Contacts;
