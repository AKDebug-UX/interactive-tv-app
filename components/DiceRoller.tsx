"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6]

export default function DiceRoller() {
  const [diceValues, setDiceValues] = useState([1, 1])
  const [isRolling, setIsRolling] = useState(false)
  const [useTwoDice, setUseTwoDice] = useState(true)

  const rollDice = () => {
    setIsRolling(true)
    const audio = new Audio("/dice-roll.mp3")
    audio.play()

    setTimeout(() => {
      const newValues = [Math.floor(Math.random() * 6) + 1, useTwoDice ? Math.floor(Math.random() * 6) + 1 : 0]
      setDiceValues(newValues)
      setIsRolling(false)
    }, 1000)
  }

  const DiceIcon1 = diceIcons[diceValues[0] - 1]
  const DiceIcon2 = useTwoDice ? diceIcons[diceValues[1] - 1] : null

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      rollDice()
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Dice Roller</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="flex items-center space-x-2 mb-6">
          <Switch id="dice-switch" checked={useTwoDice} onCheckedChange={setUseTwoDice} />
          <Label htmlFor="dice-switch" className="text-lg">
            {useTwoDice ? "Using two dice" : "Using one die"}
          </Label>
        </div>
        <div className="flex justify-center space-x-8 mb-6">
          <motion.div
            className="text-8xl text-blue-500"
            animate={isRolling ? { rotate: 360 } : {}}
            transition={{ duration: 0.4 }}
          >
            <DiceIcon1 size={120} />
          </motion.div>
          {useTwoDice && DiceIcon2 && (
            <motion.div
              className="text-8xl text-blue-500"
              animate={isRolling ? { rotate: 360 } : {}}
              transition={{ duration: 0.4 }}
            >
              <DiceIcon2 size={120} />
            </motion.div>
          )}
        </div>
        <p className="text-2xl font-bold text-gray-700 mb-4">
          {isRolling
            ? "Rolling..."
            : useTwoDice
              ? `You rolled a ${diceValues[0]} + ${diceValues[1]} = ${diceValues[0] + diceValues[1]}`
              : `You rolled a ${diceValues[0]}`}
        </p>
        <Button
          onClick={rollDice}
          disabled={isRolling}
          size="lg"
          className="text-xl py-6 px-8"
          onKeyDown={handleKeyPress}
        >
          Roll {useTwoDice ? "Dice" : "Die"}
        </Button>
      </CardContent>
    </Card>
  )
}

