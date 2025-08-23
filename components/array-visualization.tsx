"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, RotateCcw, Play } from "lucide-react"

interface ArrayVisualizationProps {
  onComplete: (earnedXP: number, earnedCoins: number) => void
}

export function ArrayVisualization({ onComplete }: ArrayVisualizationProps) {
  const [array, setArray] = useState<number[]>([1, 3, 5, 7, 9])
  const [inputValue, setInputValue] = useState("")
  const [insertIndex, setInsertIndex] = useState("")
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null)
  const [operations, setOperations] = useState(0)

  const handleInsert = () => {
    const value = Number.parseInt(inputValue)
    const index = Number.parseInt(insertIndex)

    if (isNaN(value) || isNaN(index) || index < 0 || index > array.length) {
      return
    }

    setAnimatingIndex(index)
    setTimeout(() => {
      const newArray = [...array]
      newArray.splice(index, 0, value)
      setArray(newArray)
      setInputValue("")
      setInsertIndex("")
      setOperations(operations + 1)
      setAnimatingIndex(null)
    }, 300)
  }

  const handleDelete = (index: number) => {
    setAnimatingIndex(index)
    setTimeout(() => {
      const newArray = array.filter((_, i) => i !== index)
      setArray(newArray)
      setOperations(operations + 1)
      setAnimatingIndex(null)
    }, 300)
  }

  const handleReset = () => {
    setArray([1, 3, 5, 7, 9])
    setInputValue("")
    setInsertIndex("")
    setOperations(0)
    setAnimatingIndex(null)
  }

  const handleComplete = () => {
    const earnedXP = Math.max(50, 100 - operations * 5) // More operations = less XP
    const earnedCoins = Math.max(25, 50 - operations * 2)
    onComplete(earnedXP, earnedCoins)
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Play className="h-5 w-5 text-primary" />
          <span>Array Operations</span>
        </CardTitle>
        <CardDescription>
          Practice inserting and deleting elements in an array. Try to complete the challenges efficiently!
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Array Visualization */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Current Array</h3>
            <Badge variant="outline">Length: {array.length}</Badge>
          </div>

          <div className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-lg min-h-[80px] items-center">
            {array.map((value, index) => (
              <div
                key={`${value}-${index}`}
                className={`relative group transition-all duration-300 ${
                  animatingIndex === index ? "scale-110 animate-pulse" : ""
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <div className="text-xs text-muted-foreground font-mono">[{index}]</div>
                  <div className="w-12 h-12 bg-primary/10 border-2 border-primary/20 rounded-lg flex items-center justify-center font-mono font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                    {value}
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                    onClick={() => handleDelete(index)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}

            {array.length === 0 && <div className="text-muted-foreground italic">Array is empty</div>}
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium">Insert Element</h4>
            <div className="flex space-x-2">
              <Input
                placeholder="Value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                type="number"
                className="flex-1"
              />
              <Input
                placeholder="Index"
                value={insertIndex}
                onChange={(e) => setInsertIndex(e.target.value)}
                type="number"
                min="0"
                max={array.length}
                className="w-20"
              />
              <Button onClick={handleInsert} disabled={!inputValue || !insertIndex}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Actions</h4>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleComplete} className="flex-1">
                Complete Challenge
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <span className="text-sm text-muted-foreground">Operations performed:</span>
          <Badge variant="secondary">{operations}</Badge>
        </div>

        {/* Challenge */}
        <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
          <h4 className="font-medium text-accent mb-2">Challenge</h4>
          <p className="text-sm text-muted-foreground">
            Try to insert the number 4 at index 2, then delete the element at index 0. Complete it in as few operations
            as possible for maximum rewards!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
