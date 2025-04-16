// app/admin/page.tsx
import Link from "next/link";
import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { logout } from "./actions";
import DeletePostButton from "./components/DeletePostButton";
import { ArrowLeft } from "lucide-react"; // Import an icon

export default async function AdminDashboardPage() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        {" "}
        {/* Added flex-wrap and gap */}
        <h1 className="text-2xl font-bold">Admin Dashboard - Posts</h1>
        <div className="flex gap-2 flex-wrap">
          {" "}
          {/* Added flex-wrap */}
          {/* Back to Site Button */}
          <Button asChild variant="outline" size="sm">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Site
            </Link>
          </Button>
          {/* End Back to Site Button */}
          <Button asChild size="sm">
            <Link href="/admin/new">Create New Post</Link>
          </Button>
          <form action={logout}>
            <Button type="submit" variant="outline" size="sm">
              Logout
            </Button>
          </form>
        </div>
      </div>

      {/* ... rest of the table component ... */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Text</TableHead>
              <TableHead className="hidden sm:table-cell">Media URL</TableHead>
              <TableHead className="hidden md:table-cell">Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground py-10"
                >
                  No posts found.
                </TableCell>
              </TableRow>
            )}
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell
                  className="font-medium max-w-xs truncate"
                  title={post.text}
                >
                  {post.text.split("\n")[0]} {/* Show first line */}
                  {post.text.includes("\n") ? "..." : ""}
                </TableCell>
                <TableCell
                  className="hidden sm:table-cell max-w-xs truncate"
                  title={post.mediaUrl ?? ""}
                >
                  {post.mediaUrl ? (
                    <a
                      href={post.mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-blue-600 dark:text-blue-400"
                    >
                      {post.mediaUrl.length > 40
                        ? post.mediaUrl.substring(0, 40) + "..."
                        : post.mediaUrl}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {format(new Date(post.createdAt), "MMM d, yyyy HH:mm")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/edit/${post.id}`}>Edit</Link>
                    </Button>
                    <DeletePostButton postId={post.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
