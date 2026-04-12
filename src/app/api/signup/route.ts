import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { couponSeed } from '@/lib/coupons'
import { CouponModel } from '@/models/Coupon'
import { SignupModel } from '@/models/Signup'
import { sendCouponEmail } from '@/lib/mailer'

export const runtime = 'nodejs'

type SignupResult = {
  alreadySignedUp: boolean
  coupon: string
  emailSent: boolean
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validateEmail = (email: string) => {
  if (!email) return 'Email is required.'
  if (email.length > 254) return 'Email is too long.'
  if (!emailRegex.test(email)) return 'Enter a valid email address.'
  return null
}

const ensureCouponsSeeded = async () => {
  const count = await CouponModel.estimatedDocumentCount()
  if (count > 0) return

  const now = new Date()
  try {
    await CouponModel.insertMany(
      couponSeed.map((code) => ({
        code,
        createdAt: now
      })),
      { ordered: false }
    )
  } catch {
    // Ignore duplicate insert attempts on concurrent requests
  }
}

export async function POST(request: Request) {
  let body: { email?: string }

  try {
    body = (await request.json()) as { email?: string }
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON payload.' },
      { status: 400 }
    )
  }

  const email = String(body?.email || '').trim().toLowerCase()
  const validationError = validateEmail(email)

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 })
  }

  await connectToDatabase()
  await ensureCouponsSeeded()

  let result: SignupResult | null = null

  try {
    const existing = await SignupModel.findOne({ email }).lean<{ couponCode: string; emailSent?: boolean }>()
    if (existing) {
      result = {
        alreadySignedUp: true,
        coupon: existing.couponCode,
        emailSent: Boolean(existing.emailSent)
      }
    } else {
      const now = new Date()
      const couponDoc = await CouponModel.findOneAndUpdate(
        { usedAt: null },
        { $set: { usedAt: now, usedBy: email } },
        { sort: { createdAt: 1 }, new: true }
      ).lean<{ code: string; usedAt: Date; usedBy: string }>()

      if (!couponDoc) {
        return NextResponse.json(
          { error: 'All coupons have been claimed. Please try again later.' },
          { status: 409 }
        )
      }

      try {
        await SignupModel.create({
          email,
          couponCode: couponDoc.code,
          createdAt: now,
          emailSent: false
        })
      } catch (error) {
        const mongoError = error as { code?: number }
        if (mongoError?.code === 11000) {
          await CouponModel.updateOne(
            { code: couponDoc.code, usedBy: email, usedAt: now },
            { $set: { usedAt: null, usedBy: null } }
          )
          const retryExisting = await SignupModel.findOne({ email }).lean<{ couponCode: string; emailSent?: boolean }>()
          if (retryExisting) {
            result = {
              alreadySignedUp: true,
              coupon: retryExisting.couponCode,
              emailSent: Boolean(retryExisting.emailSent)
            }
          } else {
            throw error
          }
        } else {
          throw error
        }
      }

      result ??= {
        alreadySignedUp: false,
        coupon: couponDoc.code,
        emailSent: false
      }
    }
  } catch {
    return NextResponse.json(
      { error: 'Unable to create signup right now.' },
      { status: 500 }
    )
  }

  if (!result) {
    return NextResponse.json(
      { error: 'Unable to create signup right now.' },
      { status: 500 }
    )
  }

  let delivery: 'email' | 'log' = 'log'

  if (!result.emailSent) {
    try {
      const sendResult = await sendCouponEmail({
        to: email,
        coupon: result.coupon
      })
      delivery = sendResult.delivery

      if (delivery === 'email') {
        await SignupModel.updateOne(
          { email },
          { $set: { emailSent: true, emailSentAt: new Date() } }
        )
      }
    } catch {
      return NextResponse.json(
        {
          error: 'Signup saved but email could not be sent.',
          coupon: result.coupon
        },
        { status: 500 }
      )
    }
  } else {
    delivery = 'email'
  }

  return NextResponse.json({
    ok: true,
    coupon: result.coupon,
    alreadySignedUp: result.alreadySignedUp,
    delivery
  })
}
