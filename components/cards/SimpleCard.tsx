import { BaseCardProps } from "./BaseCard";
import type { Section } from "@/lib/schemas/card";

// 定义 Section 类型（如果 lib/schemas/card 中没有定义）
interface CardSection {
  title?: string;
  content?: string[];
}

// 扩展 Props 以包含变体
interface SimpleCardProps extends BaseCardProps {
  variant?: 'standard' | 'large-title' | 'blog' | 'marketing';
}

export default function SimpleCard({
  data,
  platformRatio = "3:4",
  hideNavigation = false,
  variant = 'standard'
}: SimpleCardProps) {
  // 确保 items 存在
  const items = data.items || [];

  // 创建 sections 数据结构（如果需要）
  const sections = [{
    title: "内容要点",
    content: items.map(item => `${item.title}: ${item.description.substring(0, 50)}...`)
  }];

  // 根据变体选择主题色
  const getThemeColor = () => {
    switch (variant) {
      case 'large-title': return "yellow";
      case 'blog': return "orange";
      case 'marketing': return "pink";
      default: return "amber";
    }
  };

  const themeColor = getThemeColor();

  // 根据变体渲染不同的卡片样式
  switch (variant) {
    case 'large-title':
      return (
        <div className={`simple-card bg-${themeColor}-50 rounded-lg shadow-md overflow-hidden border border-${themeColor}-100`} style={{ width: "100%", maxWidth: "360px" }}>
          {/* 大字标题样式 */}
          <div className={`p-6 text-center bg-${themeColor}-500 text-white`}>
            <h3 className="text-3xl font-black">{data.title}</h3>
            {data.subtitle && (
              <div className="mt-2 text-sm text-white/80">{data.subtitle}</div>
            )}
          </div>

          {/* 内容区域 */}
          <div className="p-4 space-y-4">
            {data.items && data.items.map((item, index) => (
              <div key={index} className="flex items-start">
                <div className={`flex-shrink-0 bg-${themeColor}-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-1`}>
                  <span className="text-xs">{index + 1}</span>
                </div>
                <div className="flex-grow">
                  <h4 className={`text-sm font-bold text-${themeColor}-800`}>{item.title}</h4>
                  <p className={`text-xs text-${themeColor}-700 mt-1`}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 底部按钮 */}
          <div className={`bg-${themeColor}-50 p-3 flex justify-center`}>
            <button className={`px-4 py-2 bg-${themeColor}-500 text-white text-sm rounded-full hover:bg-${themeColor}-600 transition-colors`}>
              速来投递！
            </button>
          </div>
        </div>
      );

    case 'blog':
      return (
        <div className={`blog-card bg-white rounded-lg shadow-md overflow-hidden border border-${themeColor}-100`} style={{ width: "100%", maxWidth: "360px" }}>
          {/* 博客风格 - 图片网格 */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-gray-100">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`aspect-square bg-${themeColor}-200 rounded`}>
                {/* 这里可以放图片 */}
              </div>
            ))}
          </div>

          {/* 标题区域 */}
          <div className="p-3 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800">{data.title}</h3>
            {data.subtitle && (
              <p className="text-gray-500 text-xs mt-1">{data.subtitle}</p>
            )}
          </div>

          {/* 内容区域 */}
          <div className="p-3 text-sm text-gray-600">
            <p>整理照片并拼成blog样式</p>
          </div>

          {/* 底部信息 */}
          <div className="bg-gray-50 p-3 text-xs text-gray-500 border-t border-gray-100 flex justify-between items-center">
            <span>AI生成内容</span>
            <button className={`px-3 py-1 bg-${themeColor}-500 text-white text-xs rounded-full`}>
              查看详情
            </button>
          </div>
        </div>
      );

    case 'marketing':
      return (
        <div className={`marketing-card bg-gradient-to-br from-${themeColor}-50 to-purple-50 rounded-lg shadow-md overflow-hidden border border-${themeColor}-100`} style={{ width: "100%", maxWidth: "360px" }}>
          {/* 营销风格 */}
          <div className="p-4 text-center">
            <div className={`inline-block p-2 rounded-full bg-${themeColor}-100 text-${themeColor}-500 mb-3`}>
              <span className="text-xl">🔊</span>
            </div>
            <h3 className={`text-xl font-bold text-${themeColor}-800`}>{data.title}</h3>
            {data.subtitle && (
              <p className={`text-${themeColor}-600 text-sm mt-1`}>{data.subtitle}</p>
            )}
          </div>

          {/* 内容区域 */}
          <div className="p-4 bg-white/80 backdrop-blur-sm space-y-3">
            {data.items && data.items.map((item, index) => (
              <div key={index} className={`p-3 rounded-lg bg-white border border-${themeColor}-100 shadow-sm`}>
                <h4 className={`text-sm font-bold text-${themeColor}-800`}>{item.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{item.description}</p>
              </div>
            ))}
          </div>

          {/* 底部按钮 */}
          <div className="p-4 flex justify-center">
            <button className={`px-6 py-2 bg-gradient-to-r from-${themeColor}-500 to-purple-500 text-white text-sm rounded-full shadow-md hover:shadow-lg transition-all`}>
              了解更多
            </button>
          </div>
        </div>
      );

    case 'standard':
    default:
      return (
        <div className={`simple-card bg-${themeColor}-50 rounded-lg shadow-md overflow-hidden border border-${themeColor}-100`} style={{ width: "100%", maxWidth: "360px" }}>
          {/* 标题区域 */}
          <div className={`p-4 text-center border-b border-${themeColor}-100`}>
            <h3 className={`text-xl font-bold text-${themeColor}-800`}>{data.title}</h3>
            {data.subtitle && (
              <div className={`inline-block px-3 py-1 bg-${themeColor}-500 text-white text-xs rounded-full mt-2`}>
                {data.subtitle}
              </div>
            )}
          </div>

          {/* 内容区域 - 简单布局 */}
          <div className="p-4 space-y-4">
            {data.items && data.items.map((item, index) => (
              <div key={index} className="flex items-start">
                <div className={`flex-shrink-0 bg-${themeColor}-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-1`}>
                  <span className="text-xs">{index + 1}</span>
                </div>
                <div className="flex-grow">
                  <h4 className={`text-sm font-bold text-${themeColor}-800`}>{item.title}</h4>
                  <p className={`text-xs text-${themeColor}-700 mt-1`}>{item.description}</p>
                </div>
              </div>
            ))}

            {/* 如果没有 items 但有 sections，则显示 sections */}
            {(!data.items || data.items.length === 0) && sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="section">
                {section.title && (
                  <h4 className={`font-medium text-${themeColor}-700 mb-2`}>{section.title}</h4>
                )}
                <div className={`space-y-2 text-${themeColor}-700 text-sm`}>
                  {section.content?.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start">
                      <div className={`flex-shrink-0 bg-${themeColor}-500 text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5`}>
                        <span className="text-xs">{itemIndex + 1}</span>
                      </div>
                      <p className="flex-grow">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 底部信息 */}
          {data.footer && (
            <div className={`bg-${themeColor}-100/50 p-3 text-xs text-${themeColor}-700 border-t border-${themeColor}-100 text-center`}>
              {typeof data.footer === 'string' ? data.footer :
                data.footer.text || (data.footer.showAttribution ? "AI生成内容" : "")}
            </div>
          )}

          {/* 底部按钮 */}
          <div className={`bg-${themeColor}-50 p-3 flex justify-center`}>
            <button className={`px-4 py-2 bg-${themeColor}-500 text-white text-sm rounded-full hover:bg-${themeColor}-600 transition-colors`}>
              速来投递！
            </button>
          </div>
        </div>
      );
  }
} 