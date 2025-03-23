import { cn } from "@/lib/utils";

interface LayoutType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface LayoutSelectorProps {
  layouts: LayoutType[];
  selectedLayout: string;
  onLayoutSelect: (layoutId: string) => void;
}

export function LayoutSelector({
  layouts,
  selectedLayout,
  onLayoutSelect,
}: LayoutSelectorProps) {
  return (
    <div className="flex flex-col items-center space-y-2">
      <h3 className="text-sm font-medium text-gray-900">选择展示方式</h3>
      <div className="flex gap-2 w-full max-w-[400px]">
        {layouts.map((layout) => (
          <button
            key={layout.id}
            onClick={() => onLayoutSelect(layout.id)}
            className={cn(
              "flex-1 group relative rounded-md border overflow-hidden transition-all duration-200",
              selectedLayout === layout.id
                ? "border-blue-500 text-blue-500 bg-blue-50/50"
                : "border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600 hover:bg-gray-50/50"
            )}
          >
            {/* 图标区域 */}
            <div className="aspect-[3/2] flex items-center justify-center p-1.5 border-b border-inherit">
              <div className={cn(
                "w-8 h-8 transition-colors duration-200",
                selectedLayout === layout.id
                  ? "text-blue-500"
                  : "text-gray-400 group-hover:text-gray-600"
              )}>
                {layout.icon}
              </div>
            </div>

            {/* 文字描述区域 */}
            <div className="p-1.5 text-center bg-white/90">
              <p className={cn(
                "text-xs font-medium mb-0.5",
                selectedLayout === layout.id
                  ? "text-blue-600"
                  : "text-gray-600"
              )}>
                {layout.name}
              </p>
              <p className={cn(
                "text-[11px] leading-tight",
                selectedLayout === layout.id
                  ? "text-blue-500/80"
                  : "text-gray-500"
              )}>
                {layout.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 