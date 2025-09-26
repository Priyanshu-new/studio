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
  Square,
  Play,
} from 'lucide-react';
import { useRef, useState, useEffect, useCallback } from 'react';

export default function GestureControlPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [action, setAction] = useState<string>('stop music');
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const { toast } = useToast();

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
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsDetecting(false);
  }, [stream]);

  const detectGesture = useCallback(async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const cameraDataUri = canvas.toDataURL('image/jpeg');

    try {
      const result = await recognizeFacialExpressionGesture({ cameraDataUri });
      if (result.action.toLowerCase().includes('play')) {
        setAction('play music');
      } else if (result.action.toLowerCase().includes('stop')) {
        setAction('stop music');
      }
    } catch (error) {
      console.error('Gesture detection error:', error);
    }
  }, []);

  const toggleDetection = () => {
    if (isDetecting) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsDetecting(false);
    } else {
      setIsDetecting(true);
      intervalRef.current = setInterval(detectGesture, 3000); // Check every 3 seconds
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const isMusicPlaying = action === 'play music';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-2xl font-bold md:text-3xl">
          Gesture Control
        </h1>
        <p className="text-muted-foreground">
          Control app functions with your expressions and gestures. Try smiling
          or raising your hand!
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
              <div className="mt-4 flex justify-between">
                <Button onClick={toggleDetection} disabled={!stream}>
                  {isDetecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Stop Detection
                    </>
                  ) : (
                    <>
                      <Feather className="mr-2 h-4 w-4" />
                      Start Detection
                    </>
                  )}
                </Button>
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
              <Music className="h-5 w-5" /> Mock Music Player
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`flex h-full min-h-[200px] flex-col items-center justify-center rounded-md border-2 border-dashed p-6 text-center transition-colors ${
                isMusicPlaying ? 'border-primary bg-primary/10' : 'bg-muted/50'
              }`}
            >
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-background shadow-inner">
                {isMusicPlaying ? (
                  <Play className="h-12 w-12 fill-primary text-primary" />
                ) : (
                  <Square className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <p
                className={`mt-4 text-xl font-bold transition-colors ${
                  isMusicPlaying ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {isMusicPlaying ? 'Music is Playing' : 'Music is Stopped'}
              </p>
              <p className="text-sm text-muted-foreground">
                {isDetecting
                  ? 'AI is watching for gestures...'
                  : 'Detection is off.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
