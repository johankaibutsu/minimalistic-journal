"use client";

import { useState, useTransition } from "react"; // Add useTransition
// Remove useFormStatus import if DeleteConfirmButton is removed
import { deleteAdminPost } from "../actions";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export default function DeletePostButton({ postId }: { postId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  // useTransition helps manage pending state for server actions without a full form state
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    // Use startTransition to wrap the server action call
    startTransition(async () => {
      try {
        await deleteAdminPost(postId); // Call the server action directly
        toast.success("Post deleted successfully.");
        setIsOpen(false); // Close dialog on success
        // Revalidation should happen within deleteAdminPost action
      } catch (error: any) {
        console.error("Delete failed:", error);
        toast.error(error.message || "Failed to delete post.");
        // Optionally keep the dialog open on error:
        // setIsOpen(true);
      }
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the post.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          {/* The AlertDialogAction now triggers our client-side handleDelete */}
          <AlertDialogAction
            onClick={handleDelete} // Call client-side handler on click
            disabled={isPending}
            aria-disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
