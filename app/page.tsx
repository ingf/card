"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { LayoutSwitcher } from "@/components/LayoutSwitcher";
import { CardSchema } from "@/lib/schemas/card";
import type { Card as CardType, Layout } from "@/lib/schemas/card";
import { Sparkles, Loader2, Send } from "lucide-react";

export default function Home() {
  const [error, setError] = useState<string>("");
  const [cardData, setCardData] = useState<CardType | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState<Layout["type"]>("grid");
  const [activeViewLayout, setActiveViewLayout] = useState<Layout["type"] | null>(null);
  const [isLayoutChanging, setIsLayoutChanging] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("default");

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

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform);
    // 如果已有卡片数据，可以根据平台调整布局
    if (cardData) {
      // 根据不同平台设置不同的布局参数
      const platformLayouts: Record<string, Partial<Layout>> = {
        xiaohongshu: { type: "carousel", columns: 1, spacing: "medium", itemStyle: "card" },
        douyin: { type: "carousel", columns: 1, spacing: "small", itemStyle: "minimal" },
        twitter: { type: "carousel", columns: 1, spacing: "large", itemStyle: "card" },
        weibo: { type: "carousel", columns: 1, spacing: "medium", itemStyle: "bordered" },
        default: { type: activeViewLayout || "grid", columns: 3, spacing: "medium", itemStyle: "card" }
      };

      setActiveViewLayout("carousel");

      // 更新卡片布局
      const newLayout = platformLayouts[platform] || platformLayouts.default;
      setCardData({
        ...cardData,
        layout: {
          ...cardData.layout,
          ...newLayout
        }
      });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex flex-col">
      <div className="flex-grow flex flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 标题区域 - 更现代的设计 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-blue-500 mr-2" />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              AI 信息卡片生成器
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            输入任何主题，AI 将为您生成结构化的信息卡片，支持多种布局和样式
          </p>
        </div>

        {/* 输入表单 - 更现代的设计 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="relative">
              <textarea
                className="w-full h-36 p-5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white/50 backdrop-blur-sm transition-all"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="请输入您想要生成的信息卡片内容，例如：'如何建立自律习惯'、'健康饮食的五个关键点'..."
                disabled={isLoading}
              />
              {input.length > 0 && !isLoading && (
                <span className="absolute right-4 bottom-4 text-xs text-gray-400">
                  {input.length} 个字符
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full px-6 py-4 text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>AI 正在生成中...</span>
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>生成卡片</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* 错误提示 - 更现代的设计 */}
        {error && (
          <div className="p-4 text-red-500 bg-red-50 rounded-xl border border-red-200 mb-8 animate-fade-in shadow-sm">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* 卡片展示 - 修改为横向滑动布局 */}
        {cardData && (
          <div className="space-y-6 animate-fade-in flex-grow flex flex-col">
            {/* 平台选择器 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-4 border border-gray-100">
              <div className="flex flex-col space-y-2">
                <h3 className="text-sm font-medium text-gray-700 mb-2">选择平台适配</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handlePlatformChange("default")}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-all ${selectedPlatform === "default"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    默认
                  </button>
                  <button
                    onClick={() => handlePlatformChange("xiaohongshu")}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-all ${selectedPlatform === "xiaohongshu"
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    小红书
                  </button>
                  <button
                    onClick={() => handlePlatformChange("douyin")}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-all ${selectedPlatform === "douyin"
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    抖音
                  </button>
                  <button
                    onClick={() => handlePlatformChange("twitter")}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-all ${selectedPlatform === "twitter"
                        ? "bg-blue-400 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    Twitter
                  </button>
                  <button
                    onClick={() => handlePlatformChange("weibo")}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-all ${selectedPlatform === "weibo"
                        ? "bg-yellow-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    微博
                  </button>
                </div>
              </div>
            </div>

            {/* 布局切换器组件 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-4 border border-gray-100">
              <LayoutSwitcher
                activeLayout={activeViewLayout}
                onLayoutChange={switchCardLayout}
                isChanging={isLayoutChanging}
              />
            </div>

            {/* 卡片内容 - 修改为横向滑动布局 */}
            <div
              className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 transition-all duration-300 flex-grow border border-gray-100 overflow-hidden ${isLayoutChanging ? 'opacity-50 scale-98' : 'opacity-100 scale-100'
                }`}
            >
              {/* 平台预览提示 */}
              {selectedPlatform !== "default" && (
                <div className="mb-4 p-2 bg-blue-50 text-blue-700 rounded-lg text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>当前预览适配于: <strong>{
                    selectedPlatform === "xiaohongshu" ? "小红书" :
                      selectedPlatform === "douyin" ? "抖音" :
                        selectedPlatform === "twitter" ? "Twitter" :
                          selectedPlatform === "weibo" ? "微博" : "默认"
                  }</strong></span>
                </div>
              )}

              {/* 渲染卡片 */}
              <div className={`
                ${selectedPlatform === "xiaohongshu" ? "max-w-[375px]" :
                  selectedPlatform === "douyin" ? "max-w-[360px]" :
                    selectedPlatform === "twitter" ? "max-w-[500px]" :
                      selectedPlatform === "weibo" ? "max-w-[450px]" : "w-full"}
                mx-auto transition-all duration-300
              `}>
                {renderCardWithLayout()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 页脚 */}
      <footer className="w-full py-4 text-center text-gray-500 text-sm">
        <p>AI 信息卡片生成器 © {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}
