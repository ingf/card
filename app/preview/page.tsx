"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Card as CardType, CardType as CardTypeEnum } from "@/lib/schemas/card";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/Card";
import html2canvas from "html2canvas";

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const template = searchParams.get("template") as CardTypeEnum || "list";
  const title = searchParams.get("title") || "信息卡片";

  const [cardData, setCardData] = useState<CardType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  // 从 localStorage 获取数据
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 从 localStorage 获取数据
        const storedData = localStorage.getItem(`preview_card_${template}`);

        if (storedData) {
          setCardData(JSON.parse(storedData));
        } else {
          console.error("未找到预览数据");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [template]);

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

  // 下载功能
  const handleDownload = async () => {
    if (!cardContainerRef.current) return;

    try {
      // 显示加载提示
      const loadingToast = alert("正在生成图片，请稍候...");

      // 创建canvas
      const canvas = await html2canvas(cardContainerRef.current, {
        scale: 2, // 提高清晰度
        backgroundColor: "#ffffff",
        useCORS: true, // 支持跨域图片
        logging: false,
      });

      // 转换为图片
      const image = canvas.toDataURL("image/png", 1.0);

      // 创建下载链接
      const link = document.createElement("a");
      link.download = `${cardData?.title || "健康饮食卡片"}.png`;
      link.href = image;
      link.click();

    } catch (error) {
      console.error("生成图片失败:", error);
      alert("生成图片失败，请重试");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex flex-col">
      {/* 顶部导航栏 */}
      <div className="bg-white shadow-sm border-b border-gray-200 py-3 px-4 flex justify-between items-center sticky top-0 z-10">
        <Link href="/" className="flex items-center text-gray-700 hover:text-gray-900">
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span>返回</span>
        </Link>
        <h1 className="text-lg font-bold text-center text-gray-800 flex-grow">{title} - 预览模式</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleShare}
            className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100"
          >
            <Share2 className="h-5 w-5" />
          </button>
          <button
            className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100"
            onClick={handleDownload}
          >
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 主内容区域 - 使用Card组件展示卡片 */}
      <div className="flex-grow p-4 overflow-y-auto flex justify-center">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">加载中...</p>
          </div>
        ) : cardData ? (
          <div className="w-full max-w-md" ref={cardContainerRef}>
            {/* 卡片标题区域 */}
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#000' }}>
                {cardData.title}
              </h2>
              {cardData.subtitle && (
                <p className="text-gray-600">{cardData.subtitle}</p>
              )}
            </div>

            {/* 使用Card组件展示每个卡片项 */}
            <div className="space-y-8">
              {cardData.items.map((item, index) => (
                <div key={index} className="transform scale-100 origin-top">
                  <Card
                    data={cardData}
                    index={index}
                    posterFormat={template}
                    hideNavigation={true}
                    className="w-full shadow-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md mx-auto">
            <p className="text-red-500 mb-2">无法加载卡片数据</p>
            <Link href="/" className="text-blue-500 hover:underline">
              返回首页重试
            </Link>
          </div>
        )}
      </div>

      {/* 底部操作栏 */}
      {/* <div className="bg-white border-t border-gray-200 p-4 flex justify-center sticky bottom-0">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
          <Link
            href={`/detail?template=${template}&title=${encodeURIComponent(title || '')}`}
            className="flex-1 py-3 text-center text-gray-700 hover:bg-gray-50 transition-colors border-r border-gray-100"
          >
            <span className="text-sm">查看详情</span>
          </Link>
          <button
            className="flex-1 py-3 text-center text-gray-700 hover:bg-gray-50 transition-colors border-r border-gray-100"
            onClick={handleDownload}
          >
            <span className="text-sm">下载</span>
          </button>
          <button
            className="flex-1 py-3 text-center text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={handleShare}
          >
            <span className="text-sm">分享</span>
          </button>
        </div>
      </div> */}
    </main>
  );
}