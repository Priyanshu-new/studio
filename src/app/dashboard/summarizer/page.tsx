'use client';

import { summarizeLongContent } from '@/ai/flows/summarize-long-content';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { BookText, Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function SummarizerPage() {
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    if (!content) return;
    setIsLoading(true);
    setSummary('');

    try {
      const result = await summarizeLongContent({ content });
      setSummary(result.summary);
    } catch (error) {
      console.error('Summarization error:', error);
      toast({
        title: 'Summarization Failed',
        description: 'Could not summarize the content. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-2xl font-bold md:text-3xl">
          Content Summarizer
        </h1>
        <p className="text-muted-foreground">
          Paste any long text to get a quick, easy-to-read summary.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <BookText className="h-5 w-5" />
              Your Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your article, paper, or any long text here..."
              className="h-64"
            />
            <Button onClick={handleSummarize} disabled={!content || isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Summarize
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Sparkles className="h-5 w-5" />
              AI Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-full min-h-[200px] rounded-md border-2 border-dashed bg-muted/50 p-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-muted-foreground">
                    AI is reading and summarizing...
                  </p>
                </div>
              ) : summary ? (
                <div className="prose prose-sm max-w-none text-foreground">
                  <ul className="list-disc space-y-2 pl-4">
                    {summary
                      .split(/[\n-]/)
                      .filter((point) => point.trim())
                      .map((point, index) => (
                        <li key={index}>{point.trim()}</li>
                      ))}
                  </ul>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-center">
                  <p className="text-muted-foreground">
                    Your summary will appear here.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
