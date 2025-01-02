import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const ProblemCreator = () => {
  const [minValue, setMinValue] = useState("1");
  const [maxValue, setMaxValue] = useState("10");
  const [requiredSolutions, setRequiredSolutions] = useState("5");

  const handleCreate = () => {
    toast.success("Problem block created!");
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Pythagorean Problem</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="min">Minimum Value</Label>
          <Input
            id="min"
            type="number"
            value={minValue}
            onChange={(e) => setMinValue(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="max">Maximum Value</Label>
          <Input
            id="max"
            type="number"
            value={maxValue}
            onChange={(e) => setMaxValue(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="solutions">Required Solutions</Label>
          <Input
            id="solutions"
            type="number"
            value={requiredSolutions}
            onChange={(e) => setRequiredSolutions(e.target.value)}
          />
        </div>
        <Button onClick={handleCreate} className="w-full">
          Create Problem Block
        </Button>
      </CardContent>
    </Card>
  );
};