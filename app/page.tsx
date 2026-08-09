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
    city: "北京 → 罗马",
    title: "从罗马开始",
    act: "rome",
    actLabel: "帝国的根",
    route: ["北京出发", "抵达罗马", "入住 / 休整"],
    question: "为什么欧洲的历史故事，最适合从罗马开始？",
    intro: "正式方案的第一站是罗马。今天不安排密集参观，把抵达当作序章：从身体抵达一座城市开始，也从这座城市的道路、遗址和帝国记忆开始。",
    stories: [
      {
        id: "rome-opening",
        kicker: "旅程开场",
        title: "从罗马开始，而不是从景点开始",
        place: "抵达罗马",
        question: "一座城市怎样把两千年的权力压缩在今天的街道里？",
        prompt: "这趟旅行从罗马开始。接下来看到的斗兽场、万神殿、梵蒂冈、佛罗伦萨、柏林和巴黎，不是几组分散的景点，而是一条从帝国出发的历史线。先记住一个问题：罗马为什么能把自己的道路、法律、建筑和精神权威，一层层传给后来的欧洲？",
        cue: "先确认起点是罗马，再抛出‘罗马如何被继承’这个总问题。",
      },
    ],
    links: ["身体抵达罗马", "罗马打开帝国", "帝国打开欧洲"],
    reading: "正式方案 PDF｜北京→罗马，抵达日",
  },
  {
    id: "day-02",
    number: "02",
    date: "9月27日",
    city: "罗马",
    title: "皇帝如何控制一座城市",
    act: "rome",
    actLabel: "帝国的根",
    route: ["斗兽场", "万神殿", "特莱维喷泉", "真理之口", "西班牙广场"],
    question: "罗马皇帝为什么要把城市生活做成统治工具？",
    intro: "正式方案的第一天完整游览，从斗兽场开始，把公共娱乐、神圣建筑、道路和城市日常串成帝国的城市机器。",
    stories: [
      {
        id: "rome-city-machine",
        kicker: "公共生活",
        title: "斗兽场和万神殿，分别在说什么？",
        place: "斗兽场 · 万神殿",
        question: "皇帝如何同时控制人群的情绪和人们对宇宙的想象？",
        prompt: "今天可以把两个地点连起来讲：斗兽场代表皇帝如何组织城市大众，万神殿代表皇帝如何把自己包装成连接天地的统治者。一个控制人群的时间和情绪，一个控制人们理解秩序的方式。走过特莱维喷泉、真理之口和西班牙广场时，再看罗马如何把帝国遗产放进日常生活。",
        cue: "先讲斗兽场的‘人群’，再讲万神殿的‘宇宙’，最后落回街道。",
      },
    ],
    links: ["竞技场组织人群", "万神殿组织秩序", "街道保存帝国"],
    reading: "正式方案 PDF｜罗马城市线：斗兽场、万神殿、真理之口等",
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
    reading: "正式方案 PDF + 行程修正｜梵蒂冈替换原帕拉蒂尼山行程",
  },
  {
    id: "day-04",
    number: "04",
    date: "9月29日",
    city: "罗马 → 佛罗伦萨",
    title: "帝国之后，城邦如何重新发明欧洲",
    act: "renaissance",
    actLabel: "文艺复兴",
    route: ["前往佛罗伦萨", "乌菲兹美术馆", "圣母百花大教堂", "领主广场", "天堂之门"],
    question: "罗马帝国消失以后，为什么新的欧洲从城邦竞争中长出来？",
    intro: "正式方案从罗马转入佛罗伦萨。今天看乌菲兹、百花大教堂和领主广场，不是从帝国跳到艺术，而是看城市如何重新获得政治主动权。",
    stories: [
      {
        id: "florence-city-state",
        kicker: "城市转身",
        title: "佛罗伦萨为什么能接过罗马的火炬？",
        place: "乌菲兹 · 领主广场 · 百花大教堂",
        question: "城邦竞争为什么会把艺术推到政治中心？",
        prompt: "从罗马到佛罗伦萨，不是从废墟走进美术馆，而是从帝国的统一秩序走进城邦的竞争秩序。每座城都要证明自己更富、更有教养、更值得被历史记住。于是银行、教堂、广场和艺术被接到了一起，文艺复兴成为城市争夺声望与权力的方式。",
        cue: "把佛罗伦萨讲成一个城邦，不要只讲成艺术之都。",
      },
    ],
    links: ["帝国留下遗产", "城邦争夺声望", "艺术成为权力"],
    reading: "正式方案 PDF｜罗马→佛罗伦萨；自由行参考补充美第奇线",
  },
  {
    id: "day-05",
    number: "05",
    date: "9月30日",
    city: "佛罗伦萨 → 托斯卡纳 → 罗马",
    title: "文艺复兴为什么不只发生在大城市",
    act: "renaissance",
    actLabel: "文艺复兴",
    route: ["锡耶纳大教堂", "奥尔恰谷", "丝柏树", "皮恩扎", "Vitaleta 小教堂", "返回罗马"],
    question: "当权力离开大城市，历史还会留下什么？",
    intro: "正式方案把佛罗伦萨、锡耶纳、奥尔恰谷和皮恩扎连在一起。今天看的是城邦竞争如何被压缩进广场、山路、教堂和乡野景观。",
    stories: [
      {
        id: "tuscany-city-memory",
        kicker: "城邦余波",
        title: "小城是被压缩的欧洲",
        place: "锡耶纳 · 皮恩扎 · 奥尔恰谷",
        question: "为什么一座广场和一条山路，也能讲清楚一座城的秩序？",
        prompt: "在小城里，历史不再以帝国的尺度出现，而是压缩在步行距离之内。市政厅、教堂、市场和住宅彼此面对；到了奥尔恰谷，城邦的政治性又变成土地、道路和景观。今天离开托斯卡纳回到罗马，可以把这段理解成：文艺复兴不是一栋建筑，而是一整套重新组织城市与生活的方法。",
        cue: "用‘步行距离’和‘山路’让城邦历史从抽象变得可感。",
      },
    ],
    links: ["城邦竞争财富", "乡野保存秩序", "景观变成记忆"],
    reading: "正式方案 PDF｜锡耶纳、奥尔恰谷、皮恩扎后返回罗马",
  },
  {
    id: "day-06",
    number: "06",
    date: "10月1日",
    city: "罗马",
    title: "自由日：给正式路线补上一块自己的罗马",
    act: "rome",
    actLabel: "帝国的根",
    route: ["全天自由活动", "可选：古罗马补充", "可选：圣天使堡一线"],
    question: "自由时间怎样变成一条属于自己的历史线？",
    intro: "正式方案在这里留出全天自由活动。它不是路线缺失，而是让你根据体力、预约和兴趣，决定是补古罗马、补基督教罗马，还是只在罗马街道里消化前几天的故事。",
    stories: [
      {
        id: "rome-free-day",
        kicker: "自由日",
        title: "今天由你决定，罗马还缺哪一块？",
        place: "罗马 · 自由安排",
        question: "当正式路线停下来，你最想把哪条线补完整？",
        prompt: "今天可以回看前三天：斗兽场代表皇帝如何管理人群，梵蒂冈代表帝国如何被教会继承，佛罗伦萨又把罗马遗产变成了城邦竞争。现在请你选择一个缺口：补古罗马的公共空间，补圣天使堡与教皇罗马，或者只在街道里观察这些历史怎样继续生活在今天。",
        cue: "先让自己选主题，再让景点服务于主题。",
      },
    ],
    links: ["正式路线留白", "兴趣决定方向", "个人经验补全历史"],
    reading: "正式方案 PDF｜罗马全天自由活动；自由行参考作为补充库",
  },
  {
    id: "day-07",
    number: "07",
    date: "10月2日",
    city: "罗马 → 柏林",
    title: "罗马最后上午，给教皇罗马收一个尾",
    act: "modern",
    actLabel: "现代欧洲",
    route: ["圣彼得大教堂 / 可选", "机场", "抵达柏林"],
    question: "离开罗马之前，怎样把帝国、教会和文艺复兴连成一条线？",
    intro: "真实航班安排是 15:10 罗马→柏林，因此正式方案之外多出一个可利用的上午。它适合把圣彼得大教堂作为罗马章节的收束，再去机场转场。",
    stories: [
      {
        id: "rome-last-morning",
        kicker: "隐藏时段",
        title: "罗马最后上午：从皇帝走到教皇",
        place: "圣彼得大教堂 · 圣彼得广场",
        question: "为什么圣彼得大教堂适合做罗马章节的结尾？",
        prompt: "如果航班时间和交通允许，今天上午把圣彼得大教堂作为罗马的尾声。前几天看见的是异教罗马、皇帝罗马和文艺复兴城市；现在站在这里，可以把故事收成一句话：帝国消失了，但罗马的道路、建筑和普世权威被新的机构继续使用。然后带着这条线去柏林，看欧洲如何进入国家时代。",
        cue: "用‘尾声’而不是‘补景点’来讲，让移动日也有章节功能。",
      },
    ],
    links: ["皇帝留下城市", "教会接过罗马", "交通带走故事"],
    reading: "正式方案 PDF｜罗马→柏林；机票安排补充：U25082 15:10",
    hidden: true,
  },
  {
    id: "day-08",
    number: "08",
    date: "10月3日",
    city: "柏林",
    title: "德国为什么走到20世纪这一步",
    act: "modern",
    actLabel: "现代欧洲",
    route: ["国会大厦", "勃兰登堡门", "犹太人纪念碑", "波茨坦广场", "柏林墙遗址", "博恩霍尔姆大街", "查理检查站"],
    question: "德国为什么会把一个世纪的历史压缩在一座城市里？",
    intro: "正式方案的柏林整日重点是纳粹、二战、分裂、柏林墙和统一。自由行参考里的勃兰登堡门、博恩霍尔姆大街、菩提树下大街和查理检查站，正好帮助这条历史线补齐空间连接。",
    stories: [
      {
        id: "berlin-century",
        kicker: "国家的骨架",
        title: "一座城市，走过几个德国？",
        place: "国会大厦 · 柏林墙 · 博恩霍尔姆大街",
        question: "为什么柏林的纪念物总在被重新解释？",
        prompt: "今天不要把这些地方看成一串打卡点。国会大厦讲国家权力，勃兰登堡门讲统一与象征，犹太人纪念碑讲国家如何面对罪责，柏林墙和博恩霍尔姆大街讲分裂如何在一个夜晚被打开。柏林把德国从帝国、纳粹、东德、西德到统一的过程，压缩在步行和交通之间。",
        cue: "按‘权力—罪责—分裂—打开’四个词推进。",
      },
    ],
    links: ["国家制造权力", "战争制造断裂", "边界制造记忆", "打开边界重新统一"],
    reading: "正式方案 PDF｜柏林 20 世纪历史线；自由行参考补充检查站与大道",
  },
  {
    id: "day-09",
    number: "09",
    date: "10月4日",
    city: "柏林 → 巴黎",
    title: "在离开柏林前补上普鲁士",
    act: "modern",
    actLabel: "现代欧洲",
    route: ["夏洛滕堡宫 / 自选", "柏林市区", "18:30 飞往巴黎"],
    question: "纳粹以前的德国，究竟是怎样形成国家机器的？",
    intro: "真实航班是 18:30 柏林→巴黎，下午前留出接近半天。这里不再重复柏林墙，而是用夏洛滕堡宫或菩提树下大街补上普鲁士、霍亨索伦和德意志帝国的前史。",
    stories: [
      {
        id: "berlin-hidden",
        kicker: "隐藏时段",
        title: "在宫殿里补上普鲁士",
        place: "夏洛滕堡宫（可选）",
        question: "现代德国以前，权力是如何被居住和展示的？",
        prompt: "如果今天去夏洛滕堡宫，可以把它作为昨天国家机器故事的前传。国家的强大不只来自军队和法律，也来自宫殿、礼仪和一整套让等级看起来理所当然的空间。看完这里，再回想勃兰登堡门，你会发现一座城市的‘庄严’，往往是被长期训练出来的。这样柏林就不只是讲纳粹和冷战，也能回答：德国在希特勒之前究竟是什么东西？",
        cue: "把宫殿当成国家机器的前传，和昨天的街道形成对照。",
      },
    ],
    links: ["宫殿展示等级", "大道展示国家", "机场把故事带走"],
    reading: "正式方案 PDF｜柏林→巴黎；机票安排补充：U25161 18:30",
    hidden: true,
  },
  {
    id: "day-10",
    number: "10",
    date: "10月5日",
    city: "巴黎",
    title: "巴黎如何把王权变成现代城市",
    act: "modern",
    actLabel: "现代欧洲",
    route: ["卢浮宫", "蒙马特", "香榭丽舍", "埃菲尔铁塔", "塞纳河"],
    question: "法国怎样从王权的首都变成现代民族国家的城市？",
    intro: "正式方案的巴黎第一天从卢浮宫到埃菲尔铁塔，跨度很大。把它看成一条城市改造线：王权收藏、革命后的公共空间、19世纪大道和工业化的现代象征。",
    stories: [
      {
        id: "paris-modern-city",
        kicker: "现代城市",
        title: "卢浮宫到埃菲尔铁塔，是一条时间线",
        place: "卢浮宫 · 香榭丽舍 · 埃菲尔铁塔",
        question: "一座城市怎样把王权、革命和工业化同时放在眼前？",
        prompt: "卢浮宫曾经是王宫，后来变成公共博物馆；香榭丽舍和城市大道把权力、商业和人群重新组织起来；埃菲尔铁塔则把巴黎带进工业化和现代展览的时代。今天不要只说巴黎很漂亮，可以说：巴黎把过去收藏起来，再用新的城市形式展示自己已经进入现代。",
        cue: "用三个地点完成‘王宫—公共城市—工业现代性’的转场。",
      },
    ],
    links: ["王宫收藏过去", "大道组织现代人群", "铁塔展示工业未来"],
    reading: "正式方案 PDF｜巴黎：卢浮宫、蒙马特、香榭丽舍、铁塔、塞纳河",
  },
  {
    id: "day-11",
    number: "11",
    date: "10月6日",
    city: "巴黎",
    title: "法国怎样把王权、革命和民族国家串起来",
    act: "modern",
    actLabel: "现代欧洲",
    route: ["凡尔赛宫", "凡尔赛花园", "凯旋门", "巴黎圣母院"],
    question: "法国如何从王权的顶峰走到革命与民族国家？",
    intro: "正式方案把凡尔赛、凯旋门和巴黎圣母院放在同一天。它们分别代表王权的顶峰、革命与帝国重新组织国家，以及中世纪城市和宗教记忆仍然留在现代巴黎。",
    stories: [
      {
        id: "versailles-to-nation",
        kicker: "王权到民族国家",
        title: "凡尔赛的镜子，照见革命的反面",
        place: "凡尔赛宫 · 凯旋门 · 巴黎圣母院",
        question: "为什么法国必须先把王权做到极致，才会产生现代民族国家？",
        prompt: "凡尔赛把权力安排在国王周围：谁能靠近，谁只能等待，整个国家如何围绕一个中心排列。凯旋门则把战争、革命动员和拿破仑的个人形象重新写成国家叙事。到了巴黎圣母院，中世纪城市与宗教记忆又提醒我们：现代法国并不是从零开始，而是叠在旧制度和旧城市上面。",
        cue: "用‘中心—动员—叠加’三个词，把一天的景点串起来。",
      },
    ],
    links: ["王权集中中心", "革命释放动员", "民族国家重写记忆"],
    reading: "正式方案 PDF｜凡尔赛、凯旋门、巴黎圣母院；自由行参考补充凡尔赛和约线",
  },
  {
    id: "day-12",
    number: "12",
    date: "10月7日",
    city: "巴黎",
    title: "自由日：把巴黎的缝隙补成自己的线",
    act: "modern",
    actLabel: "现代欧洲",
    route: ["全天自由活动", "可选：先贤祠", "可选：荣军院 / 协和广场 / 巴士底广场"],
    question: "巴黎还有哪些地方，能把法国革命和国家记忆补完整？",
    intro: "正式方案在巴黎留出全天自由活动。这里放入自由行参考里的补充线：先贤祠、荣军院、协和广场、巴士底广场，以及凡尔赛和约、圣巴托洛缪之夜等可继续展开的历史节点。",
    stories: [
      {
        id: "paris-free-day",
        kicker: "自由日 · 自由行参考",
        title: "把革命的缝隙补进巴黎",
        place: "先贤祠 · 荣军院 · 协和广场 · 巴士底广场",
        question: "自由时间怎样让一条正式路线变得更完整？",
        prompt: "如果想补法国革命与国家记忆，可以选一条小线：先贤祠看谁被国家记住，协和广场看王权与革命如何争夺同一块空间，巴士底广场看革命如何从城市记忆变成公共身份，荣军院则可以接回拿破仑与战争。今天不必全部完成，挑一条最想讲的即可。",
        cue: "把自由行参考当作可选择的补充，不要让它覆盖正式方案。",
      },
    ],
    links: ["自由日打开选择", "地点补上缺口", "个人选择形成版本"],
    reading: "正式方案 PDF｜巴黎全天自由活动；自由行参考第二 sheet 补充线",
  },
  {
    id: "day-13",
    number: "13",
    date: "10月8日",
    city: "巴黎",
    title: "返程前，把罗马到巴黎重新拼起来",
    act: "modern",
    actLabel: "现代欧洲",
    route: ["隐藏白天", "自由补充", "20:20 飞北京"],
    question: "走完这些城市以后，欧洲在你眼里变成了什么？",
    intro: "真实航班是 20:20 巴黎→北京，因此返程前仍有大半天。正式方案之外，这段时间可以补一处最想回看的地点，也可以找一家咖啡馆，把罗马、佛罗伦萨、柏林和巴黎重新拼成自己的故事。",
    stories: [
      {
        id: "last-day",
        kicker: "隐藏时段",
        title: "把十四天变成自己的故事",
        place: "巴黎 · 返程前",
        question: "旅行结束时，什么才算真正被带回家？",
        prompt: "这趟旅行从罗马开始，最后在巴黎返程。回头看，真正的主线不是景点数量，而是几个反复出现的问题：谁在组织人群，谁在解释秩序，谁能把自己的版本写进公共记忆。帝国、教会、城邦和民族国家并没有整齐地排队离开，它们今天还在欧洲的建筑和生活里互相叠着。",
        cue: "用四个章节关键词收束：帝国、教会、城邦、国家。",
      },
    ],
    links: ["帝国留下道路", "教会留下语言", "城市留下竞争", "国家留下边界"],
    reading: "正式方案 PDF｜巴黎→北京；机票安排补充：CA934 20:20",
    hidden: true,
  },
  {
    id: "day-14",
    number: "14",
    date: "10月9日",
    city: "北京",
    title: "把故事带回去",
    act: "modern",
    actLabel: "现代欧洲",
    route: ["抵达北京", "整理照片", "下一次阅读"],
    question: "一段旅程结束后，历史怎样继续发生在自己的生活里？",
    intro: "正式方案的最后一天是抵达北京。欧洲路线结束了，但旅行手册从这里开始进入下一轮：把照片、现场观察和口播修改继续放回对应日期。",
    stories: [
      {
        id: "return-home",
        kicker: "尾声",
        title: "旅行手册不是答案，是下一次提问",
        place: "北京 · 旅行结束后",
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
          <div className="hero-note"><span className="note-line" /> <span>正式路线从罗马开始 · 当前入口：9月28日梵蒂冈</span></div>
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
