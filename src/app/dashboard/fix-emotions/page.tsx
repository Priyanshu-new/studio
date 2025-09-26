'use client';

import { recognizeFacialExpressionGesture } from '@/ai/flows/facial-expression-gesture-recognition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  Camera,
  Feather,
  Loader2,
  Music,
  Power,
  Smile,
} from 'lucide-react';
import { useRef, useState, useEffect, useCallback } from 'react';
import { YouTubePlayer } from '@/components/app/youtube-player';

type Emotion = 'happy' | 'stress' | 'fear' | 'stop' | null;

export default function GestureControlPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [emotion, setEmotion] = useState<Emotion>(null);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const { toast } = useToast();

  const videoIds = {
    stress: 'lwvMcvzEITI',
    fear: 'nkkpE6xdcnU',
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      toast({
        title: 'Camera Error',
        description:
          'Could not access the camera. Please check permissions.',
        variant: 'destructive',
      });
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
    setIsDetecting(false);
    setEmotion(null);
  }, [stream]);

  const detectGesture = useCallback(async () => {
    if (!videoRef.current || !stream || videoRef.current.videoWidth === 0) return;
    
    setIsDetecting(true);
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const cameraDataUri = canvas.toDataURL('image/jpeg');

    try {
      const result = await recognizeFacialExpressionGesture({ cameraDataUri });
      const detectedAction = result.action.toLowerCase() as Emotion;
      
      if (['happy', 'stress', 'fear', 'stop'].includes(detectedAction)) {
        if(detectedAction === 'stop') {
          setEmotion(null);
        } else {
          setEmotion(detectedAction);
        }
      }
    } catch (error) {
      console.error('Gesture detection error:', error);
       toast({
        title: 'Detection Error',
        description:
          'Could not detect emotion. Please try again.',
        variant: 'destructive',
      });
    } finally {
        setIsDetecting(false);
    }
  }, [stream, toast]);

  useEffect(() => {
    if (stream) {
      const intervalId = setInterval(() => {
        if (!isDetecting) {
          detectGesture();
        }
      }, 5000); // Check every 5 seconds

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [stream, isDetecting, detectGesture]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);
  
  const renderPlayerContent = () => {
    switch (emotion) {
      case 'happy':
        return (
          <div className="text-center">
            <Smile className="mx-auto h-12 w-12 text-primary" />
            <p className="mt-4 text-xl font-bold text-primary">
              Stay motivated and study!
            </p>
          </div>
        );
      case 'stress':
        return (
          <YouTubePlayer
            key={videoIds.stress}
            videoId={videoIds.stress}
          />
        );
      case 'fear':
        return (
          <YouTubePlayer
            key={videoIds.fear}
            videoId={videoIds.fear}
          />
        );
      default:
        return (
          <div className="text-center">
            <Music className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-xl font-bold text-muted-foreground">
              {isDetecting ? 'Detecting...' : 'Emotion not detected'}
            </p>
            <p className="text-sm text-muted-foreground">
             {isDetecting
                ? 'The AI is analyzing your expression...'
                : 'Enable your camera to start emotion detection.'}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-2xl font-bold md:text-3xl">
          Fix Emotions
        </h1>
        <p className="text-muted-foreground">
          It's hard to study when you're stressed. Take a moment to reset and you'll be better prepared to learn.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Camera className="h-5 w-5" /> Camera Feed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full scale-x-[-1] object-cover"
              />
              {!stream && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <p className="text-sm text-muted-foreground">Camera off</p>
                  <Button onClick={startCamera}>Start Camera</Button>
                </div>
              )}
            </div>
            {stream && (
              <div className="mt-4 flex justify-end">
                <Button variant="outline" onClick={stopCamera}>
                  <Power className="mr-2 h-4 w-4" />
                  Stop Camera
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Music className="h-5 w-5" /> Music Player
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`flex h-full min-h-[200px] flex-col items-center justify-center rounded-md border-2 border-dashed p-6 text-center transition-colors ${
                emotion ? 'border-primary bg-primary/10' : 'bg-muted/50'
              }`}
            >
              {renderPlayerContent()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
