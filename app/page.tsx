import BlogPosts from "@/components/blog-posts"
import { blogPosts } from "@/lib/data"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <BlogPosts posts={blogPosts} />
      <footer className="mt-12 sm:mt-16 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>My Journal.</p>
      </footer>
    </main>
  );
}

