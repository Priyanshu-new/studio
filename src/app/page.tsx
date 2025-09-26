import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Accessibility,
  Bot,
  Feather,
  Lightbulb,
  Sparkles,
  ToyBrick,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    icon: <Bot className="h-8 w-8" />,
    title: 'Abily AI Assistant',
    description:
      'Get real-time, multi-modal tutoring with voice, text, and visual input.',
  },
  {
    icon: <Accessibility className="h-8 w-8" />,
    title: 'Adaptive Interface',
    description:
      'Switchable modes to cater to various hearing, visual, and cognitive needs.',
  },
  {
    icon: <Sparkles className="h-8 w-8" />,
    title: 'Sign Language Conversion',
    description:
      'Live ISL to English conversion and vice versa using your camera.',
  },
  {
    icon: <Lightbulb className="h-8 w-8" />,
    title: 'Quiz Generator',
    description:
      'Automatically generate quizzes on any topic with instant feedback.',
  },
  {
    icon: <ToyBrick className="h-8 w-8" />,
    title: 'Chunk-Based Learning',
    description:
      'AI-powered content summarization to break down complex topics.',
  },
  {
    icon: <Feather className="h-8 w-8" />,
    title: 'Personalized Experience',
    description: 'Your learning journey adapts to your progress and preferences.',
  },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-1');

  return (
    <div className="flex min-h-screen flex-col">
      <header className="container mx-auto px-4 py-6">
        <h1 className="font-headline text-2xl font-bold">Abily Learn</h1>
      </header>

      <main className="flex-1">
        <section className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 py-16 md:grid-cols-2 lg:py-24">
          <div className="space-y-6">
            <h2 className="font-headline text-4xl font-bold tracking-tighter text-primary md:text-5xl lg:text-6xl">
              Accessible Learning for Everyone.
            </h2>
            <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl">
              Abily Learn is an AI-powered platform designed to make education
              inclusive. Explore a new way of learning, tailored to your unique
              needs.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/login">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-64 w-full overflow-hidden rounded-lg shadow-2xl md:h-96">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </div>
        </section>

        <section id="features" className="bg-muted py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h3 className="font-headline text-3xl font-bold md:text-4xl">
                Features Designed for You
              </h3>
              <p className="mt-2 text-lg text-muted-foreground">
                A suite of powerful tools to enhance your learning experience.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title}>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3 text-primary">
                      {feature.icon}
                    </div>
                    <CardTitle className="font-headline text-xl">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container mx-auto flex items-center justify-between px-4 py-6">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Abily Learn. All rights reserved.
          </p>
          <nav className="flex gap-4">
            <Link
              href="#"
              className="text-sm hover:text-primary hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm hover:text-primary hover:underline"
            >
              Terms of Service
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
