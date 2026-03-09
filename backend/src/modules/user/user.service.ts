// User Service
import prisma from "../../prisma";
import { hashPassword, comparePassword } from "../../utils/hash.util";

function sanitizeUser(user: any) {
  const { password, ...safeUser } = user;
  return { ...safeUser, hasPassword: !!password };
}

export const getProfileService = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: parseInt(userId, 10) } });
  if (!user) throw new Error("User not found");
  return { user: sanitizeUser(user) };
};

export const updateProfileService = async (userId: string, data: any) => {
  const { name, email, phone, currentPassword, newPassword } = data;

  const user = await prisma.user.findUnique({ where: { id: parseInt(userId, 10) } });
  if (!user) throw new Error("User not found");

  const updateData: any = {};

  // Name update
  if (name !== undefined) {
    const trimmedName = name.trim();
    if (trimmedName.length === 0) throw new Error("Name cannot be empty");
    updateData.name = trimmedName;
  }

  // Email update
  if (email !== undefined) {
    // const trimmedEmail = email.trim().toLowerCase();
    // if (trimmedEmail && trimmedEmail !== user.email) {
    //   const existing = await prisma.user.findUnique({
    //     where: { email: trimmedEmail },
    //   });
    //   if (existing && existing.id !== parseInt(userId, 10)) {
    //     throw new Error("Email already in use by another account");
    //   }
    //   updateData.email = trimmedEmail;
    // } else if (trimmedEmail === "") {
    //   // Allow clearing email only if user has a phone
    //   if (!user.phone) {
    //     throw new Error(
    //       "Cannot remove email — you need at least one contact method"
    //     );
    //   }
    //   updateData.email = null;
    // }
  }

  // Phone update
  if (phone !== undefined) {
    const trimmedPhone = phone.trim();
    if (trimmedPhone && trimmedPhone !== user.phone) {
      if (!/^\d{10}$/.test(trimmedPhone)) {
        throw new Error("Phone number must be 10 digits");
      }
      const existing = await prisma.user.findUnique({
        where: { phone: trimmedPhone },
      });
      if (existing && existing.id !== parseInt(userId, 10)) {
        throw new Error("Phone number already in use by another account");
      }
      updateData.phone = trimmedPhone;
    } else if (trimmedPhone === "") {
      if (!user.email) {
        throw new Error(
          "Cannot remove phone — you need at least one contact method"
        );
      }
      updateData.phone = null;
    }
  }

  // Password update
  if (newPassword) {
    if (newPassword.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    // If user already has a password, require current password
    if (user.password) {
      if (!currentPassword) {
        throw new Error("Current password is required to set a new password");
      }
      const isMatch = await comparePassword(currentPassword, user.password);
      if (!isMatch) {
        throw new Error("Current password is incorrect");
      }
    }

    updateData.password = await hashPassword(newPassword);
  }

  if (Object.keys(updateData).length === 0) {
    return { user: sanitizeUser(user), message: "No changes made" };
  }

  const updatedUser = await prisma.user.update({
    where: { id: parseInt(userId, 10) },
    data: updateData,
  });

  return { user: sanitizeUser(updatedUser), message: "Profile updated successfully" };
};