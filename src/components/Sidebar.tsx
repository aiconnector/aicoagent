"use client";

import { Menu, Plus, MessageCircle, HelpCircle, ActivityIcon, SettingsIcon } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useAppContext } from "@/context/context";
import { PromptList } from "./UserPrompts";

export default function Sidebar() {
  const [extended, setExtended] = useState(false);
  const {
    prompts,
  } = useAppContext();

  return (
    <div className="min-w-[40px] min-h-screen flex flex-col justify-between bg-white dark:bg-gray-800 p-3 border-r-2 border-gray-400 dark:border-gray-300">
      <div>
        <Menu
          className="block ml-4 cursor-pointer text-gray-600 dark:text-gray-300"
          onClick={() => setExtended(!extended)}
        />
        <div className={`mt-8 inline-flex items-center cursor-pointer gap-2 px-4 py-2 rounded-full text-sm bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors ${extended ? 'w-full' : 'w-auto'}`}>
          <Plus size={20} />
          {extended && <p>New chat</p>}
        </div>
      </div>

      <div className=" mt-8">
        <div className={`flex items-start gap-2 cursor-pointer px-4 py-2 rounded-full text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors ${extended ? 'w-full' : 'w-auto'}`}>
          <MessageCircle size={20} />
          {extended && <p>Recent chats</p>}
        </div>
        <div className={`flex items-start gap-2 cursor-pointer px-4 py-2 rounded-full text-gray-800 dark:text-gray-200 transition-colors ${extended ? 'w-full' : 'w-auto'}`}>
          {extended && <PromptList prompts={prompts} />}
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        {[
          { icon: HelpCircle, label: "Help" },
          { icon: ActivityIcon, label: "Activity" },
          { icon: SettingsIcon, label: "Settings" },
        ].map((item, index) => (
          <div key={index} className={`flex items-start gap-2 cursor-pointer px-4 py-2 rounded-full text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors ${extended ? 'w-full' : 'w-auto'}`}>
            <item.icon size={20} />
            {extended && <p>{item.label}</p>}
          </div>
        ))}
        <div className={`flex items-start gap-2 cursor-pointer px-4 py-2 rounded-full text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors ${extended ? 'w-full' : 'w-auto'}`}>
          <ThemeToggle />
          {extended && <p>Theme</p>}
        </div>
      </div>
    </div>
  );
}
