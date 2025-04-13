"use client";

import { useState } from "react";
import { format } from "date-fns";
import type { Post } from "@/lib/types";
import MediaRenderer from "@/components/media-renderer";
import { cn } from "@/lib/utils";

interface BlogPostsProps {
  posts: Post[];
}

export default function BlogPosts({ posts }: BlogPostsProps) {
  const [openPostId, setOpenPostId] = useState<string | null>(null);

  const togglePost = (id: string) => {
    setOpenPostId(openPostId === id ? null : id);
  };

  const formatTextWithLineBreaks = (text: string) => {
    return text.split("\n").map((item, index) => (
      <span key={index}>
        {item}
        <br />
      </span>
    ));
  };

  return (
    <div className="space-y-8">
      {posts
        .slice()
        .reverse()
        .map((post) => (
          <div
            key={post.id}
            className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-8"
          >
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              {format(new Date(post.date), "MMMM d, yyyy")}
            </div>
            <div>
              <div
                className="text-lg font-medium mb-2 cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                onClick={() => togglePost(post.id)}
              >
                {formatTextWithLineBreaks(post.text)}
              </div>
              <div
                className={cn(
                  "media-container",
                  openPostId === post.id && "open"
                )}
              >
                <div className="pt-4">
                  <MediaRenderer url={post.mediaUrl} />
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

