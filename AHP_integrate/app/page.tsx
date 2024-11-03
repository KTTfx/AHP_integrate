"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateAIContent, humanizeContent, checkPlagiarism } from "@/lib/api-services";
import { ProcessingStatus, PlagiarismResult } from "@/lib/types";
import { ContentInput } from "@/components/ContentInput";
import { ProcessingStatus as ProcessingStatusComponent } from "@/components/ProcessingStatus";
import { ContentOutput } from "@/components/ContentOutput";

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [originalOutput, setOriginalOutput] = useState("");
  const [status, setStatus] = useState<ProcessingStatus>({
    isProcessing: false,
    currentStep: "",
    error: "",
  });
  const [plagiarismScore, setPlagiarismScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const processContent = async (content: string): Promise<PlagiarismResult> => {
    let currentContent = content;
    let score = 100;
    let attempts = 0;
    const MAX_ATTEMPTS = 3;

    while (score > 10 && attempts < MAX_ATTEMPTS) {
      setStatus(prev => ({ ...prev, currentStep: "Humanizing content..." }));
      const humanizeResult = await humanizeContent(currentContent);
      
      if (!humanizeResult.success) {
        throw new Error(humanizeResult.error);
      }
      
      currentContent = humanizeResult.data;
      
      setStatus(prev => ({ ...prev, currentStep: "Checking for plagiarism..." }));
      const plagiarismResult = await checkPlagiarism(currentContent);
      
      if (!plagiarismResult.success) {
        throw new Error(plagiarismResult.error);
      }
      
      score = plagiarismResult.data;
      setPlagiarismScore(score);
      
      attempts++;
    }

    return { content: currentContent, score };
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;
    
    setStatus({
      isProcessing: true,
      currentStep: "Generating AI response...",
      error: "",
    });
    setIsComplete(false);
    
    try {
      const aiResult = await generateAIContent(input);
      if (!aiResult.success) {
        throw new Error(aiResult.error);
      }
      
      setOriginalOutput(aiResult.data);

      const { content, score } = await processContent(aiResult.data);
      
      if (score > 10) {
        throw new Error("Unable to achieve desired plagiarism score after multiple attempts.");
      }

      setOutput(content);
      setPlagiarismScore(score);
      setIsComplete(true);
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      }));
    } finally {
      setStatus(prev => ({
        ...prev,
        isProcessing: false,
        currentStep: "",
      }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setInput(text);
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-content.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
            AI Writing Assistant
          </h1>
          <p className="text-blue-400">Generate original content with plagiarism checking</p>
        </div>

        <Card className="p-6 bg-gray-900 border-blue-500/50 shadow-lg shadow-blue-500/20">
          <Tabs defaultValue="generate" className="space-y-4">
            <TabsList className="bg-gray-800">
              <TabsTrigger value="generate">Generate Content</TabsTrigger>
              <TabsTrigger value="check">Check Existing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="generate">
              <ContentInput
                input={input}
                onInputChange={setInput}
                onSubmit={handleSubmit}
                onFileUpload={handleFileUpload}
                isProcessing={status.isProcessing}
              />
            </TabsContent>
          </Tabs>
        </Card>

        {status.error && (
          <Card className="p-4 bg-red-900/50 border-red-500/50">
            <p className="text-red-400">{status.error}</p>
          </Card>
        )}

        {status.isProcessing && (
          <ProcessingStatusComponent currentStep={status.currentStep} />
        )}

        {output && (
          <ContentOutput
            output={output}
            plagiarismScore={plagiarismScore}
            isComplete={isComplete}
            onDownload={handleDownload}
          />
        )}
      </div>
    </div>
  );
}