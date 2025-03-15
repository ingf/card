import { Card } from "@/lib/schemas/card";

// 健康饮食卡片数据
export const healthyEatingCard: Card = {
  items: [
    {
      description: "均衡摄入各类营养素是健康饮食的基础。通过多样化的食物选择，如谷物、蔬菜、水果、蛋白质和健康脂肪，确保身体获得所需的维生素和矿物质。合理的营养搭配有助于维持身体功能，预防慢性疾病。",
      id: 1,
      title: "均衡营养",
      actionStep: "每日使用食物金字塔指导膳食，确保摄入多种颜色的蔬果和全谷物。",
      highlight: true,
      icon: {
        type: "emoji",
        value: "🥗"
      },
      tags: ["必备知识", "日常饮食"],
      bulletPoints: [
        "每天摄入至少5种不同颜色的蔬果",
        "优先选择全谷物而非精制谷物",
        "选择优质蛋白质来源如鱼类、豆类和坚果"
      ]
    },
    {
      description: "控制食物份量是维持健康体重的关键。过量饮食会导致能量摄入过剩，增加肥胖和相关疾病风险。学习估算食物份量，并根据自身活动水平调整摄入量，有助于保持健康的能量平衡。",
      id: 2,
      title: "控制份量",
      actionStep: "使用较小的餐具，细嚼慢咽，注意饱腹感，避免暴饮暴食。",
      highlight: false
    },
    {
      description: "膳食纤维对消化健康至关重要。它促进肠道蠕动，预防便秘，并有助于降低胆固醇和血糖水平。全谷物、蔬菜、水果和豆类都是膳食纤维的良好来源，应当每日适量摄入。",
      id: 3,
      title: "膳食纤维",
      actionStep: "每天摄入25-30克膳食纤维，增加全谷物、豆类和新鲜蔬果的比例。",
      highlight: true
    },
    {
      description: "限制添加糖的摄入对整体健康至关重要。过多的糖分会导致体重增加、蛀牙和其他健康问题。选择天然甜味食物如水果，减少含糖饮料和加工食品的摄入，保持血糖稳定。",
      id: 4,
      title: "限制糖分",
      actionStep: "阅读食品标签，选择无添加糖食品，用水果替代甜点满足甜食欲望。",
      highlight: false
    }
  ],
  title: "健康饮食的五个关键点",
  subtitle: "开启健康生活之旅，从均衡饮食开始",
  theme: {
    primaryColor: "#4CAF50",
    backgroundColor: "#FFFFFF",
    textColor: "#212121",
    borderRadius: "0.75rem",
    cardStyle: "elevated",
    animation: "fade",
    accentColor: "#8BC34A",
    fontFamily: "'Noto Sans SC', sans-serif",
    colorScheme: "light",
    headerStyle: {
      backgroundColor: "#F1F8E9",
      textColor: "#33691E",
      borderBottom: true,
      padding: "1.25rem"
    },
    footerStyle: {
      backgroundColor: "#F1F8E9",
      textColor: "#689F38",
      borderTop: true,
      padding: "1rem"
    },
    itemStyle: {
      backgroundColor: "#FAFAFA",
      borderColor: "#E0E0E0",
      borderWidth: "1px",
      shadow: "md",
      margin: "0.75rem"
    },
    highlightStyle: {
      backgroundColor: "#F1F8E9",
      borderColor: "#8BC34A",
      textColor: "#33691E"
    }
  },
  layout: {
    type: "carousel",
    columns: 1,
    alignment: "center",
    spacing: "medium",
    itemStyle: "card",
    showDividers: true,
    showNumbers: true,
    showIcons: true,
    animation: "slide"
  },
  header: {
    icon: {
      type: "emoji",
      value: "🥦"
    },
    actions: [
      {
        text: "收藏",
        icon: "bookmark",
        action: "save"
      },
      {
        text: "分享",
        icon: "share",
        action: "share"
      }
    ]
  },
  footer: {
    text: "健康饮食是健康生活的基础",
    showAttribution: true,
    links: [
      {
        text: "了解更多",
        url: "#",
        icon: "external-link"
      }
    ]
  },
  metadata: {
    author: "营养专家",
    createdAt: "2023-09-15",
    tags: ["健康", "饮食", "营养", "生活方式"],
    source: "健康生活指南"
  },
  interactivity: {
    isExpandable: true,
    isSwipeable: true,
    hasSearch: false,
    hasFilters: true,
    hasSorting: false
  }
};

