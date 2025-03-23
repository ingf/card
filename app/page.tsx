"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/Card";
import type { CardSchema as CardType, CardType as CardTypeEnum } from "@/lib/schemas/card";
import { Sparkles, Loader2, Send, Clock, Eye, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useSessionStorage } from "@/lib/hooks/useSessionStorage";

export default function Home() {
  const [error, setError] = useState<string>("");
  const [cardDataMap, setCardDataMap] = useSessionStorage<Partial<Record<CardTypeEnum, CardType | null>>>('cardDataMap', {
    // basic: { "title": "健康饮食的五要点", "subtitle": "均衡摄取营养，守护健康生活", "description": "通过科学的饮食规划，达到增强体质与愉悦身心的效果。这些要点将帮助您构筑健康的饮食品质。", "footer": { "text": "饮食健康从现在开始！", "showAttribution": true, "links": [] }, "type": "basic", "layout": { "type": "grid", "columns": 2, "alignment": "left", "spacing": "medium", "itemStyle": "card", "showDividers": false, "showNumbers": true, "showIcons": true, "animation": "none", "maxHeight": "600px", "aspectRatio": "16:9" }, "items": [{ "id": 1, "title": "多样化食物选择", "description": "每天摄取各类食品，如谷物、蔬菜、水果、蛋白质等，以供给身体所需的各种营养物质，促进整体健康发展。", "icon": { "type": "emoji", "value": "🥗", "style": { "size": 24, "color": "#4CAF50", "backgroundColor": "#F0FFF0" } }, "highlight": false, "style": { "backgroundColor": "#FAFAFA", "borderColor": "#CCCCCC", "textColor": "#333333", "padding": "10px", "borderRadius": "8px", "shadow": "sm" }, "tags": ["营养", "食物多样性"], "link": { "url": "https://nutrition.org.cn", "text": "阅读更多", "isExternal": true }, "type": "basic" }, { "id": 2, "title": "控制盐糖摄入", "description": "减少高盐高糖食物的消费，有助于预防高血压和糖尿病，维护心血管系统的健康状态。", "icon": { "type": "lucide", "value": "salt", "style": { "size": 24, "color": "#FF7043", "backgroundColor": "#FFF3E0" } }, "highlight": false, "style": { "backgroundColor": "#FFFDF0", "borderColor": "#E0E0E0", "textColor": "#5D4037", "padding": "10px", "borderRadius": "8px", "shadow": "sm" }, "tags": ["低糖低钠"], "link": { "url": "https://health.gov.com", "text": "了解详情", "isExternal": true }, "type": "basic" }, { "id": 3, "title": "定时定量进食", "description": "规律饮食时间，避免暴饮暴食，有助于稳定内分泌系统并保持健康的体重管理。", "icon": { "type": "emoji", "value": "⏲️", "style": { "size": 24, "color": "#FFEB3B", "backgroundColor": "#FFFDE7" } }, "highlight": false, "style": { "backgroundColor": "#FFC107", "borderColor": "#FFCA28", "textColor": "#212121", "padding": "10px", "borderRadius": "8px", "shadow": "sm" }, "tags": ["饮食规律"], "link": { "url": "https://regular-eating.info", "text": "进一步了解", "isExternal": true }, "type": "basic" }, { "id": 4, "title": "多饮水少饮酒", "description": "适量饮水以促进体内新陈代谢，减少酒精类饮品的摄入量，有助于保持良好的肾脏功能和整体健康。", "icon": { "type": "emoji", "value": "💧", "style": { "size": 24, "color": "#2196F3", "backgroundColor": "#E3F2FD" } }, "highlight": false, "style": { "backgroundColor": "#E3F2FD", "borderColor": "#BBDEFB", "textColor": "#0D47A1", "padding": "10px", "borderRadius": "8px", "shadow": "sm" }, "tags": ["健康饮品"], "link": { "url": "https://drink-water-well.com", "text": "浏览建议", "isExternal": true }, "type": "basic" }] },
    // list: { "title": "健康饮食提高生活质量", "subtitle": "通过科学饮食改善身体与精神健康", "description": "介绍健康饮食的五个关键策略，为提升身体健康及生活品质奠定基础。", "footer": { "text": "关注健康饮食，身体更有活力。", "showAttribution": true, "links": [] }, "type": "list", "layout": { "type": "list", "columns": 1, "alignment": "center", "spacing": "medium", "itemStyle": "card", "showDividers": true, "showNumbers": true, "showIcons": true, "animation": "fade", "maxHeight": "none", "aspectRatio": "auto" }, "items": [{ "id": 1, "title": "均衡饮食", "description": "确保每天摄取多样化的食物以满足身体的营养需求，避免营养不良或过剩。", "icon": { "type": "emoji", "value": "🥗", "style": { "size": 26, "color": "#34a853", "backgroundColor": "#f5f5f5" } }, "highlight": false, "style": { "backgroundColor": "#f9f9f9", "borderColor": "#dddddd", "textColor": "#333333", "padding": "20px", "borderRadius": "8px", "shadow": "sm" }, "tags": ["营养", "健康", "均衡"], "link": { "url": "https://www.healthyeating.org", "text": "了解更多", "isExternal": true }, "type": "list", "bulletPoints": ["食物多样化以获取营养", "注重碳水、蛋白质与脂肪比例", "多摄取水果、蔬菜和全谷物"], "bulletStyle": "disc" }, { "id": 2, "title": "控制摄入量", "description": "根据身体代谢需求适当控制每日的热量摄入，避免过量或不足。", "icon": { "type": "emoji", "value": "⚖️", "style": { "size": 26, "color": "#fbbd08", "backgroundColor": "#f5f5f5" } }, "highlight": false, "style": { "backgroundColor": "#f9f9f9", "borderColor": "#dddddd", "textColor": "#333333", "padding": "20px", "borderRadius": "8px", "shadow": "sm" }, "tags": ["热量控制", "节制", "健康饮食"], "link": { "url": "https://www.caloriebalance.com", "text": "控制热量摄入", "isExternal": true }, "type": "list", "bulletPoints": ["定期自测热量需求", "避免高热量食品过量", "适当减少加工食品摄入"], "bulletStyle": "disc" }, { "id": 3, "title": "减少添加糖", "description": "限制含糖食品与饮料，减少糖带来的健康风险，如肥胖与血糖问题。", "icon": { "type": "emoji", "value": "🍬", "style": { "size": 26, "color": "#ea4335", "backgroundColor": "#f5f5f5" } }, "highlight": false, "style": { "backgroundColor": "#f9f9f9", "borderColor": "#dddddd", "textColor": "#333333", "padding": "20px", "borderRadius": "8px", "shadow": "sm" }, "tags": ["糖分控制", "低糖饮食", "健康"], "link": { "url": "https://www.sugarlimits.org", "text": "减少糖摄入", "isExternal": true }, "type": "list", "bulletPoints": ["选择无糖或低糖食品", "用天然甜味剂替代添加糖", "限制甜饮料的摄入"], "bulletStyle": "disc" }, { "id": 4, "title": "多喝水", "description": "保持身体水分平衡，促进代谢功能，有助于改善皮肤及全身健康。", "icon": { "type": "emoji", "value": "💧", "style": { "size": 26, "color": "#4285f4", "backgroundColor": "#f5f5f5" } }, "highlight": false, "style": { "backgroundColor": "#f9f9f9", "borderColor": "#dddddd", "textColor": "#333333", "padding": "20px", "borderRadius": "8px", "shadow": "sm" }, "tags": ["水分", "健康", "饮食习惯"], "link": { "url": "https://www.waterintake.gov", "text": "水的作用", "isExternal": true }, "type": "list", "bulletPoints": ["每天至少喝8杯水", "避免过量饮用含咖啡因饮料", "随时补充水分"], "bulletStyle": "disc" }] }
  });
  const [loadingTemplates, setLoadingTemplates] = useState<CardTypeEnum[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [inputHistory, setInputHistory] = useSessionStorage<string[]>('inputHistory', []);

  const [templates, setTemplates] = useState<CardTypeEnum[]>([
    "basic",       // 基础卡片
    "list",        // 列表卡片
    // "steps",       // 步骤卡片
    // "stats",       // 统计卡片
    // "media",       // 媒体卡片
    // "location",    // 位置卡片
    "html",        // html卡片
    // "keyValue",    // 键值对卡片
    // "template",    // 模板卡片
  ]);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [cardScale, setCardScale] = useState({ scale: 0.5, height: '200%' });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [isLoading, cardDataMap]);

  useEffect(() => {
    if (Object.keys(cardDataMap).length > 0) {
      sessionStorage.setItem('cardDataMap', JSON.stringify(cardDataMap));
    }
  }, [cardDataMap]);

  useEffect(() => {
    if (inputHistory.length > 0) {
      sessionStorage.setItem('inputHistory', JSON.stringify(inputHistory));
    }
  }, [inputHistory]);

  useEffect(() => {
    // 从 sessionStorage 读取数据
    const savedCardData = sessionStorage.getItem('cardDataMap');
    const savedHistory = sessionStorage.getItem('inputHistory');

    if (savedCardData) {
      setCardDataMap(JSON.parse(savedCardData));
    }

    if (savedHistory) {
      setInputHistory(JSON.parse(savedHistory));
    }
  }, []); // 仅在组件挂载时执行一次

  useEffect(() => {
    const updateScale = () => {
      if (cardRef.current) {
        const parentHeight = cardRef.current.parentElement?.clientHeight || 0;
        const cardHeight = cardRef.current.scrollHeight;
        const scale = parentHeight / cardHeight;
        const compensationHeight = `${(1 / scale) * 100}%`;

        setCardScale({
          scale: scale,
          height: compensationHeight
        });
      }
    };

    updateScale();
    const resizeObserver = new ResizeObserver(updateScale);
    if (cardRef.current) {
      resizeObserver.observe(cardRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [cardDataMap]);

  const saveCardDataForPreview = (templateId: CardTypeEnum, data: CardType) => {
    try {
      localStorage.setItem(`preview_card_${templateId}`, JSON.stringify(data));
    } catch (error) {
      console.error("保存预览数据失败:", error);
    }
  };

  const hasAnyCardData = Object.values(cardDataMap).some(data => data !== null);

  const fetchTemplateData = async (templateType: CardTypeEnum, userPrompt: string) => {
    setLoadingTemplates(prev => [...prev, templateType]);

    try {
      // 为不同的卡片类型准备不同的请求格式
      const requestBody = {
        prompt: userPrompt,
        type: templateType
      };

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API 请求失败: ${response.status}`);
      }

      const data = await response.json();

      setCardDataMap(prev => ({
        ...prev,
        [templateType]: data.data
      }));

      try {
        const allCardData = JSON.parse(localStorage.getItem('generatedCardData') || '{}');
        allCardData[templateType] = data.data;
        localStorage.setItem('generatedCardData', JSON.stringify(allCardData));
      } catch (storageError) {
        console.error('保存到 localStorage 失败:', storageError);
      }

    } catch (e) {
      console.error(`Error fetching ${templateType} template:`, e);
    } finally {
      setLoadingTemplates(prev => prev.filter(t => t !== templateType));
    }
  };

  useEffect(() => {
    try {
      const savedCardData = localStorage.getItem('generatedCardData');
      if (savedCardData) {
        const parsedData = JSON.parse(savedCardData);
        setCardDataMap(parsedData);
      }
    } catch (error) {
      console.error('从 localStorage 加载数据失败:', error);
    }
  }, []); // 仅在组件挂载时执行一次

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!input.trim()) {
      setError("请输入内容");
      return;
    }

    setIsLoading(true);
    setCardDataMap({} as Partial<Record<CardTypeEnum, CardType | null>>);

    try {
      setInputHistory(prev => [input, ...prev]);

      // 收集所有错误
      const errors: string[] = [];
      const results = await Promise.allSettled(
        templates.map(templateType => fetchTemplateData(templateType, input))
      );

      // 检查是否所有请求都失败
      const allFailed = results.every(result => result.status === 'rejected');
      if (allFailed) {
        throw new Error("所有卡片类型生成失败，请重试或修改提示词");
      }

      // 显示部分失败信息
      const failedCount = results.filter(result => result.status === 'rejected').length;
      if (failedCount > 0) {
        setError(`${failedCount}/${templates.length} 个卡片类型生成失败，但其他类型已成功生成`);
      }

      setInput("");
    } catch (e) {
      console.error("Error:", e);
      setError((e as Error).message || "生成失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  const selectHistoryInput = (historyItem: string) => {
    setInput(historyItem);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const clearCardData = () => {
    setCardDataMap({} as Partial<Record<CardTypeEnum, CardType | null>>);
    sessionStorage.removeItem('cardDataMap');
    localStorage.removeItem('generatedCardData');
  };

  const getScaleConfig = (templateId: string) => {
    const configs = {
      basic: { scale: 0.5, height: '200%' },
      list: { scale: 0.45, height: '220%' },
      // 其他模板的配置...
    };
    return configs[templateId as keyof typeof configs] || { scale: 0.5, height: '200%' };
  };

  // 添加一个清理旧数据的函数
  const cleanupOldData = () => {
    try {
      const timestamp = localStorage.getItem('lastCleanup');
      const now = Date.now();

      // 每天清理一次
      if (!timestamp || (now - parseInt(timestamp)) > 24 * 60 * 60 * 1000) {
        localStorage.removeItem('generatedCardData');
        localStorage.setItem('lastCleanup', now.toString());
      }
    } catch (error) {
      console.error('清理数据失败:', error);
    }
  };

  // 在组件挂载时执行清理
  useEffect(() => {
    cleanupOldData();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex flex-col">
      <div className="text-center py-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="inline-flex items-center justify-center">
          <Sparkles className="h-6 w-6 text-blue-500 mr-2" />
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            AI 信息卡片生成器
          </h1>
        </div>
      </div>

      <div className="flex-grow flex flex-col overflow-hidden">
        <div
          ref={contentRef}
          className="flex-grow overflow-y-auto px-4 py-6 space-y-6"
        >
          {!hasAnyCardData && !isLoading && (
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

          {hasAnyCardData && (
            <div className="max-w-6xl mx-auto">
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

              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm p-3 border border-gray-100 mb-4">
                <div className="flex items-start mb-2">
                  <div className="w-7 h-7 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 mr-2">
                    AI
                  </div>
                  <div className="flex-grow">
                    {Object.values(cardDataMap).find(data => data !== null) && (
                      <>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                          {Object.values(cardDataMap).find(data => data !== null)?.title}
                        </h3>
                        {Object.values(cardDataMap).find(data => data !== null)?.subtitle && (
                          <p className="text-gray-600 text-sm">
                            {Object.values(cardDataMap).find(data => data !== null)?.subtitle}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {hasAnyCardData ? "已生成卡片，显示不同样式效果" : "尚未生成卡片"}
                </div>
                {hasAnyCardData && (
                  <button
                    onClick={clearCardData}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm transition-colors"
                  >
                    清除卡片
                  </button>
                )}
              </div>

              <div className="p-4">
                {hasAnyCardData && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {templates.map((templateId, index) => {
                      const templateData = cardDataMap[templateId];
                      const isLoading = loadingTemplates.includes(templateId);

                      return (
                        <div
                          key={templateId}
                          className="transform origin-center relative group overflow-hidden"
                          style={{
                            aspectRatio: "3/4",
                            maxWidth: "100%",
                            border: '1px solid #efefef',
                            borderRadius: "12px",
                            boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          {isLoading ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                            </div>
                          ) : templateData ? (
                            <>
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center z-10">
                                <div className="flex gap-2 flex-col">
                                  <Link
                                    href={`/preview?template=${templateId}&title=${encodeURIComponent(templateData.title)}&id=${index}`}
                                    className="bg-white hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg flex items-center justify-center transition-colors text-sm font-medium"
                                    onClick={() => saveCardDataForPreview(templateId, templateData)}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    预览
                                  </Link>
                                  <Link
                                    href={`/detail?template=${templateId}&title=${encodeURIComponent(templateData.title)}&id=${index}`}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors text-sm font-medium"
                                    onClick={() => saveCardDataForPreview(templateId, templateData)}
                                  >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    使用
                                  </Link>
                                </div>
                              </div>

                              <div className="w-full h-full flex items-center justify-center overflow-hidden">
                                <div
                                  style={{
                                    transform: 'scale(0.7)',
                                    // transformOrigin: 'center center',
                                    // width: '250%',
                                    // height: '250%'
                                  }}
                                >
                                  <Card
                                    data={templateData}
                                    posterFormat={templateId}
                                    hideNavigation={true}
                                    className="w-full h-full"
                                  />
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
                              {templateId} 模板加载失败
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}

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

      <footer className="w-full py-2 text-center text-gray-500 text-xs">
        <p>AI 信息卡片生成器 © {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}
