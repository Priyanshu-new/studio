'use client';

import { useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import type { YouTubePlayer as YouTubePlayerType } from 'react-youtube';

interface YouTubePlayerProps {
  videoId: string;
}

export function YouTubePlayer({ videoId }: YouTubePlayerProps) {
  const playerRef = useRef<YouTubePlayerType | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const onReady = (event: { target: YouTubePlayerType }) => {
    playerRef.current = event.target;
    iframeRef.current = event.target.getIframe();
    event.target.playVideo();
  };

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (!iframeRef.current || !document.pictureInPictureEnabled) return;

      if (document.hidden) {
        // @ts-ignore
        const videoElement = iframeRef.current.querySelector('video');
        if (videoElement && document.pictureInPictureElement !== videoElement) {
          await videoElement.requestPictureInPicture();
        }
      } else {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // This is a bit of a hack to get the video element from the iframe
    // as YouTube API doesn't expose it directly.
    const interval = setInterval(() => {
        if (iframeRef.current) {
            // @ts-ignore
            const video = iframeRef.current.querySelector('video');
            if (video) {
                video.setAttribute('playsinline', 'true');
                clearInterval(interval);
            }
        }
    }, 100);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
      }
    };
  }, []);

  return (
    <YouTube
      videoId={videoId}
      opts={{
        height: '100%',
        width: '100%',
        playerVars: {
          autoplay: 1,
          playsinline: 1, // Required for PiP on mobile
        },
      }}
      className="h-full w-full"
      onReady={onReady}
    />
  );
}
