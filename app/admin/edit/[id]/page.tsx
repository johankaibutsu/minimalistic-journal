// app/admin/edit/[id]/page.tsx
import Link from "next/link"; // Import Link
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostForm from "../../components/PostForm";
import { updateAdminPost } from "../../actions";
import { Button } from "@/components/ui/button"; // Import Button
import { ArrowLeft } from "lucide-react"; // Import an icon

type EditPostPageProps = {
  params: { id: string };
};

export default async function EditPostPage({ params }: EditPostPageProps) {
  const postId = params.id;

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    notFound();
  }

  const updateActionWithId = updateAdminPost.bind(null, postId);

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

      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
      <PostForm
        action={updateActionWithId}
        initialData={post}
        buttonText="Update Post"
        toastSuccessMessage="Post updated successfully!"
      />
    </div>
  );
}
