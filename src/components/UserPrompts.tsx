import { MessageCircle } from "lucide-react";

interface PromptProps {
  prompts: string[];
}

export const PromptList: React.FC<PromptProps> = ({ prompts }) => {
  return (
    <div className="dark:text-white">
      {prompts.map((prompt, index) => (
        <div key={index} className="flex items-start gap-2 cursor-pointer px-2 py-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700">
            <MessageCircle size={20} />
            <p>{prompt}</p>
        </div>
      ))}
    </div>
  );
};