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

export default function FixEmotionsPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(
    null
  );
  const [emotion, setEmotion] = useState<Emotion>(null);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const { toast } = useToast();

  const videoIds = {
    stress: 'lwvMcvzEITI',
    fear: 'nkkpE6xdcnU',
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

  const startCamera = useCallback(async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } else {
        throw new Error('Media devices not supported');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description:
          'Please enable camera permissions in your browser settings.',
      });
    }
  }, [toast]);

  const detectEmotion = useCallback(async () => {
    if (!videoRef.current || !videoRef.current.srcObject || videoRef.current.readyState < 3) {
      toast({
        title: 'Camera Not Ready',
        description: 'Please start the camera and wait for the feed to appear.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsDetecting(true);
    setEmotion(null);

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    if (canvas.width === 0 || canvas.height === 0) {
      toast({
        title: 'Camera Error',
        description: 'Could not capture video frame. Please ensure the camera is working correctly.',
        variant: 'destructive',
      });
      setIsDetecting(false);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsDetecting(false);
      toast({
        title: 'Canvas Error',
        description: 'Could not get canvas context for image capture.',
        variant: 'destructive',
      });
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
      console.error('Emotion detection error:', error);
       toast({
        title: 'Detection Error',
        description:
          'Could not detect emotion. The AI may be busy or the image is unclear.',
        variant: 'destructive',
      });
    } finally {
        setIsDetecting(false);
    }
  }, [toast]);
  
  useEffect(() => {
    // This effect is now only for cleanup
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const renderPlayerContent = () => {
    if (isDetecting) {
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-xl font-bold text-primary">
            Detecting Emotion...
          </p>
          <p className="text-sm text-muted-foreground">
            Please wait while the AI analyzes the camera feed.
          </p>
        </div>
      );
    }
    
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
              Emotion not detected
            </p>
            <p className="text-sm text-muted-foreground">
             Click the detect button to check your emotion.
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
                <Button onClick={detectEmotion} disabled={isDetecting}>
                  {isDetecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Detecting...
                    </>
                  ) : (
                    <>
                      <Feather className="mr-2 h-4 w-4" />
                      Detect Emotion
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
                emotion || isDetecting ? 'border-primary bg-primary/10' : 'bg-muted/50'
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
