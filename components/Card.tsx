import { Card as CardType, CardItem as CardItemType, Theme, Layout, MediaCardItem, StepCardItem, ListCardItem } from '@/lib/schemas/card'
import { cn } from '@/lib/utils'
import { useState, useCallback, useEffect } from 'react'
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// 卡片模板类型
export const CARD_TEMPLATES = ["basic", "list", "steps", "stats", "media", "location", "keyValue", "template"] as const;
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

  // 检查卡片项类型
  const isMediaItem = item.type === 'media';
  const isStepItem = item.type === 'step';
  const isListItem = item.type === 'list';

  // 获取视觉元素位置（仅适用于媒体卡片项）
  const visualPosition = isMediaItem && 'visualElement' in item ?
    (item as MediaCardItem).visualElement.position || 'left' : 'left';

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
      {/* 顶部图片 - 仅适用于媒体卡片项 */}
      {isMediaItem && 'visualElement' in item && visualPosition === 'top' && (
        <div className="w-full h-40">
          <img
            src={(item as MediaCardItem).visualElement.source}
            alt={(item as MediaCardItem).visualElement.alt || item.title}
            className="w-full h-full object-cover"
            style={(item as MediaCardItem).visualElement.style}
          />
        </div>
      )}

      {/* 背景图片 - 仅适用于媒体卡片项 */}
      {isMediaItem && 'visualElement' in item && visualPosition === 'background' && (
        <div className="absolute inset-0 z-0 opacity-10">
          <img
            src={(item as MediaCardItem).visualElement.source}
            alt={(item as MediaCardItem).visualElement.alt || item.title}
            className="w-full h-full object-cover"
            style={(item as MediaCardItem).visualElement.style}
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
            isMediaItem && (visualPosition === 'left' ? 'flex-row' : 'flex-row-reverse')
          )}>
            <h3 className="text-xl font-semibold flex-grow">
              {item.title}
            </h3>

            {/* 左侧或右侧图标/图片 - 仅适用于媒体卡片项 */}
            {isMediaItem && 'visualElement' in item && (visualPosition === 'left' || visualPosition === 'right') && (
              <div className="flex-shrink-0 w-12 h-12">
                <img
                  src={(item as MediaCardItem).visualElement.source}
                  alt={(item as MediaCardItem).visualElement.alt || item.title}
                  className="w-full h-full object-contain"
                  style={(item as MediaCardItem).visualElement.style}
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

        {/* Action Step - 仅适用于步骤卡片项 */}
        {isStepItem && 'actionStep' in item && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="text-sm font-medium text-gray-900 mb-1">
              Action Step:
            </div>
            <p className="text-gray-600">
              {(item as StepCardItem).actionStep}
            </p>
          </div>
        )}

        {/* 要点列表 - 仅适用于列表卡片项 */}
        {isListItem && 'bulletPoints' in item && (
          <div className="mt-4">
            <ul className="space-y-2">
              {(item as ListCardItem).bulletPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-500 flex-shrink-0">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
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

      {/* 底部图片 - 仅适用于媒体卡片项 */}
      {isMediaItem && 'visualElement' in item && visualPosition === 'bottom' && (
        <div className="w-full h-40">
          <img
            src={(item as MediaCardItem).visualElement.source}
            alt={(item as MediaCardItem).visualElement.alt || item.title}
            className="w-full h-full object-cover"
            style={(item as MediaCardItem).visualElement.style}
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
    case "basic":
      return renderBasicCard(data, currentItem, currentIndex, posterFormat);
    case "list":
      return renderListCard(data, currentItem, currentIndex, posterFormat);
    case "steps":
      return renderStepsCard(data, currentItem, currentIndex, posterFormat);
    case "stats":
      return renderStatsCard(data, currentItem, currentIndex, posterFormat);
    case "media":
      return renderMediaCard(data, currentItem, currentIndex, posterFormat);
    case "location":
      return renderLocationCard(data, currentItem, currentIndex, posterFormat);
    case "keyValue":
      return renderKeyValueCard(data, currentItem, currentIndex, posterFormat);
    case "template":
      return renderTemplateCard(data, currentItem, currentIndex, posterFormat);
    default:
      return renderBasicCard(data, currentItem, currentIndex, posterFormat);
  }
};

// 基础卡片布局
const renderBasicCard = (data: CardType, item: CardItemType, index: number, posterFormat: string) => {
  const theme = data.theme;
  const primaryColor = theme?.primaryColor || '#3B82F6';
  const textColor = theme?.textColor || '#000000';

  return (
    <div className="flex flex-col h-full rounded-lg overflow-hidden"
      style={{ backgroundColor: theme?.backgroundColor || '#FFFFFF' }}>
      {/* 卡片头部 */}
      <div className="p-4" style={{
        backgroundColor: theme?.headerStyle?.backgroundColor || '#F3F4F6',
        color: theme?.headerStyle?.textColor || '#111827'
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
      </div>

      {/* 卡片内容 */}
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            {item.icon && (
              <span className="text-xl">{item.icon.value}</span>
            )}
            <h3 className="text-lg font-semibold" style={{ color: textColor }}>
              {item.title}
            </h3>
          </div>

          <p className="text-sm leading-relaxed" style={{ color: `${textColor}CC` }}>
            {item.description}
          </p>
        </div>

        {/* 链接 */}
        {item.link && (
          <div className="mt-3">
            <a
              href={item.link.url}
              target={item.link.isExternal ? "_blank" : undefined}
              rel={item.link.isExternal ? "noopener noreferrer" : undefined}
              className="inline-flex items-center text-sm hover:underline"
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

      {/* 卡片底部 */}
      {data.footer && (
        <div className="p-3 text-sm border-t" style={{
          backgroundColor: theme?.footerStyle?.backgroundColor || '#F3F4F6',
          color: theme?.footerStyle?.textColor || '#4B5563',
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

// 列表卡片布局
const renderListCard = (data: CardType, item: CardItemType, index: number, posterFormat: string) => {
  const theme = data.theme;
  const primaryColor = theme?.primaryColor || '#4CAF50';
  const accentColor = theme?.accentColor || '#8BC34A';

  // 检查是否为列表卡片项
  const isListItem = item.type === 'list';
  // 检查是否为步骤卡片项
  const isStepItem = item.type === 'step';

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

          {/* 要点列表 - 仅适用于列表卡片项 */}
          {isListItem && 'bulletPoints' in item && (
            <ul className="mt-3 space-y-1">
              {(item as ListCardItem).bulletPoints.map((point: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span style={{ color: accentColor }}>•</span>
                  <span style={{ color: theme?.textColor || '#212121' }}>{point}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 行动步骤 - 仅适用于步骤卡片项 */}
        {isStepItem && 'actionStep' in item && (
          <div className="p-3 rounded-lg mt-3" style={{
            backgroundColor: `${accentColor}15`,
            borderLeft: `3px solid ${accentColor}`
          }}>
            <div className="text-xs font-medium mb-1" style={{ color: accentColor }}>行动步骤</div>
            <p className="text-sm" style={{ color: theme?.textColor || '#212121' }}>{(item as StepCardItem).actionStep}</p>
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

  // 检查是否为步骤卡片项
  const isStepItem = item.type === 'step';

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

          {/* 行动步骤 - 仅适用于步骤卡片项 */}
          {isStepItem && 'actionStep' in item && (
            <div className="mt-3 p-3 bg-white/70 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">{(item as StepCardItem).actionStep}</p>
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

// 统计卡片布局
const renderStatsCard = (data: CardType, item: CardItemType, index: number, posterFormat: string) => {
  const theme = data.theme;
  const primaryColor = theme?.primaryColor || '#6366F1';
  const isStatItem = item.type === 'stat';

  return (
    <div className="flex flex-col h-full rounded-lg overflow-hidden bg-white">
      {/* 卡片头部 */}
      <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        <h2 className="text-xl font-bold">{data.title}</h2>
        {data.subtitle && (
          <p className="text-sm opacity-90 mt-1">{data.subtitle}</p>
        )}
      </div>

      {/* 统计内容 */}
      <div className="flex-grow p-6 flex flex-col justify-center">
        {isStatItem && 'value' in item && (
          <div className="text-center">
            <div className="text-4xl font-bold mb-2" style={{ color: primaryColor }}>
              {isStatItem && 'prefix' in item && (item as any).prefix}
              {(item as any).value}
              {isStatItem && 'suffix' in item && (item as any).suffix}
            </div>
            <h3 className="text-lg font-medium mb-1">{item.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{item.description}</p>

            {isStatItem && 'percentage' in item && (item as any).percentage !== undefined && (
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className={`text-sm font-medium ${(item as any).trend === 'up' ? 'text-green-500' : (item as any).trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
                  {(item as any).percentage > 0 ? '+' : ''}{(item as any).percentage}%
                </div>
                {(item as any).trend === 'up' && (
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                  </svg>
                )}
                {(item as any).trend === 'down' && (
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                  </svg>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 进度指示器 */}
      <div className="p-3 bg-gray-50 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">统计 {index + 1}/{data.items.length}</span>
          <div className="flex gap-1">
            {data.items.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i === index ? 'bg-indigo-500' : 'bg-gray-200'}`}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 媒体卡片布局
const renderMediaCard = (data: CardType, item: CardItemType, index: number, posterFormat: string) => {
  const theme = data.theme;
  const primaryColor = theme?.primaryColor || '#EC4899';
  const isMediaItem = item.type === 'media';

  return (
    <div className="flex flex-col h-full rounded-lg overflow-hidden bg-white">
      {/* 媒体内容 */}
      {isMediaItem && 'visualElement' in item && (
        <div className="w-full h-48 bg-gray-100">
          <img
            src={(item as any).visualElement.source}
            alt={(item as any).visualElement.alt || item.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* 卡片内容 */}
      <div className="flex-grow p-5">
        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
        <p className="text-sm text-gray-600 mb-3">{item.description}</p>

        {isMediaItem && 'caption' in item && (item as any).caption && (
          <div className="text-xs text-gray-500 italic mt-2">
            {(item as any).caption}
          </div>
        )}

        {/* 链接 */}
        {item.link && (
          <div className="mt-3">
            <a
              href={item.link.url}
              target={item.link.isExternal ? "_blank" : undefined}
              rel={item.link.isExternal ? "noopener noreferrer" : undefined}
              className="inline-flex items-center text-sm hover:underline"
              style={{ color: primaryColor }}
            >
              {item.link.text || "查看详情"}
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </a>
          </div>
        )}
      </div>

      {/* 进度指示器 */}
      <div className="p-3 bg-gray-50 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">媒体 {index + 1}/{data.items.length}</span>
          <div className="flex gap-1">
            {data.items.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i === index ? 'bg-pink-500' : 'bg-gray-200'}`}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 位置卡片布局
const renderLocationCard = (data: CardType, item: CardItemType, index: number, posterFormat: string) => {
  const theme = data.theme;
  const primaryColor = theme?.primaryColor || '#10B981';
  const isLocationItem = item.type === 'location';

  return (
    <div className="flex flex-col h-full rounded-lg overflow-hidden bg-white">
      {/* 卡片头部 */}
      <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
        <h2 className="text-xl font-bold">{data.title}</h2>
        {data.subtitle && (
          <p className="text-sm opacity-90 mt-1">{data.subtitle}</p>
        )}
      </div>

      {/* 位置内容 */}
      <div className="flex-grow p-5">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
            {isLocationItem && 'location' in item && (
              <div className="text-sm font-medium text-gray-700 mb-1">
                {(item as any).location}
              </div>
            )}
            {isLocationItem && 'address' in item && (item as any).address && (
              <div className="text-sm text-gray-500 mb-2">
                {(item as any).address}
              </div>
            )}
            <p className="text-sm text-gray-600 mt-2">{item.description}</p>
          </div>
        </div>

        {/* 地图链接 */}
        {isLocationItem && 'mapUrl' in item && (item as any).mapUrl && (
          <div className="mt-4 p-2 bg-gray-50 rounded-lg border border-gray-100 text-center">
            <a
              href={(item as any).mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center text-sm font-medium"
              style={{ color: primaryColor }}
            >
              在地图中查看
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </a>
          </div>
        )}
      </div>

      {/* 进度指示器 */}
      <div className="p-3 bg-gray-50 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">位置 {index + 1}/{data.items.length}</span>
          <div className="flex gap-1">
            {data.items.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i === index ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 键值对卡片布局
const renderKeyValueCard = (data: CardType, item: CardItemType, index: number, posterFormat: string) => {
  const theme = data.theme;
  const primaryColor = theme?.primaryColor || '#F59E0B';
  const isKeyValueItem = item.type === 'keyValue';

  return (
    <div className="flex flex-col h-full rounded-lg overflow-hidden bg-white">
      {/* 卡片头部 */}
      <div className="p-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
        <h2 className="text-xl font-bold">{data.title}</h2>
        {data.subtitle && (
          <p className="text-sm opacity-90 mt-1">{data.subtitle}</p>
        )}
      </div>

      {/* 键值对内容 */}
      <div className="flex-grow p-5">
        <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
        <p className="text-sm text-gray-600 mb-4">{item.description}</p>

        {isKeyValueItem && 'keyValue' in item && (
          <div className={`mt-3 grid gap-3 ${(item as any).layout === 'horizontal' ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {Object.entries((item as any).keyValue).map(([key, value], idx) => (
              <div key={idx} className={`${(item as any).layout === 'horizontal' ? '' : 'flex justify-between'} py-2 border-b border-gray-100`}>
                <div className="text-sm font-medium text-gray-600">{key}</div>
                <div className="text-sm text-gray-800">{value as string}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 进度指示器 */}
      <div className="p-3 bg-gray-50 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">数据 {index + 1}/{data.items.length}</span>
          <div className="flex gap-1">
            {data.items.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i === index ? 'bg-amber-500' : 'bg-gray-200'}`}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 模板卡片布局
const renderTemplateCard = (data: CardType, item: CardItemType, index: number, posterFormat: string) => {
  const theme = data.theme;
  const primaryColor = theme?.primaryColor || '#8B5CF6';
  const isTemplateItem = item.type === 'template';

  // 处理模板文本替换变量
  const processTemplateText = (templateText: string, variables: Record<string, string> = {}) => {
    return templateText.replace(/\{(\w+)\}/g, (match, key) => {
      return variables[key] || match;
    });
  };

  return (
    <div className="flex flex-col h-full rounded-lg overflow-hidden bg-white">
      {/* 卡片头部 */}
      <div className="p-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white">
        <h2 className="text-xl font-bold">{data.title}</h2>
        {data.subtitle && (
          <p className="text-sm opacity-90 mt-1">{data.subtitle}</p>
        )}
      </div>

      {/* 模板内容 */}
      <div className="flex-grow p-5">
        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
        <p className="text-sm text-gray-600 mb-4">{item.description}</p>

        {isTemplateItem && 'templateText' in item && (
          <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-sm whitespace-pre-wrap">
              {processTemplateText(
                (item as any).templateText,
                { ...((data as any).globalVariables || {}), ...((item as any).variables || {}) }
              )}
            </div>
          </div>
        )}
      </div>

      {/* 进度指示器 */}
      <div className="p-3 bg-gray-50 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">模板 {index + 1}/{data.items.length}</span>
          <div className="flex gap-1">
            {data.items.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i === index ? 'bg-violet-500' : 'bg-gray-200'}`}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

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
        // boxShadow: getTemplateById(posterFormat).style.boxShadow
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