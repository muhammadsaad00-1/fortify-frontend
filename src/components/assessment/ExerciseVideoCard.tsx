import React, { useState } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExerciseVideoCardProps {
  videoPath?: string;
  title: string;
  description: string;
  onFullscreen?: () => void;
}

export default function ExerciseVideoCard({
  videoPath,
  title,
  description,
  onFullscreen,
}: ExerciseVideoCardProps) {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const isYouTubeUrl =
    typeof videoPath === "string" &&
    (videoPath.includes("youtube.com") || videoPath.includes("youtu.be"));

  const getYouTubeEmbedUrl = (url?: string) => {
    if (!url) return "";

    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }

    if (url.includes("youtube.com/watch")) {
      const parsed = new URL(url);
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }

    return url;
  };

  const youtubeEmbedUrl = getYouTubeEmbedUrl(videoPath);

  if (!videoPath) {
    return (
      <div className="rounded-lg overflow-hidden bg-muted border border-dashed border-muted-foreground/30 aspect-video flex flex-col items-center justify-center p-4">
        <Play className="h-12 w-12 text-muted-foreground/50 mb-2" />
        <p className="text-sm text-muted-foreground text-center">
          Video tutorial for {title} will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative rounded-lg overflow-hidden bg-black aspect-video group">
        {isYouTubeUrl ? (
          <iframe
            className="w-full h-full"
            src={youtubeEmbedUrl}
            title={`${title} video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted={isMuted}
              controls
              preload="metadata"
            >
              <source src={videoPath} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Overlay controls */}
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              {onFullscreen && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8"
                  onClick={onFullscreen}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.197M13 13a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </Button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Description */}
      <div className="p-3 rounded-lg bg-muted/50 border border-muted">
        <p className="text-sm text-card-foreground font-semibold mb-1">
          {title}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
