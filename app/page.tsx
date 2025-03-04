"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { CardSchema } from "@/lib/schemas/card";
import type { Card as CardType, Layout } from "@/lib/schemas/card";

export default function Home() {
  const [error, setError] = useState<string>("");
  const [cardData, setCardData] = useState<CardType | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState<Layout["type"]>("grid");

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

      // 如果用户选择了布局，覆盖AI生成的布局
      if (selectedLayout && selectedLayout !== validatedData.layout?.type) {
        validatedData.layout = {
          ...validatedData.layout,
          type: selectedLayout
        };
      }

      setCardData(validatedData);
      setError("");
    } catch (e) {
      console.error("Error:", e);
      setError("生成失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  // 布局选项
  const layoutOptions = [
    { value: "grid", label: "网格布局", description: "适合展示平等重要性的项目" },
    { value: "list", label: "列表布局", description: "适合线性阅读的内容" },
    { value: "masonry", label: "瀑布流布局", description: "适合不同高度的内容" },
    { value: "carousel", label: "轮播布局", description: "适合浏览多个项目" },
    { value: "timeline", label: "时间线布局", description: "适合展示有序或时间相关的内容" },
    { value: "tabs", label: "标签页布局", description: "适合分类内容" },
    { value: "accordion", label: "手风琴布局", description: "适合需要展开/折叠的详细内容" }
  ];

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 标题 */}
        <h1 className="text-3xl font-bold text-center text-gray-800">
          AI 信息卡片生成器
        </h1>

        <p className="text-center text-gray-600">
          输入任何主题，AI将生成结构化的信息卡片，支持多种布局和样式
        </p>

        {/* 输入表单 */}
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <textarea
            className="w-full h-32 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="请输入您想要生成的信息卡片内容，例如：'如何建立自律习惯'"
            disabled={isLoading}
          />

          {/* 布局选择 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              选择布局样式（可选）
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {layoutOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedLayout(option.value as Layout["type"])}
                  className={`p-3 border rounded-lg text-left transition-colors ${selectedLayout === option.value
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200 text-gray-800"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

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
