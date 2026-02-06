import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDataSource } from "@/lib/data-source";
import { User } from "@/entities/User";
import { UserRole } from "@/entities/Enums";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const dataSource = await getDataSource();
    const userRepo = dataSource.getRepository(User);

    // Check if user already exists
    const existingUser = await userRepo.findOneBy({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User();
    newUser.name = name;
    newUser.email = email;
    newUser.password = hashedPassword;
    newUser.role = UserRole.USER; // Default role

    await userRepo.save(newUser);

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
