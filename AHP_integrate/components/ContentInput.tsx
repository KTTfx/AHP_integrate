"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, RefreshCw } from "lucide-react";

interface ContentInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isProcessing: boolean;
}

export function ContentInput({
  input,
  onInputChange,
  onSubmit,
  onFileUpload,
  isProcessing
}: ContentInputProps) {
  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Enter your prompt for AI content generation..."
        className="min-h-[200px] bg-gray-800 border-blue-500/30 focus:border-blue-500"
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
      />
      
      <div className="flex justify-between items-center">
        <Button
          onClick={() => document.getElementById('file-upload')?.click()}
          variant="outline"
          className="bg-gray-800 border-blue-500/30 hover:bg-blue-500/20"
        >
          Upload File
        </Button>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={onFileUpload}
          accept=".txt,.doc,.docx"
        />
        
        <Button
          onClick={onSubmit}
          className="bg-blue-600 hover:bg-blue-700"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          Generate
        </Button>
      </div>
    </div>
  );
}