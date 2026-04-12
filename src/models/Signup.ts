import mongoose, { type InferSchemaType } from 'mongoose'

const SignupSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    couponCode: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    emailSent: { type: Boolean, required: true, default: false },
    emailSentAt: { type: Date, default: null }
  },
  { timestamps: false }
)

export type SignupDocument = InferSchemaType<typeof SignupSchema>

export const SignupModel =
  mongoose.models.Signup || mongoose.model('Signup', SignupSchema)
