import { Card as CardType, CardItem as CardItemType, Theme, Layout } from '@/lib/schemas/card'
import { cn } from '@/lib/utils'
import { useState, useCallback, useEffect } from 'react'
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CardFactory from "./cards/CardFactory";

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

// 轮播导航按钮组件
const CarouselNavButton = ({
  direction,
  onClick,
  color
}: {
  direction: 'prev' | 'next',
  onClick: () => void,
  color: string
}) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-50 transition-all"
      style={{ [direction === 'prev' ? 'left' : 'right']: '8px' }}
      aria-label={direction === 'prev' ? '上一个' : '下一个'}
    >
      {direction === 'prev' ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 19L8 12L15 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 5L16 12L9 19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
};

// 渲染卡片内容
const renderCardContent = (item: CardItemType, index: number, data: CardType, posterFormat: string) => {
  // 根据海报格式渲染不同内容
  if (posterFormat === "simple") {
    // 简单海报样式 - 类似图片中的效果
    return (
      <div className="flex flex-col h-full bg-amber-50/80 p-4 rounded-lg">
        {/* 标题区域 */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-amber-800">{data.title}</h2>
          <div className="inline-block px-3 py-1 bg-amber-500 text-white text-xs rounded-full mt-2">
            关注健康
          </div>
        </div>

        {/* 内容列表 */}
        <div className="space-y-4 flex-grow">
          {data.items.map((listItem, idx) => (
            <div key={idx} className="flex items-start">
              <div className="flex-shrink-0 bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                <span className="text-xs">{idx + 1}</span>
              </div>
              <div className="flex-grow">
                <h3 className="text-sm font-bold text-amber-800">{listItem.title}</h3>
                <p className="text-xs text-amber-700 mt-1">{listItem.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 行动步骤 */}
        {item.actionStep && (
          <div className="mt-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
            <div className="text-xs font-medium text-blue-800 mb-1">行动步骤:</div>
            <div className="text-xs text-blue-700">
              {item.actionStep}
            </div>
          </div>
        )}
      </div>
    );
  } else if (posterFormat === "complex") {
    // 复杂海报样式
    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg">
        {/* 标题区域 */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">{data.title}</h2>
          <div className="inline-block px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full mt-2">
            关注健康
          </div>
        </div>

        {/* 内容列表 */}
        <div className="space-y-4 flex-grow">
          {data.items.map((listItem, idx) => (
            <div key={idx} className="flex items-start bg-white/70 p-3 rounded-lg shadow-sm">
              <div className="flex-shrink-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-7 h-7 flex items-center justify-center mr-2">
                <span className="text-xs">{idx + 1}</span>
              </div>
              <div className="flex-grow">
                <h3 className="text-sm font-bold text-gray-800">{listItem.title}</h3>
                <p className="text-xs text-gray-600 mt-1">{listItem.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 行动步骤 */}
        {item.actionStep && (
          <div className="mt-4 bg-white/70 p-3 rounded-lg shadow-sm border border-purple-100">
            <div className="text-xs font-medium text-purple-800 mb-1">行动步骤:</div>
            <div className="text-xs text-purple-700">
              {item.actionStep}
            </div>
          </div>
        )}
      </div>
    );
  } else {
    // 标准卡片样式 - 限制最多显示4个要点
    const maxItems = 4;
    const hasMoreItems = data.items.length > maxItems;

    return (
      <div className="flex flex-col h-full bg-blue-50/80 p-4 rounded-lg">
        {/* 标题区域 */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-blue-800">{data.title}</h2>
          <div className="inline-block px-3 py-1 bg-blue-500 text-white text-xs rounded-full mt-2">
            关注健康
          </div>
        </div>

        {/* 内容列表 - 最多显示4个 */}
        <div className="space-y-4 flex-grow">
          {data.items.slice(0, maxItems).map((listItem, idx) => (
            <div key={idx} className="flex items-start">
              <div className="flex-shrink-0 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                <span className="text-xs">{idx + 1}</span>
              </div>
              <div className="flex-grow">
                <h3 className="text-sm font-bold text-blue-800">{listItem.title}</h3>
                <p className="text-xs text-blue-700 mt-1">{listItem.description}</p>
              </div>
            </div>
          ))}

          {/* 显示"查看更多"按钮 */}
          {hasMoreItems && (
            <div className="text-center mt-2">
              <button
                className="text-xs text-blue-600 hover:text-blue-800 underline"
                onClick={() => alert(`还有${data.items.length - maxItems}个要点未显示，完整内容请查看详情`)}
              >
                查看更多 ({data.items.length - maxItems})
              </button>
            </div>
          )}
        </div>

        {/* 行动步骤 */}
        {item.actionStep && (
          <div className="mt-4 bg-white/70 p-3 rounded-lg border border-blue-100">
            <div className="text-xs font-medium text-blue-800 mb-1">行动步骤:</div>
            <div className="text-xs text-blue-700">
              {item.actionStep}
            </div>
          </div>
        )}
      </div>
    );
  }
};

export function Card({ 
  data, 
  platformRatio = "3:4", 
  posterFormat = "standard",
  hideNavigation = false 
}: CardProps) {
  return (
    <div className="card-container" style={{ aspectRatio: platformRatio }}>
      <CardFactory 
        data={data} 
        platformRatio={platformRatio} 
        posterFormat={posterFormat}
        hideNavigation={hideNavigation}
      />
    </div>
  );
} 