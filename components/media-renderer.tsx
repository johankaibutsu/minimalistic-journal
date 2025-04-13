"use client";

import Image from "next/image";

interface MediaRendererProps {
  url: string;
}

export default function MediaRenderer({ url }: MediaRendererProps) {
  if (!url) return null;

  // Check if URL is from Spotify
  if (url.includes("spotify.com")) {
    const spotifyId = url.split("/").pop()?.split("?")[0];
    return (
      <iframe
        src={`https://open.spotify.com/embed/track/${spotifyId}`}
        width="100%"
        height="352"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-md"
      ></iframe>
    );
  }

  // Check if URL is from YouTube
  if (url.includes("youtube.com/watch") || url.includes("youtu.be")) {
    let videoId = "";

    try {
      if (url.includes("youtube.com/watch")) {
        videoId = new URL(url).searchParams.get("v") || "";
      } else if (url.includes("youtu.be")) {
        videoId = url.split("/").pop()?.split("?")[0] || "";
      }
    } catch (error) {
      console.error("Invalid YouTube URL", error);
    }

    if (videoId) {
      return (
        <div className="w-full max-w-2xl mx-auto aspect-video">
          <iframe
            className="w-full h-full rounded-md"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      );
    }
  }

  // Check if URL is a direct video file (mp4, webm, etc.)
  if (url.match(/\.(mp4|webm|ogg)$/)) {
    return (
      <div className="w-full max-w-2xl mx-auto aspect-video">
        <video src={url} controls className="w-full h-full rounded-md" />
      </div>
    );
  }

  // Default to full-size image
  return (
    <div className="w-full max-w-3xl mx-auto flex justify-center relative">
      <div style={{ position: "relative", width: "100%", height: "75vh" }}>
        <Image
          src={url}
          alt="Media content"
          layout="fill"
          objectFit="contain"
          className="rounded-md"
        />
      </div>
    </div>
  );
}
