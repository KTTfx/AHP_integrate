"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Bot } from "lucide-react";

interface ProcessingStatusProps {
  currentStep: string;
}

export function ProcessingStatus({ currentStep }: ProcessingStatusProps) {
  return (
    <Card className="p-6 bg-gray-900 border-blue-500/50">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-blue-500 animate-pulse" />
          <span className="text-blue-400">{currentStep}</span>
        </div>
        <Progress value={66} className="h-2 bg-gray-800" />
      </div>
    </Card>
  );
}