import type { Card as CardType } from "@/lib/schemas/card";

export interface BaseCardProps {
  data: CardType;
  platformRatio?: string;
  hideNavigation?: boolean;
}

export default function BaseCard({ data, platformRatio = "3:4", hideNavigation = false }: BaseCardProps) {
  // 基础卡片的共享逻辑和属性
  return (
    <div className="base-card">
      {/* 基础卡片内容 */}
      <h3 className="text-lg font-bold text-gray-800 mb-1">{data.title}</h3>
      {data.subtitle && (
        <p className="text-gray-600 text-sm">{data.subtitle}</p>
      )}
    </div>
  );
} 