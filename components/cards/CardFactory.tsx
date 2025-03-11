import { Card as CardType } from "@/lib/schemas/card";
import SimpleCard from "./SimpleCard";
import ComplexCard from "./ComplexCard";

export interface CardFactoryProps {
  data: CardType;
  platformRatio?: string;
  posterFormat: string;
  hideNavigation?: boolean;
}

export default function CardFactory({
  data,
  platformRatio = "3:4",
  posterFormat = "simple-1",
  hideNavigation = false
}: CardFactoryProps) {
  // 根据模板ID选择合适的组件
  // 简单海报模板
  if (posterFormat.startsWith("simple-")) {
    const templateNumber = parseInt(posterFormat.split("-")[1]);

    switch (templateNumber) {
      case 2:
        return <SimpleCard data={data} platformRatio={platformRatio} hideNavigation={hideNavigation} variant="large-title" />;
      case 3:
        return <SimpleCard data={data} platformRatio={platformRatio} hideNavigation={hideNavigation} variant="blog" />;
      case 4:
        return <SimpleCard data={data} platformRatio={platformRatio} hideNavigation={hideNavigation} variant="marketing" />;
      case 1:
      default:
        return <SimpleCard data={data} platformRatio={platformRatio} hideNavigation={hideNavigation} variant="standard" />;
    }
  }

  // 复杂海报模板
  if (posterFormat.startsWith("complex-")) {
    const templateNumber = parseInt(posterFormat.split("-")[1]);

    switch (templateNumber) {
      case 2:
        return <ComplexCard data={data} platformRatio={platformRatio} hideNavigation={hideNavigation} variant="learning-order" />;
      case 3:
        return <ComplexCard data={data} platformRatio={platformRatio} hideNavigation={hideNavigation} variant="study-method" />;
      case 4:
        return <ComplexCard data={data} platformRatio={platformRatio} hideNavigation={hideNavigation} variant="daily-tips" />;
      case 1:
      default:
        return <ComplexCard data={data} platformRatio={platformRatio} hideNavigation={hideNavigation} variant="qa" />;
    }
  }

  // 默认返回简单卡片
  return <SimpleCard data={data} platformRatio={platformRatio} hideNavigation={hideNavigation} variant="standard" />;
} 