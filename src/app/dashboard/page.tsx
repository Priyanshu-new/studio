import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  ArrowRight,
  Bot,
  BookText,
  Feather,
  Hand,
  Lightbulb,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const tools = [
  {
    title: 'AI Assistant',
    description: 'Chat with Abily AI for real-time help.',
    href: '/dashboard/assistant',
    icon: <Bot className="h-6 w-6" />,
    imageId: 'dashboard-card-1',
  },
  {
    title: 'ISL Translator',
    description: 'Convert sign language to text.',
    href: '/dashboard/isl-translator',
    icon: <Hand className="h-6 w-6" />,
    imageId: 'dashboard-card-2',
  },
  {
    title: 'Fix Emotions',
    description: 'Use gestures to interact with the app.',
    href: '/dashboard/fix-emotions',
    icon: <Feather className="h-6 w-6" />,
    imageId: 'dashboard-card-3',
  },
  {
    title: 'Quiz Generator',
    description: 'Create quizzes on any topic.',
    href: '/dashboard/quiz-generator',
    icon: <Lightbulb className="h-6 w-6" />,
    imageId: 'dashboard-card-4',
  },
  {
    title: 'Summarizer',
    description: 'Summarize long articles and texts.',
    href: '/dashboard/summarizer',
    icon: <BookText className="h-6 w-6" />,
    imageId: 'dashboard-card-5',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-2xl font-bold md:text-3xl">
          Welcome to your Dashboard
        </h1>
        <p className="text-muted-foreground">
          Here are the tools to power your learning journey.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const image = PlaceHolderImages.find((img) => img.id === tool.imageId);
          return (
            <Card
              key={tool.title}
              className="group flex transform flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <CardHeader>
                <div className="relative h-40 w-full overflow-hidden rounded-lg">
                  {image && (
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      fill
                      className="object-cover"
                      data-ai-hint={image.imageHint}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    {tool.icon}
                  </div>
                  <div>
                    <CardTitle className="font-headline text-xl">
                      {tool.title}
                    </CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </div>
                </div>
                <Link
                  href={tool.href}
                  className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary"
                >
                  Go to Tool <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
