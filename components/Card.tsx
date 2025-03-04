import { Card as CardType, CardItem as CardItemType, Theme, Layout } from '@/lib/schemas/card'
import { cn } from '@/lib/utils'

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

export function Card({ data }: CardProps) {
  const {
    title,
    subtitle,
    description,
    items,
    theme: themeInput,
    layout = {
      type: 'grid',
      columns: 2,
      alignment: 'start'
    },
    footer
  } = data

  // 创建默认主题
  const defaultTheme: Theme = {
    primaryColor: '#FF9966',
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
    borderRadius: '0.5rem',
    cardStyle: 'elevated',
    colorScheme: 'light',
    animation: 'none'
  };

  // 合并用户提供的主题和默认主题
  const theme: Theme = {
    ...defaultTheme,
    ...(themeInput || {})
  };

  // 动画类
  const animationClasses = {
    'none': '',
    'fade': 'animate-fade-in',
    'slide': 'animate-slide-in',
    'zoom': 'animate-zoom-in'
  };

  // 布局类
  const getLayoutClasses = () => {
    if (layout.type === 'grid') {
      return {
        'grid-cols-1': true,
        'md:grid-cols-2': layout.columns === 2,
        'md:grid-cols-3': layout.columns === 3,
        'md:grid-cols-4': layout.columns === 4,
        'md:grid-cols-5': layout.columns === 5,
        'md:grid-cols-6': layout.columns === 6,
      };
    }

    if (layout.type === 'masonry') {
      return {
        'columns-1': true,
        'md:columns-2': layout.columns === 2,
        'md:columns-3': layout.columns === 3,
        'md:columns-4': layout.columns === 4,
        'space-y-4': true
      };
    }

    return {};
  };

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
          style={{ color: theme.textColor }}
        >
          {title}
        </h1>

        {subtitle && (
          <h2
            className="text-xl text-gray-600 mb-4"
            style={{ color: `${theme.textColor}99` }}
          >
            {subtitle}
          </h2>
        )}

        {description && (
          <p
            className="max-w-2xl mx-auto text-gray-600"
            style={{ color: `${theme.textColor}99` }}
          >
            {description}
          </p>
        )}
      </div>

      {/* 内容区域 - 根据布局类型渲染 */}
      {layout.type === 'grid' || layout.type === 'masonry' ? (
        <div className={cn(
          layout.type === 'grid' ? 'grid' : '',
          "gap-8",
          getLayoutClasses()
        )}>
          {items.map((item) => (
            <div key={item.id} className={layout.type === 'masonry' ? 'mb-4 break-inside-avoid' : ''}>
              <CardItem item={item} theme={theme} layout={layout} />
            </div>
          ))}
        </div>
      ) : layout.type === 'list' ? (
        <div className="space-y-4">
          {items.map((item) => (
            <CardItem key={item.id} item={item} theme={theme} layout={layout} />
          ))}
        </div>
      ) : layout.type === 'timeline' ? (
        <div className="relative border-l-2 border-gray-200 ml-6 pl-8 space-y-8">
          {items.map((item) => (
            <div key={item.id} className="relative">
              <div
                className="absolute w-4 h-4 rounded-full -left-10 top-2"
                style={{ backgroundColor: theme.primaryColor }}
              />
              <CardItem item={item} theme={theme} layout={layout} />
            </div>
          ))}
        </div>
      ) : layout.type === 'tabs' ? (
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
                layout={layout}
              />
            ) : (
              <CardItem item={items[0]} theme={theme} layout={layout} />
            )}
          </div>
        </div>
      ) : layout.type === 'accordion' ? (
        <div className="space-y-2">
          {items.map((item) => (
            <details
              key={item.id}
              className="border rounded-lg overflow-hidden"
              open={item.highlight}
            >
              <summary
                className="p-4 cursor-pointer font-medium flex justify-between items-center"
                style={{ backgroundColor: `${theme.primaryColor}10` }}
              >
                <span>{item.title}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="p-4">
                <p>{item.description}</p>
                {item.actionStep && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium mb-1">Action Step:</div>
                    <p className="text-gray-600">{item.actionStep}</p>
                  </div>
                )}
              </div>
            </details>
          ))}
        </div>
      ) : layout.type === 'carousel' ? (
        <div className="relative overflow-hidden">
          <div className="flex overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-hide">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-full md:w-1/2 px-2 snap-start"
                style={{ scrollSnapAlign: 'start' }}
              >
                <CardItem item={item} theme={theme} layout={layout} />
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-2">
            {items.map((_, index) => (
              <button
                key={index}
                className="w-2 h-2 rounded-full bg-gray-300"
                style={{ backgroundColor: index === 0 ? theme.primaryColor : undefined }}
              />
            ))}
          </div>
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