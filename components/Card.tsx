import { Card as CardType, CardItem as CardItemType, Theme, Layout } from '@/lib/schemas/card'
import { cn } from '@/lib/utils'
import { useState, useCallback, useEffect } from 'react'
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CardProps {
  data: CardType;
  platformRatio?: string;
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

  // 数字标记位置
  const numberPosition = layout?.itemStyle?.numberStyle?.position || 'center-left';
  const numberShape = layout?.itemStyle?.numberStyle?.shape || 'circle';

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
        <div className={cn(
          "flex items-center gap-4 mb-4",
          {
            'flex-row': numberPosition === 'center-left',
            'flex-row-reverse': numberPosition === 'top-right',
            'justify-between': numberPosition === 'top-right',
          }
        )}>
          {layout?.itemStyle?.numberStyle?.show !== false && (
            <div
              className={cn(
                "flex-shrink-0 w-10 h-10 flex items-center justify-center",
                numberShapeClasses[numberShape as keyof typeof numberShapeClasses]
              )}
              style={{
                backgroundColor: primaryColor,
                color: 'white',
                width: layout?.itemStyle?.numberStyle?.size ? `${layout.itemStyle.numberStyle.size}px` : undefined,
                height: layout?.itemStyle?.numberStyle?.size ? `${layout.itemStyle.numberStyle.size}px` : undefined,
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

export function Card({ data, platformRatio = "default" }: CardProps) {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const slideRef = React.useRef<HTMLDivElement>(null);

  // 处理滑动到下一张卡片
  const nextSlide = () => {
    if (!data.items || currentSlide >= data.items.length - 1) return;
    setCurrentSlide(prev => prev + 1);
  };

  // 处理滑动到上一张卡片
  const prevSlide = () => {
    if (currentSlide <= 0) return;
    setCurrentSlide(prev => prev - 1);
  };

  // 获取当前平台的比例配置
  const ratioConfig = platformRatios[platformRatio as keyof typeof platformRatios] || platformRatios.default;

  // 当布局类型为 carousel 时使用纵向滑动布局
  const isCarousel = data.layout?.type === "carousel";

  // 根据布局类型选择不同的渲染方式
  if (isCarousel) {
    return (
      <div className="w-full">
        <h2 className="text-2xl font-bold text-center mb-6">{data.title}</h2>

        {data.subtitle && (
          <p className="text-gray-600 text-center mb-8">{data.subtitle}</p>
        )}

        {/* 平台比例指示器 */}
        <div className="text-center mb-4 text-sm text-gray-500">
          {platformRatio !== "default" ? `${platformRatio} 比例` : "默认比例"}
        </div>

        {/* 手机框架容器 - 使用动态比例 */}
        <div className={`mx-auto ${ratioConfig.class}`} style={{ maxWidth: ratioConfig.width }}>
          {/* 手机框架 */}
          <div className="bg-white rounded-[32px] shadow-xl border border-gray-200 overflow-hidden h-full flex flex-col relative">
            {/* 手机顶部状态栏 */}
            <div className="bg-gray-100 h-6 min-h-[24px] w-full flex items-center justify-between px-4 border-b border-gray-200">
              <div className="w-16 h-2 bg-gray-300 rounded-full"></div>
              <div className="w-4 h-2 bg-gray-300 rounded-full"></div>
            </div>

            {/* 指示器和导航 */}
            <div className="flex justify-between items-center px-4 py-2 bg-white">
              <div className="text-gray-500 text-sm">
                {currentSlide + 1} / {data.items?.length || 1}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={prevSlide}
                  disabled={currentSlide === 0}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg p-1.5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  aria-label="上一张"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <button
                  onClick={nextSlide}
                  disabled={!data.items || currentSlide >= data.items.length - 1}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg p-1.5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  aria-label="下一张"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* 轮播内容 - 纵向设计 */}
            <div ref={slideRef} className="px-4 flex-grow overflow-y-auto">
              <div className="transition-all duration-300 ease-in-out h-full">
                {data.items && data.items[currentSlide] && (
                  <div className="w-full h-full">
                    <div className="bg-white rounded-xl overflow-hidden mb-4 h-full flex flex-col">
                      {/* 卡片头部 */}
                      <div className="flex items-center gap-3 p-3 border-b border-gray-100">
                        <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                          {currentSlide + 1}
                        </div>

                        <h3 className="text-base font-bold text-gray-800 line-clamp-1">
                          {data.items[currentSlide].title}
                        </h3>
                      </div>

                      {/* 卡片内容 */}
                      <div className="p-3 text-gray-700 leading-relaxed flex-grow overflow-y-auto text-sm">
                        {data.items[currentSlide].description}
                      </div>

                      {/* 行动步骤 (如果有) */}
                      {data.items[currentSlide].actionStep && (
                        <div className="mx-3 mb-3 p-2 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="font-medium text-blue-800 text-xs">行动步骤:</div>
                          <div className="text-blue-700 text-xs">
                            {data.items[currentSlide].actionStep}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 底部指示器点 */}
            <div className="flex justify-center py-2 gap-1.5">
              {data.items && data.items.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${currentSlide === index ? 'bg-blue-500 w-3' : 'bg-gray-300'}`}
                  aria-label={`跳转到第 ${index + 1} 张`}
                />
              ))}
            </div>

            {/* 手机底部导航栏 */}
            <div className="h-1 bg-gray-200 rounded-full mx-auto w-1/3 mb-2"></div>
          </div>
        </div>
      </div>
    );
  }

  // 默认网格布局 - 修改文字颜色为黑色
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">{data.title}</h2>

      {data.subtitle && (
        <p className="text-gray-600 text-center mb-8">{data.subtitle}</p>
      )}

      {/* 网格布局 */}
      <div className={`
        grid gap-6
        ${data.layout?.columns === 1 ? 'grid-cols-1' :
          data.layout?.columns === 2 ? 'grid-cols-1 md:grid-cols-2' :
            'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}
        ${data.layout?.alignment === 'left' ? 'text-left' :
          data.layout?.alignment === 'right' ? 'text-right' :
            'text-center'}
      `}>
        {data.items?.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
          >
            {/* 卡片头部 */}
            <div className="border-b border-gray-100 p-4 flex items-center gap-3">
              <div className="bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">{index + 1}</span>
              </div>

              {item.title && (
                <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
              )}
            </div>

            {/* 卡片内容 */}
            <div className="p-4 text-gray-700">
              {item.description}
            </div>

            {/* 行动步骤 (如果有) */}
            {item.actionStep && (
              <div className="mx-4 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="font-medium text-blue-800 mb-1 text-sm">行动步骤:</div>
                <div className="text-blue-700 text-sm">
                  {item.actionStep}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 