import { Card as CardType, CardItem as CardItemType, Theme, Layout } from '@/lib/schemas/card'
import { cn } from '@/lib/utils'
import { useState, useCallback, useEffect } from 'react'

interface CardProps {
  data: CardType
}

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

export function Card({ data }: CardProps) {
  const {
    title,
    subtitle,
    description,
    layout: layoutInput = {
      type: 'grid',
      columns: 2,
      alignment: 'start'
    },
    theme: themeInput = {},
    items = [],
    footer
  } = data;

  // 设置默认主题
  const defaultTheme: Theme = {
    primaryColor: '#3b82f6',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    cardStyle: 'elevated',
    borderRadius: '0.5rem',
    colorScheme: 'light',
    animation: 'none'
  };

  // 使用合并后的主题
  const theme: Theme = {
    ...defaultTheme,
    ...themeInput
  };

  const textColor = theme.textColor;

  // 轮播状态
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const totalSlides = items.length;

  // 轮播导航函数
  const goToSlide = useCallback((index: number) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setActiveSlide(index);

    // 找到对应的元素并滚动到视图
    const slideElement = document.getElementById(`carousel-slide-${index}`);
    if (slideElement) {
      slideElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }

    // 动画完成后重置状态
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  }, [isAnimating]);

  const goToNextSlide = useCallback(() => {
    const nextSlide = (activeSlide + 1) % totalSlides;
    goToSlide(nextSlide);
  }, [activeSlide, totalSlides, goToSlide]);

  const goToPrevSlide = useCallback(() => {
    const prevSlide = (activeSlide - 1 + totalSlides) % totalSlides;
    goToSlide(prevSlide);
  }, [activeSlide, totalSlides, goToSlide]);

  // 自动轮播
  useEffect(() => {
    if (layoutInput.type === 'carousel' && totalSlides > 1) {
      const interval = setInterval(() => {
        goToNextSlide();
      }, 5000); // 5秒切换一次

      return () => clearInterval(interval);
    }
  }, [layoutInput.type, totalSlides, goToNextSlide]);

  // 动画类
  const animationClasses = {
    'none': '',
    'fade': 'animate-fade-in',
    'slide': 'animate-slide-in',
    'zoom': 'animate-zoom-in'
  };

  // 布局类
  const getLayoutClasses = () => {
    if (layoutInput.type === 'grid') {
      return {
        'grid-cols-1': true,
        'md:grid-cols-2': layoutInput.columns === 2,
        'md:grid-cols-3': layoutInput.columns === 3,
        'md:grid-cols-4': layoutInput.columns === 4,
        'md:grid-cols-5': layoutInput.columns === 5,
        'md:grid-cols-6': layoutInput.columns === 6,
      };
    }

    if (layoutInput.type === 'masonry') {
      return {
        'columns-1': true,
        'md:columns-2': layoutInput.columns === 2,
        'md:columns-3': layoutInput.columns === 3,
        'md:columns-4': layoutInput.columns === 4,
        'space-y-4': true
      };
    }

    return {};
  };

  // 教育模板渲染
  if (layoutInput.type === 'education') {
    const educationBorderColor = layoutInput.templateStyle?.borderColor || '#FF5722';
    const educationHeaderBgColor = layoutInput.templateStyle?.headerBgColor || '#FF5722';
    const educationBodyBgColor = layoutInput.templateStyle?.bodyBgColor || '#ffffff';
    const educationNumberBgColor = layoutInput.templateStyle?.numberBgColor || '#FF5722';

    return (
      <div className="w-full max-w-5xl mx-auto animate-fade-in">
        <div
          className="rounded-lg overflow-hidden border-4 education-template"
          style={{
            borderColor: educationBorderColor,
            backgroundColor: educationBodyBgColor,
            fontFamily: layoutInput.templateStyle?.bodyFont || "'Noto Sans SC', sans-serif"
          }}
        >
          {/* 标题区域 */}
          <div
            className="p-4 text-center relative"
            style={{
              backgroundColor: educationHeaderBgColor,
              color: '#ffffff',
              fontFamily: layoutInput.templateStyle?.headerFont || "'Noto Sans SC', sans-serif",
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E\")"
            }}
          >
            <div className="absolute right-2 top-2 bg-black text-white px-3 py-1 text-sm font-bold">
              建议收藏
            </div>
            <h1 className="text-3xl font-bold mb-2 mt-4">{title}</h1>
            {subtitle && <h2 className="text-xl opacity-90 mb-2">{subtitle}</h2>}
          </div>

          {/* 内容区域 */}
          <div className="p-6">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="mb-8 last:mb-0"
              >
                <div className="flex items-start gap-4 mb-2">
                  <div
                    className="flex-shrink-0 w-14 h-14 flex items-center justify-center text-2xl font-bold"
                    style={{
                      backgroundColor: educationNumberBgColor,
                      color: '#ffffff',
                      borderRadius: '4px'
                    }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-xl font-bold mt-2">{item.title}</h3>
                </div>

                <div
                  className="ml-18 pl-4 border-l-2 py-2"
                  style={{ borderColor: educationBorderColor }}
                >
                  <p className="text-gray-700 whitespace-pre-line">{item.description}</p>

                  {item.actionStep && (
                    <div className="mt-3 text-gray-600 italic">
                      {item.actionStep}
                    </div>
                  )}
                </div>

                {index < items.length - 1 && (
                  <div
                    className="border-b my-6 mx-4"
                    style={{
                      borderStyle: (layoutInput.templateStyle?.dividerStyle as any) || 'dashed',
                      borderColor: educationBorderColor
                    }}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 金融模板渲染
  if (layoutInput.type === 'finance') {
    const financeHeaderColor = layoutInput.templateStyle?.headerBgColor || '#1890FF';
    const financeDotColor = layoutInput.templateStyle?.dotColor || '#1890FF';
    const financeBodyBgColor = layoutInput.templateStyle?.bodyBgColor || '#E6F7FF';

    return (
      <div className="w-full max-w-5xl mx-auto animate-fade-in">
        <div
          className="rounded-lg overflow-hidden finance-template"
          style={{
            backgroundColor: financeBodyBgColor,
            fontFamily: layoutInput.templateStyle?.bodyFont || "'Noto Sans SC', sans-serif"
          }}
        >
          {/* 标题区域 */}
          <div className="p-4 text-center relative">
            <div className="finance-dots-top" style={{ backgroundImage: `radial-gradient(circle, ${financeHeaderColor} 3px, transparent 3px)` }}></div>
            <h1
              className="text-3xl font-bold mb-2 mt-4"
              style={{
                color: financeHeaderColor,
                fontFamily: layoutInput.templateStyle?.headerFont || "'Noto Sans SC', sans-serif"
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <h2
                className="text-xl mb-2"
                style={{ color: financeHeaderColor }}
              >
                {subtitle}
              </h2>
            )}
            <div className="finance-dots-bottom" style={{ backgroundImage: `radial-gradient(circle, ${financeHeaderColor} 3px, transparent 3px)` }}></div>
          </div>

          {/* 内容区域 */}
          <div className="p-6">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="mb-6 last:mb-0 bg-white rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: financeDotColor }}
                  >
                    Q
                  </div>
                  <h3
                    className="text-lg font-bold"
                    style={{ color: financeHeaderColor }}
                  >
                    {item.title}
                  </h3>
                </div>

                <div className="ml-9">
                  <p className="text-gray-700">{item.description}</p>

                  {item.actionStep && (
                    <div
                      className="mt-3 p-2 rounded-lg"
                      style={{ backgroundColor: `${financeDotColor}15` }}
                    >
                      <span className="font-medium">提示：</span> {item.actionStep}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 页脚 */}
          {footer && footer.text && (
            <div
              className="p-3 text-center text-sm"
              style={{ color: financeHeaderColor }}
            >
              {footer.text}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full max-w-5xl mx-auto",
        animationClasses[theme.animation as keyof typeof animationClasses]
      )}
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {/* 标题区域 */}
      <div className="mb-8 text-center">
        <h1
          className="text-4xl font-bold mb-2"
          style={{ color: textColor }}
        >
          {title}
        </h1>

        {subtitle && (
          <h2
            className="text-xl text-gray-600 mb-4"
            style={{ color: `${textColor}99` }}
          >
            {subtitle}
          </h2>
        )}

        {description && (
          <p
            className="max-w-2xl mx-auto text-gray-600"
            style={{ color: `${textColor}99` }}
          >
            {description}
          </p>
        )}
      </div>

      {/* 内容区域 - 根据布局类型渲染 */}
      {layoutInput.type === 'grid' || layoutInput.type === 'masonry' ? (
        <div className={cn(
          layoutInput.type === 'grid' ? 'grid' : '',
          "gap-8",
          getLayoutClasses()
        )}>
          {items.map((item) => (
            <div key={item.id} className={layoutInput.type === 'masonry' ? 'mb-4 break-inside-avoid' : ''}>
              <CardItem item={item} theme={theme} layout={layoutInput} />
            </div>
          ))}
        </div>
      ) : layoutInput.type === 'list' ? (
        <div className="space-y-4">
          {items.map((item) => (
            <CardItem key={item.id} item={item} theme={theme} layout={layoutInput} />
          ))}
        </div>
      ) : layoutInput.type === 'timeline' ? (
        <div className="relative border-l-2 border-gray-200 ml-6 pl-8 space-y-8">
          {items.map((item) => (
            <div key={item.id} className="relative">
              <div
                className="absolute w-4 h-4 rounded-full -left-10 top-2"
                style={{ backgroundColor: theme.primaryColor }}
              />
              <CardItem item={item} theme={theme} layout={layoutInput} />
            </div>
          ))}
        </div>
      ) : layoutInput.type === 'tabs' ? (
        <div className="flex flex-col">
          <div className="flex border-b overflow-x-auto">
            {items.map((item) => (
              <button
                key={item.id}
                className="px-4 py-2 font-medium border-b-2 border-transparent hover:border-gray-300"
                style={{ borderBottomColor: item.highlight ? theme.primaryColor : 'transparent' }}
              >
                {item.title}
              </button>
            ))}
          </div>
          <div className="p-4">
            {items.find(item => item.highlight) ? (
              <CardItem
                item={items.find(item => item.highlight) || items[0]}
                theme={theme}
                layout={layoutInput}
              />
            ) : (
              <CardItem item={items[0]} theme={theme} layout={layoutInput} />
            )}
          </div>
        </div>
      ) : layoutInput.type === 'accordion' ? (
        <div className="space-y-3">
          {items.map((item, index) => (
            <details
              key={item.id}
              className={`border rounded-lg overflow-hidden transition-all duration-200 ${item.highlight ? 'shadow-md' : 'shadow-sm'
                }`}
              open={item.highlight}
            >
              <summary
                className="p-4 cursor-pointer font-medium flex justify-between items-center hover:bg-gray-50 transition-colors"
                style={{
                  backgroundColor: item.highlight ? `${theme.primaryColor}15` : `${theme.primaryColor}05`,
                  borderLeft: item.highlight ? `3px solid ${theme.primaryColor}` : 'none',
                  color: textColor
                }}
              >
                <div className="flex items-center gap-3">
                  {layoutInput.itemStyle?.numberStyle?.show && (
                    <div
                      className="flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-medium flex-shrink-0"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      {index + 1}
                    </div>
                  )}
                  <span className="line-clamp-1">{item.title}</span>
                </div>
                <svg
                  className="w-5 h-5 transition-transform duration-200"
                  style={{ transform: item.highlight ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="p-4 animate-fade-in">
                {item.visualElement && (
                  <div className={`mb-3 ${item.visualElement.position === 'top' ? 'w-full' :
                    item.visualElement.position === 'right' ? 'float-right ml-4 mb-2' :
                      item.visualElement.position === 'left' ? 'float-left mr-4 mb-2' : ''
                    }`} style={{
                      maxWidth: item.visualElement.position === 'top' ? '100%' : '40%',
                    }}>
                    {item.visualElement.type === 'icon' ? (
                      <div
                        className="w-10 h-10 flex items-center justify-center rounded-full"
                        style={{ backgroundColor: `${theme.primaryColor}20` }}
                      >
                        <span className="text-xl" style={{ color: theme.primaryColor }}>
                          {item.icon?.value || '📌'}
                        </span>
                      </div>
                    ) : item.visualElement.type === 'image' ? (
                      <img
                        src={item.visualElement.source}
                        alt={item.visualElement.alt || item.title}
                        className="w-full h-auto rounded-lg object-cover"
                      />
                    ) : null}
                  </div>
                )}
                <p className="text-gray-700">{item.description}</p>
                {item.actionStep && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="text-sm font-medium mb-1 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                      行动步骤:
                    </div>
                    <p className="text-gray-600">{item.actionStep}</p>
                  </div>
                )}
              </div>
            </details>
          ))}
        </div>
      ) : layoutInput.type === 'carousel' ? (
        <div className="relative overflow-hidden rounded-lg carousel-container">
          {/* 导航按钮 */}
          {totalSlides > 1 && (
            <>
              <CarouselNavButton direction="prev" onClick={goToPrevSlide} color={theme.primaryColor} />
              <CarouselNavButton direction="next" onClick={goToNextSlide} color={theme.primaryColor} />
            </>
          )}

          {/* 轮播内容 */}
          <div className="flex overflow-x-auto snap-x snap-mandatory pb-8 scrollbar-hide carousel-slides">
            {items.map((item, index) => (
              <div
                id={`carousel-slide-${index}`}
                key={item.id}
                className={cn(
                  "flex-shrink-0 w-full px-4 snap-start transition-opacity duration-300",
                  {
                    "opacity-100": activeSlide === index,
                    "opacity-60": activeSlide !== index
                  }
                )}
                style={{ scrollSnapAlign: 'start' }}
              >
                <CardItem item={item} theme={theme} layout={layoutInput} />
              </div>
            ))}
          </div>

          {/* 指示器 */}
          {totalSlides > 1 && (
            <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center py-2">
              <div className="flex space-x-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                {items.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={cn(
                      "transition-all duration-300 rounded-full focus:outline-none",
                      activeSlide === index ? "w-6 h-2" : "w-2 h-2"
                    )}
                    style={{
                      backgroundColor: activeSlide === index
                        ? theme.primaryColor
                        : `${theme.primaryColor}40`
                    }}
                    aria-label={`转到幻灯片 ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* 页脚 */}
      {footer && footer.text && (
        <div className="mt-8 text-center text-sm text-gray-500">
          {footer.text}
          {footer.showAttribution && (
            <div className="mt-2">
              Generated with AI
            </div>
          )}
        </div>
      )}
    </div>
  )
} 