import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bot, Send } from 'lucide-react';

export default function AssistantPage() {
  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="mb-6">
        <h1 className="font-headline text-2xl font-bold md:text-3xl">
          Abily AI Assistant
        </h1>
        <p className="text-muted-foreground">
          Ask me anything! I can help you with your studies, explain concepts, and more.
        </p>
      </div>
      <Card className="flex flex-1 flex-col">
        <CardHeader className="flex flex-row items-center gap-3">
          <Bot className="h-6 w-6" />
          <CardTitle className="font-headline text-xl">Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 space-y-4 overflow-y-auto p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Bot className="h-5 w-5" />
            </div>
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm">
                Hello! How can I assist your learning today?
              </p>
            </div>
          </div>
        </CardContent>
        <div className="border-t p-4">
          <div className="relative">
            <Textarea
              placeholder="Type your message here..."
              className="pr-16"
              rows={1}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute bottom-2 right-2"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
