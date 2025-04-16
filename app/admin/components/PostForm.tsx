// app/admin/components/PostForm.tsx
"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import type { Post } from "@prisma/client";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import type { FormState } from "../actions"; // Adjust path if needed

type PostFormProps = {
  action: (
    prevState: FormState | null,
    formData: FormData,
  ) => Promise<FormState>;
  initialData?: Post | null;
  buttonText: string;
  toastSuccessMessage: string;
};

// Helper to format Date to YYYY-MM-DD for input[type=date]
function formatDateForInput(date: Date | null | undefined): string {
  if (!date) return "";
  // Ensure it's a Date object
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} aria-disabled={pending}>
      {pending ? "Saving..." : text}
    </Button>
  );
}

export default function PostForm({
  action,
  initialData,
  buttonText,
  toastSuccessMessage,
}: PostFormProps) {
  const initialState: FormState = null;
  const [state, formAction] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // Extract potential default date from initialData or form state
  const defaultDateValue =
    state?.fields?.customCreatedAt ??
    formatDateForInput(initialData?.createdAt);

  useEffect(() => {
    if (state?.message && !state.issues) {
      toast.success(toastSuccessMessage);
      // Redirect handled by server action, no form reset needed here
    } else if (state?.message && state.issues) {
      toast.error(state.message, {
        description: state.issues.join("\n"),
      });
    } else if (state?.message) {
      toast.error(state.message);
    }
  }, [state, toastSuccessMessage]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      {initialData?.id && (
        <input type="hidden" name="id" value={initialData.id} />
      )}

      {/* Text Input */}
      <div className="space-y-2">
        <Label htmlFor="text">Entry Text</Label>
        <Textarea
          id="text"
          name="text"
          placeholder="Journal entry text..."
          required
          rows={6}
          defaultValue={state?.fields?.text ?? initialData?.text ?? ""}
          aria-invalid={state?.issues?.some((issue) =>
            issue.toLowerCase().includes("text"),
          )}
        />
      </div>

      {/* Media URL Input */}
      <div className="space-y-2">
        <Label htmlFor="mediaUrl">Media URL (Optional)</Label>
        <Input
          id="mediaUrl"
          name="mediaUrl"
          type="url"
          placeholder="https://example.com/image.jpg or youtube.com/watch?v=..."
          defaultValue={state?.fields?.mediaUrl ?? initialData?.mediaUrl ?? ""}
          aria-invalid={state?.issues?.some((issue) =>
            issue.toLowerCase().includes("url"),
          )}
        />
      </div>

      {/* --- NEW: Custom Date Input --- */}
      <div className="space-y-2">
        <Label htmlFor="customCreatedAt">Custom Creation Date (Optional)</Label>
        <Input
          id="customCreatedAt"
          name="customCreatedAt" // Matches the name read in the action
          type="date" // Provides a date picker UI
          // Use the calculated default value
          defaultValue={defaultDateValue}
          aria-invalid={state?.issues?.some((issue) =>
            issue.toLowerCase().includes("date"),
          )}
          aria-describedby="date-description"
        />
        <p id="date-description" className="text-sm text-muted-foreground">
          Leave blank to use the current date/time. If editing, this will
          override the original creation date.
        </p>
      </div>
      {/* --- END: Custom Date Input --- */}

      {/* Error Display */}
      {state?.issues && (
        <div className="text-sm font-medium text-destructive" role="alert">
          {/* ... (error display remains the same) ... */}
          <p className="font-bold mb-1">{state.message}</p>
          <ul className="list-disc list-inside">
            {state.issues.map((issue, index) => (
              <li key={index}>{issue}</li>
            ))}
          </ul>
        </div>
      )}
      {state?.message &&
        !state.issues &&
        !state?.fields && ( // General DB error
          <div className="text-sm font-medium text-destructive" role="alert">
            {state.message}
          </div>
        )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" asChild>
          <Link href="/admin">Cancel</Link>
        </Button>
        <SubmitButton text={buttonText} />
      </div>
    </form>
  );
}
