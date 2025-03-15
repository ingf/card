import { Card as CardType, CardItem as CardItemType, Theme, Layout } from '@/lib/schemas/card'
import { cn } from '@/lib/utils'
import { useState, useCallback, useEffect } from 'react'
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CardFactory from "./cards/CardFactory1";
import { getTemplateById } from '@/lib/mockData';

// 卡片模板类型
export const CARD_TEMPLATES = ["list", "steps"] as const;
export type CardTemplate = typeof CARD_TEMPLATES[number];

interface CardProps {
  data: CardType;
  platformRatio?: string;
  posterFormat?: string;
  hideNavigation?: boolean;
}

// 平台比例配置
const platformRatios = {
  "1:1": { width: "375px", height: "375px", class: "aspect-square" },
  "3:4": { width: "375px", height: "500px", class: "aspect-[3/4]" },
  "4:5": { width: "375px", height: "469px", class: "aspect-[4/5]" },
  "9:16": { width: "375px", height: "667px", class: "aspect-[9/16]" },
  "4:3": { width: "400px", height: "300px", class: "aspect-[4/3]" },
  "16:9": { width: "480px", height: "270px", class: "aspect-[16/9]" },
  "default": { width: "375px", height: "auto", class: "" }
};

// 平台样式配置
const platformStyles = {
  "linkedin": { color: "#0077B5", name: "LinkedIn" },
  "instagram": { color: "#E1306C", name: "Instagram" },
  "facebook": { color: "#1877F2", name: "Facebook" },
  "twitter": { color: "#1DA1F2", name: "Twitter" },
  "tiktok": { color: "#000000", name: "TikTok" },
  "default": { color: "#3B82F6", name: "默认" }
};

// 添加背景样式配置
const posterBackgrounds = {
  "simple": [
    "bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-100",
    "bg-gradient-to-br from-pink-50 to-purple-100 border border-pink-100",
    "bg-gradient-to-br from-green-50 to-emerald-100 border border-green-100",
    "bg-gradient-to-br from-amber-50 to-orange-100 border border-amber-100",
    "bg-gradient-to-br from-sky-50 to-cyan-100 border border-sky-100"
  ],
  "complex": [
    "bg-white",
    "bg-gray-50 border border-gray-100",
    "bg-blue-50 border border-blue-100",
    "bg-amber-50 border border-amber-100",
    "bg-emerald-50 border border-emerald-100"
  ]
};

