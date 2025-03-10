"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/Card";
// import { LayoutSwitcher } from "@/components/LayoutSwitcher"; // 注释掉
import { CardSchema } from "@/lib/schemas/card";
import type { Card as CardType, Layout } from "@/lib/schemas/card";
import { Sparkles, Loader2, Send, Clock, Settings, ChevronDown, ChevronUp } from "lucide-react";

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
  // 添加输入历史记录状态
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  // 添加输入框引用，用于自动聚焦
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // 添加内容区域引用，用于自动滚动到底部
  const contentRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [cardData]);

  // 自动聚焦输入框
  useEffect(() => {
    if (inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [isLoading, cardData]);

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
      // 将当前输入添加到历史记录
      setInputHistory(prev => [input, ...prev.slice(0, 9)]);

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
      // 清空输入框
      setInput("");
    } catch (e) {
      console.error("Error:", e);
      setError("生成失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  // 移除布局切换相关函数
  // const switchCardLayout = (layoutType: Layout["type"]) => { ... }; // 注释掉

  // 从历史记录中选择输入
  const selectHistoryInput = (historyItem: string) => {
    setInput(historyItem);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

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
  } as const;

  // 定义平台配置类型
  type PlatformConfigKey = keyof typeof platformConfigs;

  // 修改 handlePlatformChange 函数，移除布局切换逻辑
  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform);

    // 从平台配置中获取对应的比例
    const config = platformConfigs[platform as PlatformConfigKey] || platformConfigs.default;
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

  // 切换设置面板显示状态
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex flex-col">
      {/* 标题区域 */}
      <div className="text-center py-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="inline-flex items-center justify-center">
          <Sparkles className="h-6 w-6 text-blue-500 mr-2" />
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            AI 信息卡片生成器
          </h1>
        </div>
      </div>

      {/* 主内容区域 - 类似 Claude/Grok3 的布局 */}
      <div className="flex-grow flex flex-col overflow-hidden">
        {/* 聊天内容区域 */}
        <div
          ref={contentRef}
          className="flex-grow overflow-y-auto px-4 py-6 space-y-6"
        >
          {/* 欢迎信息 */}
          {!cardData && !isLoading && (
            <div className="max-w-3xl mx-auto text-center py-8">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-10 w-10 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">AI 信息卡片生成器</h2>
              <p className="text-gray-600 text-lg mb-6 max-w-xl mx-auto">
                在下方输入任何主题，AI 将为您生成结构化的信息卡片
              </p>
              <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">📝</div>
                  <div className="text-sm text-gray-700">输入内容</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">✨</div>
                  <div className="text-sm text-gray-700">AI 生成</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">🎨</div>
                  <div className="text-sm text-gray-700">自定义样式</div>
                </div>
              </div>
            </div>
          )}

          {/* 加载状态 */}
          {isLoading && (
            <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 border border-gray-100 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                </div>
                <p className="text-gray-700">AI 正在生成信息卡片，请稍候...</p>
              </div>
            </div>
          )}

          {/* 生成的卡片内容 */}
          {cardData && (
            <div className="max-w-4xl mx-auto">
              {/* 用户输入显示 */}
              <div className="bg-blue-50 rounded-lg p-3 mb-4 border border-blue-100">
                <div className="flex items-start">
                  <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 mr-2">
                    U
                  </div>
                  <div className="flex-grow">
                    <p className="text-gray-800">{inputHistory[0]}</p>
                  </div>
                </div>
              </div>

              {/* AI 生成的卡片 */}
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm p-4 border border-gray-100">
                <div className="flex items-start mb-3">
                  <div className="w-7 h-7 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 mr-2">
                    AI
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{cardData.title}</h3>
                    {cardData.subtitle && (
                      <p className="text-gray-600 text-sm mb-2">{cardData.subtitle}</p>
                    )}
                  </div>
                </div>

                {/* 设置面板切换按钮 */}
                <div className="mb-2">
                  <button
                    onClick={toggleSettings}
                    className="flex items-center text-xs text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <Settings className="h-3 w-3 mr-1" />
                    <span>显示设置</span>
                    {showSettings ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                  </button>
                </div>

                {/* 设置面板 */}
                {showSettings && (
                  <div className="mb-3 p-2 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* 平台选择 */}
                      <div>
                        <h4 className="text-xs font-medium text-gray-700 mb-1">选择平台预览</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                          {Object.entries(platformConfigs).map(([key, config]) => (
                            <button
                              key={key}
                              onClick={() => handlePlatformChange(key)}
                              className={`flex items-center justify-between px-2 py-1 rounded-md transition-all text-xs ${selectedPlatform === key
                                ? `${config.color} text-white`
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                              <div className="flex items-center">
                                <span className="mr-1 text-sm">{config.icon}</span>
                                <span>{config.name}</span>
                              </div>
                              <div className="text-xs opacity-80">
                                {config.ratio !== "default" && config.ratio}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 海报格式选择 */}
                      <div>
                        <h4 className="text-xs font-medium text-gray-700 mb-1">选择海报格式</h4>
                        <div className="flex flex-wrap gap-1">
                          <button
                            onClick={() => handlePosterFormatChange("standard")}
                            className={`px-2 py-1 rounded-md transition-all text-xs ${posterFormat === "standard"
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                          >
                            <div className="flex items-center">
                              <span className="mr-1">📄</span>
                              <span>标准卡片</span>
                            </div>
                          </button>
                          <button
                            onClick={() => handlePosterFormatChange("simple")}
                            className={`px-2 py-1 rounded-md transition-all text-xs ${posterFormat === "simple"
                              ? "bg-green-500 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                          >
                            <div className="flex items-center">
                              <span className="mr-1">🪧</span>
                              <span>简单海报</span>
                            </div>
                          </button>
                          <button
                            onClick={() => handlePosterFormatChange("complex")}
                            className={`px-2 py-1 rounded-md transition-all text-xs ${posterFormat === "complex"
                              ? "bg-purple-500 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                          >
                            <div className="flex items-center">
                              <span className="mr-1">🖼️</span>
                              <span>复杂海报</span>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 平台预览提示 */}
                {selectedPlatform !== "default" && (
                  <div className="mb-2 p-1.5 bg-blue-50 text-blue-700 rounded-md text-xs flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>
                      当前预览: <strong>{platformConfigs[selectedPlatform as PlatformConfigKey]?.name || "默认"}</strong>
                      {selectedRatio !== "default" && <span className="ml-1">({selectedRatio})</span>}
                    </span>
                  </div>
                )}

                {/* 渲染卡片 */}
                <div className="mx-auto transition-all duration-300 flex items-center justify-center py-4">
                  {renderCardWithLayout()}
                </div>
              </div>
            </div>
          )}

          {/* 错误提示 */}
          {error && (
            <div className="max-w-3xl mx-auto p-3 text-red-500 bg-red-50 rounded-xl border border-red-200 animate-fade-in shadow-sm">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}
        </div>

        {/* 底部输入区域 */}
        <div className="border-t border-gray-200 bg-white/90 backdrop-blur-sm p-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleFormSubmit} className="relative">
              <textarea
                ref={inputRef}
                className="w-full p-3 pr-16 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white/50 backdrop-blur-sm transition-all resize-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="输入您想要生成的信息卡片内容，例如：'如何建立自律习惯'、'健康饮食的五个关键点'..."
                disabled={isLoading}
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (input.trim()) {
                      handleFormSubmit(e);
                    }
                  }
                }}
              />
              <button
                type="submit"
                className="absolute right-2 bottom-2 px-3 py-2 text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </form>

            {/* 历史记录快捷访问 */}
            {inputHistory.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {inputHistory.slice(0, 3).map((item, index) => (
                  <button
                    key={index}
                    onClick={() => selectHistoryInput(item)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors truncate max-w-xs"
                  >
                    <Clock className="h-3 w-3 inline mr-1" />
                    {item.length > 30 ? item.substring(0, 30) + "..." : item}
                  </button>
                ))}
                {inputHistory.length > 3 && (
                  <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors">
                    +{inputHistory.length - 3} 更多
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="w-full py-2 text-center text-gray-500 text-sm">
        <p>AI 信息卡片生成器 © {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}
