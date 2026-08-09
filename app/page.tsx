"use client";

import { useEffect, useMemo, useState } from "react";

type Story = {
  id: string;
  kicker: string;
  title: string;
  place: string;
  question: string;
  prompt: string;
  cue: string;
};

type Day = {
  id: string;
  number: string;
  date: string;
  city: string;
  title: string;
  act: string;
  actLabel: string;
  route: string[];
  question: string;
  intro: string;
  stories: Story[];
  links: string[];
  reading: string;
  hidden?: boolean;
};

const acts = [
  { id: "rome", label: "帝国的根", short: "I", color: "clay" },
  { id: "faith", label: "教皇的罗马", short: "II", color: "blue" },
  { id: "renaissance", label: "文艺复兴", short: "III", color: "gold" },
  { id: "modern", label: "现代欧洲", short: "IV", color: "ink" },
];

const days: Day[] = [
  {
    id: "day-01",
    number: "01",
    date: "9月26日",
    city: "巴黎",
    title: "从塞纳河开始",
    act: "modern",
    actLabel: "现代欧洲",
    route: ["抵达巴黎", "塞纳河散步", "左岸"],
    question: "一座城市，怎样把自己的过去变成今天的气质？",
    intro: "先不急着打卡。把巴黎当作一部已经写了两千年的城市小说，今天只读序章：河流、岛屿和一座不断被重写的首都。",
    stories: [
      {
        id: "paris-opening",
        kicker: "现场开场",
        title: "巴黎不是从铁塔开始的",
        place: "塞纳河 · 西岱岛",
        question: "为什么一座城市会把自己的中心放在河中的小岛上？",
        prompt: "我现在站在塞纳河边。这里首先不是一张明信片，而是一条把巴黎分成两种节奏的线：右岸更像权力与秩序，左岸更像思想与生活。巴黎真正的故事，不是某个景点有多漂亮，而是这座城市总在把河流、王权、革命和日常生活重新排成一张地图。",
        cue: "先说你眼前的河，再说城市如何被权力塑形。",
      },
    ],
    links: ["河流提供交通", "岛屿形成中心", "中心长出国家"],
    reading: "自由行参考｜巴黎城市与历史线",
  },
  {
    id: "day-02",
    number: "02",
    date: "9月27日",
    city: "巴黎",
    title: "王权如何制造一座首都",
    act: "modern",
    actLabel: "现代欧洲",
    route: ["协和广场", "荣军院", "巴士底广场"],
    question: "法国国王为什么要把权力写进城市的空间？",
    intro: "今天看的是权力的城市设计：广场、纪念碑、军队与道路，如何让一个国家看上去比个人更长久。",
    stories: [
      {
        id: "paris-power",
        kicker: "城市故事",
        title: "广场是没有屋顶的政治剧场",
        place: "协和广场 · 荣军院",
        question: "为什么王权和革命都喜欢广场？",
        prompt: "请注意这个广场的尺度。它不是为了让人觉得舒服，而是为了让权力可以被看见。王朝在这里安排仪式，革命在这里安排断头台，拿破仑又把军功写回纪念碑。巴黎的广场像一块反复擦写的黑板：同一个空间，每一代人都想证明自己才是历史的主人。",
        cue: "把一个具体的空间细节，连接到王权、革命和记忆。",
      },
    ],
    links: ["仪式集中人群", "人群变成政治", "政治留下纪念物"],
    reading: "自由行参考｜协和广场、荣军院、巴士底广场",
  },
  {
    id: "day-03",
    number: "03",
    date: "9月28日",
    city: "罗马",
    title: "帝国如何变成教皇世界",
    act: "faith",
    actLabel: "教皇的罗马",
    route: ["圣彼得大教堂", "梵蒂冈博物馆", "西斯廷教堂"],
    question: "罗马帝国灭亡以后，罗马为什么反而成为欧洲精神中心？",
    intro: "今天把梵蒂冈放在整条历史线上看：帝国的权力退出之后，教会如何接过罗马的语言、建筑和普世想象。",
    stories: [
      {
        id: "vatican-empire",
        kicker: "故事一 · 帝国转身",
        title: "君士坦丁为什么改变欧洲？",
        place: "圣彼得大教堂",
        question: "一个曾经迫害基督徒的帝国，为什么最后让基督教进入权力中心？",
        prompt: "站在圣彼得大教堂前，可以把故事从君士坦丁讲起。罗马帝国原本靠军队、法律和皇帝维持秩序，但在危机中，君士坦丁发现基督教提供了一种跨越地域的新共同体。米兰敕令让基督教从地下走到阳光下；从这一刻起，帝国没有立刻消失，却开始把自己的普世权力翻译成了宗教语言。",
        cue: "先讲危机，再讲选择，最后落到‘帝国的语言被继承’。",
      },
      {
        id: "vatican-art",
        kicker: "故事二 · 艺术成为权力",
        title: "西斯廷教堂不只是一间教堂",
        place: "梵蒂冈博物馆 · 西斯廷教堂",
        question: "为什么教皇要用最伟大的艺术，把自己的权威放到每个人眼前？",
        prompt: "进入西斯廷教堂时，可以把天花板看成一场公开的权力宣言。教皇把创世纪、先知与末日审判放在同一条视觉叙事里，让罗马看起来不仅拥有过去，也拥有解释世界的资格。米开朗基罗画的不是一张天花板，而是教皇时代对‘谁有权讲述人类起源’这个问题的回答。",
        cue: "不要只说‘很震撼’，指出艺术在这里替谁说话。",
      },
    ],
    links: ["皇帝的普世秩序", "教会的共同体", "教皇的精神权威"],
    reading: "你的旅行设定｜梵蒂冈替换原帕拉蒂尼山行程",
  },
  {
    id: "day-04",
    number: "04",
    date: "9月29日",
    city: "罗马",
    title: "皇帝如何控制一座城市",
    act: "rome",
    actLabel: "帝国的根",
    route: ["斗兽场", "古罗马广场", "帕拉蒂尼山"],
    question: "罗马皇帝为什么要把娱乐、粮食和建筑做成统治工具？",
    intro: "昨天看精神权威，今天回到帝国的城市机器：竞技场、广场和皇宫，如何把普通人的生活组织进皇帝的秩序。",
    stories: [
      {
        id: "rome-crowd",
        kicker: "公共生活",
        title: "斗兽场是一座巨大的意见机器",
        place: "斗兽场",
        question: "为什么皇帝要为大众提供如此庞大的公共娱乐？",
        prompt: "斗兽场最值得讲的不是它有多大，而是它把整个罗马社会分层地安排在看台上。每个人都知道自己坐在哪里，也知道皇帝坐在哪里。角斗、粮食和欢呼被放进同一套公共秩序里：皇帝让你看见，他不仅能发动战争，也能安排城市的时间、情绪和想象。",
        cue: "从看台分区讲‘谁坐在哪里’，再讲皇帝如何管理情绪。",
      },
    ],
    links: ["竞技场组织人群", "广场组织政治", "宫殿组织等级"],
    reading: "自由行参考｜古罗马公共空间",
  },
  {
    id: "day-05",
    number: "05",
    date: "9月30日",
    city: "佛罗伦萨",
    title: "银行家为什么资助文艺复兴",
    act: "renaissance",
    actLabel: "文艺复兴",
    route: ["乌菲兹美术馆", "领主广场", "圣母百花大教堂"],
    question: "美第奇家族为什么不是艺术收藏家，而是用艺术打造政治权力？",
    intro: "佛罗伦萨的秘密在于：艺术、银行与城市荣誉从来没有分开。今天沿着美第奇家族的赞助网络，看文艺复兴如何成为一种公共形象。",
    stories: [
      {
        id: "florence-bankers",
        kicker: "城邦竞争",
        title: "艺术赞助是一种看得见的信用",
        place: "乌菲兹美术馆",
        question: "为什么银行家要把钱变成画、教堂和城市记忆？",
        prompt: "美第奇家族当然需要财富，但在城邦政治里，财富本身并不自动变成合法性。于是他们把银行赚来的钱转化为建筑、画作和公共荣耀，让整座佛罗伦萨不断重复一个印象：这个家族有能力让城市变得更伟大。文艺复兴不是艺术突然自由了，而是艺术被卷入了城市竞争。",
        cue: "把‘赞助’说成信用、声望和公共政治，不要只说有钱。",
      },
    ],
    links: ["银行积累财富", "赞助转成声望", "声望转成权力"],
    reading: "自由行参考｜美第奇、城邦竞争、人文主义",
  },
  {
    id: "day-06",
    number: "06",
    date: "10月1日",
    city: "托斯卡纳",
    title: "小城为什么能留下大历史",
    act: "renaissance",
    actLabel: "文艺复兴",
    route: ["锡耶纳", "皮恩扎", "托斯卡纳乡野"],
    question: "当权力离开大城市，历史还会留下什么？",
    intro: "今天放慢速度，看城邦时代留下的尺度：广场、钟楼、山路和一座小城如何保存自己的政治性格。",
    stories: [
      {
        id: "tuscany-scale",
        kicker: "城邦余波",
        title: "小城是被压缩的欧洲",
        place: "锡耶纳 · 皮恩扎",
        question: "为什么一个广场，就足以讲清楚一座城的秩序？",
        prompt: "在小城里，历史不再以帝国的尺度出现，而是压缩在步行距离之内。市政厅、教堂、市场和住宅彼此面对，权力、信仰和日常生活没有被分到不同区域。你可以把这里看成欧洲政治的一张缩小地图：人们如何共同生活，城市就如何决定自己是谁。",
        cue: "用‘步行距离’做线索，让抽象的城邦变得可感。",
      },
    ],
    links: ["乡野连接城市", "城市保存秩序", "秩序变成记忆"],
    reading: "自由行参考｜锡耶纳、皮恩扎与托斯卡纳历史线",
  },
  {
    id: "day-07",
    number: "07",
    date: "10月2日",
    city: "罗马 → 柏林",
    title: "移动的一天，也可以是历史的一幕",
    act: "modern",
    actLabel: "现代欧洲",
    route: ["隐藏上午", "机场 / 车站", "抵达柏林"],
    question: "当人从一座历史城市移动到另一座城市，什么还会跟着我们？",
    intro: "今天是转场日。把空余的上午当成一张可自由书写的纸：补一处罗马，或只是留在城市里，把前三天的故事串起来。",
    stories: [
      {
        id: "transfer-memory",
        kicker: "移动中的故事",
        title: "旅行不是从景点之间跳过去",
        place: "罗马出发前",
        question: "为什么转场也值得被记录？",
        prompt: "今天我们离开罗马。可以回头看一眼：帝国的道路、教会的网络、艺术家的迁徙，其实一直在把欧洲连接起来。现在我们沿着现代交通移动，身体经过的速度变快了，但问题没有变——一座城市留下的东西，究竟是建筑，还是一套看世界的方法？",
        cue: "用‘离开’作为回望动作，把转场变成章节结尾。",
      },
    ],
    links: ["道路连接帝国", "网络连接教会", "交通连接现代欧洲"],
    reading: "隐藏时段建议｜罗马→柏林前上午",
    hidden: true,
  },
  {
    id: "day-08",
    number: "08",
    date: "10月3日",
    city: "柏林",
    title: "一个国家如何被制造出来",
    act: "modern",
    actLabel: "现代欧洲",
    route: ["勃兰登堡门", "菩提树下大街", "博恩霍尔姆大街"],
    question: "德国为什么会有一个如此强大的国家机器？",
    intro: "柏林不是一条连续的古都街景，而是一层层叠在一起的国家工程：普鲁士、统一、战争、分裂和重新连接。",
    stories: [
      {
        id: "berlin-state",
        kicker: "国家的骨架",
        title: "一条大道，走过几个德国？",
        place: "勃兰登堡门 · 菩提树下大街",
        question: "为什么柏林的纪念物总在被重新解释？",
        prompt: "站在勃兰登堡门前，不要把它只看成一个城市地标。它曾经是王国的入口、帝国的背景、分裂的边界，也成为统一的舞台。柏林提醒我们：国家不是一个永远不变的容器，它会随着军队、边界和政治制度的改变，不断重新定义自己的象征。",
        cue: "按‘王国—帝国—分裂—统一’四个词快速推进。",
      },
    ],
    links: ["王国塑造秩序", "帝国扩张边界", "边界制造记忆"],
    reading: "自由行参考｜勃兰登堡门、菩提树下大街、检查站",
  },
  {
    id: "day-09",
    number: "09",
    date: "10月4日",
    city: "柏林 → 巴黎",
    title: "在离开柏林前补一章",
    act: "modern",
    actLabel: "现代欧洲",
    route: ["隐藏半天", "夏洛滕堡宫 / 自选", "飞往巴黎"],
    question: "强大的国家机器，在战争以前是什么样子？",
    intro: "下午转场前留出一个隐藏时段。它可以用来补看王权的宫殿，也可以只在柏林街头走一段，让昨天的国家故事落回日常。",
    stories: [
      {
        id: "berlin-hidden",
        kicker: "隐藏时段",
        title: "在宫殿里补上普鲁士",
        place: "夏洛滕堡宫（可选）",
        question: "现代德国以前，权力是如何被居住和展示的？",
        prompt: "如果今天去夏洛滕堡宫，可以把它作为昨天国家机器故事的前传。国家的强大不只来自军队和法律，也来自宫殿、礼仪和一整套让等级看起来理所当然的空间。看完这里，再回想勃兰登堡门，你会发现一座城市的‘庄严’，往往是被长期训练出来的。",
        cue: "把宫殿当成国家机器的前传，和昨天的街道形成对照。",
      },
    ],
    links: ["宫殿展示等级", "大道展示国家", "机场把故事带走"],
    reading: "隐藏时段建议｜柏林→巴黎前半天",
    hidden: true,
  },
  {
    id: "day-10",
    number: "10",
    date: "10月5日",
    city: "巴黎",
    title: "革命为什么从城市开始",
    act: "modern",
    actLabel: "现代欧洲",
    route: ["先贤祠", "拉丁区", "革命记忆线"],
    question: "为什么巴黎的街道会变成政治行动的现场？",
    intro: "回到巴黎，进入革命的章节。今天关注的不是英雄名单，而是城市里的人如何获得集合、传播和改变秩序的能力。",
    stories: [
      {
        id: "paris-revolution",
        kicker: "革命现场",
        title: "街道让陌生人变成‘人民’",
        place: "先贤祠 · 拉丁区",
        question: "革命者为什么需要一座城市，而不只是一个口号？",
        prompt: "革命并不是口号自己走上街头的。它需要咖啡馆、报纸、广场和一群可以迅速聚集的人。巴黎的街道把原本互不认识的个体变成了能够共同说话的‘人民’。所以看先贤祠时，也可以问：谁被记住，谁被写进国家的公共记忆？",
        cue: "从传播工具讲到公共身份，再落到先贤祠的名字。",
      },
    ],
    links: ["街道传播观点", "广场汇聚人群", "纪念碑固定记忆"],
    reading: "自由行参考｜先贤祠、法国大革命、公共记忆",
  },
  {
    id: "day-11",
    number: "11",
    date: "10月6日",
    city: "巴黎",
    title: "拿破仑如何把革命变成帝国",
    act: "modern",
    actLabel: "现代欧洲",
    route: ["凯旋门", "香榭丽舍", "荣军院补充线"],
    question: "革命推翻旧秩序后，为什么又需要一个皇帝？",
    intro: "今天看一种历史的反转：革命带来平等与动员，拿破仑则把这种动员组织成一套新的帝国秩序。",
    stories: [
      {
        id: "napoleon-empire",
        kicker: "革命的回声",
        title: "凯旋门把个人变成国家叙事",
        place: "凯旋门",
        question: "一场胜利，如何被写成一个国家的身份？",
        prompt: "凯旋门看起来是在纪念战争，但它真正做的是把许多人的牺牲、军队的移动和皇帝的个人形象，压缩成一个国家可以反复讲述的故事。拿破仑继承了革命的动员能力，却把它集中到帝国的中心。这里的宏大，既是胜利，也是政治对记忆的重新编排。",
        cue: "把纪念碑拆成‘谁的胜利、谁的记忆、谁的国家’。",
      },
    ],
    links: ["革命释放动员", "帝国集中权力", "纪念碑固定胜利"],
    reading: "自由行参考｜拿破仑、凯旋门与民族国家",
  },
  {
    id: "day-12",
    number: "12",
    date: "10月7日",
    city: "凡尔赛",
    title: "绝对王权如何让自己看起来合理",
    act: "modern",
    actLabel: "现代欧洲",
    route: ["凡尔赛宫", "镜厅", "花园轴线"],
    question: "为什么一个宫殿要大到像一套政治理论？",
    intro: "今天去凡尔赛，不只看奢华。看路易十四怎样把贵族、礼仪、空间与国家财政编进同一座宫殿。",
    stories: [
      {
        id: "versailles-order",
        kicker: "王权的舞台",
        title: "镜厅照见的不是风景，是秩序",
        place: "凡尔赛宫 · 镜厅",
        question: "为什么王权需要如此精确地安排每一个人的位置？",
        prompt: "凡尔赛的奢华不是装饰性的浪费，而是一套让权力变得可见的制度。谁可以靠近国王，谁只能站在更远的位置，谁拥有被看见的资格，都被礼仪安排好了。镜厅最精彩的地方不是镜子，而是它让整个宫廷相信：世界本来就应该围绕国王排列。",
        cue: "用‘距离’和‘位置’讲权力，不要只用‘奢华’形容。",
      },
    ],
    links: ["宫殿安排距离", "礼仪安排等级", "国家安排资源"],
    reading: "自由行参考｜凡尔赛宫、凡尔赛和约与法国王权",
  },
  {
    id: "day-13",
    number: "13",
    date: "10月8日",
    city: "巴黎",
    title: "返程前，把欧洲重新拼起来",
    act: "modern",
    actLabel: "现代欧洲",
    route: ["隐藏白天", "自由补充", "最后一顿饭"],
    question: "走完这些城市以后，欧洲在你眼里变成了什么？",
    intro: "最后一个完整白天不必塞满景点。你可以补一处最想回看的地方，也可以找一家咖啡馆，把这条跨越帝国、教会、城邦和国家的线写下来。",
    stories: [
      {
        id: "last-day",
        kicker: "隐藏时段",
        title: "把十四天变成自己的故事",
        place: "巴黎 · 自由安排",
        question: "旅行结束时，什么才算真正被带回家？",
        prompt: "这趟旅行从罗马开始，也许最后留下的不是一组景点，而是几个反复出现的问题：谁在组织人群，谁在解释秩序，谁能把自己的版本写进公共记忆。帝国、教会、城邦和民族国家并没有整齐地排队离开，它们今天还在欧洲的建筑和生活里互相叠着。",
        cue: "用四个章节关键词收束：帝国、教会、城邦、国家。",
      },
    ],
    links: ["帝国留下道路", "教会留下语言", "城市留下竞争", "国家留下边界"],
    reading: "隐藏时段建议｜巴黎返程日前白天",
    hidden: true,
  },
  {
    id: "day-14",
    number: "14",
    date: "10月9日",
    city: "巴黎",
    title: "把故事带回去",
    act: "modern",
    actLabel: "现代欧洲",
    route: ["返程", "机场", "下一次阅读"],
    question: "一段旅程结束后，历史怎样继续发生在自己的生活里？",
    intro: "最后一天只保留一个动作：把你最想留下的一句话记下来。它会成为下一次修改旅行手册的起点。",
    stories: [
      {
        id: "return-home",
        kicker: "尾声",
        title: "旅行手册不是答案，是下一次提问",
        place: "返程途中",
        question: "你要把哪个问题带回日常？",
        prompt: "我现在正在离开欧洲。回头看，这十四天没有把历史讲完，反而让我多了几个问题：城市为什么这样长成，权力为什么总要被看见，艺术为什么会参与政治。真正有用的旅行，不是记住所有名字，而是回到日常以后，仍然能用新的问题看见熟悉的世界。",
        cue: "最后留一个开放问题，不要把结尾说死。",
      },
    ],
    links: ["看见地点", "理解连接", "带走问题"],
    reading: "下一步｜继续补充你的读书笔记与现场观察",
  },
];

