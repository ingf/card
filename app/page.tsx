"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/Card";
import { CardSchema } from "@/lib/schemas/card";
import type { Card as CardType, Layout } from "@/lib/schemas/card";
import { Sparkles, Loader2, Send, Clock, Download, Eye, ExternalLink, X } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [error, setError] = useState<string>("");
  const [cardData, setCardData] = useState<CardType | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [posterFormat, setPosterFormat] = useState<string>("standard");
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("standard");
  const [showPreview, setShowPreview] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<string>("standard");

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

  // 从历史记录中选择输入
  const selectHistoryInput = (historyItem: string) => {
    setInput(historyItem);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // 添加海报格式选择函数
  const handlePosterFormatChange = (format: string) => {
    setPosterFormat(format);
  };

  // 添加选择模板的处理函数
  const handleTemplateSelect = (template: string, format?: string) => {
    setSelectedTemplate(template);

    // 如果提供了格式，则更新格式
    if (format) {
      handlePosterFormatChange(format);
    }
  };

  // 打开预览弹窗
  const openPreview = (template: string) => {
    setPreviewTemplate(template);
    setShowPreview(true);
  };

  // 关闭预览弹窗
  const closePreview = () => {
    setShowPreview(false);
  };

  // 生成详情页链接
  const getDetailLink = (template: string) => {
    if (!cardData) return "#";
    return `/detail?template=${template}&title=${encodeURIComponent(cardData.title)}&id=${Date.now()}`;
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
            <div className="max-w-6xl mx-auto">
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

              {/* 多种模板展示 - 网格布局 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 标准卡片模板 */}
                <div className={`bg-white rounded-lg shadow-md overflow-hidden border ${selectedTemplate === "standard" ? "border-blue-400 ring-2 ring-blue-200" : "border-gray-200"} hover:shadow-lg transition-all flex flex-col h-full`}>
                  <div className="p-2 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
                    <span className="text-xs font-medium text-blue-700">标准卡片</span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => openPreview("standard")}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-0.5 rounded flex items-center"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        预览
                      </button>
                      <button
                        onClick={() => handleTemplateSelect("standard", "standard")}
                        className={`text-xs ${selectedTemplate === "standard" ? "bg-blue-600" : "bg-blue-500"} text-white px-2 py-0.5 rounded flex items-center`}
                      >
                        {selectedTemplate === "standard" ? "已选择" : "选择"}
                      </button>
                    </div>
                  </div>
                  <div className="p-3 flex-grow flex justify-center items-center">
                    <div className="w-full h-full flex items-center justify-center">
                      {cardData && (
                        <div className="transform scale-90 origin-center">
                          <Card
                            data={{
                              ...cardData,
                              layout: { type: "carousel", columns: 1, alignment: "center", spacing: "medium", itemStyle: "card" }
                            }}
                            platformRatio="default"
                            posterFormat="standard"
                            hideNavigation={true}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-2 bg-gray-50 border-t border-gray-100 flex justify-center">
                    <Link
                      href={getDetailLink("standard")}
                      className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full flex items-center"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      使用此模板
                    </Link>
                  </div>
                </div>

                {/* 简单海报模板 */}
                <div className={`bg-white rounded-lg shadow-md overflow-hidden border ${selectedTemplate === "simple" ? "border-green-400 ring-2 ring-green-200" : "border-gray-200"} hover:shadow-lg transition-all flex flex-col h-full`}>
                  <div className="p-2 bg-green-50 border-b border-green-100 flex justify-between items-center">
                    <span className="text-xs font-medium text-green-700">简单海报</span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => openPreview("simple")}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-0.5 rounded flex items-center"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        预览
                      </button>
                      <button
                        onClick={() => handleTemplateSelect("simple", "simple")}
                        className={`text-xs ${selectedTemplate === "simple" ? "bg-green-600" : "bg-green-500"} text-white px-2 py-0.5 rounded flex items-center`}
                      >
                        {selectedTemplate === "simple" ? "已选择" : "选择"}
                      </button>
                    </div>
                  </div>
                  <div className="p-3 flex-grow flex justify-center items-center">
                    <div className="w-full h-full flex items-center justify-center">
                      {cardData && (
                        <div className="transform scale-90 origin-center">
                          <Card
                            data={{
                              ...cardData,
                              layout: { type: "carousel", columns: 1, alignment: "center", spacing: "medium", itemStyle: "card" }
                            }}
                            platformRatio="default"
                            posterFormat="simple"
                            hideNavigation={true}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-2 bg-gray-50 border-t border-gray-100 flex justify-center">
                    <Link
                      href={getDetailLink("simple")}
                      className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full flex items-center"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      使用此模板
                    </Link>
                  </div>
                </div>

                {/* 复杂海报模板 */}
                <div className={`bg-white rounded-lg shadow-md overflow-hidden border ${selectedTemplate === "complex" ? "border-purple-400 ring-2 ring-purple-200" : "border-gray-200"} hover:shadow-lg transition-all flex flex-col h-full`}>
                  <div className="p-2 bg-purple-50 border-b border-purple-100 flex justify-between items-center">
                    <span className="text-xs font-medium text-purple-700">复杂海报</span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => openPreview("complex")}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-0.5 rounded flex items-center"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        预览
                      </button>
                      <button
                        onClick={() => handleTemplateSelect("complex", "complex")}
                        className={`text-xs ${selectedTemplate === "complex" ? "bg-purple-600" : "bg-purple-500"} text-white px-2 py-0.5 rounded flex items-center`}
                      >
                        {selectedTemplate === "complex" ? "已选择" : "选择"}
                      </button>
                    </div>
                  </div>
                  <div className="p-3 flex-grow flex justify-center items-center">
                    <div className="w-full h-full flex items-center justify-center">
                      {cardData && (
                        <div className="transform scale-90 origin-center">
                          <Card
                            data={{
                              ...cardData,
                              layout: { type: "carousel", columns: 1, alignment: "center", spacing: "medium", itemStyle: "card" }
                            }}
                            platformRatio="default"
                            posterFormat="complex"
                            hideNavigation={true}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-2 bg-gray-50 border-t border-gray-100 flex justify-center">
                    <Link
                      href={getDetailLink("complex")}
                      className="text-xs bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-full flex items-center"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      使用此模板
                    </Link>
                  </div>
                </div>
              </div>

              {/* 下载按钮 */}
              <div className="mt-4 flex justify-center">
                <button
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-full text-sm text-white transition-colors inline-flex items-center"
                  onClick={() => {
                    // 这里可以添加下载功能
                    alert('下载功能将在后续版本中实现');
                  }}
                >
                  <Download className="h-4 w-4 mr-1" />
                  下载选中模板
                </button>
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

      {/* 预览弹窗 */}
      {showPreview && cardData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-lg">
                {previewTemplate === "standard" && "标准卡片预览"}
                {previewTemplate === "simple" && "简单海报预览"}
                {previewTemplate === "complex" && "复杂海报预览"}
              </h3>
              <button
                onClick={closePreview}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-grow overflow-y-auto p-4 flex items-center justify-center">
              <div className="w-full" style={{ maxWidth: "375px" }}>
                <Card
                  data={{
                    ...cardData,
                    layout: { type: "carousel", columns: 1, alignment: "center", spacing: "medium", itemStyle: "card" }
                  }}
                  platformRatio="9:16"
                  posterFormat={previewTemplate}
                  hideNavigation={false}
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <Link
                href={getDetailLink(previewTemplate)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                使用此模板
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 页脚 */}
      <footer className="w-full py-2 text-center text-gray-500 text-xs">
        <p>AI 信息卡片生成器 © {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}
