"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { CardSchema } from "@/lib/schemas/card";
import type { Card as CardType } from "@/lib/schemas/card";

export default function Home() {
  const [error, setError] = useState<string>("");
  const [cardData, setCardData] = useState<CardType | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCardData(null);
    
    if (!input.trim()) {
      setError("请输入内容");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) {
        throw new Error("请求失败");
      }

      const data = await response.json();
      console.log("API Response:", data);

      // 使用 Zod schema 验证
      const validatedData = CardSchema.parse(data);
      console.log("Validated data:", validatedData);
      
      setCardData(validatedData);
      setError("");
    } catch (e) {
      console.error("Error:", e);
      setError("生成失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 标题 */}
        <h1 className="text-3xl font-bold text-center text-gray-800">
          AI 信息卡片生成器
        </h1>

        {/* 输入表单 */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <textarea
            className="w-full h-32 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="请输入您想要生成的信息卡片内容，例如：'如何建立自律习惯'"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="w-full px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            disabled={isLoading}
          >
            {isLoading ? "生成中..." : "生成卡片"}
          </button>
        </form>

        {/* 错误提示 */}
        {error && (
          <div className="p-4 text-red-500 bg-red-50 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {/* 卡片展示 */}
        {cardData && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <Card data={cardData} />
          </div>
        )}
      </div>
    </main>
  );
}
