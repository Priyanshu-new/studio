'use client';

import { convertISLToText } from '@/ai/flows/convert-isl-to-text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Camera, Hand, Loader2, Power } from 'lucide-react';
import { useRef, useState, useEffect, useCallback } from 'react';

export default function ISLTranslatorPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [translation, setTranslation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
          'Could not access the camera. Please check your permissions and try again.',
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
  }, [stream]);

  const captureAndTranslate = async () => {
    if (!videoRef.current) return;
    setIsLoading(true);
    setTranslation('');

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    // Flip the canvas context horizontally
    ctx?.translate(canvas.width, 0);
    ctx?.scale(-1, 1);
    ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const photoDataUri = canvas.toDataURL('image/jpeg');

    try {
      const result = await convertISLToText({ photoDataUri });
      setTranslation(result.englishText);
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: 'Translation Failed',
        description: 'Could not translate the sign. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-2xl font-bold md:text-3xl">
          ISL to English Translator
        </h1>
        <p className="text-muted-foreground">
          Use your camera to translate Indian Sign Language into English text.
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
                  <p className="text-sm text-muted-foreground">
                    Camera is off
                  </p>
                  <Button onClick={startCamera}>Start Camera</Button>
                </div>
              )}
            </div>
            {stream && (
              <div className="mt-4 flex justify-between">
                <Button onClick={captureAndTranslate} disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="mr-2 h-4 w-4" />
                  )}
                  Translate Sign
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
              <Hand className="h-5 w-5" /> Translation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-full min-h-[200px] items-center justify-center rounded-md border-2 border-dashed bg-muted/50 p-6 text-center">
              {isLoading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-muted-foreground">Translating...</p>
                </div>
              ) : translation ? (
                <p className="text-2xl font-bold text-primary">{translation}</p>
              ) : (
                <p className="text-muted-foreground">
                  Your translated text will appear here.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