// 单个卡片项组件
const CardItem = ({ item, theme, layout }: {
  item: CardItemType,
  theme?: Theme,
  layout?: Layout
}) => {
  const primaryColor = theme?.primaryColor || '#FF9966';
  const textColor = theme?.textColor || '#000000';
  const cardStyle = theme?.cardStyle || 'elevated';
  const borderRadius = theme?.borderRadius || '0.5rem';

  // 卡片样式类
  const cardStyleClasses = {
    'flat': 'bg-white',
    'outlined': 'bg-white border border-gray-200',
    'elevated': 'bg-white shadow-lg',
    'glass': 'bg-white/70 backdrop-blur-md border border-white/20'
  };

  // 简化数字标记处理
  const showNumber = true; // 默认显示数字
  const numberShape = 'circle'; // 默认圆形

  // 数字标记形状
  const numberShapeClasses = {
    'circle': 'rounded-full',
    'square': 'rounded-md',
    'pill': 'rounded-full px-3'
  };

  // 自定义样式
  const customStyle = {
    backgroundColor: item.style?.backgroundColor,
    color: item.style?.textColor || textColor,
    borderColor: item.style?.borderColor,
    padding: item.style?.padding,
    borderRadius: item.style?.borderRadius || borderRadius,
  };

  // 视觉元素位置
  const visualPosition = item.visualElement?.position || 'left';

  return (
    <div
      className={cn(
        "overflow-hidden transition-all",
        cardStyleClasses[cardStyle as keyof typeof cardStyleClasses],
        item.highlight && 'ring-2 ring-offset-2',
        {
          'border-l-4': item.highlight && cardStyle !== 'glass',
        }
      )}
      style={{
        ...customStyle,
        borderLeftColor: item.highlight ? primaryColor : undefined,
        borderRadius: customStyle.borderRadius,
      }}
    >
      {/* 顶部图片 */}
      {item.visualElement && visualPosition === 'top' && (
        <div className="w-full h-40">
          <img
            src={item.visualElement.source}
            alt={item.visualElement.alt || item.title}
            className="w-full h-full object-cover"
            style={item.visualElement.style}
          />
        </div>
      )}

      {/* 背景图片 */}
      {item.visualElement && visualPosition === 'background' && (
        <div className="absolute inset-0 z-0 opacity-10">
          <img
            src={item.visualElement.source}
            alt={item.visualElement.alt || item.title}
            className="w-full h-full object-cover"
            style={item.visualElement.style}
          />
        </div>
      )}

      <div className="p-6 relative">
        {/* 标题区域 */}
        <div className="flex items-center gap-4 mb-4">
          {showNumber && (
            <div
              className={cn(
                "flex-shrink-0 w-10 h-10 flex items-center justify-center",
                numberShapeClasses[numberShape as keyof typeof numberShapeClasses]
              )}
              style={{
                backgroundColor: primaryColor,
                color: 'white',
              }}
            >
              <span className="text-xl font-bold text-white">
                {item.id}
              </span>
            </div>
          )}

          <div className={cn(
            "flex items-center gap-3",
            visualPosition === 'left' ? 'flex-row' : 'flex-row-reverse'
          )}>
            <h3 className="text-xl font-semibold flex-grow">
              {item.title}
            </h3>

            {/* 左侧或右侧图标/图片 */}
            {item.visualElement && (visualPosition === 'left' || visualPosition === 'right') && (
              <div className="flex-shrink-0 w-12 h-12">
                <img
                  src={item.visualElement.source}
                  alt={item.visualElement.alt || item.title}
                  className="w-full h-full object-contain"
                  style={item.visualElement.style}
                />
              </div>
            )}
          </div>
        </div>

        {/* 标签 */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {item.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded-full bg-gray-100"
                style={{ backgroundColor: `${primaryColor}20` }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 描述文本 */}
        <p className="text-gray-600 mb-4">
          {item.description}
        </p>

        {/* Action Step */}
        {item.actionStep && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="text-sm font-medium text-gray-900 mb-1">
              Action Step:
            </div>
            <p className="text-gray-600">
              {item.actionStep}
            </p>
          </div>
        )}

        {/* 链接 */}
        {item.link && (
          <div className="mt-4">
            <a
              href={item.link.url}
              target={item.link.isExternal ? "_blank" : undefined}
              rel={item.link.isExternal ? "noopener noreferrer" : undefined}
              className="inline-flex items-center text-blue-600 hover:underline"
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

      {/* 底部图片 */}
      {item.visualElement && visualPosition === 'bottom' && (
        <div className="w-full h-40">
          <img
            src={item.visualElement.source}
            alt={item.visualElement.alt || item.title}
            className="w-full h-full object-cover"
            style={item.visualElement.style}
          />
        </div>
      )}
    </div>
  );
};

// 根据卡片类型渲染不同的布局
const renderCardByType = (data: CardType, currentIndex: number, posterFormat: string) => {
  const currentItem = data.items[currentIndex];

  switch (data.type) {
    case "list":
      return renderListCard(data, currentItem, currentIndex, posterFormat);
    case "steps":
      return renderStepsCard(data, currentItem, currentIndex, posterFormat);
    // case "comparison":
    //   return renderComparisonCard(data, currentItem, currentIndex, posterFormat);
    // case "faq":
    //   return renderFaqCard(data, currentItem, currentIndex, posterFormat);
    // case "timeline":
    //   return renderTimelineCard(data, currentItem, currentIndex, posterFormat);
    default:
      return renderListCard(data, currentItem, currentIndex, posterFormat);
  }
};

// 列表卡片布局
const renderListCard = (data: CardType, item: CardItemType, index: number, posterFormat: string) => {
  const theme = data.theme;
  const primaryColor = theme?.primaryColor || '#4CAF50';
  const accentColor = theme?.accentColor || '#8BC34A';

  return (
    <div className="flex flex-col h-full rounded-lg overflow-hidden"
      style={{ backgroundColor: theme?.backgroundColor || '#FFFFFF' }}>
      {/* 卡片头部 */}
      <div className="p-4" style={{
        backgroundColor: theme?.headerStyle?.backgroundColor || '#F1F8E9',
        color: theme?.headerStyle?.textColor || '#33691E'
      }}>
        <div className="flex items-center gap-2 mb-2">
          {data.header?.icon && (
            <span className="text-2xl">{data.header.icon.value}</span>
          )}
          <h2 className="text-xl font-bold">{data.title}</h2>
        </div>
        {data.subtitle && (
          <p className="text-sm opacity-80">{data.subtitle}</p>
        )}

        {/* 标签 */}
        {data.metadata?.tags && (
          <div className="flex flex-wrap gap-1 mt-2">
            {data.metadata.tags.map((tag, idx) => (
              <span key={idx} className="px-2 py-0.5 text-xs rounded-full"
                style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 卡片内容 */}
      <div className="flex-grow p-4 overflow-y-hidden">
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: primaryColor }}>
              <span>{index + 1}</span>
            </div>
            <h3 className="text-lg font-semibold" style={{ color: theme?.textColor || '#212121' }}>
              {item.title}
            </h3>
            {item.icon && (
              <span className="text-xl">{item.icon.value}</span>
            )}
          </div>

          <p className="text-sm leading-relaxed" style={{ color: `${theme?.textColor || '#212121'}CC` }}>
            {item.description}
          </p>

          {/* 要点列表 */}
          {item.bulletPoints && (
            <ul className="mt-3 space-y-1">
              {item.bulletPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span style={{ color: accentColor }}>•</span>
                  <span style={{ color: theme?.textColor || '#212121' }}>{point}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 行动步骤 */}
        {item.actionStep && (
          <div className="p-3 rounded-lg mt-3" style={{
            backgroundColor: `${accentColor}15`,
            borderLeft: `3px solid ${accentColor}`
          }}>
            <div className="text-xs font-medium mb-1" style={{ color: accentColor }}>行动步骤</div>
            <p className="text-sm" style={{ color: theme?.textColor || '#212121' }}>{item.actionStep}</p>
          </div>
        )}
      </div>

      {/* 卡片底部 */}
      {data.footer && (
        <div className="p-3 text-sm border-t" style={{
          backgroundColor: theme?.footerStyle?.backgroundColor || '#F1F8E9',
          color: theme?.footerStyle?.textColor || '#689F38',
          borderColor: `${primaryColor}30`
        }}>
          <div className="flex items-center justify-between">
            <span>{data.footer.text}</span>
            {data.footer.links && data.footer.links.length > 0 && (
              <a href={data.footer.links[0].url} className="flex items-center gap-1 hover:underline"
                style={{ color: primaryColor }}>
                {data.footer.links[0].text}
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
  );
};

// 步骤卡片布局
const renderStepsCard = (data: CardType, item: CardItemType, index: number, posterFormat: string) => {
  const theme = data.theme;
  const primaryColor = theme?.primaryColor || '#2196F3';

  return (
    <div className="flex flex-col h-full rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* 卡片头部 */}
      <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <h2 className="text-xl font-bold">{data.title}</h2>
        {data.subtitle && (
          <p className="text-sm opacity-90 mt-1">{data.subtitle}</p>
        )}
      </div>

      {/* 步骤内容 */}
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="relative pl-10 pb-8 border-l-2 border-blue-300">
          <div className="absolute left-0 top-0 -translate-x-1/2 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
            {index + 1}
          </div>

          <h3 className="text-lg font-semibold text-blue-800 mb-2">{item.title}</h3>
          <p className="text-sm text-blue-900/80 leading-relaxed">{item.description}</p>

          {item.actionStep && (
            <div className="mt-3 p-3 bg-white/70 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">{item.actionStep}</p>
            </div>
          )}
        </div>
      </div>

      {/* 进度指示器 */}
      <div className="p-3 bg-white/80 border-t border-blue-100">
        <div className="flex justify-between items-center">
          <span className="text-xs text-blue-600">步骤 {index + 1}/{data.items.length}</span>
          <div className="flex gap-1">
            {data.items.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i === index ? 'bg-blue-500' : 'bg-blue-200'}`}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 其他类型的卡片布局...

/**
 * 使用示例:
 * 
 * ```tsx
 * // 使用 CARD_TEMPLATES 常量
 * const [activeTemplates, setActiveTemplates] = useState<CardTemplate[]>(CARD_TEMPLATES);
 * 
 * // 使用 CARD_TYPES 常量
 * const [activeCardTypes, setActiveCardTypes] = useState<CardTypeEnum[]>(CARD_TYPES);
 * ```
 */
export function Card({ data, width = 375, height = 500, platformRatio = "default", posterFormat = "standard", hideNavigation = false, className = "" }: CardProps & { width?: number, height?: number, className?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalItems = data.items.length;

  // 处理导航
  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + totalItems) % totalItems);
  }, [totalItems]);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % totalItems);
  }, [totalItems]);

  // 获取平台比例配置
  const ratio = platformRatios[platformRatio as keyof typeof platformRatios] || platformRatios.default;

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        ratio.class,
        className
      )}
      style={{
        width: width ? `${width}px` : ratio.width,
        height: height ? `${height}px` : ratio.height,
        boxShadow: getTemplateById(posterFormat).style.boxShadow
      }}
    >
      {/* 根据模板样式渲染不同布局 */}
      {renderCardByType(data, currentIndex, posterFormat)}

      {/* 导航按钮 - 根据模板样式调整 */}
      {!hideNavigation && totalItems > 1 && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            onClick={handlePrev}
            className="w-7 h-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-sm"
          >
            <ChevronLeft className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={handleNext}
            className="w-7 h-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-sm"
          >
            <ChevronRight className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      )}
    </div>
  );
} 