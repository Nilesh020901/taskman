import mongoose, { type InferSchemaType } from 'mongoose'

const CouponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, index: true },
    createdAt: { type: Date, required: true, default: Date.now },
    usedAt: { type: Date, default: null },
    usedBy: { type: String, default: null }
  },
  { timestamps: false }
)

export type CouponDocument = InferSchemaType<typeof CouponSchema>

export const CouponModel =
  mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema)
