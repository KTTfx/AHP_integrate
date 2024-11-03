"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Download } from "lucide-react";

interface ContentOutputProps {
  output: string;
  plagiarismScore: number;
  isComplete: boolean;
  onDownload: () => void;
}

export function ContentOutput({
  output,
  plagiarismScore,
  isComplete,
  onDownload
}: ContentOutputProps) {
  return (
    <Card className="p-6 bg-gray-900 border-blue-500/50 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-blue-400">Generated Content</h3>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-green-500" />
          <span className={`${plagiarismScore <= 10 ? 'text-green-500' : 'text-red-500'}`}>
            Plagiarism Score: {plagiarismScore}%
          </span>
        </div>
      </div>
      
      <div className="p-4 bg-gray-800 rounded-lg whitespace-pre-wrap">
        {output}
      </div>

      {isComplete && plagiarismScore <= 10 && (
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={onDownload}
        >
          <Download className="mr-2 h-4 w-4" />
          Download Result
        </Button>
      )}
    </Card>
  );
}