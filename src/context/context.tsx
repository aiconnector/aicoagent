"use client"
import React, { createContext, useState, useContext, ReactNode } from "react";
import { GroundingChunk } from "../app/groundingChunksHandler";

interface ContextType {
  onSent: () => Promise<void>;
  chatWithVertex: () => Promise<void>;
  response: string;
  setResponse: React.Dispatch<React.SetStateAction<string>>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  result: string;
  setResult: React.Dispatch<React.SetStateAction<string>>;
  prompts: string[];
  setPrompts: React.Dispatch<React.SetStateAction<string[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  showResult: boolean;
  setShowResult: React.Dispatch<React.SetStateAction<boolean>>;
  recentPrompt: string;
  groundingChunks: GroundingChunk[];
  setGroundingChunks: React.Dispatch<React.SetStateAction<GroundingChunk[]>>;
}

const Context = createContext<ContextType | undefined>(undefined);

function formatText(text: string): string {
  // Handle bold text
  const boldFormatted = text.replace(/\*\*(.*?)\*\*/g, "<br><b>$1</b>");
  
  // Handle source references as subscripts
//   const sourceFormatted = boldFormatted.replace(/\[(.*?)\]/g, "[$1]");
  
  // Handle newline characters, replace multipe <br> with <br></br>into one
  const newlineFormatted = boldFormatted.replace(/\*/g, "<br>").replace(/(<br>\s*){2,}/g, '<br>');
  
  // Handle single asterisks for emphasis (e.g., italic)
  const finalFormatted = newlineFormatted.replace(/\*(.*?)\*/g, "<em>$1</em>");

  console.log(finalFormatted);
  return finalFormatted;
}

interface ContextProviderProps {
  children: ReactNode;
}

export function ContextProvider({ children }: ContextProviderProps) 
{
    const [input, setInput] = useState<string>("");
    const [recentPrompt, setRecentPrompt] = useState<string>("");
    const [result, setResult] = useState<string>("");
    const [prompts, setPrompts] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [showResult, setShowResult] = useState<boolean>(false);
    const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);
    
    const [response, setResponse] = useState<string>("");

    const onSent = async (): Promise<void> => {  
        setResult("");
        setLoading(true);
        setShowResult(true);
        setRecentPrompt(input);

        try {
            const response = await fetch('/api/sendMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: input }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate content');
            }
            const data = await response.json();
            const formattedResult = formatText(data.result);
            setResult(formattedResult);
            setPrompts(prevPrompts => [...prevPrompts, input]);
        } catch (error) {
            console.error("Error generating content:", error);
            setResult("An error occurred while searching the content. Please try again.");
        } finally {
            setLoading(false);
            setInput("");
        }
    }

    const chatWithVertex = async (): Promise<void> => {  
        setResult("");
        setLoading(true);
        setShowResult(true);
        setRecentPrompt(input);

        try {
            const response = await fetch('/api/getResponse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: input }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate content');
            }
            const data = await response.json();
            // console.log("data:", data);
            const formattedResult = formatText(data.text);
            console.log("chunks:", data.groundingChunks);
            setResult(formattedResult);
            setGroundingChunks(data.groundingChunks);
            setPrompts(prevPrompts => [...prevPrompts, input]);
        } catch (error) {
            console.error("Error generating content:", error);
            setResult("An error occurred while searching the content. Please try again.");
        } finally {
            setLoading(false);
            setInput("");
        }
    }

    const contextValue: ContextType = {
        onSent,
        chatWithVertex,
        response,
        setResponse,
        input,
        setInput,
        result,
        setResult,
        prompts,
        setPrompts,
        loading,
        setLoading,
        showResult,
        setShowResult,
        recentPrompt,
        groundingChunks,
        setGroundingChunks,
    }
  
    return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export function useAppContext(): ContextType {
    const context = useContext(Context);
    if (context === undefined) {
        throw new Error('useAppContext must be used within a ContextProvider');
    }
    return context;
}
