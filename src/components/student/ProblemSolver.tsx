import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const ProblemSolver = () => {
  const [answer, setAnswer] = useState("");
  const [solved, setSolved] = useState(0);
  const required = 5;

  // Generate random triangle sides
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  const c = Math.sqrt(a * a + b * b);

  const handleSubmit = () => {
    const userAnswer = parseFloat(answer);
    if (Math.abs(userAnswer - c) < 0.1) {
      setSolved((prev) => prev + 1);
      setAnswer("");
      toast.success("Correct! Keep going!");
    } else {
      toast.error("Try again!");
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Pythagorean Theorem</span>
          <span className="text-sm text-muted-foreground">
            {solved}/{required} solved
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-center">
            Find the hypotenuse of a right triangle with:
            <br />
            <span className="font-semibold">a = {a}</span> and{" "}
            <span className="font-semibold">b = {b}</span>
          </p>
        </div>
        <div className="flex space-x-2">
          <Input
            type="number"
            step="0.01"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter your answer"
          />
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-primary rounded-full h-2.5 transition-all duration-300"
            style={{ width: `${(solved / required) * 100}%` }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
};