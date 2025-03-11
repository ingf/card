"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/Card";
import { CardSchema } from "@/lib/schemas/card";
import type { Card as CardType, Layout } from "@/lib/schemas/card";
import { Sparkles, Loader2, Send, Clock, Download, Eye, ExternalLink } from "lucide-react";
import Link from "next/link";
import { getCardByKeyword } from "@/lib/mockData";

export default function Home() {
  const [error, setError] = useState<string>("");
  const [cardData, setCardData] = useState<CardType | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("simple-1");
  const [inputHistory, setInputHistory] = useState<string[]>([]);

  // 添加输入框引用，用于自动聚焦
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // 添加内容区域引用，用于自动滚动到底部
  const contentRef = useRef<HTMLDivElement>(null);

  // 自动聚焦输入框
  useEffect(() => {
    if (inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [isLoading, cardData]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!input.trim()) {
      setError("请输入内容");
      return;
    }

    setIsLoading(true);

    try {
      // 使用模拟数据
      const data = getCardByKeyword(input);

      // 设置卡片数据
      setCardData(data);
      setError("");
      // 添加到历史记录
      setInputHistory(prev => [input, ...prev]);
      // 清空输入框
      setInput("");
    } catch (e) {
      console.error("Error:", e);
      setError("生成失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  // 从历史记录中选择输入
  const selectHistoryInput = (historyItem: string) => {
    setInput(historyItem);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // 选择模板
  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
  };

  // 生成详情页链接
  const getDetailLink = (template: string) => {
    if (!cardData) return "#";
    return `/detail?template=${template}&title=${encodeURIComponent(cardData.title)}&id=${Date.now()}`;
  };

  // 模板配置
  const templates = [
    { id: "simple-1", name: "标准卡片" },
    { id: "simple-2", name: "大字封面" },
    { id: "simple-3", name: "AI拼图blog" },
    { id: "simple-4", name: "运营必知" }
  ];

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

      {/* 主内容区域 */}
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
            <div className="max-w-6xl mx-auto">
              {/* 用户输入显示 */}
              <div className="bg-blue-50 rounded-lg p-3 mb-4 border border-blue-100">
                <div className="flex items-start">
                  <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 mr-2">
                    U
                  </div>
                  <div className="flex-grow">
                    <p className="text-gray-800">{inputHistory[0] || input}</p>
                  </div>
                </div>
              </div>

              {/* AI 生成的卡片 - 标题 */}
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm p-3 border border-gray-100 mb-4">
                <div className="flex items-start mb-2">
                  <div className="w-7 h-7 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 mr-2">
                    AI
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{cardData.title}</h3>
                    {cardData.subtitle && (
                      <p className="text-gray-600 text-sm">{cardData.subtitle}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* 模板选择 */}
              <div className="mb-4">
                {/* 模板选择器 */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                  {/* 模板选择标签 */}
                  <div className="p-3 bg-gray-50 border-b border-gray-200 flex overflow-x-auto">
                    <button
                      onClick={() => handleTemplateSelect("simple-1")}
                      className={`px-4 py-2 mx-1 text-sm rounded-lg transition-all ${selectedTemplate === "simple-1"
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      标准卡片
                    </button>
                    <button
                      onClick={() => handleTemplateSelect("simple-2")}
                      className={`px-4 py-2 mx-1 text-sm rounded-lg transition-all ${selectedTemplate === "simple-2"
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      大字封面
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 flex justify-center items-center" style={{ minHeight: "500px" }}>
                {cardData && (
                  <div className="flex justify-center">
                    <div className="transform origin-center relative group">
                      {/* 悬停时显示的背景和按钮 */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center z-10">
                        <div className="flex gap-3">
                          <Link
                            href={`/preview?template=${selectedTemplate}&title=${encodeURIComponent(cardData.title)}&id=${Date.now()}`}
                            className="bg-white hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg flex items-center transition-colors"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            预览
                          </Link>
                          <Link
                            href={getDetailLink(selectedTemplate)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            使用
                          </Link>
                        </div>
                      </div>

                      {/* 移除原来的单独按钮 */}
                      <Card
                        data={{
                          ...cardData,
                          layout: { type: "carousel", columns: 1, alignment: "center", spacing: "medium", itemStyle: "card" }
                        }}
                        platformRatio="3:4"
                        posterFormat={selectedTemplate}
                        hideNavigation={true}
                      />
                    </div>
                  </div>
                )}
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
      <footer className="w-full py-2 text-center text-gray-500 text-xs">
        <p>AI 信息卡片生成器 © {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}
