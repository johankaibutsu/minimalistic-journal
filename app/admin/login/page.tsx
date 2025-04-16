// app/admin/login/page.tsx
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { login, type LoginState } from "@/app/admin/actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="w-full"
    >
      {pending ? "Logging in..." : "Login"}
    </Button>
  );
}

export default function LoginPage() {
  const initialState: LoginState = null;
  const [state, formAction] = useActionState(login, initialState);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.message);
    }
    // Success case is handled by redirect in the action
  }, [state]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Admin Login</h1>
          <p className="text-muted-foreground">
            Enter the password to access the admin panel.
          </p>
        </div>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          {/* Optional: Display error message inline too */}
          {/* {state?.error && (
             <p className="text-sm font-medium text-destructive">{state.message}</p>
           )} */}
          <LoginButton />
        </form>
      </div>
    </div>
  );
}
