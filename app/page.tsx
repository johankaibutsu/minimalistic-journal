// app/page.tsx
import BlogPosts from "@/components/blog-posts";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <BlogPosts posts={posts} />
      <footer className="mt-12 sm:mt-16 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>My Journal.</p>
      </footer>
    </main>
  );
}
