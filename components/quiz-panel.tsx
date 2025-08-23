"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, HelpCircle, ArrowRight } from "lucide-react"

interface QuizQuestion {
  id: string
  question: string
  type: "yes-no" | "multiple-choice"
  options?: string[]
  correctAnswer: string | number
  explanation: string
}

interface QuizPanelProps {
  questions: QuizQuestion[]
  onComplete: (score: number, earnedXP: number, earnedCoins: number) => void
  title?: string
}

export function QuizPanel({ questions, onComplete, title = "Knowledge Check" }: QuizPanelProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<(string | number | null)[]>(new Array(questions.length).fill(null))
  const [showExplanation, setShowExplanation] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [score, setScore] = useState(0)

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  const handleAnswer = (answer: string | number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = answer
    setAnswers(newAnswers)
    setShowExplanation(true)
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setShowExplanation(false)
    } else {
      // Calculate final score
      const finalScore = answers.reduce((acc, answer, index) => {
        return acc + (answer === questions[index].correctAnswer ? 1 : 0)
      }, 0)

      const percentage = (finalScore / questions.length) * 100
      const earnedXP = Math.round(percentage * 2) // Up to 200 XP for perfect score
      const earnedCoins = Math.round(percentage * 1.5) // Up to 150 coins for perfect score

      setScore(finalScore)
      setIsCompleted(true)
      onComplete(finalScore, earnedXP, earnedCoins)
    }
  }

  const isCorrect = answers[currentQuestionIndex] === currentQuestion.correctAnswer

  if (isCompleted) {
    const percentage = (score / questions.length) * 100

    return (
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <span>Quiz Complete!</span>
          </CardTitle>
          <CardDescription>Great job on completing the knowledge check</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-4xl font-bold text-primary">{percentage.toFixed(0)}%</div>
          <p className="text-muted-foreground">
            You got {score} out of {questions.length} questions correct
          </p>

          <div className="flex justify-center space-x-4">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              +{Math.round(percentage * 2)} XP
            </Badge>
            <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">
              +{Math.round(percentage * 1.5)} Coins
            </Badge>
          </div>

          {percentage >= 80 && (
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <p className="text-green-700 dark:text-green-400 font-medium">
                Excellent work! You've mastered this topic.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            <span>{title}</span>
          </CardTitle>
          <Badge variant="outline">
            {currentQuestionIndex + 1} / {questions.length}
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium leading-relaxed">{currentQuestion.question}</h3>

          {currentQuestion.type === "yes-no" ? (
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={answers[currentQuestionIndex] === "yes" ? "default" : "outline"}
                onClick={() => handleAnswer("yes")}
                disabled={showExplanation}
                className="h-12"
              >
                Yes
              </Button>
              <Button
                variant={answers[currentQuestionIndex] === "no" ? "default" : "outline"}
                onClick={() => handleAnswer("no")}
                disabled={showExplanation}
                className="h-12"
              >
                No
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {currentQuestion.options?.map((option, index) => (
                <Button
                  key={index}
                  variant={answers[currentQuestionIndex] === index ? "default" : "outline"}
                  onClick={() => handleAnswer(index)}
                  disabled={showExplanation}
                  className="w-full justify-start h-auto p-4 text-left"
                >
                  <span className="mr-3 font-mono text-sm bg-muted px-2 py-1 rounded">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </Button>
              ))}
            </div>
          )}
        </div>

        {showExplanation && (
          <div
            className={`p-4 rounded-lg border ${
              isCorrect ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"
            }`}
          >
            <div className="flex items-center space-x-2 mb-2">
              {isCorrect ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span
                className={`font-medium ${
                  isCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
                }`}
              >
                {isCorrect ? "Correct!" : "Incorrect"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
          </div>
        )}

        {showExplanation && (
          <Button onClick={handleNext} className="w-full">
            {currentQuestionIndex < questions.length - 1 ? (
              <>
                Next Question
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            ) : (
              "Complete Quiz"
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
