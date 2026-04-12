import nodemailer from 'nodemailer'

type DeliveryMode = 'email' | 'log'

type SendCouponInput = {
  to: string
  coupon: string
}

type SendCouponResult = {
  delivery: DeliveryMode
}

const getDeliveryMode = () => {
  if (process.env.EMAIL_MODE === 'log') return 'log'

  const hasCreds =
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS

  return hasCreds ? 'email' : 'log'
}

const globalForMailer = globalThis as typeof globalThis & {
  __taskmanTransport?: nodemailer.Transporter
}

const getTransporter = () => {
  if (globalForMailer.__taskmanTransport) {
    return globalForMailer.__taskmanTransport
  }

  const port = Number(process.env.SMTP_PORT || 587)
  const secure = Number.isFinite(port) && port === 465
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })

  globalForMailer.__taskmanTransport = transporter
  return transporter
}

export const sendCouponEmail = async ({
  to,
  coupon
}: SendCouponInput): Promise<SendCouponResult> => {
  const delivery = getDeliveryMode()

  if (delivery === 'log') {
    console.info(
      `[taskman] Coupon for ${to}: ${coupon} (EMAIL_MODE=log or SMTP not configured)`
    )
    return { delivery }
  }

  const transporter = getTransporter()
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@taskman.app'

  await transporter.sendMail({
    from,
    to,
    subject: 'Your TaskMan coupon is here',
    text: `Thanks for signing up for TaskMan.\n\nHere is your coupon code: ${coupon}\n\nSee you inside!`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="margin: 0 0 12px;">Welcome to TaskMan</h2>
        <p style="margin: 0 0 8px;">Thanks for signing up. Here is your coupon code:</p>
        <p style="font-size: 20px; font-weight: 700; letter-spacing: 1px; margin: 0 0 12px;">
          ${coupon}
        </p>
        <p style="margin: 0;">Apply it during checkout to unlock your offer.</p>
      </div>
    `
  })

  return { delivery }
}
