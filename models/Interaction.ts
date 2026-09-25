import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInteraction extends Document {
  customerId: mongoose.Types.ObjectId;
  clientNum: number;
  rmId: string;
  rmName?: string;
  type: 'call' | 'meeting' | 'email' | 'query' | 'note';
  date: Date;
  notes: string;
  outcome?: string;
  duration?: number; // minutes
  createdAt?: Date;
  updatedAt?: Date;
}

const InteractionSchema = new Schema<IInteraction>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    clientNum: { type: Number, required: true, index: true },
    rmId: { type: String, required: true },
    rmName: { type: String },
    type: {
      type: String,
      enum: ['call', 'meeting', 'email', 'query', 'note'],
      required: true,
    },
    date: { type: Date, required: true },
    notes: { type: String, required: true },
    outcome: { type: String },
    duration: { type: Number },
  },
  {
    timestamps: true,
    collection: 'interactions',
  }
);

const Interaction: Model<IInteraction> =
  mongoose.models.Interaction ||
  mongoose.model<IInteraction>('Interaction', InteractionSchema);

export default Interaction;
