"use client";

import { useState } from "react";
import type { Layout } from "@/lib/schemas/card";

interface LayoutOption {
  value: string;
  label: string;
  description: string;
}

interface LayoutSwitcherProps {
  activeLayout: Layout["type"] | null;
  onLayoutChange: (layoutType: Layout["type"]) => void;
  isChanging: boolean;
}

export function LayoutSwitcher({ activeLayout, onLayoutChange, isChanging }: LayoutSwitcherProps) {
  // 布局选项 - 只保留四种布局
  const layoutOptions: LayoutOption[] = [
    { value: "grid", label: "网格布局", description: "适合展示平等重要性的项目" },
    { value: "list", label: "列表布局", description: "适合线性阅读的内容" },
    { value: "education", label: "教育模板", description: "适合教学内容和课程大纲" },
    { value: "finance", label: "金融模板", description: "适合金融知识和问答形式" }
  ];

  // 布局预览图渲染函数
  const renderLayoutPreview = (layoutType: Layout["type"]) => {
    switch (layoutType) {
      case "grid":
        return (
          <div className="layout-preview grid-preview">
            <div className="preview-item"></div>
            <div className="preview-item"></div>
            <div className="preview-item"></div>
            <div className="preview-item"></div>
          </div>
        );
      case "list":
        return (
          <div className="layout-preview list-preview">
            <div className="preview-item"></div>
            <div className="preview-item"></div>
            <div className="preview-item"></div>
          </div>
        );
      case "education":
        return (
          <div className="layout-preview education-preview">
            <div className="preview-header"></div>
            <div className="preview-item with-number"></div>
            <div className="preview-item with-number"></div>
          </div>
        );
      case "finance":
        return (
          <div className="layout-preview finance-preview">
            <div className="preview-dots"></div>
            <div className="preview-item with-dot"></div>
            <div className="preview-item with-dot"></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* 桌面端布局切换器 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-medium text-gray-700">切换布局视图：</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-100">
          {layoutOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onLayoutChange(option.value as Layout["type"])}
              className={`flex flex-col items-center py-3 px-2 transition-all ${
                activeLayout === option.value
                  ? "bg-blue-50 border-t-2 border-blue-500"
                  : "bg-white hover:bg-gray-50"
              }`}
              disabled={isChanging}
            >
              <div className="w-12 h-12 mb-2 flex items-center justify-center">
                {renderLayoutPreview(option.value as Layout["type"])}
              </div>
              <span className={`text-xs font-medium ${
                activeLayout === option.value ? "text-blue-600" : "text-gray-700"
              }`}>
                {option.label}
              </span>
              <span className="text-xs text-gray-500 mt-1 text-center line-clamp-1">
                {option.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 移动端布局切换器 */}
      <div className="md:hidden bg-white rounded-lg shadow-sm p-3 border border-gray-100 overflow-x-auto scrollbar-hide">
        <div className="flex space-x-2 min-w-max">
          {layoutOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onLayoutChange(option.value as Layout["type"])}
              className={`flex items-center px-3 py-2 rounded-full transition-all ${
                activeLayout === option.value
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              disabled={isChanging}
            >
              <span className="w-4 h-4 mr-1.5 flex-shrink-0">
                {renderLayoutPreview(option.value as Layout["type"])}
              </span>
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
} 