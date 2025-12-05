import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import crypto from "crypto"
import { query } from "@/lib/db"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export async function hashPassword(password: string): Promise<string>
{
  return new Promise((resolve, reject) =>
  {
    // In a real app, use bcrypt instead of this simple hash
    const hash = crypto.createHash("sha256").update(password).digest("hex")
    resolve(hash)
  })
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean>
{
  const hash = await hashPassword(password)
  return hash === hashedPassword
}

export async function generateToken(payload: any): Promise<string>
{
  return new Promise((resolve, reject) =>
  {
    const token = crypto.randomBytes(64).toString("hex")
    // In a real app, use JWT signing instead of this simple token
    resolve(token)
  })
}

export async function verifyToken(token: string): Promise<any>
{
  try
  {
    // In a real app, verify JWT token
    return { valid: true, payload: { id: 1, username: "admin" } }
  } catch (error)
  {
    return { valid: false }
  }
}

export async function getSession()
{
  const token = cookies().get("admin_token")?.value

  if (!token)
  {
    return null
  }

  try
  {
    const { valid, payload } = await verifyToken(token)

    if (!valid)
    {
      return null
    }

    return payload
  } catch (error)
  {
    return null
  }
}

export async function getUserSession()
{
  const token = cookies().get("user_token")?.value

  if (!token)
  {
    return null
  }

  try
  {
    // Extract user ID from token
    const parts = token.split(".")
    if (parts.length !== 3 || parts[0] !== "user")
    {
      return null
    }

    const userId = parts[1]

    // Get user from database
    const users = await query({
      sql: "SELECT id, email, first_name, last_name FROM users WHERE id = ?",
      values: [userId],
    })

    return users[0] || null
  } catch (error)
  {
    console.error("User session error:", error)
    return null
  }
}

export async function requireAuth()
{
  const session = await getSession()

  if (!session)
  {
    redirect("/login")
  }

  return session
}
