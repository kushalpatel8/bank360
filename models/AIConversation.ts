import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAIConversation extends Document {
  sessionId: string;
  userId: string;
  customerId?: mongoose.Types.ObjectId;
  clientNum?: number;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}

const AIConversationSchema = new Schema<IAIConversation>(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
    clientNum: { type: Number },
    messages: [
      {
        role: { type: String, enum: ['user', 'assistant'], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
    collection: 'ai_conversations',
  }
);

const AIConversation: Model<IAIConversation> =
  mongoose.models.AIConversation ||
  mongoose.model<IAIConversation>('AIConversation', AIConversationSchema);

export default AIConversation;
