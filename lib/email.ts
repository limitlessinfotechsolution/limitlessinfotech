import { Resend } from "resend"

// Initialize Resend with your API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY)

interface SendEmailOptions {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  from?: string
}

/**
 * Sends an email using the Resend service.
 * If RESEND_API_KEY is not set, it will log the email details instead of sending.
 * @param options - Email options including to, subject, html/text, and optional from.
 * @returns A promise that resolves with the Resend response or void if simulated.
 */
export async function sendEmail(options: SendEmailOptions) {
  const { to, subject, html, text, from = "onboarding@resend.dev" } = options

  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not set. Simulating email sending.")
    // Simulated email sending for development
    return
  }

  try {
    const { data, error } = await resend.emails.send({
      from: from,
      to: to,
      subject: subject,
      html: html,
      text: text,
      react: undefined, // Explicitly set to undefined for non-React emails
    })

    if (error) {
      throw new Error(`Failed to send email: ${error.message}`)
    }

    return data
  } catch (error) {
    throw error
  }
}

interface ContactFormEmailData {
  name: string
  email: string
  subject: string
  message: string
}

/**
 * Sends a contact form submission email.
 * @param data - The contact form data.
 */
export async function sendContactFormEmail(data: ContactFormEmailData) {
  const { name, email, subject, message } = data
  const recipientEmail = "contact@limitlessinfotech.com" // Replace with your actual contact email

  const htmlContent = `
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>Message:</strong></p>
    <p>${message.replace(/\n/g, "<br>")}</p>
  `
  const textContent = `
    Name: ${name}
    Email: ${email}
    Subject: ${subject}
    Message:
    ${message}
  `

  await sendEmail({
    to: recipientEmail,
    subject: `New Contact Form Submission: ${subject}`,
    html: htmlContent,
    text: textContent,
    from: `"${name}" <${email}>`, // Set sender name and email for replies
  })
}

/**
 * Sends a password reset email.
 * @param toEmail - The recipient's email address.
 * @param resetLink - The password reset link.
 */
export async function sendPasswordResetEmail(toEmail: string, resetLink: string) {
  const subject = "Password Reset Request"
  const htmlContent = `
    <p>Hello,</p>
    <p>You have requested to reset your password for your account at Limitless Infotech Solutions.</p>
    <p>Please click on the following link to reset your password:</p>
    <p><a href="${resetLink}">${resetLink}</a></p>
    <p>This link will expire in a short period for security reasons.</p>
    <p>If you did not request a password reset, please ignore this email.</p>
    <p>Thank you,</p>
    <p>The Limitless Infotech Solutions Team</p>
  `
  const textContent = `
    Hello,

    You have requested to reset your password for your account at Limitless Infotech Solutions.

    Please click on the following link to reset your password:
    ${resetLink}

    This link will expire in a short period for security reasons.

    If you did not request a password reset, please ignore this email.

    Thank you,
    The Limitless Infotech Solutions Team
  `

  await sendEmail({
    to: toEmail,
    subject: subject,
    html: htmlContent,
    text: textContent,
    from: "no-reply@limitlessinfotech.com", // Use a no-reply address
  })
}