// 高效学习卡片数据
export const effectiveLearningCard: Card = {
  items: [
    {
      description: "主动学习是指积极参与学习过程，而非被动接受信息。通过提问、讨论和实践，你能更好地理解和记忆知识点。主动学习提高注意力，增强理解深度，促进长期记忆形成。",
      id: 1,
      title: "主动学习",
      actionStep: "学习时提出问题，用自己的话解释概念，寻找实际应用场景。",
      highlight: true
    },
    {
      description: "间隔重复是科学的记忆方法，通过在递增的时间间隔内复习材料来增强记忆。这种方法利用了大脑的遗忘曲线原理，比集中在短时间内反复复习更有效，显著提高长期记忆效果。",
      id: 2,
      title: "间隔重复",
      actionStep: "使用间隔重复软件，按递增时间间隔（如1天、3天、7天）复习知识点。",
      highlight: false
    },
    {
      description: "深度加工是将新知识与已有知识建立联系，形成意义网络。通过类比、对比、总结和应用等方式，可以加深对知识的理解和记忆，使信息更容易被长期记忆和提取。",
      id: 3,
      title: "深度加工",
      actionStep: "将新知识与已知概念联系，创建思维导图，寻找不同知识间的联系。",
      highlight: true
    },
    {
      description: "测试效应指通过自测来增强记忆和学习效果。研究表明，与简单阅读相比，测试自己对材料的记忆能显著提高长期记忆效果，同时帮助识别知识盲点，指导后续学习。",
      id: 4,
      title: "自我测试",
      actionStep: "使用闪卡或练习题，尝试不看笔记回忆关键概念，检验理解程度。",
      highlight: false
    }
  ],
  title: "高效学习的四大策略",
  subtitle: "科学方法助你事半功倍",
  theme: {
    accentColor: "#2196F3",
    backgroundColor: "#F5F9FF",
    colorScheme: "light",
    textColor: "#333333",
    animation: "fade",
    primaryColor: "#2196F3",
    borderRadius: "0.75rem",
    cardStyle: "outlined",
    fontFamily: "'Noto Sans SC', sans-serif"
  },
  layout: {
    type: "carousel",
    columns: 1,
    alignment: "center",
    spacing: "medium",
    itemStyle: "card",
    showDividers: true,
    showNumbers: true,
    showIcons: true,
    animation: "slide"
  },
};

// 时间管理卡片数据
export const timeManagementCard: Card = {
  items: [
    {
      description: "优先级矩阵帮助区分任务的重要性和紧急性。将任务分为四类：重要且紧急、重要但不紧急、紧急但不重要、既不重要也不紧急。这让你专注于真正重要的事情，避免被紧急事务分散注意力。",
      id: 1,
      title: "优先级矩阵",
      actionStep: "每天列出任务清单，按重要性和紧急性分类，优先处理重要且紧急的任务。",
      highlight: true
    },
    {
      description: "番茄工作法将工作分割成25分钟的专注时段，中间穿插短暂休息。这种方法利用了人脑的注意力周期，帮助保持高效率和防止疲劳。定时休息让大脑得到恢复，提高整体工作质量。",
      id: 2,
      title: "番茄工作法",
      actionStep: "设置25分钟计时器专注工作，然后休息5分钟，每完成4个周期后休息较长时间。",
      highlight: false
    },
    {
      description: "时间块管理法是将一天划分为几个大的时间块，每个时间块专注于一类相似任务。这种方法减少了任务切换带来的注意力损失，让你能够进入心流状态，提高工作效率和质量。",
      id: 3,
      title: "时间块管理",
      actionStep: "将一天划分为2-3个大时间块，每块专注于一类任务，减少任务切换次数。",
      highlight: true
    },
    {
      description: "二八法则指出80%的结果来自20%的努力。在时间管理中，这意味着识别那些能带来最大价值的少数关键任务，并优先投入时间和精力，在有限的时间内创造最大的价值。",
      id: 4,
      title: "二八法则",
      actionStep: "识别能带来80%结果的20%关键任务，优先分配时间给这些高价值活动。",
      highlight: false
    }
  ],
  title: "高效时间管理四大技巧",
  subtitle: "掌握这些方法，让每一分钟都更有价值",
  theme: {
    accentColor: "#FF5722",
    backgroundColor: "#FFF9F5",
    colorScheme: "light",
    textColor: "#3E2723",
    animation: "fade",
    primaryColor: "#FF5722",
    borderRadius: "0.75rem",
    cardStyle: "outlined",
    fontFamily: "'Noto Sans SC', sans-serif"
  },
  layout: {
    type: "carousel",
    columns: 1,
    alignment: "center",
    spacing: "medium",
    itemStyle: "card",
    showDividers: true,
    showNumbers: true,
    showIcons: true,
    animation: "slide"
  },
};

