// app/admin/components/DeletePostButton.tsx
"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { deleteAdminPost } from "../actions"; // Import the delete action
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
import { Trash2 } from "lucide-react"; // Icon

function DeleteConfirmButton() {
  const { pending } = useFormStatus();
  return (
    <AlertDialogAction
      onClick={async (e) => {
        // The form submission will handle the actual deletion
        // This onClick might still be needed if the form doesn't submit automatically
        // on this button click (depends on AlertDialog behavior)
        if (pending) {
          e.preventDefault(); // Prevent action if already pending
        }
      }}
      disabled={pending}
      aria-disabled={pending}
      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
    >
      {pending ? "Deleting..." : "Delete"}
    </AlertDialogAction>
  );
}

export default function DeletePostButton({ postId }: { postId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  // Bind the postId to the action
  const deleteActionWithId = async () => {
    try {
      await deleteAdminPost(postId);
      toast.success("Post deleted successfully.");
      setIsOpen(false); // Close dialog on success
      // Revalidation happens in the server action
    } catch (error: any) {
      console.error("Delete failed:", error);
      toast.error(error.message || "Failed to delete post.");
    }
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
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {/* Wrap the confirmation button in a form to trigger the action */}
          <form action={deleteActionWithId}>
            <DeleteConfirmButton />
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
