"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/Card";
import { LayoutSwitcher } from "@/components/LayoutSwitcher";
import { CardSchema } from "@/lib/schemas/card";
import type { Card as CardType, Layout } from "@/lib/schemas/card";

export default function Home() {
  const [error, setError] = useState<string>("");
  const [cardData, setCardData] = useState<CardType | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState<Layout["type"]>("grid");
  const [activeViewLayout, setActiveViewLayout] = useState<Layout["type"] | null>(null);
  const [isLayoutChanging, setIsLayoutChanging] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCardData(null);
    setActiveViewLayout(null);

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
          type: selectedLayout,
          columns: validatedData.layout?.columns || 3,
          alignment: validatedData.layout?.alignment || "center",
          spacing: validatedData.layout?.spacing || "medium",
          itemStyle: validatedData.layout?.itemStyle || "card"
        };
      }

      // 设置初始视图布局为生成的布局
      setActiveViewLayout(validatedData.layout?.type || "grid");
      setCardData(validatedData);
      setError("");
    } catch (e) {
      console.error("Error:", e);
      setError("生成失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  // 切换卡片视图布局
  const switchCardLayout = (layoutType: Layout["type"]) => {
    if (!cardData || activeViewLayout === layoutType) return;

    setIsLayoutChanging(true);

    // 添加短暂延迟以便动画效果更明显
    setTimeout(() => {
      setActiveViewLayout(layoutType);
      setIsLayoutChanging(false);
    }, 300);
  };

  // 渲染卡片视图
  const renderCardWithLayout = () => {
    if (!cardData) return null;

    // 创建一个新的卡片数据对象，使用当前选择的布局
    const cardWithLayout: CardType = {
      ...cardData,
      layout: {
        type: activeViewLayout || "grid",
        columns: cardData.layout?.columns || 3,
        alignment: cardData.layout?.alignment || "center",
        spacing: cardData.layout?.spacing || "medium",
        itemStyle: cardData.layout?.itemStyle || "card"
      }
    };

    return <Card data={cardWithLayout} />;
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow flex flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 标题 */}
        <h1 className="text-3xl font-bold text-center text-gray-800">
          AI 信息卡片生成器
        </h1>

        <p className="text-center text-gray-600 mt-2 mb-8">
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
          <div className="space-y-6 animate-fade-in flex-grow flex flex-col">
            {/* 布局切换器组件 */}
            <LayoutSwitcher
              activeLayout={activeViewLayout}
              onLayoutChange={switchCardLayout}
              isChanging={isLayoutChanging}
            />

            {/* 卡片内容 */}
            <div className={`bg-white rounded-xl shadow-lg p-6 transition-opacity duration-300 flex-grow ${isLayoutChanging ? 'opacity-50' : 'opacity-100'}`}>
              {renderCardWithLayout()}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
