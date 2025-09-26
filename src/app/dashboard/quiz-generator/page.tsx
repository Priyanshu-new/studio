'use client';

import { generateQuizzesFromTopic } from '@/ai/flows/generate-quizzes-from-topic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Loader2,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import { useState } from 'react';

type Question = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

type Quiz = {
  questions: Question[];
};

export default function QuizGeneratorPage() {
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;

    setIsLoading(true);
    setQuiz(null);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowResults(false);

    try {
      const result = await generateQuizzesFromTopic({ topic, numQuestions });
      const parsedQuiz = JSON.parse(result.quiz);
      setQuiz(parsedQuiz);
    } catch (error) {
      console.error('Quiz generation error:', error);
      toast({
        title: 'Quiz Generation Failed',
        description:
          'Could not generate the quiz. The AI might be busy, please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  const score =
    quiz?.questions.reduce((total, question, index) => {
      return total + (question.answer === userAnswers[index] ? 1 : 0);
    }, 0) || 0;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h2 className="font-headline text-2xl">Generating Your Quiz...</h2>
        <p className="text-muted-foreground">
          The AI is crafting {numQuestions} questions about &quot;{topic}&quot;.
        </p>
      </div>
    );
  }

  if (quiz && showResults) {
    return (
      <div className="space-y-6">
        <h1 className="font-headline text-3xl">Quiz Results</h1>
        <Card>
          <CardHeader>
            <CardTitle>
              Your Score: {score} / {quiz.questions.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => {
                setShowResults(false);
                setCurrentQuestionIndex(0);
              }}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Review Answers
            </Button>
          </CardContent>
        </Card>
        {quiz.questions.map((q, index) => (
          <Card
            key={index}
            className={
              userAnswers[index] === q.answer
                ? 'border-green-500'
                : 'border-red-500'
            }
          >
            <CardHeader>
              <CardTitle className="flex items-start gap-3">
                {userAnswers[index] === q.answer ? (
                  <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                ) : (
                  <XCircle className="mt-1 h-5 w-5 flex-shrink-0 text-red-500" />
                )}
                {q.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Your answer:</strong> {userAnswers[index]}
              </p>
              <p>
                <strong>Correct answer:</strong> {q.answer}
              </p>
              <p className="mt-2 rounded-md bg-muted p-2">
                <strong>Explanation:</strong> {q.explanation}
              </p>
            </CardContent>
          </Card>
        ))}
        <Button onClick={() => setQuiz(null)}>Create a New Quiz</Button>
      </div>
    );
  }

  if (quiz) {
    const question = quiz.questions[currentQuestionIndex];
    return (
      <div className="space-y-6">
        <h1 className="font-headline text-3xl">Quiz on {topic}</h1>
        <Card>
          <CardHeader>
            <CardTitle>
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </CardTitle>
            <p className="pt-2 text-lg">{question.question}</p>
          </CardHeader>
          <CardContent>
            <RadioGroup
              onValueChange={handleAnswerSelect}
              value={userAnswers[currentQuestionIndex]}
            >
              {question.options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
        <div className="flex justify-between">
          <Button
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          {currentQuestionIndex < quiz.questions.length - 1 ? (
            <Button
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              disabled={!userAnswers[currentQuestionIndex]}
            >
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={() => setShowResults(true)}
              disabled={!userAnswers[currentQuestionIndex]}
            >
              Show Results
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-2xl font-bold md:text-3xl">
          Quiz Generator
        </h1>
        <p className="text-muted-foreground">
          Enter a topic to generate a multiple-choice quiz.
        </p>
      </div>
      <Card>
        <form onSubmit={handleGenerateQuiz}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Lightbulb className="h-5 w-5" />
              Create a Quiz
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., The Solar System"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="num-questions">Number of Questions</Label>
              <Input
                id="num-questions"
                type="number"
                value={numQuestions}
                onChange={(e) =>
                  setNumQuestions(
                    Math.max(1, Math.min(10, parseInt(e.target.value, 10) || 1))
                  )
                }
                min="1"
                max="10"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={!topic || isLoading}>
              Generate Quiz
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
