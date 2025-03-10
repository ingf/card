"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/Card";
import { CardSchema } from "@/lib/schemas/card";
import type { Card as CardType } from "@/lib/schemas/card";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import Link from "next/link";

export default function DetailPage() {
  const searchParams = useSearchParams();
  const template = searchParams.get("template") || "standard";
  const title = searchParams.get("title") || "信息卡片";

  const [cardData, setCardData] = useState<CardType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 模拟从API获取数据
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 这里应该是从API获取数据，现在我们模拟一些数据
        const mockData = {
          title: title,
          subtitle: "AI生成的信息卡片",
          layout: {
            type: "carousel",
            columns: 1,
            alignment: "center",
            spacing: "medium",
            itemStyle: "card"
          },
          items: [
            {
              id: 1,
              title: "饮食健康",
              description: "保持饮食均衡，多吃蔬菜水果，少吃油腻食物。",
              actionStep: "每天至少摄入5种不同颜色的蔬菜水果。"
            },
            {
              id: 2,
              title: "适量运动",
              description: "每周进行适量的运动，如散步、跑步、游泳等。",
              actionStep: "每天保持30分钟中等强度的有氧运动。"
            },
            {
              id: 3,
              title: "充足睡眠",
              description: "保证每天充足的睡眠时间，让身体得到充分的休息。",
              actionStep: "每晚保持7-8小时的高质量睡眠。"
            }
          ]
        };

        // 使用Zod验证数据
        const validatedData = CardSchema.parse(mockData);
        setCardData(validatedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [title]);

  // 分享功能
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: "查看我用AI生成的信息卡片",
        url: window.location.href,
      })
        .catch((error) => console.log('分享失败', error));
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert("链接已复制到剪贴板"))
        .catch((err) => console.error("无法复制链接: ", err));
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex flex-col">
      {/* 顶部导航栏 */}
      <div className="bg-white shadow-sm border-b border-gray-200 py-3 px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center text-gray-700 hover:text-gray-900">
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span>返回</span>
        </Link>
        <h1 className="text-lg font-bold text-center text-gray-800 flex-grow">{title}</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleShare}
            className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100"
          >
            <Share2 className="h-5 w-5" />
          </button>
          <button
            className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100"
            onClick={() => alert('下载功能将在后续版本中实现')}
          >
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 主内容区域 - 竖屏展示 */}
      <div className="flex-grow flex flex-col items-center justify-center p-4 overflow-y-auto">
        {isLoading ? (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">加载中...</p>
          </div>
        ) : cardData ? (
          <div className="max-w-md w-full mx-auto" style={{ maxHeight: "90vh" }}>
            <Card
              data={cardData}
              platformRatio="9:16"
              posterFormat={template as string}
            />
          </div>
        ) : (
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <p className="text-red-500 mb-2">无法加载卡片数据</p>
            <Link href="/" className="text-blue-500 hover:underline">
              返回首页重试
            </Link>
          </div>
        )}
      </div>

      {/* 底部操作栏 */}
      <div className="bg-white border-t border-gray-200 p-4 flex justify-center">
        <button
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center shadow-md"
          onClick={() => alert('下载功能将在后续版本中实现')}
        >
          <Download className="h-5 w-5 mr-2" />
          下载卡片
        </button>
      </div>
    </main>
  );
} 