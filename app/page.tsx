"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/Card";
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
          ...validatedData.layout,
          type: selectedLayout
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

  // 布局预览图渲染函数
  const renderLayoutPreview = (layoutType: Layout["type"]) => {
    switch (layoutType) {
      case "grid":
        return (
          <div className="layout-preview grid-preview">
            <div className="preview-item"></div>
            <div className="preview-item"></div>
            <div className="preview-item"></div>
            <div className="preview-item"></div>
          </div>
        );
      case "list":
        return (
          <div className="layout-preview list-preview">
            <div className="preview-item"></div>
            <div className="preview-item"></div>
            <div className="preview-item"></div>
          </div>
        );
      case "masonry":
        return (
          <div className="layout-preview masonry-preview">
            <div className="preview-item" style={{ height: '18px' }}></div>
            <div className="preview-item" style={{ height: '24px' }}></div>
            <div className="preview-item" style={{ height: '16px' }}></div>
            <div className="preview-item" style={{ height: '20px' }}></div>
          </div>
        );
      case "carousel":
        return (
          <div className="layout-preview carousel-preview">
            <div className="preview-item active"></div>
            <div className="preview-dots">
              <span className="active"></span>
              <span></span>
              <span></span>
            </div>
          </div>
        );
      case "timeline":
        return (
          <div className="layout-preview timeline-preview">
            <div className="timeline-line"></div>
            <div className="preview-item"></div>
            <div className="preview-item"></div>
            <div className="preview-item"></div>
          </div>
        );
      case "tabs":
        return (
          <div className="layout-preview tabs-preview">
            <div className="tabs-header">
              <span className="active"></span>
              <span></span>
              <span></span>
            </div>
            <div className="preview-item"></div>
          </div>
        );
      case "accordion":
        return (
          <div className="layout-preview accordion-preview">
            <div className="preview-item open"></div>
            <div className="preview-item closed"></div>
            <div className="preview-item closed"></div>
          </div>
        );
      case "education":
        return (
          <div className="layout-preview education-preview">
            <div className="preview-header"></div>
            <div className="preview-item with-number"></div>
            <div className="preview-item with-number"></div>
          </div>
        );
      case "finance":
        return (
          <div className="layout-preview finance-preview">
            <div className="preview-dots"></div>
            <div className="preview-item with-dot"></div>
            <div className="preview-item with-dot"></div>
          </div>
        );
      default:
        return null;
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
    { value: "accordion", label: "手风琴布局", description: "适合需要展开/折叠的详细内容" },
    { value: "education", label: "教育模板", description: "适合教学内容和课程大纲" },
    { value: "finance", label: "金融模板", description: "适合金融知识和问答形式" }
  ];

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
        ...(cardData.layout || {}),
        type: activeViewLayout || "grid"
      }
    };

    return <Card data={cardWithLayout} />;
  };

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
          <div className="space-y-6 animate-fade-in">
            {/* 布局切换器 - 优化后的UI */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-700">切换布局视图：</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-px bg-gray-100">
                {layoutOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => switchCardLayout(option.value as Layout["type"])}
                    className={`flex flex-col items-center py-3 px-2 transition-all ${activeViewLayout === option.value
                      ? "bg-blue-50 border-t-2 border-blue-500"
                      : "bg-white hover:bg-gray-50"
                      }`}
                    disabled={isLayoutChanging}
                  >
                    <div className="w-12 h-12 mb-2 flex items-center justify-center">
                      {renderLayoutPreview(option.value as Layout["type"])}
                    </div>
                    <span className={`text-xs font-medium ${activeViewLayout === option.value ? "text-blue-600" : "text-gray-700"
                      }`}>
                      {option.label}
                    </span>
                    <span className="text-xs text-gray-500 mt-1 text-center line-clamp-1">
                      {option.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 移动端布局切换器 */}
            <div className="md:hidden bg-white rounded-lg shadow-sm p-3 border border-gray-100 overflow-x-auto scrollbar-hide">
              <div className="flex space-x-2 min-w-max">
                {layoutOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => switchCardLayout(option.value as Layout["type"])}
                    className={`flex items-center px-3 py-2 rounded-full transition-all ${activeViewLayout === option.value
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    disabled={isLayoutChanging}
                  >
                    <span className="w-4 h-4 mr-1.5 flex-shrink-0">
                      {renderLayoutPreview(option.value as Layout["type"])}
                    </span>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 卡片内容 */}
            <div className={`bg-white rounded-xl shadow-lg p-6 transition-opacity duration-300 ${isLayoutChanging ? 'opacity-50' : 'opacity-100'}`}>
              {renderCardWithLayout()}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
