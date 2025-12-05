import { query } from "./db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret_admin_key";

// Register Admin
export async function registerAdmin({
    name,
    email,
    password,
}: {
    name: string;
    email: string;
    password: string;
})
{
    if (!name || !email || !password) throw new Error("Missing fields");

    // Check if admin exists
    const existing = await query({
        sql: "SELECT id FROM admins WHERE email = ?",
        values: [email],
    });
    if (existing.length > 0)
        throw new Error("Admin with this email already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await query({
        sql: "INSERT INTO admins (name, email, password) VALUES (?, ?, ?)",
        values: [name, email, hashedPassword],
    });

    return { id: result.insertId, name, email };
}

// Login Admin
export async function loginAdmin({
    email,
    password,
}: {
    email: string;
    password: string;
})
{
    if (!email || !password) throw new Error("Missing fields");

    const admins = await query({
        sql: "SELECT * FROM admins WHERE email = ?",
        values: [email],
    });
    const admin = admins[0];
    if (!admin) return null;

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) return null;

    // Create session token
    const token = jwt.sign(
        { id: admin.id, email: admin.email, name: admin.name },
        JWT_SECRET,
        { expiresIn: "7d" }
    );

    // ✅ Must await cookies()
    const cookieStore = await cookies();
    cookieStore.set({
        name: "admin_token",
        value: token,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60,
    });

    return { id: admin.id, name: admin.name, email: admin.email };
}

// Get Admin Session
export async function getAdminSession()
{
    const cookieStore = await cookies(); // ✅ must await
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return null;

    try
    {
        const decoded = jwt.verify(token, JWT_SECRET) as {
            id: number;
            email: string;
            name: string;
        };
        return decoded;
    } catch
    {
        return null;
    }
}

// Logout Admin
export async function logoutAdmin()
{
    const cookieStore = await cookies(); // ✅ must await
    cookieStore.set({
        name: "admin_token",
        value: "",
        path: "/",
        maxAge: 0,
    });
}
