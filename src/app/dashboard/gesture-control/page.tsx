'use client';

import { recognizeFacialExpressionGesture } from '@/ai/flows/facial-expression-gesture-recognition';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [emotion, setEmotion] = useState<Emotion>(null);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const { toast } = useToast();

  const videoIds = {
    stress: 'lwvMcvzEITI',
    fear: 'nkkpE6xdcnU',
  };

  const getCameraPermission = useCallback(async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
        return stream;
      }
      throw new Error('Media devices not supported');
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings.',
      });
      return null;
    }
  }, [toast]);

  const startCamera = async () => {
    const stream = await getCameraPermission();
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setHasCameraPermission(null);
    setIsDetecting(false);
    setEmotion(null);
  }, []);

  const detectGesture = useCallback(async () => {
    if (!videoRef.current || !videoRef.current.srcObject || videoRef.current.videoWidth === 0) {
      toast({
        title: 'Camera Not Ready',
        description: 'Please start the camera and wait for the feed to appear.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsDetecting(true);

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        setIsDetecting(false);
        return;
    }
    
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
          'Could not detect gesture. Please try again.',
        variant: 'destructive',
      });
    } finally {
        setIsDetecting(false);
    }
  }, [toast]);

  useEffect(() => {
    return () => {
      // Ensure camera is off when leaving the page.
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);
  
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
              Gesture not detected
            </p>
            <p className="text-sm text-muted-foreground">
              Click the detect button to check your gesture.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-2xl font-bold md:text-3xl">
          Gesture Control
        </h1>
        <p className="text-muted-foreground">
          Control app functions with your expressions and gestures. Try smiling,
          looking stressed, or raising your hand!
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
              {hasCameraPermission === null && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <p className="text-sm text-muted-foreground">Camera off</p>
                  <Button onClick={startCamera}>Start Camera</Button>
                </div>
              )}
            </div>
             {hasCameraPermission === false && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTitle>Camera Access Required</AlertTitle>
                  <AlertDescription>
                    Please allow camera access in your browser settings to use this feature.
                  </AlertDescription>
                </Alert>
             )}
            {hasCameraPermission === true && (
              <div className="mt-4 flex justify-between">
                <Button onClick={detectGesture} disabled={isDetecting}>
                  {isDetecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Detecting...
                    </>
                  ) : (
                    <>
                      <Feather className="mr-2 h-4 w-4" />
                      Detect Gesture
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