const initialDay = days[2];

export default function Home() {
  const [activeDayId, setActiveDayId] = useState(initialDay.id);
  const [activeAct, setActiveAct] = useState("all");
  const [fieldMode, setFieldMode] = useState(false);
  const [savedPrompts, setSavedPrompts] = useState<Record<string, string>>({});
  const [editingPrompt, setEditingPrompt] = useState<string | null>(null);
  const [observation, setObservation] = useState("");
  const [fieldStory, setFieldStory] = useState("");
  const [toast, setToast] = useState("");
  const [openHidden, setOpenHidden] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("eurotravel-prompts-v1");
      if (stored) window.setTimeout(() => setSavedPrompts(JSON.parse(stored)), 0);
    } catch {
      // Local storage is an enhancement; the guide remains fully usable without it.
    }
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const visibleDays = useMemo(
    () => (activeAct === "all" ? days : days.filter((day) => day.act === activeAct)),
    [activeAct],
  );
  const selectedDay = days.find((day) => day.id === activeDayId) ?? initialDay;
  const hiddenDays = days.filter((day) => day.hidden);

  function selectDay(id: string) {
    setActiveDayId(id);
    window.setTimeout(() => document.getElementById("day-detail")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }

  function savePrompt(story: Story, value: string) {
    const next = { ...savedPrompts, [story.id]: value };
    setSavedPrompts(next);
    window.localStorage.setItem("eurotravel-prompts-v1", JSON.stringify(next));
    setEditingPrompt(null);
    setToast("口播提示词已保存在这台设备");
  }

  async function copyPrompt(story: Story) {
    const value = savedPrompts[story.id] ?? story.prompt;
    try {
      await navigator.clipboard.writeText(value);
      setToast("口播提示词已复制，可以发给 ChatGPT 修改");
    } catch {
      setToast("当前浏览器不允许自动复制，请手动选中文字");
    }
  }

  function createFieldStory() {
    const note = observation.trim();
    if (!note) {
      setToast("先写一句你现场看到的细节");
      return;
    }
    setFieldStory(`我现在在${selectedDay.city}的现场，刚刚注意到“${note}”。它让我重新想到：${selectedDay.question} 这处细节不只是一个画面，也可以成为今天故事的入口。`);
    setToast("已生成一版现场讲法，可以继续修改");
  }

  return (
    <main className={`travel-site ${fieldMode ? "is-field-mode" : ""}`}>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="欧洲历史旅行手册首页">
          <span className="brand-mark">EH</span>
          <span>
            <strong>欧洲历史旅行手册</strong>
            <small>EUROPE / FIELD GUIDE</small>
          </span>
        </a>
        <nav className="topnav" aria-label="主导航">
          <a href="#route">路线</a>
          <a href="#stories">故事卡</a>
          <a href="#field">现场工作台</a>
        </nav>
        <button className={`field-toggle ${fieldMode ? "active" : ""}`} onClick={() => setFieldMode(!fieldMode)} aria-pressed={fieldMode}>
          <span className="status-dot" /> {fieldMode ? "退出现场模式" : "进入现场模式"}
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span>14 DAYS</span><i /> <span>ROME · FLORENCE · BERLIN · PARIS</span></p>
          <h1>把景点，走成一条<br /><em>欧洲文明的时间线。</em></h1>
          <p className="hero-lede">这不是一份打卡清单。它是一套可以带到现场、随时改写、随时开口讲的旅行手册。</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#day-detail">从今天的故事开始 <span>↘</span></a>
            <a className="text-link" href="#field">我想在现场补充 <span>→</span></a>
          </div>
          <div className="hero-note"><span className="note-line" /> <span>当前入口：9月28日 · 梵蒂冈</span></div>
        </div>
        <div className="hero-map" aria-label="旅行的四幕历史主线">
          <div className="map-orbit orbit-one" />
          <div className="map-orbit orbit-two" />
          <div className="map-label label-rome"><b>ROMA</b><span>帝国的根</span></div>
          <div className="map-label label-florence"><b>FIRENZE</b><span>文艺复兴</span></div>
          <div className="map-label label-berlin"><b>BERLIN</b><span>国家的骨架</span></div>
          <div className="map-label label-paris"><b>PARIS</b><span>现代欧洲</span></div>
          <div className="map-center"><span>EUROPE</span><strong>14</strong><small>days of stories</small></div>
          <span className="map-star star-one">✦</span><span className="map-star star-two">✦</span><span className="map-star star-three">✧</span>
        </div>
      </section>

      <section className="stats-strip" aria-label="旅行手册概况">
        <div><strong>14</strong><span>天的路线</span></div>
        <div><strong>04</strong><span>幕历史主线</span></div>
        <div><strong>12</strong><span>张故事卡</span></div>
        <div className="stat-highlight"><strong>03</strong><span>个隐藏时段</span><em>留给临场决定</em></div>
      </section>

      <section className="route-section section-shell" id="route">
        <div className="section-heading">
          <div><p className="eyebrow">THE LONG ARC</p><h2>先看整条线，<em>再进入今天。</em></h2></div>
          <p>四个章节，讲的是欧洲如何从帝国的秩序，走到今天的城市与国家。点击任意章节，筛选你的路线。</p>
        </div>
        <div className="act-grid">
          <button className={`act-card all ${activeAct === "all" ? "selected" : ""}`} onClick={() => setActiveAct("all")}>
            <span className="act-index">00</span><strong>整条旅程</strong><small>从罗马到巴黎，14天</small><i>→</i>
          </button>
          {acts.map((act) => (
            <button key={act.id} className={`act-card ${act.color} ${activeAct === act.id ? "selected" : ""}`} onClick={() => setActiveAct(act.id)}>
              <span className="act-index">{act.short}</span><strong>{act.label}</strong><small>{act.id === "rome" ? "共和国 · 帝国 · 城市" : act.id === "faith" ? "君士坦丁 · 教会 · 艺术" : act.id === "renaissance" ? "城邦 · 银行 · 人文主义" : "王权 · 革命 · 民族国家"}</small><i>↗</i>
            </button>
          ))}
        </div>
      </section>

      <section className="day-section section-shell" id="day-detail">
        <div className="section-heading detail-heading">
          <div><p className="eyebrow">YOUR DAILY FIELD GUIDE</p><h2>每天一页，<em>一个能讲出来的故事。</em></h2></div>
          <p>左侧选日期。右侧的提示词可以直接口播，也可以改成你的语气，再交给 ChatGPT 继续打磨。</p>
        </div>
        <div className="day-layout">
          <aside className="day-rail" aria-label="每日行程">
            <div className="rail-top"><span>行程索引</span><small>{visibleDays.length} / 14 days</small></div>
            <div className="day-list">
              {visibleDays.map((day) => (
                <button key={day.id} className={`day-tab ${activeDayId === day.id ? "active" : ""}`} onClick={() => selectDay(day.id)}>
                  <span className="day-number">{day.number}</span><span><b>{day.date}</b><small>{day.city}</small></span>{day.hidden && <em>空</em>}
                </button>
              ))}
            </div>
            {activeAct !== "all" && <button className="clear-filter" onClick={() => setActiveAct("all")}>显示全部日期 ×</button>}
          </aside>

          <article className="day-detail">
            <div className="day-banner">
              <div><span className="day-kicker">DAY {selectedDay.number} / {selectedDay.actLabel}</span><h3>{selectedDay.city}<small>{selectedDay.date}</small></h3><p>{selectedDay.title}</p></div>
              <div className="day-stamp">{selectedDay.hidden ? "HIDDEN\nSLOT" : selectedDay.number}</div>
            </div>
            <div className="route-chips"><span className="chips-label">TODAY /</span>{selectedDay.route.map((stop) => <span key={stop} className={selectedDay.hidden && stop.includes("隐藏") ? "hidden-chip" : ""}>{stop}</span>)}</div>
            <div className="question-card"><span className="quote-mark">“</span><div><span className="mini-label">今天要理解的问题</span><h4>{selectedDay.question}</h4><p>{selectedDay.intro}</p></div></div>
            <div className="story-head" id="stories"><div><p className="eyebrow">STORY CARDS / {selectedDay.stories.length.toString().padStart(2, "0")}</p><h4>到了现场，直接从这里开口。</h4></div><button className="small-action" onClick={() => setToast("提示：先说眼前细节，再说历史连接")}>如何使用？ <span>↗</span></button></div>
            <div className="story-stack">
              {selectedDay.stories.map((story, index) => {
                const value = savedPrompts[story.id] ?? story.prompt;
                const isEditing = editingPrompt === story.id;
                return <div className="story-card" key={story.id}>
                  <div className="story-card-top"><span className="story-number">0{index + 1}</span><span className="story-kicker">{story.kicker}</span><span className="story-place">{story.place}</span></div>
                  <h5>{story.title}</h5><p className="story-question">{story.question}</p>
                  <div className="prompt-wrap"><span className="prompt-label">口播提示词</span>{isEditing ? <textarea className="prompt-editor" defaultValue={value} aria-label={`${story.title}口播提示词`} onKeyDown={(event) => { if ((event.metaKey || event.ctrlKey) && event.key === "Enter") savePrompt(story, event.currentTarget.value); }} /> : <p className="prompt-text">{value}</p>}<span className="cue-line">现场提醒：{story.cue}</span></div>
                  <div className="story-actions">{isEditing ? <button className="button button-primary compact" onClick={(event) => savePrompt(story, (event.currentTarget.parentElement?.previousElementSibling?.querySelector("textarea") as HTMLTextAreaElement)?.value ?? value)}>保存修改</button> : <button className="button button-ghost compact" onClick={() => setEditingPrompt(story.id)}>编辑口播</button>}<button className="button button-ghost compact" onClick={() => copyPrompt(story)}>复制给 ChatGPT</button><span className="edit-hint">{isEditing ? "⌘ / Ctrl + Enter 也可以保存" : "可随时改成你的语气"}</span></div>
                </div>;
              })}
            </div>
            <div className="connection-card"><div className="connection-title"><span className="eyebrow">THE CONNECTING LINE</span><strong>景点之间，不是箭头，是因果。</strong></div><div className="connection-line">{selectedDay.links.map((link, index) => <div key={link} className="connection-node"><span>{String(index + 1).padStart(2, "0")}</span><b>{link}</b>{index < selectedDay.links.length - 1 && <i>→</i>}</div>)}</div></div>
            <div className="reading-line"><span>▰</span><p><small>关联线索</small>{selectedDay.reading}</p><button onClick={() => setToast("之后可以把你的读书笔记继续放进对应日期")}>补充笔记 <span>＋</span></button></div>
          </article>
        </div>
      </section>

      <section className="hidden-section section-shell" id="hidden">
        <div className="section-heading"><div><p className="eyebrow">ROOM FOR THE UNPLANNED</p><h2>给临场决定，<em>留出真正的空间。</em></h2></div><p>隐藏时段不是空白，而是旅行中最适合放进“此刻的你”的地方。</p></div>
        <div className="hidden-grid">{hiddenDays.map((day) => <button className={`hidden-card ${openHidden === day.id ? "open" : ""}`} key={day.id} onClick={() => { setOpenHidden(openHidden === day.id ? null : day.id); selectDay(day.id); }}><span className="hidden-date">{day.date}</span><strong>{day.city}</strong><h4>{day.title}</h4><p>{day.route.join(" · ")}</p><i>{openHidden === day.id ? "已打开 ↗" : "查看建议 ↗"}</i></button>)}</div>
      </section>

      <section className="field-section section-shell" id="field">
        <div className="field-intro"><p className="eyebrow">LIVE NOTEBOOK / 现场工作台</p><h2>把刚刚看到的，<em>变成一段自己的故事。</em></h2><p>这里不要求你写完整。一个细节、一个疑问、一句吐槽，都可以成为下一张故事卡的起点。</p></div>
        <div className="field-workbench"><div className="workbench-top"><span className="recording-dot" /> FIELD NOTE / {selectedDay.city} · {selectedDay.date}<span className="workbench-save">自动保存在本机</span></div><label htmlFor="observation">我刚刚看到 / 听到 / 想到的是……</label><textarea id="observation" value={observation} onChange={(event) => setObservation(event.target.value)} placeholder="例如：圣彼得广场的柱廊像两只手，把人群抱在中间……" /><div className="workbench-bottom"><span>{observation.length} / 240</span><button className="button button-primary" onClick={createFieldStory}>生成一版现场讲法 <span>↗</span></button></div>{fieldStory && <div className="generated-note"><span className="note-badge">NEW DRAFT</span><p>{fieldStory}</p><textarea defaultValue={fieldStory} aria-label="现场讲法草稿" /></div>}</div>
      </section>

      <footer className="footer"><div><span className="brand-mark">EH</span><strong>欧洲历史旅行手册</strong></div><p>一份会随着你的脚步继续生长的旅行工具。</p><span>v.01 / OCT 2026</span></footer>
      {toast && <div className="toast" role="status">{toast}<span>✓</span></div>}
    </main>
  );
}
