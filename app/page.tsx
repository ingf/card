"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
// import { LayoutSwitcher } from "@/components/LayoutSwitcher"; // 注释掉
import { CardSchema } from "@/lib/schemas/card";
import type { Card as CardType, Layout } from "@/lib/schemas/card";
import { Sparkles, Loader2, Send } from "lucide-react";

export default function Home() {
  const [error, setError] = useState<string>("");
  const [cardData, setCardData] = useState<CardType | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [selectedLayout, setSelectedLayout] = useState<Layout["type"]>("grid"); // 注释掉
  // const [activeViewLayout, setActiveViewLayout] = useState<Layout["type"] | null>(null); // 注释掉
  // const [isLayoutChanging, setIsLayoutChanging] = useState(false); // 注释掉
  const [selectedPlatform, setSelectedPlatform] = useState<string>("default");
  const [selectedRatio, setSelectedRatio] = useState<string>("default");
  const [posterFormat, setPosterFormat] = useState<string>("standard");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCardData(null);
    // setActiveViewLayout(null); // 注释掉

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

      // 默认设置为轮播布局
      validatedData.layout = {
        type: "carousel",
        columns: 1,
        alignment: "center",
        spacing: "medium",
        itemStyle: "card"
      };

      // 设置卡片数据
      setCardData(validatedData);
      setError("");
    } catch (e) {
      console.error("Error:", e);
      setError("生成失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  // 移除布局切换相关函数
  // const switchCardLayout = (layoutType: Layout["type"]) => { ... }; // 注释掉

  // 渲染卡片视图
  const renderCardWithLayout = () => {
    if (!cardData) return null;
    return <Card data={cardData} platformRatio={selectedRatio} posterFormat={posterFormat} />;
  };

  // 定义平台配置对象，包含名称、颜色、比例和图标
  const platformConfigs = {
    default: {
      name: "默认",
      color: "bg-blue-500",
      ratio: "default",
      icon: "🌐"
    },
    xiaohongshu: {
      name: "小红书",
      color: "bg-red-500",
      ratio: "4:5",
      icon: "📱"
    },
    douyin: {
      name: "抖音",
      color: "bg-black",
      ratio: "9:16",
      icon: "📹"
    },
    twitter: {
      name: "Twitter",
      color: "bg-blue-400",
      ratio: "4:3",
      icon: "🐦"
    },
    weibo: {
      name: "微博",
      color: "bg-yellow-600",
      ratio: "3:4",
      icon: "📰"
    },
    instagram: {
      name: "Instagram",
      color: "bg-pink-500",
      ratio: "1:1",
      icon: "📷"
    },
    facebook: {
      name: "Facebook",
      color: "bg-blue-600",
      ratio: "16:9",
      icon: "👥"
    }
  };

  // 修改 handlePlatformChange 函数，移除布局切换逻辑
  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform);

    // 从平台配置中获取对应的比例
    const config = platformConfigs[platform as keyof typeof platformConfigs] || platformConfigs.default;
    setSelectedRatio(config.ratio);

    // 如果已有卡片数据，保持轮播布局
    if (cardData) {
      setCardData({
        ...cardData,
        layout: {
          type: "carousel",
          columns: 1,
          spacing: "medium",
          alignment: "center",
          itemStyle: "card"
        }
      });
    }
  };

  // 添加海报格式选择函数
  const handlePosterFormatChange = (format: string) => {
    setPosterFormat(format);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex flex-col">
      <div className="flex-grow flex flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 标题区域 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-blue-500 mr-2" />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              AI 信息卡片生成器
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            输入任何主题，AI 将为您生成结构化的信息卡片，支持多种平台预览
          </p>
        </div>

        {/* 输入表单 */}
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

        {/* 错误提示 */}
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

        {/* 卡片展示 */}
        {cardData && (
          <div className="space-y-6 animate-fade-in flex-grow flex flex-col">
            {/* 平台选择器 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-4 border border-gray-100">
              <div className="flex flex-col space-y-2">
                <h3 className="text-sm font-medium text-gray-700 mb-2">选择平台预览</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {Object.entries(platformConfigs).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => handlePlatformChange(key)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all ${selectedPlatform === key
                        ? `${config.color} text-white`
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      <div className="flex items-center">
                        <span className="mr-2 text-lg">{config.icon}</span>
                        <span>{config.name}</span>
                      </div>
                      <div className="text-xs opacity-80">
                        {config.ratio !== "default" && config.ratio}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 海报格式选择器 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-4 border border-gray-100 mt-4">
              <div className="flex flex-col space-y-2">
                <h3 className="text-sm font-medium text-gray-700 mb-2">选择海报格式</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handlePosterFormatChange("standard")}
                    className={`px-3 py-2 rounded-lg transition-all ${posterFormat === "standard"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-2">📄</span>
                      <span>标准卡片</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handlePosterFormatChange("simple")}
                    className={`px-3 py-2 rounded-lg transition-all ${posterFormat === "simple"
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-2">🪧</span>
                      <span>简单海报</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handlePosterFormatChange("complex")}
                    className={`px-3 py-2 rounded-lg transition-all ${posterFormat === "complex"
                        ? "bg-purple-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-2">🖼️</span>
                      <span>复杂海报</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* 卡片内容 */}
            <div
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 transition-all duration-300 flex-grow border border-gray-100 overflow-hidden"
              style={{ minHeight: "700px" }}
            >
              {/* 平台预览提示 */}
              {selectedPlatform !== "default" && (
                <div className="mb-4 p-2 bg-blue-50 text-blue-700 rounded-lg text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>
                    当前预览适配于: <strong>{platformConfigs[selectedPlatform]?.name || "默认"}</strong>
                    {selectedRatio !== "default" && <span className="ml-1">({selectedRatio})</span>}
                  </span>
                </div>
              )}

              {/* 渲染卡片 */}
              <div className="mx-auto transition-all duration-300 flex items-center justify-center" style={{ minHeight: "600px" }}>
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
