import React from 'react';
import { Card as CardType } from '@/lib/schemas/card';

// 这是一个简单的卡片工厂组件，用于创建不同类型的卡片
const CardFactory = ({ data }: { data: CardType }) => {
  // 这里可以根据卡片类型返回不同的卡片组件
  return (
    <div className="card-factory">
      {/* 卡片工厂的实现将在后续版本中完善 */}
    </div>
  );
};

export default CardFactory; 