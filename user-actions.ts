"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { query } from "@/lib/db"
import { hashPassword, comparePasswords } from "@/lib/auth"

export async function registerUser(formData: FormData)
{
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!firstName || !lastName || !email || !password)
  {
    return { success: false, error: "All fields are required" }
  }

  if (password !== confirmPassword)
  {
    return { success: false, error: "Passwords do not match" }
  }

  if (password.length < 6)
  {
    return { success: false, error: "Password must be at least 6 characters long" }
  }

  try
  {
    // Check for existing user
    const existingUsers = await query({
      sql: "SELECT * FROM users WHERE email = ?",
      values: [email],
    })

    if (existingUsers.length > 0)
    {
      return { success: false, error: "An account with this email already exists" }
    }

    // Hash and save password
    const hashedPassword = await hashPassword(password)

    const result: any = await query({
      sql: "INSERT INTO users (email, password, first_name, last_name) VALUES (?, ?, ?, ?)",
      values: [email, hashedPassword, firstName, lastName],
    })

    const userId = result.insertId

    // Optionally log user in immediately
    // const token = `user.${userId}.${Date.now()}`
    // cookies().set("user_token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   maxAge: 60 * 60 * 24 * 7,
    //   path: "/",
    // })

    return { success: true }
  } catch (error)
  {
    console.error("Registration error:", error)
    return { success: false, error: "Registration failed. Please try again." }
  }
}

export async function loginUser(formData: FormData)
{
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password)
  {
    return { success: false, error: "Email and password are required" }
  }

  try
  {
    const users = await query({
      sql: "SELECT * FROM users WHERE email = ?",
      values: [email],
    })

    const user = users[0]
    if (!user)
    {
      return { success: false, error: "Invalid email or password" }
    }

    const passwordMatch = await comparePasswords(password, user.password)
    if (!passwordMatch)
    {
      return { success: false, error: "Invalid email or password" }
    }

    const token = `user.${user.id}.${Date.now()}`
    cookies().set("user_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    }
  } catch (error)
  {
    console.error("Login error:", error)
    return { success: false, error: "Authentication failed" }
  }
}

export async function logoutUser()
{
  cookies().delete("user_token")
  redirect("/shop")
}

export async function getUserSession()
{
  const token = cookies().get("user_token")?.value

  if (!token) return null

  try
  {
    const parts = token.split(".")
    if (parts.length !== 3 || parts[0] !== "user") return null

    const userId = parseInt(parts[1])
    if (isNaN(userId)) return null

    const users = await query({
      sql: "SELECT id, email, first_name, last_name FROM users WHERE id = ?",
      values: [userId],
    })

    return users[0] || null
  } catch (error)
  {
    console.error("Session error:", error)
    return null
  }
}
