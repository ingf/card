import { Card as CardType } from '@/lib/schemas/card'
import { cn } from '@/lib/utils'

interface CardProps {
  data: CardType
}

export function Card({ data }: CardProps) {
  const {
    title,
    items,
    theme = {},
    layout = { type: 'grid', columns: 2 }
  } = data

  const {
    primaryColor = '#FF9966',
    backgroundColor = '#FFFFFF',
    textColor = '#000000'
  } = theme

  return (
    <div className="w-full max-w-5xl mx-auto p-6" 
         style={{ backgroundColor }}>
      <h1 className="text-4xl font-bold text-center mb-12"
          style={{ color: textColor }}>
        {title}
      </h1>
      
      <div className={cn(
        "grid gap-8",
        layout.type === 'grid' && {
          'grid-cols-1 md:grid-cols-2': layout.columns === 2,
          'grid-cols-1 md:grid-cols-3': layout.columns === 3,
          'grid-cols-1 md:grid-cols-4': layout.columns === 4
        }
      )}>
        {items.map((item) => (
          <div key={item.id} 
               className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              {/* 标题区域 */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                     style={{ backgroundColor: primaryColor }}>
                  <span className="text-xl font-bold text-white">
                    {item.id}
                  </span>
                </div>
                <h3 className="text-xl font-semibold flex-grow">
                  {item.title}
                </h3>
                {item.visualElement && (
                  <div className="flex-shrink-0 w-12 h-12">
                    {item.visualElement.type === 'icon' ? (
                      <img 
                        src={item.visualElement.source} 
                        alt={item.visualElement.alt || item.title}
                        className="w-full h-full object-contain"
                      />
                    ) : null}
                  </div>
                )}
              </div>

              {/* 描述文本 */}
              <p className="text-gray-600 mb-4">
                {item.description}
              </p>

              {/* Action Step */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-sm font-medium text-gray-900 mb-1">
                  Action Step:
                </div>
                <p className="text-gray-600">
                  {item.actionStep}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 