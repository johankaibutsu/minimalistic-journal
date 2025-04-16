// app/admin/actions.ts
"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

// --- Reusable Validation Schema ---
const PostSchema = z.object({
  text: z.string().min(1, "Journal entry text cannot be empty."),
  // Allow empty string or valid URL for mediaUrl
  mediaUrl: z
    .union([z.string().url("Invalid URL format.").nullish(), z.literal("")])
    .transform((val) => (val === "" ? null : val)), // Convert empty string to null
});

// --- Auth Actions (from previous step) ---
// ... login and logout functions remain the same ...
const LoginSchema = z.object({
  password: z.string().min(1, "Password is required."),
});
export type LoginState = { message: string; error?: boolean } | null;
export async function login(
  prevState: LoginState | null,
  formData: FormData,
): Promise<LoginState> {
  // ... (implementation from Step 3) ...
  const validatedFields = LoginSchema.safeParse({
    password: formData.get("password"),
  });
  if (!validatedFields.success)
    return { message: "Password is required.", error: true };
  const { password } = validatedFields.data;
  if (password === process.env.ADMIN_PASSWORD) {
    cookies().set("auth_token", "logged_in", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    redirect("/admin");
  } else {
    return { message: "Invalid password.", error: true };
  }
}
export async function logout() {
  cookies().delete("auth_token");
  redirect("/admin/login");
}

// --- CRUD Actions ---

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
} | null;

// CREATE Action
export async function createAdminPost(
  prevState: FormState | null,
  formData: FormData,
): Promise<FormState> {
  let postId: string | null = null;
  try {
    const rawFormData = {
      text: formData.get("text"),
      mediaUrl: formData.get("mediaUrl") || "",
      customCreatedAt: formData.get("customCreatedAt") || "", // Get custom date
    };

    const validatedFields = PostSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
      // ... (error handling remains the same) ...
      const issues = validatedFields.error.issues.map((issue) => issue.message);
      return {
        message: "Validation failed.",
        issues: issues,
        fields: rawFormData as Record<string, string>,
      };
    }

    const dataToCreate: {
      text: string;
      mediaUrl?: string | null;
      createdAt?: Date;
    } = {
      text: validatedFields.data.text,
      mediaUrl: validatedFields.data.mediaUrl,
    };

    // Handle custom date
    if (validatedFields.data.customCreatedAt) {
      // IMPORTANT: Parsing date string like this assumes server timezone or UTC.
      // If specific local time is needed, more robust parsing is required.
      // new Date('YYYY-MM-DD') might interpret as UTC midnight.
      // Adding T00:00:00 makes it clearer it's start of day in server/db timezone.
      const customDate = new Date(
        validatedFields.data.customCreatedAt + "T00:00:00",
      );
      if (!isNaN(customDate.getTime())) {
        dataToCreate.createdAt = customDate;
      } else {
        // Handle invalid date string that somehow passed regex (unlikely)
        return {
          message: "Invalid custom date provided.",
          fields: rawFormData as Record<string, string>,
          issues: ["Invalid custom date provided."],
        };
      }
    }
    // If no custom date, Prisma's @default(now()) will apply

    const newPost = await prisma.post.create({
      data: dataToCreate,
    });
    postId = newPost.id; // Store ID for potential revalidation if needed later
  } catch (error) {
    // ... (error handling remains the same) ...
    console.error("Create Post Error:", error);
    if (error instanceof Error && error.message === "Not authorized")
      return { message: "Authorization Error." };
    return { message: "Database Error: Failed to create post." };
  }

  // Revalidate and Redirect *after* successful creation
  revalidatePath("/admin"); // Revalidate the admin dashboard
  revalidatePath("/"); // Revalidate the public homepage
  redirect("/admin"); // Redirect back to dashboard
}

// UPDATE Action
export async function updateAdminPost(
  id: string,
  prevState: FormState | null,
  formData: FormData,
): Promise<FormState> {
  try {
    const rawFormData = {
      text: formData.get("text"),
      mediaUrl: formData.get("mediaUrl") || "",
      customCreatedAt: formData.get("customCreatedAt") || "", // Get custom date
    };

    const validatedFields = PostSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
      // ... (error handling remains the same) ...
      const issues = validatedFields.error.issues.map((issue) => issue.message);
      return {
        message: "Validation failed.",
        issues: issues,
        fields: rawFormData as Record<string, string>,
      };
    }

    const dataToUpdate: {
      text: string;
      mediaUrl?: string | null;
      createdAt?: Date;
    } = {
      text: validatedFields.data.text,
      mediaUrl: validatedFields.data.mediaUrl,
    };

    // Handle custom date update
    if (validatedFields.data.customCreatedAt) {
      const customDate = new Date(
        validatedFields.data.customCreatedAt + "T00:00:00",
      );
      if (!isNaN(customDate.getTime())) {
        dataToUpdate.createdAt = customDate; // Override createdAt if provided
      } else {
        return {
          message: "Invalid custom date provided.",
          fields: rawFormData as Record<string, string>,
          issues: ["Invalid custom date provided."],
        };
      }
    }
    // If customCreatedAt is empty/not provided, we simply don't include `createdAt`
    // in the update payload, so the existing one is preserved.
    // Prisma's @updatedAt will handle the update timestamp automatically.

    await prisma.post.update({
      where: { id },
      data: dataToUpdate,
    });
  } catch (error) {
    // ... (error handling remains the same) ...
    console.error("Update Post Error:", error);
    if (error instanceof Error && error.message === "Not authorized")
      return { message: "Authorization Error." };
    return { message: "Database Error: Failed to update post." };
  }

  // Revalidate and Redirect *after* successful update
  revalidatePath("/admin"); // Revalidate admin dashboard
  revalidatePath("/"); // Revalidate public homepage
  revalidatePath(`/admin/edit/${id}`); // Revalidate the edit page itself
  redirect("/admin"); // Redirect back to dashboard
}

// DELETE Action
export async function deleteAdminPost(id: string) {
  try {
    await prisma.post.delete({
      where: { id },
    });
    // Revalidate paths *after* successful deletion
    revalidatePath("/admin");
    revalidatePath("/");
  } catch (error: any) {
    // Catch specific error types if needed
    console.error(`Database Error deleting post ${id}:`, error);

    // Check for specific Prisma errors if necessary
    // if (error.code === 'P2025') { // Record to delete not found
    //    throw new Error("Post not found.");
    // }

    // Throw a more specific or generic error for the client
    throw new Error(`Database Error: Failed to delete post (ID: ${id}).`);
  }
  // No return value needed, success is implied if no error is thrown
  // No redirect needed here
}