// 职场沟通卡片数据
export const workplaceCommunicationCard: Card = {
  items: [
    {
      description: "积极倾听是有效沟通的基础。它包括听取话语、理解言外之意、情感和观点。通过保持眼神接触、点头、提问和复述关键点，你可以表明你真正在倾听并重视对方的观点。",
      id: 1,
      title: "积极倾听",
      actionStep: "与他人交谈时避免打断，提出相关问题，用自己的话复述对方观点确认理解。",
      highlight: true
    },
    {
      description: "清晰表达是职场沟通的关键。避免使用行业术语和复杂词汇，直接表达核心观点，并提供具体例子支持论点。组织思路，确保信息传递的逻辑性和连贯性，提高沟通效率。",
      id: 2,
      title: "清晰表达",
      actionStep: "重要沟通前准备要点，使用简单直接的语言，通过具体例子说明抽象概念。",
      highlight: false
    },
    {
      description: "非语言沟通包括面部表情、肢体语言、眼神接触和声调等，它们往往比言语本身传递更多信息。保持适当的肢体语言和面部表情，能增强你的信息可信度和影响力。",
      id: 3,
      title: "非语言沟通",
      actionStep: "保持开放的肢体语言，适当的眼神接触，与内容相匹配的面部表情和语调。",
      highlight: true
    },
    {
      description: "情绪智力是识别、理解和管理自己情绪以及感知他人情绪的能力。在职场中，高情商能帮助你更好地处理冲突，建立信任，并在压力下保持冷静和理性，促进有效沟通。",
      id: 4,
      title: "情绪智力",
      actionStep: "练习识别情绪触发点，沟通前调整心态，尝试从他人角度理解问题。",
      highlight: false
    }
  ],
  title: "职场沟通的四大核心技能",
  subtitle: "提升这些能力，让你的职场关系更顺畅",
  theme: {
    accentColor: "#673AB7",
    backgroundColor: "#F5F0FF",
    colorScheme: "light",
    textColor: "#311B92",
    animation: "fade",
    primaryColor: "#673AB7",
    borderRadius: "0.75rem",
    cardStyle: "outlined",
    fontFamily: "'Noto Sans SC', sans-serif"
  },
  layout: {
    type: "carousel",
    columns: 1,
    alignment: "center",
    spacing: "medium",
    itemStyle: "card",
    showDividers: true,
    showNumbers: true,
    showIcons: true,
    animation: "slide"
  },
};

// 创意思维卡片数据
export const creativeThinkingCard: Card = {
  items: [
    {
      description: "发散思维是创造性思考的基础，指从一个起点探索多种可能性和方向。通过自由联想、头脑风暴等方法，你可以突破常规思维限制，产生更多独特的想法和解决方案。",
      id: 1,
      title: "发散思维",
      actionStep: "面对问题时，先不评判地列出至少20个可能的解决方案，无论看起来多么不切实际。",
      highlight: true
    },
    {
      description: "跨领域思考是将不同领域的知识、概念和方法相互融合，产生新见解的过程。通过学习多个领域的知识并寻找它们之间的联系，你可以发现独特的创新点和解决问题的新思路。",
      id: 2,
      title: "跨领域思考",
      actionStep: "尝试将熟悉的领域与不相关的领域结合，思考它们之间可能的联系和启发。",
      highlight: false
    },
    {
      description: "逆向思维是从结果出发，反向推导解决方案的思考方式。它挑战常规思考顺序，帮助你发现传统思路中可能忽略的机会和解决方案，特别适合解决复杂问题和创新设计。",
      id: 3,
      title: "逆向思维",
      actionStep: "设想理想结果，然后反向思考：需要什么条件才能达到这个结果？有哪些障碍需要克服？",
      highlight: true
    },
    {
      description: "类比思维是通过比较不同事物之间的相似性，将已知领域的解决方案应用到新问题上的思考方式。生物模仿设计就是典型应用，它从自然界寻找灵感解决人类问题。",
      id: 4,
      title: "类比思维",
      actionStep: "思考你的问题在自然界或其他领域中有什么类似情况，这些领域如何解决类似问题。",
      highlight: false
    }
  ],
  title: "激发创意思维的四种方法",
  subtitle: "突破思维局限，释放你的创造潜能",
  theme: {
    accentColor: "#00BCD4",
    backgroundColor: "#E0F7FA",
    colorScheme: "light",
    textColor: "#006064",
    animation: "fade",
    primaryColor: "#00BCD4",
    borderRadius: "0.75rem",
    cardStyle: "outlined",
    fontFamily: "'Noto Sans SC', sans-serif"
  },
  layout: {
    type: "carousel",
    columns: 1,
    alignment: "center",
    spacing: "medium",
    itemStyle: "card",
    showDividers: true,
    showNumbers: true,
    showIcons: true,
    animation: "slide"
  },
};

// 导出所有卡片数据的集合
export const allMockCards = [
  healthyEatingCard,
  effectiveLearningCard,
  timeManagementCard,
  workplaceCommunicationCard,
  creativeThinkingCard
];

// 根据关键词获取卡片数据
export function getCardByKeyword(keyword: string): Card {
  const lowerKeyword = keyword.toLowerCase();

  if (lowerKeyword.includes('健康') || lowerKeyword.includes('饮食') || lowerKeyword.includes('营养')) {
    return healthyEatingCard;
  }

  if (lowerKeyword.includes('学习') || lowerKeyword.includes('记忆') || lowerKeyword.includes('知识')) {
    return effectiveLearningCard;
  }

  if (lowerKeyword.includes('时间') || lowerKeyword.includes('管理') || lowerKeyword.includes('效率')) {
    return timeManagementCard;
  }

  if (lowerKeyword.includes('沟通') || lowerKeyword.includes('职场') || lowerKeyword.includes('交流')) {
    return workplaceCommunicationCard;
  }

  if (lowerKeyword.includes('创意') || lowerKeyword.includes('创新') || lowerKeyword.includes('思维')) {
    return creativeThinkingCard;
  }

  // 默认返回健康饮食卡片
  return healthyEatingCard;
}