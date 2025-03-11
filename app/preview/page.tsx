"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card as CardType } from "@/lib/schemas/card";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import Link from "next/link";
import { getCardByKeyword, getTemplateById } from "@/lib/mockData";
import { cn } from "@/lib/utils";

// 单个卡片项组件
const CardItem = ({ item, theme, index }: {
  item: any,
  theme?: any,
  index: number
}) => {
  const primaryColor = theme?.primaryColor || '#FF9966';
  const textColor = theme?.textColor || '#000000';
  const accentColor = theme?.accentColor || primaryColor;

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 mb-6">
      {/* 卡片头部 */}
      <div className="p-4 border-b border-gray-100 flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0"
          style={{ backgroundColor: primaryColor }}
        >
          <span>{index + 1}</span>
        </div>
        <h3 className="text-xl font-semibold" style={{ color: textColor }}>
          {item.title}
        </h3>
        {item.icon && (
          <span className="text-xl">{item.icon.value}</span>
        )}
      </div>

      {/* 卡片内容 */}
      <div className="p-6">
        {/* 标签 */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.map((tag: string, idx: number) => (
              <span
                key={idx}
                className="px-2 py-1 text-xs rounded-full"
                style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 描述文本 */}
        <p className="text-gray-700 mb-4 leading-relaxed">
          {item.description}
        </p>

        {/* 要点列表 */}
        {item.bulletPoints && (
          <ul className="mt-4 space-y-2 mb-4">
            {item.bulletPoints.map((point: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 text-gray-700">
                <span style={{ color: accentColor }}>•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        )}

        {/* 行动步骤 */}
        {item.actionStep && (
          <div className="p-4 rounded-lg mt-4 bg-gray-50 border-l-4" style={{ borderLeftColor: accentColor }}>
            <div className="text-sm font-medium mb-1" style={{ color: accentColor }}>行动步骤</div>
            <p className="text-gray-700">{item.actionStep}</p>
          </div>
        )}

        {/* 链接 */}
        {item.link && (
          <div className="mt-4">
            <a
              href={item.link.url}
              target={item.link.isExternal ? "_blank" : undefined}
              rel={item.link.isExternal ? "noopener noreferrer" : undefined}
              className="inline-flex items-center hover:underline"
              style={{ color: primaryColor }}
            >
              {item.link.text || "了解更多"}
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const template = searchParams.get("template") || "standard";
  const title = searchParams.get("title") || "信息卡片";

  const [cardData, setCardData] = useState<CardType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 模拟从API获取数据
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 这里应该是从API获取数据，现在我们使用模拟数据
        const mockData = getCardByKeyword(title);
        setCardData(mockData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [title]);

  // 分享功能
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: "查看我用AI生成的信息卡片",
        url: window.location.href,
      })
        .catch((error) => console.log('分享失败', error));
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert("链接已复制到剪贴板"))
        .catch((err) => console.error("无法复制链接: ", err));
    }
  };

  // 获取模板样式
  const templateStyle = getTemplateById(template).style;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex flex-col">
      {/* 顶部导航栏 */}
      <div className="bg-white shadow-sm border-b border-gray-200 py-3 px-4 flex justify-between items-center sticky top-0 z-10">
        <Link href="/" className="flex items-center text-gray-700 hover:text-gray-900">
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span>返回</span>
        </Link>
        <h1 className="text-lg font-bold text-center text-gray-800 flex-grow">{title} - 预览模式</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleShare}
            className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100"
          >
            <Share2 className="h-5 w-5" />
          </button>
          <button
            className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100"
            onClick={() => alert('下载功能将在后续版本中实现')}
          >
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 主内容区域 - 纵向排列卡片内容 */}
      <div className="flex-grow p-4 overflow-y-auto">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">加载中...</p>
          </div>
        ) : cardData ? (
          <div className="max-w-3xl mx-auto">
            {/* 卡片标题区域 */}
            <div
              className="w-full bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 mb-6 p-6"
              style={{
                backgroundColor: templateStyle.backgroundColor || 'white',
                backgroundImage: templateStyle.backgroundImage,
                boxShadow: templateStyle.boxShadow
              }}
            >
              <h2 className="text-2xl font-bold mb-2" style={{ color: templateStyle.titleColor || '#000' }}>
                {cardData.title}
              </h2>
              {cardData.subtitle && (
                <p className="text-gray-600 mb-4">{cardData.subtitle}</p>
              )}

              {/* 元数据 */}
              {cardData.metadata && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {cardData.metadata.tags && cardData.metadata.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs rounded-full bg-gray-100"
                      style={{ backgroundColor: `${cardData.theme.primaryColor}15`, color: cardData.theme.primaryColor }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 卡片内容区域 - 纵向排列所有项 */}
            {cardData.items.map((item, index) => (
              <CardItem
                key={item.id}
                item={item}
                theme={cardData.theme}
                index={index}
              />
            ))}

            {/* 底部信息 */}
            {cardData.footer && (
              <div className="w-full bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{cardData.footer.text}</span>
                  {cardData.footer.links && cardData.footer.links.length > 0 && (
                    <a
                      href={cardData.footer.links[0].url}
                      className="flex items-center gap-1 hover:underline"
                      style={{ color: cardData.theme.primaryColor }}
                    >
                      {cardData.footer.links[0].text}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md mx-auto">
            <p className="text-red-500 mb-2">无法加载卡片数据</p>
            <Link href="/" className="text-blue-500 hover:underline">
              返回首页重试
            </Link>
          </div>
        )}
      </div>

      {/* 底部操作栏 */}
      <div className="bg-white border-t border-gray-200 p-4 flex justify-center sticky bottom-0">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
          <Link
            href={`/detail?template=${template}&title=${encodeURIComponent(title || '')}`}
            className="flex-1 py-3 text-center text-gray-700 hover:bg-gray-50 transition-colors border-r border-gray-100"
          >
            <span className="text-sm">查看详情</span>
          </Link>
          <button
            className="flex-1 py-3 text-center text-gray-700 hover:bg-gray-50 transition-colors border-r border-gray-100"
            onClick={() => alert('下载功能将在后续版本中实现')}
          >
            <span className="text-sm">下载</span>
          </button>
          <button
            className="flex-1 py-3 text-center text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => alert('更多功能将在后续版本中实现')}
          >
            <span className="text-sm">⋮</span>
          </button>
        </div>
      </div>
    </main>
  );
} 