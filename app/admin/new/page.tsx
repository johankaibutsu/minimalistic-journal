// app/admin/new/page.tsx
import Link from "next/link"; // Import Link
import PostForm from "../components/PostForm";
import { createAdminPost } from "../actions";
import { Button } from "@/components/ui/button"; // Import Button
import { ArrowLeft } from "lucide-react"; // Import an icon

export default function NewPostPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Add Back to Site link here */}
      <div className="mb-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Site
          </Link>
        </Button>
      </div>
      {/* End Back to Site link */}

      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      <PostForm
        action={createAdminPost}
        buttonText="Create Post"
        toastSuccessMessage="Post created successfully!"
      />
    </div>
  );
}
