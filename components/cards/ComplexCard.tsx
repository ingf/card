import { BaseCardProps } from "./BaseCard";

export default function ComplexCard({ data, platformRatio = "3:4", hideNavigation = false }: BaseCardProps) {
  // 确保 items 存在
  const items = data.items || [];
  
  return (
    <div className="complex-card bg-gradient-to-br from-white to-blue-50 rounded-lg shadow-md overflow-hidden border border-gray-200">
      {/* 标题区域 - 更精美的设计 */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
        <h3 className="text-xl font-bold">{data.title}</h3>
        {data.subtitle && (
          <p className="text-blue-100 text-sm mt-1">{data.subtitle}</p>
        )}
      </div>
      
      {/* 内容区域 - 复杂布局 */}
      <div className="p-4">
        {items.map((item, index) => (
          <div key={index} className="section mb-4 bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm">
            <h4 className="font-medium text-indigo-700 mb-2 border-b border-indigo-100 pb-1">{item.title}</h4>
            <div className="text-gray-700">
              <div className="mb-2 flex items-start">
                <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-xs mr-2 mt-1">
                  {index + 1}
                </div>
                <p>{item.description}</p>
              </div>
              {item.actionStep && (
                <div className="mt-2 pl-6 text-sm text-blue-600">
                  <strong>行动步骤:</strong> {item.actionStep}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* 导航控制 */}
      {!hideNavigation && items.length > 1 && (
        <div className="flex justify-center p-2 gap-1">
          {items.map((_, idx) => (
            <div 
              key={idx} 
              className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-blue-500' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      )}
      
      {/* 底部信息 */}
      {data.footer && (
        <div className="bg-gray-50 p-3 text-xs text-gray-500 border-t border-gray-200">
          {typeof data.footer === 'string' ? data.footer : 
            data.footer.text || (data.footer.showAttribution ? "AI生成内容" : "")}
        </div>
      )}
    </div>
  );
} 