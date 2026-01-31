// Auth Service
import prisma from "../../prisma";
import { hashPassword, comparePassword } from "../../utils/hash.util";
import { signToken } from "../../utils/jwt.util";
import { RegisterInput, LoginInput } from "./auth.types";

export const registerUser = async (data: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email }
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
        name: data.name,
        email:data.email,
        phone: data.phone,
        password: hashedPassword,
        role: "USER"
    }
    });

    const { password, ...safeUser } = user;

  const token = signToken({ id: user.id, role: user.role });

  return {
    message: "User registered successfully",
    user: safeUser,
    token,
    };
};

export const loginUser = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email }
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await comparePassword(data.password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = signToken({ id: user.id, role: user.role });

  return { user, token };
};
