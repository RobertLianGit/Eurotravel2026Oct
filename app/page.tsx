"use client";

import { useEffect, useMemo, useState, type DragEvent } from "react";

type Activity = {
  id: string;
  time: string;
  title: string;
  place: string;
  note: string;
  kind: "visit" | "meal" | "move" | "free";
};

type StoryChapter = {
  label: string;
  title: string;
  text: string;
};

type DayPlan = {
  id: string;
  number: string;
  date: string;
  city: string;
  tag: string;
  title: string;
  route: string[];
  transport: string[];
  meals: string[];
  photoIdeas?: string[];
  activities: Activity[];
  story: {
    title: string;
    question: string;
    lead: string;
    body: string;
    chapters: StoryChapter[];
    prompt: string;
  };
  source: string;
};

type FreeOption = {
  id: string;
  region: "罗马" | "柏林" | "巴黎";
  category: "历史补线" | "邓紫棋 / 拍照";
  title: string;
  places: string;
  story: string;
  timing: string;
  source: string;
  locationKeys?: string[];
};

type MapPoint = {
  name: string;
  query: string;
  kind: "hotel" | "visit" | "move" | "optional" | "context";
  note?: string;
  coordinates: [number, number];
  displayOffset?: [number, number];
};

type HotelAnchor = {
  name: string;
  area: string;
  query: string;
  coordinates?: [number, number];
};

type DayMap = {
  city: string;
  subtitle: string;
  center: [number, number];
  bbox: [number, number, number, number];
  hotel: HotelAnchor;
  points: MapPoint[];
  contextPoints?: MapPoint[];
  relationship: string;
  note: string;
};

const freeOptions: FreeOption[] = [
  { id: "paris-versailles-treaty", region: "巴黎", category: "历史补线", title: "凡尔赛和约：一战之后的欧洲", places: "凡尔赛宫 / 镜厅 / 巴黎", story: "把凡尔赛从路易十四的王权延伸到1919年的战后秩序：旧王宫如何成为重新划分欧洲的地方。", timing: "巴黎自由日或凡尔赛日之后", source: "Excel 自由行参考（已提炼）", locationKeys: ["凡尔赛宫"] },
  { id: "paris-concorde", region: "巴黎", category: "历史补线", title: "协和广场：王权与革命争夺同一块空间", places: "协和广场", story: "从路易十五广场、革命时期的断头台，到今天的城市轴线，讲公共空间如何反复改名、改写。", timing: "巴黎自由日半日", source: "Excel 自由行参考（已提炼）", locationKeys: ["协和广场"] },
  { id: "paris-bastille", region: "巴黎", category: "历史补线", title: "巴士底广场：一座消失的监狱如何变成革命符号", places: "巴士底广场 / 圣安东尼街区", story: "现场已经看不到完整的巴士底监狱，但正因为它消失了，记忆才更依赖地图、纪念柱和公共叙事。", timing: "巴黎自由日下午", source: "Excel 自由行参考（已提炼）", locationKeys: ["巴士底广场"] },
  { id: "paris-pantheon", region: "巴黎", category: "历史补线", title: "先贤祠：法国决定记住谁", places: "先贤祠 / 拉丁区", story: "从教堂到国家陵寝，讲法国如何把宗教空间改造成公共记忆的名单。", timing: "巴黎自由日上午", source: "Excel 自由行参考（已提炼）", locationKeys: ["先贤祠"] },
  { id: "paris-invalides", region: "巴黎", category: "历史补线", title: "荣军院：拿破仑与战争国家", places: "荣军院 / 拿破仑墓", story: "把拿破仑从个人英雄拉回国家机器：战争、荣誉、军队和国家记忆如何彼此绑定。", timing: "巴黎自由日或返程前半天", source: "Excel 自由行参考（已提炼）", locationKeys: ["荣军院"] },
  { id: "paris-bartholomew", region: "巴黎", category: "历史补线", title: "圣巴托洛缪之夜：宗教战争如何进入城市记忆", places: "巴黎历史中心 / 卢浮宫—塞纳河一线", story: "把法国宗教战争放进城市空间：王权、天主教、胡格诺派和暴力记忆怎样叠在同一座首都里。", timing: "适合做一条历史故事线，不必专门赶景点", source: "Excel 自由行参考（已提炼）" },
  { id: "gem-fly-away", region: "巴黎", category: "邓紫棋 / 拍照", title: "邓紫棋《Fly Away》巴黎同款拍照线", places: "巴黎地铁 → 卢浮宫 → 埃菲尔铁塔", story: "公开资料可确认 MV 在巴黎取景。建议不追求完全复刻，而是保留‘地铁转场—卢浮宫—铁塔夜景’这条镜头逻辑。", timing: "第10天转场时预留30–45分钟", source: "邓紫棋公开 MV 资料" },
  { id: "gem-zenith", region: "巴黎", category: "邓紫棋 / 拍照", title: "邓紫棋巴黎演出地打卡", places: "Le Zénith Paris–La Villette", story: "这是粉丝向打卡，不是历史景点。她曾在这里举办巴黎演出，适合在巴黎自由日单独安排，不要硬塞进卢浮宫路线。", timing: "第12天自由日上午或下午", source: "邓紫棋巴黎演出资料" },
  { id: "paris-left-bank-photo", region: "巴黎", category: "邓紫棋 / 拍照", title: "左岸生活感拍照备选", places: "圣日耳曼大街 → Café de Flore / Les Deux Magots → 艺术桥", story: "如果想拍‘人在巴黎’而不只是地标，可以用咖啡馆、街角和塞纳河完成一条轻松的人像线。", timing: "第12天自由日下午", source: "巴黎官方旅游资料 / 拍照备选" },
  { id: "berlin-unter-den-linden", region: "柏林", category: "历史补线", title: "菩提树下大街：国家大道的形成", places: "Unter den Linden / 新岗哨 / 博物馆岛外观", story: "把普鲁士王权、帝国首都、战争记忆和今天的柏林大道放到一条步行线上。", timing: "第9天飞巴黎前隐藏时段", source: "Excel 自由行参考（已提炼）", locationKeys: ["菩提树下大街"] },
  { id: "rome-gem-unverified", region: "罗马", category: "邓紫棋 / 拍照", title: "邓紫棋罗马具体地点：待核实入口", places: "现场照片 / 链接 → 再加入罗马路线", story: "目前没有足够可靠的公开资料确认她在罗马的具体打卡地点。这里先保留入口，不把候选地点误写成她去过。", timing: "罗马自由日集中核对", source: "待你补充照片或链接" },
  { id: "rome-photo-line", region: "罗马", category: "邓紫棋 / 拍照", title: "罗马人像拍照候选线", places: "特莱维喷泉 → 西班牙广场", story: "这不是已确认的邓紫棋同款地点，而是一条最适合现场拍照、距离和节奏都可控的候选线。", timing: "第6天自由日上午", source: "罗马拍照备选" },
  { id: "rome-jasmine", region: "罗马", category: "邓紫棋 / 拍照", title: "圣彼得穹顶远景拍照候选", places: "橘园 / 马尔他骑士团钥匙孔 / 茉莉花步道", story: "不再进入梵蒂冈内部，改从城市远景拍圣彼得穹顶；适合把拍照和罗马历史收束结合起来。", timing: "第6天自由日下午", source: "罗马拍照备选" },
];

const hotelAnchors: Record<"rome" | "florence" | "berlin" | "paris", HotelAnchor> = {
  rome: { name: "温暖酒店 Warmthotel", area: "Via Giuseppe Prezzolini, 5 · Roma", query: "Warmthotel, Via Giuseppe Prezzolini 5, 00144 Roma RM, Italy", coordinates: [41.8157, 12.4721] },
  florence: { name: "佛罗伦萨米开朗基罗星际酒店", area: "Viale Fratelli Rosselli, 2 · Firenze", query: "Starhotels Michelangelo Florence, Viale Fratelli Rosselli 2, 50123 Firenze FI, Italy", coordinates: [43.7761, 11.2433] },
  berlin: { name: "柏林中心 H+ 酒店", area: "Chausseestraße 118–120 · Berlin Mitte", query: "H+ Hotel Berlin Mitte, Chausseestraße 118-120, 10115 Berlin, Germany", coordinates: [52.5351, 13.3836] },
  paris: { name: "巴黎意大利广场美居酒店", area: "25 Bd Auguste Blanqui · Paris 13e", query: "Hôtel Mercure Paris Place d'Italie, 25 Boulevard Auguste Blanqui, 75013 Paris, France", coordinates: [48.8313, 2.3548] },
};

const dailyMaps: Record<string, DayMap> = {
  "day-01": {
    city: "罗马",
    subtitle: "抵达段：机场 → 酒店",
    center: [41.88, 12.43],
    bbox: [12.21, 41.76, 12.55, 41.94],
    hotel: hotelAnchors.rome,
    contextPoints: [
      { name: "斗兽场", query: "Colosseum, Rome", kind: "context", coordinates: [41.8902, 12.4922] },
      { name: "梵蒂冈", query: "Vatican City", kind: "context", coordinates: [41.9033, 12.4534] },
    ],
    points: [{ name: "罗马机场 FCO", query: "Leonardo da Vinci–Fiumicino Airport", kind: "move", coordinates: [41.7999, 12.2462], note: "抵达后前往酒店" }],
    relationship: "今天先看机场到酒店的大方向，正式景点从第2天开始。",
    note: "酒店位置补齐后，这里会显示机场 → 酒店的准确落点和路线。",
  },
  "day-02": {
    city: "罗马",
    subtitle: "古罗马城市线：东南古城 → 万神殿 → 西班牙广场",
    center: [41.895, 12.478],
    bbox: [12.43, 41.80, 12.52, 41.92],
    hotel: hotelAnchors.rome,
    points: [
      { name: "斗兽场", query: "Colosseum, Rome", kind: "visit", coordinates: [41.8902, 12.4922], note: "起点：皇帝如何组织城市人群" },
      { name: "万神殿", query: "Pantheon, Rome", kind: "visit", coordinates: [41.8986, 12.4769], note: "从公共娱乐转到宇宙秩序" },
      { name: "特莱维喷泉", query: "Trevi Fountain, Rome", kind: "visit", coordinates: [41.9009, 12.4833] },
      { name: "真理之口", query: "Bocca della Verità, Rome", kind: "visit", coordinates: [41.8884, 12.4817] },
      { name: "西班牙广场", query: "Spanish Steps, Rome", kind: "visit", coordinates: [41.9059, 12.4828], note: "终点：帝国遗产进入今日街道" },
    ],
    relationship: "这些点位集中在罗马历史中心，斗兽场在东南侧，万神殿—特莱维—西班牙广场形成一条向北的步行线。",
    note: "正式路线点位已标出；酒店标记暂时只能显示到罗马市中心，不能代替真实酒店定位。",
  },
  "day-03": {
    city: "罗马｜梵蒂冈",
    subtitle: "跨越城市边界：罗马酒店 → 梵蒂冈城",
    center: [41.903, 12.454],
    bbox: [12.43, 41.80, 12.49, 41.925],
    hotel: hotelAnchors.rome,
    contextPoints: [
      { name: "斗兽场", query: "Colosseum, Rome", kind: "context", coordinates: [41.8902, 12.4922] },
      { name: "万神殿", query: "Pantheon, Rome", kind: "context", coordinates: [41.8986, 12.4769] },
      { name: "特莱维喷泉", query: "Trevi Fountain, Rome", kind: "context", coordinates: [41.9009, 12.4833] },
    ],
    points: [
      { name: "圣彼得大教堂", query: "St. Peter's Basilica, Vatican City", kind: "visit", coordinates: [41.9022, 12.4539], note: "君士坦丁、基督教帝国、教皇罗马", displayOffset: [-3, 4] },
      { name: "梵蒂冈博物馆", query: "Vatican Museums", kind: "visit", coordinates: [41.9065, 12.4536], note: "教皇如何收藏和重新解释罗马遗产", displayOffset: [3, -3] },
      { name: "西斯廷教堂", query: "Sistine Chapel, Vatican City", kind: "visit", coordinates: [41.9031, 12.4545], note: "艺术成为权力和解释权", displayOffset: [7, 0] },
    ],
    relationship: "梵蒂冈在罗马西北侧，三处正式景点彼此非常集中；真正需要规划的是酒店到梵蒂冈的进城交通和预约时间。",
    note: "第3天只显示梵蒂冈正式行程；后面的地图不会再次把梵蒂冈当作新景点。",
  },
  "day-04": {
    city: "佛罗伦萨",
    subtitle: "罗马 → 佛罗伦萨市中心历史线",
    center: [43.771, 11.255],
    bbox: [11.235, 43.755, 11.275, 43.79],
    hotel: hotelAnchors.florence,
    points: [
      { name: "佛罗伦萨火车站 / 抵达点", query: "Firenze Santa Maria Novella station", kind: "move", coordinates: [43.7767, 11.2486] },
      { name: "乌菲兹美术馆", query: "Uffizi Gallery, Florence", kind: "visit", coordinates: [43.7678, 11.2553], note: "美第奇如何把财富变成政治信用" },
      { name: "圣母百花大教堂", query: "Cathedral of Santa Maria del Fiore, Florence", kind: "visit", coordinates: [43.7731, 11.256], note: "城邦竞争的公共宣言" },
      { name: "领主广场", query: "Piazza della Signoria, Florence", kind: "visit", coordinates: [43.7696, 11.2558] },
      { name: "天堂之门", query: "Gates of Paradise, Florence", kind: "visit", coordinates: [43.7734, 11.2552] },
    ],
    relationship: "佛罗伦萨核心景点高度集中在老城步行范围内；酒店若在车站附近，通常先向东南进入大教堂—领主广场—乌菲兹一线。",
    note: "佛罗伦萨酒店已确认在 Viale Fratelli Rosselli, 2；这里重点看酒店 / 火车站与老城景点的相对位置。",
  },
  "day-05": {
    city: "托斯卡纳",
    subtitle: "佛罗伦萨 / 罗马住宿关系之外的乡村日",
    center: [43.15, 11.53],
    bbox: [11.15, 41.72, 12.70, 43.90],
    hotel: hotelAnchors.rome,
    points: [
      { name: "锡耶纳大教堂", query: "Siena Cathedral", kind: "visit", coordinates: [43.3188, 11.3308], note: "另一座城邦的自我表达" },
      { name: "奥尔恰谷 / 丝柏树", query: "Val d'Orcia, Tuscany", kind: "visit", coordinates: [43.06, 11.6], note: "土地、道路和景观也是秩序" },
      { name: "皮恩扎", query: "Pienza, Italy", kind: "visit", coordinates: [43.0768, 11.6785] },
      { name: "Vitaleta 小教堂", query: "Cappella della Madonna di Vitaleta", kind: "visit", coordinates: [43.0607, 11.6627] },
      { name: "返回罗马", query: "Rome, Italy", kind: "move", coordinates: [41.9028, 12.4964] },
    ],
    relationship: "这是包车 / 旅游车串联的长距离日，不适合用步行地图理解；重点看锡耶纳、皮恩扎和奥尔恰谷之间的空间跨度。",
    note: "按你的最新说明，今天返回罗马后仍以温暖酒店作为住宿锚点；交通以包车或旅游车为准。预订单文本显示 9/29 退房，后续需要再核对是否为订单日期显示问题。",
  },
  "day-06": {
    city: "罗马",
    subtitle: "自由日：经典人像线 + 圣彼得穹顶远景候选",
    center: [41.895, 12.479],
    bbox: [12.43, 41.80, 12.52, 41.925],
    hotel: hotelAnchors.rome,
    points: [
      { name: "特莱维喷泉", query: "Trevi Fountain, Rome", kind: "optional", coordinates: [41.9009, 12.4833] },
      { name: "西班牙广场", query: "Spanish Steps, Rome", kind: "optional", coordinates: [41.9059, 12.4828] },
      { name: "橘园", query: "Giardino degli Aranci, Rome", kind: "optional", coordinates: [41.8889, 12.4828] },
      { name: "马尔他骑士团钥匙孔", query: "Knights of Malta Keyhole, Rome", kind: "optional", coordinates: [41.8859, 12.4769] },
      { name: "茉莉花步道", query: "Passeggiata del Gelsomino, Rome", kind: "optional", coordinates: [41.8976, 12.4487], note: "从城外远景看圣彼得穹顶" },
    ],
    relationship: "自由日不锁死路线；地图把几个候选点放在同一张罗马图上，方便你按天气和体力取舍。",
    note: "按你的最新说明，自由日仍从温暖酒店出发；这些候选不会自动覆盖正式行程，选中后再去现场控制台排序。",
  },
  "day-07": {
    city: "罗马 → 柏林",
    subtitle: "罗马酒店 → FCO；柏林抵达关系放到第8天",
    center: [41.84, 12.37],
    bbox: [12.21, 41.76, 12.55, 41.94],
    hotel: hotelAnchors.rome,
    contextPoints: [
      { name: "斗兽场", query: "Colosseum, Rome", kind: "context", coordinates: [41.8902, 12.4922] },
      { name: "罗马历史中心", query: "Centro Storico, Rome", kind: "context", coordinates: [41.895, 12.478] },
    ],
    points: [{ name: "罗马机场 FCO", query: "Leonardo da Vinci–Fiumicino Airport", kind: "move", coordinates: [41.7999, 12.2462], note: "U25082｜15:10 起飞" }],
    relationship: "上午自由时段属于罗马；下午跨城后，第8天地图再展开柏林酒店与景点关系。",
    note: "不要把梵蒂冈重新塞回今天；地图只保留温暖酒店 → FCO 机场的实际关系。按你的说明，这段时间仍住温暖酒店。",
  },
  "day-08": {
    city: "柏林",
    subtitle: "国家权力 → 罪责 → 分裂 → 边界打开",
    center: [52.52, 13.38],
    bbox: [13.27, 52.48, 13.43, 52.58],
    hotel: hotelAnchors.berlin,
    points: [
      { name: "国会大厦", query: "Reichstag Building, Berlin", kind: "visit", coordinates: [52.5186, 13.3762], note: "现代国家权力的象征", displayOffset: [-10, -5] },
      { name: "勃兰登堡门", query: "Brandenburg Gate, Berlin", kind: "visit", coordinates: [52.5163, 13.3777], note: "王国、帝国、分裂与统一", displayOffset: [4, -10] },
      { name: "欧洲被害犹太人纪念碑", query: "Memorial to the Murdered Jews of Europe", kind: "visit", coordinates: [52.5138, 13.3785], displayOffset: [13, -2] },
      { name: "波茨坦广场 / 柏林墙", query: "Potsdamer Platz, Berlin", kind: "visit", coordinates: [52.5096, 13.376], note: "分裂进入城市肌理", displayOffset: [0, 8] },
      { name: "博恩霍尔姆大街", query: "Bornholmer Straße Berlin Wall Memorial", kind: "visit", coordinates: [52.5546, 13.3912], note: "1989年边界真正打开的地点", displayOffset: [0, -2] },
      { name: "查理检查站", query: "Checkpoint Charlie, Berlin", kind: "visit", coordinates: [52.5076, 13.3904], displayOffset: [8, 6] },
    ],
    relationship: "柏林正式景点跨越市中心南北；勃兰登堡门—国会大厦—纪念碑—波茨坦广场较集中，博恩霍尔姆大街在北侧，查理检查站在南侧。",
    note: "已安排的柏林点位只在今日地图显示，不再作为自由行备选重复出现。",
  },
  "day-09": {
    city: "柏林 → 巴黎",
    subtitle: "柏林酒店 → 夏洛滕堡宫 / BER",
    center: [52.48, 13.37],
    bbox: [13.25, 52.34, 13.55, 52.56],
    hotel: hotelAnchors.berlin,
    points: [
      { name: "夏洛滕堡宫", query: "Charlottenburg Palace, Berlin", kind: "visit", coordinates: [52.5206, 13.2955], note: "补上普鲁士和霍亨索伦前史" },
      { name: "柏林机场 BER", query: "Berlin Brandenburg Airport", kind: "move", coordinates: [52.3667, 13.5033], note: "U25161｜18:30 起飞" },
    ],
    relationship: "这是柏林最后半天的补线：酒店 → 夏洛滕堡宫 → BER；不要再绕回已经完成的柏林墙主线。",
    note: "行李是否能随车、酒店到夏洛滕堡的实际距离，需要结合酒店地址和司机安排确认。",
  },
  "day-10": {
    city: "巴黎",
    subtitle: "卢浮宫 → 蒙马特 → 城市大道 → 埃菲尔铁塔",
    center: [48.865, 2.33],
    bbox: [2.27, 48.83, 2.42, 48.91],
    hotel: hotelAnchors.paris,
    points: [
      { name: "卢浮宫", query: "Louvre Museum, Paris", kind: "visit", coordinates: [48.8606, 2.3376], note: "王宫收藏变成公共博物馆" },
      { name: "蒙马特", query: "Montmartre, Paris", kind: "visit", coordinates: [48.8867, 2.3431] },
      { name: "香榭丽舍", query: "Avenue des Champs-Élysées, Paris", kind: "visit", coordinates: [48.8698, 2.3076] },
      { name: "埃菲尔铁塔", query: "Eiffel Tower, Paris", kind: "visit", coordinates: [48.8584, 2.2945], note: "工业化和现代国家的展示橱窗" },
      { name: "塞纳河", query: "Seine River, Paris", kind: "visit", coordinates: [48.8566, 2.3522] },
    ],
    relationship: "正式路线从卢浮宫向西北到蒙马特，再折回城市大道和铁塔；拍照线是沿既有转场叠加，不是另加一条远距离路线。",
    note: "酒店位置补齐后，可判断当天更适合从酒店先去卢浮宫，还是先去蒙马特。",
  },
  "day-11": {
    city: "巴黎｜凡尔赛",
    subtitle: "巴黎酒店 → 凡尔赛 → 凯旋门 → 巴黎圣母院",
    center: [48.82, 2.25],
    bbox: [2.08, 48.78, 2.40, 48.90],
    hotel: hotelAnchors.paris,
    points: [
      { name: "凡尔赛宫", query: "Palace of Versailles", kind: "visit", coordinates: [48.8049, 2.1204], note: "绝对王权的空间机器" },
      { name: "凯旋门", query: "Arc de Triomphe, Paris", kind: "visit", coordinates: [48.8738, 2.295], note: "革命与帝国重新写国家叙事" },
      { name: "巴黎圣母院", query: "Notre-Dame de Paris", kind: "visit", coordinates: [48.853, 2.3499] },
    ],
    relationship: "凡尔赛在巴黎西南郊，凯旋门和巴黎圣母院回到市中心；这是巴黎当天最需要看交通顺序的一天。",
    note: "凡尔赛已经是正式行程，不会再出现在自由行备选库；这里专门显示它与巴黎酒店和市中心的空间关系。",
  },
  "day-12": {
    city: "巴黎",
    subtitle: "自由日：演出地 / 左岸 / 革命记忆备选",
    center: [48.86, 2.35],
    bbox: [2.28, 48.82, 2.42, 48.91],
    hotel: hotelAnchors.paris,
    points: [
      { name: "Le Zénith Paris–La Villette", query: "Le Zénith Paris–La Villette", kind: "optional", coordinates: [48.8943, 2.393], note: "邓紫棋巴黎演出地打卡候选" },
      { name: "圣日耳曼大街", query: "Boulevard Saint-Germain, Paris", kind: "optional", coordinates: [48.853, 2.333], note: "左岸生活感拍照线" },
      { name: "艺术桥", query: "Pont des Arts, Paris", kind: "optional", coordinates: [48.8584, 2.3376] },
      { name: "先贤祠", query: "Panthéon, Paris", kind: "optional", coordinates: [48.8462, 2.346] },
      { name: "荣军院", query: "Les Invalides, Paris", kind: "optional", coordinates: [48.8566, 2.3126] },
      { name: "协和广场", query: "Place de la Concorde, Paris", kind: "optional", coordinates: [48.8656, 2.3212] },
      { name: "巴士底广场", query: "Place de la Bastille, Paris", kind: "optional", coordinates: [48.853, 2.369] },
    ],
    relationship: "自由日候选分成三块：左岸与市中心、荣军院—协和广场、北侧拉维莱特；不要一天全部跑完，地图用于挑一条。",
    note: "先在地图上看距离，再把最终选择加入控制台；这里的候选点不会自动改写正式行程。",
  },
  "day-13": {
    city: "巴黎 → 北京",
    subtitle: "巴黎酒店 → 最后自由时段 → CDG",
    center: [48.92, 2.43],
    bbox: [2.20, 48.78, 2.60, 49.04],
    hotel: hotelAnchors.paris,
    points: [{ name: "戴高乐机场 CDG", query: "Charles de Gaulle Airport", kind: "move", coordinates: [49.0097, 2.5479], note: "CA934｜20:20 起飞" }],
    relationship: "返程日重点不是再塞景点，而是看巴黎酒店到机场的方向和最后离城时间。",
    note: "巴黎酒店已确认在意大利广场附近；这里重点看最后自由时段与 CDG 机场的离城方向。",
  },
};

function sketchPosition(map: DayMap, point: MapPoint) {
  const [left, bottom, right, top] = map.bbox;
  const [lat, lon] = point.coordinates;
  const [offsetX, offsetY] = point.displayOffset ?? [0, 0];
  const x = 8 + ((lon - left) / (right - left)) * 84 + offsetX;
  const y = 10 + ((top - lat) / (top - bottom)) * 46 + offsetY;
  return { x: Math.max(6, Math.min(94, x)), y: Math.max(8, Math.min(57, y)) };
}

function distanceKm(from: [number, number], to: [number, number]) {
  const [fromLat, fromLon] = from;
  const [toLat, toLon] = to;
  const earthRadius = 6371;
  const latDelta = (toLat - fromLat) * Math.PI / 180;
  const lonDelta = (toLon - fromLon) * Math.PI / 180;
  const value = Math.sin(latDelta / 2) ** 2 + Math.cos(fromLat * Math.PI / 180) * Math.cos(toLat * Math.PI / 180) * Math.sin(lonDelta / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

function directionLabel(from: [number, number], to: [number, number]) {
  const latDelta = to[0] - from[0];
  const lonDelta = to[1] - from[1];
  if (Math.abs(lonDelta) > Math.abs(latDelta) * 1.15) return lonDelta > 0 ? "向东" : "向西";
  if (Math.abs(latDelta) > Math.abs(lonDelta) * 1.15) return latDelta > 0 ? "向北" : "向南";
  return `${latDelta > 0 ? "北" : "南"}${lonDelta > 0 ? "东" : "西"}`;
}

function segmentLabel(from: [number, number], to: [number, number], point: MapPoint) {
  const km = distanceKm(from, to);
  const roundedKm = km < 1 ? km.toFixed(1) : km.toFixed(1);
  const direction = directionLabel(from, to);
  const mode = point.kind === "move" || km > 8 ? "交通段" : `步行约 ${Math.max(3, Math.round(km * 12))} 分钟`;
  return `约 ${roundedKm} km · ${direction} · ${mode}`;
}

function MapCard({ map }: { map: DayMap }) {
  const contextPoints = map.contextPoints ?? [];
  const routePoints = map.points.filter((point) => point.kind !== "optional");
  const optionalPoints = map.points.filter((point) => point.kind === "optional");
  const routePath = routePoints.map((point) => {
    const position = sketchPosition(map, point);
    return `${position.x},${position.y}`;
  }).join(" ");
  const optionalPath = optionalPoints.map((point) => {
    const position = sketchPosition(map, point);
    return `${position.x},${position.y}`;
  }).join(" ");
  const hotelPoint = map.hotel.coordinates ? { name: map.hotel.name, query: map.hotel.query, kind: "hotel" as const, coordinates: map.hotel.coordinates } : null;

  return <details className="map-card">
    <summary><span className="map-summary-icon">⌖</span><span><b>今日地图</b><small>{map.subtitle}</small></span><em>点击展开</em><strong>＋</strong></summary>
    <div className="map-card-body">
      <div className="map-card-intro"><div><p className="eyebrow">SKETCH MAP / 方位草图</p><h4>{map.city}怎么走</h4><p>{map.relationship}</p></div><span className="map-status">相对位置示意<br /><b>不是按比例地图</b></span></div>
      <div className="map-layout">
        <div className="sketch-map-wrap">
          <svg className="sketch-map" viewBox="0 0 100 64" role="img" aria-label={`${map.city}方位草图`}>
            <path className="sketch-land" d="M5 46 C12 33 17 22 31 18 C45 4 70 9 84 18 C95 26 94 43 87 53 C73 62 52 56 39 58 C23 60 10 55 5 46 Z" />
            <path className="sketch-road road-one" d="M4 44 C17 39 22 48 35 40 S57 16 94 22" />
            <path className="sketch-road road-two" d="M15 15 C26 27 26 39 42 48 S70 51 91 42" />
            <path className="sketch-road road-three" d="M20 55 C35 39 49 35 62 14" />
            {routePath && routePoints.length > 1 && <polyline className="sketch-route" points={routePath} />}
            {optionalPath && optionalPoints.length > 1 && <polyline className="sketch-route optional-route" points={optionalPath} />}
            <g className="sketch-compass" transform="translate(87 8)"><circle r="5" /><path d="M0 -4 L1.5 1 L0 0 L-1.5 1 Z" /><text x="0" y="-7">N</text><text x="8" y="2">E</text><text x="0" y="10">S</text><text x="-8" y="2">W</text></g>
            <text className="sketch-caption" x="7" y="61">方位关系草图 · 北向上</text>
            {contextPoints.map((point) => { const position = sketchPosition(map, point); return <g className="sketch-context" key={`context-${point.name}`} transform={`translate(${position.x} ${position.y})`}><circle r="1.7" /></g>; })}
            {map.hotel.coordinates && (() => { const position = sketchPosition(map, { name: map.hotel.name, query: map.hotel.query, kind: "hotel", coordinates: map.hotel.coordinates }); return <g className="sketch-hotel" transform={`translate(${position.x} ${position.y})`}><circle r="3.1" /><text x="4.4" y="1.2">H · 酒店</text></g>; })()}
            {map.points.map((point, index) => { const position = sketchPosition(map, point); return <g className={`sketch-point ${point.kind}`} key={`point-${point.name}-${index}`} transform={`translate(${position.x} ${position.y})`}><circle r={point.kind === "optional" ? 2.6 : 2.9} /><text x="0" y="0.9" textAnchor="middle">{point.kind === "optional" ? "·" : String(index + 1)}</text></g>; })}
          </svg>
        </div>
        <div className="map-stops">
          <div className={`map-stop hotel-stop ${map.hotel.coordinates ? "" : "pending"}`}><span className="map-stop-number hotel-number">H</span><div><b>{map.hotel.name}</b><small>{map.hotel.area}</small></div></div>
          {map.points.map((point, index) => <div className="route-sequence" key={`${point.name}-${index}`}>
            {hotelPoint && <div className="map-segment"><span>↓</span><small>{segmentLabel(index === 0 ? hotelPoint.coordinates : map.points[index - 1].coordinates, point.coordinates, point)}</small></div>}
            <div className={`map-stop ${point.kind}`}><span className="map-stop-number">{point.kind === "optional" ? "·" : String(index + 1).padStart(2, "0")}</span><div><b>{point.name}</b><small>{point.note ?? (point.kind === "optional" ? "自由日候选" : "当天路线点位")}</small></div></div>
          </div>)}
          {contextPoints.length > 0 && <div className="map-context-note"><b>城市参照地标</b><span>{contextPoints.map((point) => point.name).join(" · ")}</span></div>}
        </div>
      </div>
      <div className="map-card-footer"><p><b>怎么读：</b>{map.note}</p><div className="map-legend"><span><i className="legend-line solid" />实线：当天顺序</span><span><i className="legend-line dashed" />虚线：备选方向</span><span><i className="legend-dot hotel-dot" />H：酒店</span></div></div>
    </div>
  </details>;
}

const basePlans: DayPlan[] = [
  {
    id: "day-01", number: "01", date: "9月26日", city: "北京 → 罗马", tag: "抵达日", title: "从罗马开始",
    route: ["北京出发", "抵达罗马", "酒店 / 休整"], transport: ["CA939｜13:15 北京 → 18:30 罗马", "机场 → 酒店：以接送安排为准"], meals: ["飞机上简餐", "抵达后：酒店附近晚餐"],
    activities: [
      { id: "d1-1", time: "13:15", title: "北京出发", place: "首都机场", note: "把今天当作正式旅程的序章", kind: "move" },
      { id: "d1-2", time: "18:30", title: "抵达罗马", place: "罗马机场", note: "办理入境、取行李、前往酒店", kind: "move" },
      { id: "d1-3", time: "20:30", title: "入住 / 休整", place: "罗马酒店", note: "不再安排正式景点", kind: "free" },
    ],
    story: { title: "为什么欧洲的故事，要从罗马开始？", question: "一座城市怎样把两千年的权力压缩进今天的街道？", lead: "今天不是打卡日，而是整趟旅行的开场。先记住一个总问题：罗马为什么能把道路、法律、建筑和精神权威，一层层传给后来的欧洲？", body: "这趟旅行从罗马开始，接下来会经过佛罗伦萨、柏林和巴黎。它们看上去属于不同国家、不同世纪，但都在处理同一个遗产：罗马留下的帝国想象。你今晚不需要讲完整故事，只要告诉自己，明天看到的每一座建筑，都不是孤立的风景，而是一个曾经统治过巨大世界的城市留下的回声。", chapters: [{ label: "01", title: "先把罗马放回地图", text: "罗马不是意大利的一座古城，而是欧洲政治语言的起点。" }, { label: "02", title: "旅程的总问题", text: "帝国消失以后，谁继承了它的道路、法律和精神权威？" }], prompt: "请把‘从罗马开始’写成一段 60 秒旅行开场，语气自然，适合我在抵达罗马后对老婆讲。" },
    source: "正式方案 PDF｜北京→罗马抵达日",
  },
  {
    id: "day-02", number: "02", date: "9月27日", city: "罗马", tag: "正式行程", title: "皇帝如何控制一座城市",
    route: ["斗兽场", "万神殿", "特莱维喷泉", "真理之口", "西班牙广场"], transport: ["酒店 → 斗兽场：步行 / 地铁，以酒店位置调整", "市中心景点之间：步行串联"], meals: ["午餐：斗兽场—万神殿之间自选", "晚餐：西班牙广场附近自选"],
    activities: [
      { id: "d2-1", time: "09:00", title: "斗兽场", place: "Colosseo", note: "看皇帝如何组织城市大众", kind: "visit" },
      { id: "d2-2", time: "11:30", title: "万神殿", place: "Pantheon", note: "看皇帝如何把秩序包装成宇宙", kind: "visit" },
      { id: "d2-3", time: "13:00", title: "午餐 / 休息", place: "万神殿周边", note: "给体力留余量", kind: "meal" },
      { id: "d2-4", time: "14:30", title: "特莱维喷泉", place: "Trevi Fountain", note: "从帝国建筑进入今天的城市生活", kind: "visit" },
      { id: "d2-5", time: "16:00", title: "真理之口 → 西班牙广场", place: "罗马市中心", note: "按当天体力调整顺序", kind: "visit" },
    ],
    story: { title: "皇帝如何控制一座城市", question: "皇帝为什么要同时控制人群的情绪和人们对世界的想象？", lead: "今天的故事不是‘罗马有很多古迹’，而是看一座帝国怎样把娱乐、神圣、道路和日常生活组织成一台城市机器。", body: "先从斗兽场开始。它最值得讲的不是巨大，而是它把整个罗马社会分层地安排在看台上：每个人都知道自己坐在哪里，也知道皇帝坐在哪里。角斗、粮食和欢呼被放进同一套公共秩序里，皇帝让人们看见，他不仅能发动战争，也能安排城市的时间、情绪和想象。再到万神殿，故事从人群转向宇宙。穹顶把光线引入建筑中心，建筑仿佛在告诉人们：罗马的秩序不仅管理城市，也连接天地。走到特莱维喷泉、真理之口和西班牙广场时，再把镜头拉回今天：帝国早已消失，但它留下的道路、建筑、传说和城市节奏，仍然在日常生活里运转。", chapters: [{ label: "01", title: "斗兽场：皇帝管理人群", text: "看台的分层不是建筑细节，而是社会秩序的公开展示。" }, { label: "02", title: "万神殿：皇帝管理宇宙", text: "建筑把政治权力包装成一种关于天地秩序的想象。" }, { label: "03", title: "街道：帝国进入日常", text: "真正持久的帝国，不只留在废墟里，也留在城市的走法里。" }], prompt: "请把下面这段罗马故事改成我可以边走边讲的 3 分钟口播。保留‘斗兽场管理人群—万神殿管理宇宙—街道保存帝国’的因果关系，不要写成百科介绍，并加入一个现场观察细节。\n\n原稿：" },
    source: "正式方案 PDF｜罗马城市线：斗兽场、万神殿、真理之口等",
  },
  {
    id: "day-03", number: "03", date: "9月28日", city: "罗马｜梵蒂冈", tag: "重点日", title: "帝国如何变成教皇世界",
    route: ["圣彼得大教堂", "梵蒂冈博物馆", "西斯廷教堂"], transport: ["罗马酒店 → 梵蒂冈：步行 / 地铁 / 车程，以酒店位置调整", "梵蒂冈内部：按预约时间入场"], meals: ["午餐：梵蒂冈周边自选", "晚餐：回罗马市区后自选"],
    activities: [
      { id: "d3-1", time: "08:00", title: "圣彼得大教堂", place: "St. Peter's Basilica", note: "从君士坦丁讲到教皇罗马", kind: "visit" },
      { id: "d3-2", time: "11:30", title: "午餐 / 休息", place: "梵蒂冈周边", note: "根据预约和排队情况调整", kind: "meal" },
      { id: "d3-3", time: "13:30", title: "梵蒂冈博物馆", place: "Vatican Museums", note: "看教皇如何收藏、解释和展示历史", kind: "visit" },
      { id: "d3-4", time: "16:30", title: "西斯廷教堂", place: "Sistine Chapel", note: "把艺术讲成教皇权力的语言", kind: "visit" },
      { id: "d3-5", time: "18:30", title: "离开梵蒂冈", place: "回罗马市区", note: "当天预约时间以票面为准", kind: "move" },
    ],
    story: { title: "从异教帝国到教皇罗马：帝国为什么没有真正消失？", question: "罗马帝国灭亡以后，罗马为什么反而成为欧洲精神中心？", lead: "今天是整趟旅行的关键转折：不是从一个景点跳到另一个景点，而是把斗兽场看到的帝国，讲到圣彼得大教堂、梵蒂冈博物馆和西斯廷教堂里的教皇世界。", body: "站在圣彼得大教堂前，可以先问一个看似矛盾的问题：一个曾经迫害基督徒的帝国，为什么最后会让基督教进入权力中心？罗马帝国原本靠军队、法律和皇帝维持秩序，但在长期危机中，君士坦丁看到基督教提供了一种跨越地域的新共同体。公元313年，米兰敕令让基督教从地下走到阳光下。重要的不是皇帝突然变得虔诚，而是帝国开始把自己的普世权力翻译成宗教语言。帝国没有在这一刻立刻消失，它只是开始换一种方式继续存在。\n\n进入梵蒂冈博物馆时，可以把它看成教皇对罗马遗产的收藏和重新编排。古代雕塑、宗教图像和文艺复兴艺术被放进同一条参观路径，让来到这里的人感觉：罗马不只拥有过去，它还拥有解释过去的资格。到了西斯廷教堂，故事再往前一步。米开朗基罗画的不是一张漂亮天花板，而是一场关于人类起源、救赎和权威的公开宣言。教皇借艺术告诉欧洲：谁能够解释创世纪，谁就拥有解释世界秩序的权力。\n\n所以今天离开梵蒂冈时，可以把整天收成一条线：皇帝曾经在罗马组织世界，君士坦丁让帝国采用基督教的语言，教皇又在罗马继承了帝国的普世想象。两千年前的皇帝和今天的教皇并不是同一种权力，但他们都在回答同一个问题——谁有资格把分散的人、土地和记忆，组织成一个共同的世界？", chapters: [{ label: "01", title: "圣彼得大教堂：皇帝转身", text: "从君士坦丁开始，罗马帝国把新的宗教共同体纳入自己的秩序。" }, { label: "02", title: "梵蒂冈博物馆：教皇收藏罗马", text: "博物馆不是杂物间，而是教皇重新编排古代、宗教和艺术的叙事机器。" }, { label: "03", title: "西斯廷教堂：艺术成为权力", text: "米开朗基罗的天花板把创世纪变成一场关于解释权的公开宣言。" }, { label: "04", title: "离开梵蒂冈：帝国换了一种语言", text: "帝国消失了，但普世秩序的想象继续留在罗马。" }], prompt: "请把下面这篇‘罗马帝国如何变成教皇罗马’改成适合我在 9 月 28 日梵蒂冈现场口播的完整故事。要求：\n1. 8—10 分钟，可以完整讲清楚，不要压缩成几个知识点；\n2. 保留‘罗马帝国危机—君士坦丁—米兰敕令—圣彼得大教堂—梵蒂冈博物馆—西斯廷教堂—教皇继承帝国遗产’的因果链；\n3. 每到一个地点，都要告诉我眼前应该观察什么；\n4. 语气像我在给老婆讲故事，不要像导游背诵；\n5. 最后用一句话把今天和前一天的斗兽场连接起来。\n\n原稿：" },
    source: "正式方案 PDF + 行程修正｜第三天固定为梵蒂冈，不再显示帕拉蒂尼山",
  },
  {
    id: "day-04", number: "04", date: "9月29日", city: "罗马 → 佛罗伦萨", tag: "正式行程", title: "帝国之后，城邦重新发明欧洲",
    route: ["前往佛罗伦萨", "乌菲兹美术馆", "圣母百花大教堂", "领主广场", "天堂之门"], transport: ["罗马 → 佛罗伦萨：按正式方案交通", "佛罗伦萨市区：步行串联"], meals: ["午餐：佛罗伦萨市中心自选", "晚餐：酒店 / 市区自选"],
    activities: [
      { id: "d4-1", time: "上午", title: "前往佛罗伦萨", place: "罗马 → 佛罗伦萨", note: "从帝国城市进入城邦城市", kind: "move" },
      { id: "d4-2", time: "10:30", title: "乌菲兹美术馆", place: "Uffizi Gallery", note: "美第奇如何用艺术打造公共声望", kind: "visit" },
      { id: "d4-3", time: "14:00", title: "百花大教堂 / 洗礼堂", place: "Duomo", note: "城市竞争如何变成建筑高度", kind: "visit" },
      { id: "d4-4", time: "16:00", title: "领主广场", place: "Piazza della Signoria", note: "看城邦如何把政治放到公共空间", kind: "visit" },
    ],
    story: { title: "佛罗伦萨为什么能接过罗马的火炬？", question: "罗马帝国消失以后，新的欧洲为什么从城邦竞争中长出来？", lead: "今天不是从帝国跳进美术馆，而是看城市如何重新获得政治主动权。", body: "佛罗伦萨的银行、广场、教堂和美术馆共同说明了一件事：财富本身不会自动变成合法性。美第奇家族必须把银行赚来的钱转化为建筑、画作和公共荣耀，让整座城市不断重复一个印象——这个家族有能力让佛罗伦萨变得更伟大。文艺复兴因此不是艺术突然自由了，而是艺术被卷入城邦竞争，成为城市争夺信用、声望和权力的方式。", chapters: [{ label: "01", title: "城邦竞争", text: "城市之间的竞争，让公共建筑成为政治声明。" }, { label: "02", title: "美第奇赞助", text: "银行财富必须经过艺术和公共荣耀，才能变成政治信用。" }, { label: "03", title: "从罗马到佛罗伦萨", text: "罗马留下的古典遗产，在城邦竞争中被重新激活。" }], prompt: "请把佛罗伦萨的乌菲兹、百花大教堂和领主广场串成一个 5 分钟故事，重点讲‘城邦竞争如何把艺术变成政治’。\n\n原稿：" },
    source: "正式方案 PDF｜罗马→佛罗伦萨；自由行参考补充美第奇线",
  },
  {
    id: "day-05", number: "05", date: "9月30日", city: "佛罗伦萨 → 托斯卡纳 → 罗马", tag: "正式行程", title: "文艺复兴为什么不只发生在大城市",
    route: ["锡耶纳大教堂", "奥尔恰谷", "丝柏树", "皮恩扎", "Vitaleta 小教堂", "返回罗马"], transport: ["托斯卡纳包车 / 旅游车：以正式方案为准", "乡村景点之间：随车移动"], meals: ["午餐：锡耶纳 / 皮恩扎自选", "晚餐：返回罗马后自选"],
    activities: [
      { id: "d5-1", time: "上午", title: "锡耶纳大教堂", place: "Siena", note: "看另一座城邦的自我表达", kind: "visit" },
      { id: "d5-2", time: "中午", title: "奥尔恰谷 / 丝柏树", place: "Val d'Orcia", note: "景观不是背景，也是一种秩序", kind: "visit" },
      { id: "d5-3", time: "下午", title: "皮恩扎 / Vitaleta 小教堂", place: "Pienza", note: "把政治理想压缩进小城尺度", kind: "visit" },
      { id: "d5-4", time: "傍晚", title: "返回罗马", place: "托斯卡纳 → 罗马", note: "把城邦故事带回帝国起点", kind: "move" },
    ],
    story: { title: "小城是被压缩的欧洲", question: "当权力离开大城市，历史还会留下什么？", lead: "今天的故事要慢下来：广场、钟楼、山路和乡野景观，如何保存城邦时代的政治性格。", body: "在小城里，历史不再以帝国的尺度出现，而是压缩在步行距离之内。市政厅、教堂、市场和住宅彼此面对，权力、信仰和日常生活没有被分到不同区域。到了奥尔恰谷，城邦的政治性又变成土地、道路和景观。今天离开托斯卡纳回到罗马，可以把这段理解成：文艺复兴不是一栋建筑，而是一整套重新组织城市与生活的方法。", chapters: [{ label: "01", title: "锡耶纳：另一种城邦", text: "佛罗伦萨不是唯一的答案，竞争本身才是文艺复兴的动力。" }, { label: "02", title: "奥尔恰谷：土地变成秩序", text: "景观看似自然，其实凝结了道路、农业和权力的安排。" }, { label: "03", title: "返回罗马", text: "离开城邦以后，重新回到帝国的起点，历史线开始折返。" }], prompt: "请把锡耶纳、奥尔恰谷、皮恩扎和返回罗马串成一个 4 分钟口播，避免只写风景描写，要讲清楚‘城邦、土地、景观和秩序’的关系。\n\n原稿：" },
    source: "正式方案 PDF｜锡耶纳、奥尔恰谷、皮恩扎后返回罗马",
  },
  {
    id: "day-06", number: "06", date: "10月1日", city: "罗马", tag: "自由日", title: "给自己补一块罗马",
    route: ["全天自由活动", "拍照预留：罗马人像线", "可选：古罗马 / 橘园一线"], transport: ["市内交通：步行 / 地铁 / 打车按当天选择", "自由日不锁死路线；拍照线按天气和体力取舍"], meals: ["午餐：当天路线附近自选", "晚餐：罗马市区自选"],
    photoIdeas: ["邓紫棋罗马具体打卡点：目前没有足够可靠的公开资料确认，不把候选点写成她去过。", "建议预留：特莱维喷泉 → 西班牙广场，适合做一条轻量经典人像线。", "进阶备选：橘园 / 马尔他骑士团钥匙孔；想拍圣彼得穹顶远景，可看罗马官方推荐的茉莉花步道。"],
    activities: [
      { id: "d6-1", time: "09:00–11:00", title: "拍照预留：罗马人像线", place: "特莱维喷泉 → 西班牙广场", note: "先作为邓紫棋打卡候选，不把它写成已确认的她去过地点；天气不好可直接取消", kind: "free" },
      { id: "d6-2", time: "中午", title: "午餐", place: "当天决定", note: "可以在控制台里加入餐厅", kind: "meal" },
      { id: "d6-3", time: "14:30–16:30", title: "第二拍照备选 / 历史补线", place: "橘园 / 马尔他骑士团钥匙孔 / 茉莉花步道", note: "三选一即可；不要为了拍照把自由日排满", kind: "free" },
      { id: "d6-4", time: "傍晚", title: "自由活动 / 晚餐", place: "罗马市区", note: "保留体力，也可补拍白天没拍到的照片", kind: "free" },
    ],
    story: { title: "自由日不是空白，是你的版本", question: "自由时间怎样把正式路线变成自己的旅行？", lead: "正式方案在这里留出全天自由活动。今天的重点不是完成更多景点，而是决定你想把哪条历史线补完整。", body: "你可以回看前几天：斗兽场代表皇帝如何管理人群，梵蒂冈代表帝国如何被教会继承，佛罗伦萨又把罗马遗产变成了城邦竞争。现在请你选择一个缺口：补古罗马公共空间，补圣天使堡和教皇罗马，或者只在街道里观察这些历史怎样继续生活在今天。自由日的价值，是让你不必服从别人替你排好的顺序。", chapters: [{ label: "01", title: "补古罗马", text: "把前一天的帝国城市线再补一段。" }, { label: "02", title: "补教皇罗马", text: "把梵蒂冈之后的城市记忆继续延伸。" }, { label: "03", title: "什么都不补", text: "休息、吃饭和观察，也可以成为旅行材料。" }], prompt: "我在罗马自由日有这些选择：____。请帮我根据前几天已经讲过的帝国、教会和文艺复兴，安排一条不重复、节奏合理的半日或一日路线，并写出当天可以讲的完整故事。\n\n现场补充：" },
    source: "正式方案 PDF｜罗马全天自由活动；自由行参考第二 sheet 作为补充库",
  },
  {
    id: "day-07", number: "07", date: "10月2日", city: "罗马 → 柏林", tag: "隐藏时段", title: "去柏林前的自由半天",
    route: ["罗马最后自由时段", "酒店取行李", "机场", "抵达柏林"], transport: ["U25082｜15:10 罗马 → 17:20 柏林", "预计 12:00 左右从市区前往机场，按实际接送调整"], meals: ["早餐：罗马酒店附近", "午餐：机场 / 路上"],
    activities: [
      { id: "d7-1", time: "07:30–10:30", title: "罗马最后自由时段", place: "酒店周边 / 当天自选", note: "不再安排梵蒂冈：睡懒觉、咖啡、买伴手礼，或补一个前几天错过的街区", kind: "free" },
      { id: "d7-2", time: "10:30", title: "回酒店取行李", place: "罗马酒店", note: "检查护照、机票和随身物品，为机场留足余量", kind: "move" },
      { id: "d7-3", time: "12:00", title: "前往机场", place: "罗马市区 → FCO", note: "按接送安排和当天路况调整", kind: "move" },
      { id: "d7-4", time: "15:10", title: "飞往柏林", place: "FCO → BER", note: "从罗马章节转入德国章节", kind: "move" },
    ],
    story: { title: "离开罗马：把三条历史线装进行李", question: "当我们离开罗马，哪些故事已经完成，哪些要带去柏林？", lead: "第 3 天已经完整参观过梵蒂冈，今天不再重复安排景点。真实航班前的上午故意留白：让你们休息、吃早餐、买东西，也把罗马的几条历史线收起来。", body: "离开罗马前，先回想第 2 天的斗兽场和万神殿：皇帝如何管理人群，也如何把自己的秩序包装成宇宙秩序。第 3 天的梵蒂冈已经把故事转了一个方向——帝国不再只靠军队和法律留下来，它还通过基督教、艺术和教皇的普世权威继续影响欧洲。第 4、5 天的佛罗伦萨和托斯卡纳，又让我们看到罗马的古典遗产怎样被城邦、银行和艺术重新激活。今天的自由半天不是少安排了一个景点，而是给这些故事留出消化的时间。去机场路上，可以把它收成一句话：罗马留下了帝国的道路、教会的权威和城市竞争的记忆；下一站柏林，要看现代国家如何接过并改造这些遗产。", chapters: [{ label: "01", title: "不再加一个景点", text: "梵蒂冈已经在第 3 天完整完成，今天的留白是有意安排，不是遗漏。" }, { label: "02", title: "把罗马收成三层", text: "斗兽场与万神殿是皇帝，梵蒂冈是教会，佛罗伦萨是古典遗产的新竞争。" }, { label: "03", title: "从帝国城市去国家城市", text: "带着罗马的问题去柏林：谁来组织现代欧洲，国家又会走向哪里？" }], prompt: "请把罗马去柏林前的自由半天写成一段 2—3 分钟的告别故事。注意：梵蒂冈已经在第 3 天完整参观过，今天不要再安排圣彼得大教堂或任何梵蒂冈景点；要把斗兽场、万神殿、梵蒂冈、佛罗伦萨和即将抵达的柏林连接起来，语气像我在机场路上讲给老婆听。\n\n我今天早上实际看到的细节：" },
    source: "正式方案 PDF｜罗马→柏林；机票安排补充 U25082 15:10；第 3 天梵蒂冈已完成",
  },
  {
    id: "day-08", number: "08", date: "10月3日", city: "柏林", tag: "正式行程", title: "德国为什么走到20世纪这一步",
    route: ["国会大厦", "勃兰登堡门", "犹太人纪念碑", "波茨坦广场", "柏林墙遗址", "博恩霍尔姆大街", "查理检查站"], transport: ["柏林市内：步行 + 地铁 / 车辆，以正式方案为准", "点位较多：控制台可按当天体力调整顺序"], meals: ["午餐：市中心路线附近", "晚餐：柏林市区自选"],
    activities: [
      { id: "d8-1", time: "09:00", title: "国会大厦", place: "Reichstag", note: "国家权力的象征", kind: "visit" },
      { id: "d8-2", time: "10:30", title: "勃兰登堡门", place: "Brandenburg Gate", note: "王国入口、帝国背景、统一舞台", kind: "visit" },
      { id: "d8-3", time: "11:30", title: "犹太人纪念碑", place: "Memorial to the Murdered Jews of Europe", note: "国家如何面对罪责", kind: "visit" },
      { id: "d8-4", time: "14:00", title: "波茨坦广场 / 柏林墙", place: "Potsdamer Platz", note: "分裂如何进入城市肌理", kind: "visit" },
      { id: "d8-5", time: "16:30", title: "博恩霍尔姆大街 / 查理检查站", place: "Bornholmer Straße / Checkpoint Charlie", note: "边界如何在一个夜晚被打开", kind: "visit" },
    ],
    story: { title: "一座城市，走过几个德国？", question: "德国为什么会把一个世纪的历史压缩在一座城市里？", lead: "今天不是看几个二战和柏林墙地标，而是沿着国家、战争、罪责、分裂和重新统一，走完德国的20世纪。", body: "从国会大厦开始，先看国家权力如何被建筑代表；走到勃兰登堡门，它曾经是王国的入口、帝国的背景、分裂的边界，也成为统一的舞台。犹太人纪念碑把故事从国家荣耀转向国家罪责：一个国家不仅要纪念胜利，也必须面对自己造成的毁灭。到了波茨坦广场和柏林墙遗址，国家被切成两半，城市的道路、家庭和时间都被边界重新安排。最后在博恩霍尔姆大街或查理检查站，讲 1989 年边境打开的瞬间：历史并不总是因为一个伟大计划而改变，有时是一句含混的新闻发布、一个执行命令的人和门外越来越多的人，共同把冷战推向终点。今天柏林的完整故事，是德国如何制造国家、把国家推向极端，又如何在废墟和分裂之后重新学习统一。", chapters: [{ label: "01", title: "国家权力", text: "国会大厦与勃兰登堡门，讲国家如何展示自己。" }, { label: "02", title: "国家罪责", text: "犹太人纪念碑提醒我们，现代国家也必须面对毁灭性的过去。" }, { label: "03", title: "城市分裂", text: "柏林墙不是一面孤立的墙，而是把生活切开的制度。" }, { label: "04", title: "边界打开", text: "博恩霍尔姆大街把冷战的终点落到一个具体夜晚。" }], prompt: "请把柏林这一天改写成 8—10 分钟的完整现场故事。必须保留‘普鲁士/国家形成—纳粹与罪责—二战—分裂—柏林墙—1989 打开边界—统一’的因果线，并且每个地点都给我一个可以指给老婆看的现场细节。\n\n原稿：" },
    source: "正式方案 PDF｜柏林 20 世纪历史线；自由行参考补充勃兰登堡门、博恩霍尔姆大街、检查站",
  },
  {
    id: "day-09", number: "09", date: "10月4日", city: "柏林 → 巴黎", tag: "隐藏时段", title: "在离开柏林前补上普鲁士",
    route: ["夏洛滕堡宫 / 可选", "柏林市区", "18:30 飞往巴黎"], transport: ["U25161｜18:30 柏林 → 20:20 巴黎", "预计下午 15:00 左右离开市区，按机场与行李调整"], meals: ["早餐：柏林酒店", "午餐：夏洛滕堡 / 市区自选"],
    activities: [
      { id: "d9-1", time: "09:30", title: "夏洛滕堡宫 / 可选", place: "Charlottenburg Palace", note: "补上普鲁士与霍亨索伦前史", kind: "visit" },
      { id: "d9-2", time: "12:30", title: "午餐", place: "夏洛滕堡周边", note: "现场决定", kind: "meal" },
      { id: "d9-3", time: "14:30", title: "前往机场", place: "柏林市区 → BER", note: "不要把下午排得过满", kind: "move" },
      { id: "d9-4", time: "18:30", title: "飞往巴黎", place: "BER → 巴黎", note: "进入法国章节", kind: "move" },
    ],
    story: { title: "纳粹以前的德国，究竟是什么？", question: "强大的国家机器，在战争以前是怎样形成的？", lead: "今天的隐藏时段不重复柏林墙，而是补上正式方案缺掉的前史：普鲁士、宫殿、礼仪和国家机器。", body: "如果去夏洛滕堡宫，可以把它当作昨天国家故事的前传。国家的强大不只来自军队和法律，也来自宫殿、礼仪和一整套让等级看起来理所当然的空间。看完这里，再回想勃兰登堡门，你会发现一座城市的庄严往往是被长期训练出来的。这样柏林就不只是讲纳粹和冷战，也能回答：德国在希特勒之前究竟是什么东西？", chapters: [{ label: "01", title: "宫殿训练等级", text: "空间、礼仪和距离让国家秩序变得可见。" }, { label: "02", title: "普鲁士补课", text: "把昨天的20世纪放回更长的国家形成史。" }, { label: "03", title: "去往巴黎", text: "带着德国的国家问题，进入法国的王权与革命。" }], prompt: "请把夏洛滕堡宫写成柏林正式行程的前传，讲清楚普鲁士、宫廷、国家机器和后来德国历史之间的关系，控制在 4 分钟。\n\n原稿：" },
    source: "正式方案 PDF｜柏林→巴黎；机票安排补充 U25161 18:30",
  },
  {
    id: "day-10", number: "10", date: "10月5日", city: "巴黎", tag: "正式行程", title: "巴黎如何把王权变成现代城市",
    route: ["卢浮宫", "蒙马特", "香榭丽舍", "埃菲尔铁塔", "塞纳河", "Fly Away 拍照线"], transport: ["巴黎市内：地铁 / 步行 / 车辆，以正式方案为准", "点位较多：现场可调整顺序；拍照预留随转场完成"], meals: ["午餐：卢浮宫或市中心附近", "晚餐：塞纳河 / 酒店附近自选"],
    photoIdeas: ["公开资料可确认：邓紫棋《Fly Away》MV在巴黎取景，画面涉及巴黎地铁、卢浮宫和埃菲尔铁塔，可按‘地铁 → 卢浮宫 → 铁塔’做同款路线。", "建议预留 30–45 分钟拍照，不另加一个远距离景点；正式参观超时时，优先保留铁塔与塞纳河机位。"],
    activities: [
      { id: "d10-1", time: "上午", title: "卢浮宫", place: "Louvre", note: "王宫如何变成公共博物馆", kind: "visit" },
      { id: "d10-2", time: "中午", title: "午餐 / 转场", place: "巴黎市区", note: "根据排队和体力调整", kind: "meal" },
      { id: "d10-3", time: "下午", title: "蒙马特 → 香榭丽舍", place: "Paris", note: "城市生活与国家大道；转场途中预留地铁拍照镜头", kind: "visit" },
      { id: "d10-4", time: "傍晚", title: "埃菲尔铁塔 / 塞纳河 + Fly Away 同款镜头", place: "Eiffel Tower / Seine", note: "把公开资料里出现的巴黎取景点收在一张照片里", kind: "free" },
    ],
    story: { title: "卢浮宫到埃菲尔铁塔，是一条时间线", question: "一座城市怎样把王权、革命和工业化同时放在眼前？", lead: "今天看巴黎不是看漂亮，而是看一座首都怎样把过去收藏起来，再用新的城市形式展示自己已经进入现代。", body: "卢浮宫曾经是王宫，后来变成公共博物馆；它把王权的收藏转成国家可以共享的文化。香榭丽舍和城市大道把权力、商业和人群重新组织起来，巴黎不再只是国王的城市，也变成现代社会的舞台。埃菲尔铁塔则把巴黎带进工业化和世界展览的时代。今天三个地点连起来，可以讲成一座城市如何从王权的私有空间，变成现代国家的公共橱窗。", chapters: [{ label: "01", title: "王宫收藏过去", text: "卢浮宫把王权的收藏转成公共文化。" }, { label: "02", title: "大道组织人群", text: "现代巴黎把权力、商业和日常生活放到同一张城市地图上。" }, { label: "03", title: "铁塔展示未来", text: "工业技术成为国家和城市展示现代性的方式。" }], prompt: "请把卢浮宫、蒙马特、香榭丽舍、埃菲尔铁塔和塞纳河串成一个 6 分钟巴黎故事，重点讲王权如何变成现代城市。\n\n原稿：" },
    source: "正式方案 PDF｜巴黎：卢浮宫、蒙马特、香榭丽舍、铁塔、塞纳河",
  },
  {
    id: "day-11", number: "11", date: "10月6日", city: "巴黎 / 凡尔赛", tag: "正式行程", title: "法国如何从王权走到民族国家",
    route: ["凡尔赛宫", "凡尔赛花园", "凯旋门", "巴黎圣母院"], transport: ["巴黎 ↔ 凡尔赛：按正式方案交通", "凡尔赛 → 巴黎市区：车辆 / RER 以安排为准"], meals: ["午餐：凡尔赛周边", "晚餐：巴黎市区自选"],
    activities: [
      { id: "d11-1", time: "上午", title: "凡尔赛宫", place: "Versailles", note: "绝对王权把空间变成政治理论", kind: "visit" },
      { id: "d11-2", time: "中午", title: "凡尔赛花园 / 午餐", place: "Versailles", note: "按当天节奏安排", kind: "meal" },
      { id: "d11-3", time: "下午", title: "凯旋门", place: "Arc de Triomphe", note: "革命动员被重新写成国家叙事", kind: "visit" },
      { id: "d11-4", time: "傍晚", title: "巴黎圣母院", place: "Notre-Dame", note: "中世纪城市与现代国家叠在一起", kind: "visit" },
    ],
    story: { title: "凡尔赛的镜子，照见革命的反面", question: "法国为什么必须先把王权做到极致，才会产生现代民族国家？", lead: "今天三个地点代表三种不同的法国：王权的顶峰、革命与帝国重新组织国家，以及仍然留在现代城市里的中世纪记忆。", body: "凡尔赛把权力安排在国王周围：谁可以靠近，谁只能等待，整个国家如何围绕一个中心排列，都被礼仪和建筑安排好了。凯旋门则把战争、革命动员和拿破仑的个人形象重新写成国家叙事。到了巴黎圣母院，中世纪城市与宗教记忆提醒我们：现代法国并不是从零开始，而是叠在旧制度、旧城市和旧信仰上面。今天真正要讲的，是法国怎样把旧世界的集中权力，转化成现代国家可以使用的动员能力。", chapters: [{ label: "01", title: "凡尔赛安排距离", text: "谁能靠近国王，谁拥有被看见的资格。" }, { label: "02", title: "凯旋门重写胜利", text: "革命释放的动员能力被帝国集中到国家中心。" }, { label: "03", title: "圣母院保存旧城", text: "现代国家并没有抹掉中世纪，而是把它纳入新的城市身份。" }], prompt: "请把凡尔赛、凯旋门、巴黎圣母院串成一个 6 分钟故事，讲清楚法国如何从王权、革命走到民族国家，并给每个地点一个可观察的现场细节。\n\n原稿：" },
    source: "正式方案 PDF｜凡尔赛、凯旋门、巴黎圣母院；自由行参考补充凡尔赛和约线",
  },
  {
    id: "day-12", number: "12", date: "10月7日", city: "巴黎", tag: "自由日", title: "把巴黎的缝隙补成自己的线",
    route: ["全天自由活动", "音乐打卡备选", "可选：先贤祠 / 革命记忆线"], transport: ["市内交通：当天决定", "可以在控制台加入具体餐厅、街区、拍照点和交通方式"], meals: ["午餐：当天路线附近自选", "晚餐：巴黎市区自选"],
    photoIdeas: ["已确认的邓紫棋巴黎打卡候选：Le Zénith Paris–La Villette，她曾在这里举行巴黎演出；适合做粉丝打卡，不必和历史景点硬塞在同一天。", "如果想拍生活感：圣日耳曼大街 + Café de Flore / Les Deux Magots + 艺术桥；这是巴黎官方推荐的左岸散步组合。", "如果只想拍《Fly Away》同款，优先放回第 10 天，不建议第 12 天再重复卢浮宫和铁塔。"],
    activities: [
      { id: "d12-1", time: "上午", title: "音乐打卡备选", place: "Le Zénith Paris–La Villette", note: "邓紫棋曾在此演出；如果想做粉丝打卡，预留半天，不与核心历史线硬塞", kind: "free" },
      { id: "d12-2", time: "中午", title: "午餐", place: "当天决定", note: "可以加入你想去的餐厅", kind: "meal" },
      { id: "d12-3", time: "下午", title: "自由活动 / 左岸拍照 / 补景点", place: "圣日耳曼大街 / 艺术桥 / 巴黎", note: "也可以改成先贤祠、荣军院、协和广场或巴士底广场", kind: "free" },
    ],
    story: { title: "把革命的缝隙补进巴黎", question: "自由时间怎样让一条正式路线变得更完整？", lead: "正式方案在巴黎留出全天自由活动。自由行参考里的内容，在这里成为可选择的补充，不会覆盖正式安排。", body: "如果想补法国革命与国家记忆，可以选一条小线：先贤祠看谁被国家记住，协和广场看王权与革命如何争夺同一块空间，巴士底广场看革命如何从城市记忆变成公共身份，荣军院则可以接回拿破仑与战争。今天不必全部完成，挑一条最想讲的即可。自由日的控制台会把你最终选定的顺序写回‘今日行程’，所以你和老婆看到的路线，和你最后真正决定的路线会保持一致。", chapters: [{ label: "01", title: "先贤祠：谁被记住", text: "国家通过纪念人物，决定公共记忆的名单。" }, { label: "02", title: "协和广场：同一空间的反复改写", text: "王权、革命和共和国在同一块广场上留下不同版本。" }, { label: "03", title: "巴士底：记忆变成身份", text: "一座已不存在的监狱，如何成为现代法国的政治符号。" }], prompt: "我在巴黎自由日想去：____，想吃：____，交通偏好是：____。请帮我排一个节奏合理的当天行程，并把这些地点串成一个完整的法国革命与国家记忆故事。\n\n现场补充：" },
    source: "正式方案 PDF｜巴黎全天自由活动；自由行参考第二 sheet 补充线",
  },
  {
    id: "day-13", number: "13", date: "10月8日", city: "巴黎 → 北京", tag: "隐藏时段", title: "返程前，把罗马到巴黎重新拼起来",
    route: ["隐藏白天", "自由补充", "20:20 飞北京"], transport: ["CA934｜20:20 巴黎 → 次日 12:20 北京", "预计 16:00 左右离开巴黎市区，按机场与行李调整"], meals: ["午餐：巴黎市区自选", "晚餐：机场 / 飞机上"],
    activities: [
      { id: "d13-1", time: "上午", title: "最后一个自由时段", place: "巴黎", note: "补最想回看的地点或整理旅行故事", kind: "free" },
      { id: "d13-2", time: "15:30", title: "回酒店取行李", place: "巴黎酒店", note: "为去机场留出余量", kind: "move" },
      { id: "d13-3", time: "20:20", title: "飞往北京", place: "巴黎 → 北京", note: "把故事带回去", kind: "move" },
    ],
    story: { title: "从罗马到巴黎，欧洲到底留下了什么？", question: "走完这些城市以后，欧洲在你眼里变成了什么？", lead: "返程前还有大半天。今天不必再追景点，可以把整趟旅行收束成自己的版本。", body: "这趟旅行从罗马开始，最后在巴黎返程。回头看，真正的主线不是景点数量，而是几个反复出现的问题：谁在组织人群，谁在解释秩序，谁能把自己的版本写进公共记忆。帝国、教会、城邦和民族国家并没有整齐地排队离开，它们今天还在欧洲的建筑和生活里互相叠着。你可以挑一个最想回看的地方，也可以坐在咖啡馆里，把这条线讲给老婆听：罗马留下帝国，梵蒂冈留下精神权威，佛罗伦萨留下城邦竞争，柏林留下国家的极端经验，巴黎则把王权、革命和现代城市放在一起。", chapters: [{ label: "01", title: "帝国", text: "罗马把欧洲放进一条道路和法律的网络。" }, { label: "02", title: "教会", text: "梵蒂冈把罗马的普世想象换成精神权威。" }, { label: "03", title: "城邦", text: "佛罗伦萨证明城市竞争可以重新发明欧洲。" }, { label: "04", title: "国家", text: "柏林和巴黎展示国家如何走向极端、革命与现代。" }], prompt: "请把这 14 天旅行总结成一段 5 分钟的返程前故事：从罗马帝国开始，经过梵蒂冈、佛罗伦萨、柏林，最后到巴黎的王权、革命与现代城市。语气像我对老婆讲，不要写成总结报告。\n\n我的现场补充：" },
    source: "正式方案 PDF｜巴黎→北京；机票安排补充 CA934 20:20",
  },
  {
    id: "day-14", number: "14", date: "10月9日", city: "北京", tag: "抵达后", title: "把故事带回去",
    route: ["抵达北京", "整理照片", "下一次阅读"], transport: ["CA934｜约 12:20 抵达北京", "回家 / 休息"], meals: ["飞机上 / 抵达后自选"],
    activities: [
      { id: "d14-1", time: "12:20", title: "抵达北京", place: "北京", note: "旅程结束，资料开始整理", kind: "move" },
      { id: "d14-2", time: "晚上", title: "整理照片与现场笔记", place: "家中", note: "把修改后的故事保存回网站", kind: "free" },
    ],
    story: { title: "旅行手册不是答案，是下一次提问", question: "一段旅程结束后，历史怎样继续发生在自己的生活里？", lead: "正式路线在北京结束，但故事不会在飞机落地时结束。", body: "真正有用的旅行，不是记住所有名字，而是回到日常以后，仍然能用新的问题看见熟悉的世界。把照片、现场观察、吃过的饭、走过的路和你最后讲给老婆听的版本放回对应日期，这份手册才真正变成你的东西。", chapters: [{ label: "01", title: "整理", text: "把现场发生过的内容留在当天。" }, { label: "02", title: "修改", text: "把不准确、不自然或不完整的故事继续改。" }, { label: "03", title: "继续提问", text: "下一次旅行从新的问题开始。" }], prompt: "请根据我这次欧洲旅行留下的照片、笔记和修改后的故事，帮我整理一份属于我的旅行档案。\n\n现场补充：" },
    source: "正式方案 PDF｜北京抵达日",
  },
];

const initialPlans = Object.fromEntries(basePlans.map((plan) => [plan.id, plan])) as Record<string, DayPlan>;

type View = "plan" | "story" | "control" | "library";

export default function Home() {
  const [activeDayId, setActiveDayId] = useState("day-03");
  const [activeView, setActiveView] = useState<View>("plan");
  const [plans, setPlans] = useState<Record<string, DayPlan>>(initialPlans);
  const [storyDraft, setStoryDraft] = useState("");
  const [newActivity, setNewActivity] = useState("");
  const [draggingActivityId, setDraggingActivityId] = useState<string | null>(null);
  const [libraryFilter, setLibraryFilter] = useState("全部");
  const [toast, setToast] = useState("");

  const activePlan = plans[activeDayId] ?? initialPlans["day-03"];
  const libraryFilters = ["全部", "罗马", "柏林", "巴黎", "邓紫棋 / 拍照"];
  const scheduledText = useMemo(() => Object.values(plans).map((plan) => [plan.route.join(" "), ...plan.activities.map((activity) => `${activity.title} ${activity.place}`)].join(" ")).join(" ").toLocaleLowerCase(), [plans]);
  const visibleFreeOptions = useMemo(() => freeOptions.filter((option) => {
    const alreadyScheduled = option.locationKeys?.some((key) => scheduledText.includes(key.toLocaleLowerCase())) ?? false;
    const matchesFilter = libraryFilter === "全部" || option.region === libraryFilter || option.category === libraryFilter;
    return matchesFilter && !alreadyScheduled;
  }), [libraryFilter, scheduledText]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("eurotravel-plans-v3");
      if (stored) window.setTimeout(() => setPlans({ ...initialPlans, ...JSON.parse(stored) }), 0);
    } catch {
      // Device-local persistence is optional.
    }
  }, []);

  useEffect(() => {
    window.setTimeout(() => setStoryDraft(activePlan.story.prompt), 0);
  }, [activePlan]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const viewCopy = useMemo(() => ({
    plan: { label: "今日行程", hint: "你和老婆一起看" },
    story: { label: "今日故事", hint: "你现场讲" },
    control: { label: "现场控制台", hint: "你来调整" },
    library: { label: "自由行备选", hint: "集中挑选" },
  }), []);

  function selectDay(id: string) {
    setActiveDayId(id);
    setActiveView("plan");
    window.setTimeout(() => document.getElementById("workspace")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }

  function updatePlan(update: (plan: DayPlan) => DayPlan) {
    setPlans((current) => ({ ...current, [activeDayId]: update(current[activeDayId]) }));
  }

  function updateActivity(activityId: string, field: "time" | "title" | "place" | "note", value: string) {
    updatePlan((plan) => ({ ...plan, activities: plan.activities.map((activity) => activity.id === activityId ? { ...activity, [field]: value } : activity) }));
  }

  function moveActivity(index: number, direction: -1 | 1) {
    updatePlan((plan) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= plan.activities.length) return plan;
      const activities = [...plan.activities];
      [activities[index], activities[nextIndex]] = [activities[nextIndex], activities[index]];
      return { ...plan, activities };
    });
  }

  function reorderActivity(sourceId: string, targetId: string) {
    if (sourceId === targetId) return;
    updatePlan((plan) => {
      const sourceIndex = plan.activities.findIndex((activity) => activity.id === sourceId);
      const targetIndex = plan.activities.findIndex((activity) => activity.id === targetId);
      if (sourceIndex < 0 || targetIndex < 0) return plan;
      const activities = [...plan.activities];
      const [moved] = activities.splice(sourceIndex, 1);
      activities.splice(targetIndex, 0, moved);
      return { ...plan, activities };
    });
    setDraggingActivityId(null);
  }

  function startDragging(event: DragEvent<HTMLButtonElement>, activityId: string) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", activityId);
    setDraggingActivityId(activityId);
  }

  function dropActivity(event: DragEvent<HTMLDivElement>, targetId: string) {
    event.preventDefault();
    const sourceId = event.dataTransfer.getData("text/plain") || draggingActivityId;
    if (sourceId) reorderActivity(sourceId, targetId);
  }

  function removeActivity(activityId: string) {
    updatePlan((plan) => ({ ...plan, activities: plan.activities.filter((activity) => activity.id !== activityId) }));
  }

  function addActivity() {
    const title = newActivity.trim();
    if (!title) { setToast("先写一个想加入今天的地点或安排"); return; }
    updatePlan((plan) => ({ ...plan, activities: [...plan.activities, { id: `custom-${Date.now()}`, time: "待定", title, place: "现场补充", note: "由你在现场加入", kind: "free" }] }));
    setNewActivity("");
    setToast("已加入今日行程草稿");
  }

  function addFreeOption(option: FreeOption) {
    updatePlan((plan) => ({ ...plan, activities: [...plan.activities, { id: `option-${option.id}-${Date.now()}`, time: "待定", title: option.title, place: option.places, note: `${option.timing}｜${option.story}`, kind: "free" }] }));
    setToast(`已把“${option.title}”加入第${activePlan.number}天草稿`);
  }

  function savePlan() {
    window.localStorage.setItem("eurotravel-plans-v3", JSON.stringify(plans));
    setToast("今日行程已保存到本机，今日行程页会同步更新");
  }

  async function copyStoryPrompt() {
    try {
      await navigator.clipboard.writeText(storyDraft);
      setToast("完整故事提示词已复制，可以发给 ChatGPT 继续修改");
    } catch {
      setToast("当前浏览器不允许自动复制，请手动选中提示词");
    }
  }

  function resetPlan() {
    setPlans((current) => ({ ...current, [activeDayId]: initialPlans[activeDayId] }));
    setToast("已恢复这一天的正式方案草稿");
  }

  return (
    <main className="trip-app">
      <header className="app-header">
        <a className="app-brand" href="#top"><span className="brand-seal">EH</span><span><b>欧洲历史旅行手册</b><small>EUROPE / FIELD GUIDE</small></span></a>
        <div className="header-status"><span className="live-dot" />本机可编辑</div>
      </header>

      <section className="app-intro" id="top">
        <div><p className="eyebrow">YOUR TRIP / 14 DAYS</p><h1>从罗马开始，<em>一起走，也一起讲。</em></h1><p className="intro-copy">一个入口，三种用法：先看今天要去哪，再看你要讲什么，最后把现场调整写回当天行程。</p></div>
        <div className="trip-people"><span className="person-pill"><i>我</i>行程 + 故事 + 调整</span><span className="person-pill"><i>她</i>今天去哪 + 吃什么</span></div>
      </section>

      <section className="day-picker" aria-label="选择旅行日期">
        <div className="day-picker-head"><b>旅行日期</b><span>先选一天，再看这一日的三层内容</span></div>
        <div className="day-scroller">{basePlans.map((plan) => <button key={plan.id} className={`day-chip ${plan.id === activeDayId ? "active" : ""} ${plan.id === "day-03" ? "vatican" : ""}`} onClick={() => selectDay(plan.id)}><strong>{plan.number}</strong><span><b>{plan.date}</b><small>{plan.city}</small></span>{plan.id === "day-03" && <em>梵蒂冈</em>}</button>)}</div>
      </section>

      <section className="workspace section-shell" id="workspace">
        <div className="current-day-head"><div><p className="eyebrow">DAY {activePlan.number} / {activePlan.tag}</p><h2>{activePlan.city}<small>{activePlan.date}</small></h2><p>{activePlan.title}</p></div><div className="source-chip">{activePlan.source}</div></div>
        <nav className="module-tabs" aria-label="旅行手册模块">
          {(Object.keys(viewCopy) as View[]).map((view) => <button key={view} className={activeView === view ? "active" : ""} onClick={() => setActiveView(view)}><span className={`tab-icon ${view}`}>{view === "plan" ? "⌂" : view === "story" ? "✦" : view === "library" ? "◇" : "↻"}</span><span><b>{viewCopy[view].label}</b><small>{viewCopy[view].hint}</small></span></button>)}
        </nav>

        {activeView === "plan" && <section className="module plan-module">
          <div className="module-title"><div><p className="eyebrow">SHARED VIEW / 给两个人</p><h3>今天要去哪？</h3><p>这张是你和老婆共同看的版本。它只放具体安排：时间、地点、交通、吃饭，以及现场已经调整过的内容。</p></div><span className="shared-badge">✓ 两个人都看这张</span></div>
          <div className="plan-layout"><div className="timeline-card"><div className="card-topline"><span>今日路线</span><small>{activePlan.activities.length} 个安排</small></div><div className="route-ribbon">{activePlan.route.map((stop, index) => <span key={`${stop}-${index}`}><i>{String(index + 1).padStart(2, "0")}</i>{stop}</span>)}</div><div className="timeline">{activePlan.activities.map((activity) => <div className={`timeline-item ${activity.kind}`} key={activity.id}><div className="timeline-time">{activity.time}</div><div className="timeline-dot" /><div className="timeline-content"><div><b>{activity.title}</b><span>{activity.place}</span></div><p>{activity.note}</p></div></div>)}</div></div><aside className="side-info"><div className="info-card transport-card"><span className="info-icon">↗</span><div><small>交通方式</small>{activePlan.transport.map((item) => <p key={item}>{item}</p>)}</div></div><div className="info-card meal-card"><span className="info-icon">◇</span><div><small>吃饭 / 休息</small>{activePlan.meals.map((item) => <p key={item}>{item}</p>)}</div></div>{activePlan.photoIdeas && <div className="info-card photo-card"><span className="info-icon">✦</span><div><small>拍照 / 打卡建议</small>{activePlan.photoIdeas.map((item) => <p key={item}>{item}</p>)}</div></div>}<div className="next-card"><small>今天的提醒</small><b>{activePlan.id === "day-03" ? "第三天固定是梵蒂冈" : activePlan.tag === "隐藏时段" ? "这是可以临场调整的时间" : "时间可以在现场控制台调整"}</b><button onClick={() => setActiveView("control")}>去调整今日安排 →</button></div></aside></div>
          {dailyMaps[activePlan.id] && <MapCard map={dailyMaps[activePlan.id]} />}
        </section>}

        {activeView === "story" && <section className="module story-module">
          <div className="module-title story-title"><div><p className="eyebrow">YOUR STORY / 给你讲</p><h3>{activePlan.story.title}</h3><p>{activePlan.story.question}</p></div><span className="story-length">完整故事<br /><b>{activePlan.story.chapters.length} 幕</b></span></div>
          <div className="story-lead"><span className="quote-mark">“</span><p>{activePlan.story.lead}</p></div>
          <div className="story-body"><div className="story-text"><p>{activePlan.story.body}</p><div className="chapter-list">{activePlan.story.chapters.map((chapter) => <article className="chapter" key={chapter.label}><span>{chapter.label}</span><div><h4>{chapter.title}</h4><p>{chapter.text}</p></div></article>)}</div></div><aside className="prompt-panel"><div className="prompt-panel-top"><span>口播提示词</span><small>可编辑 · 可发给 ChatGPT</small></div><textarea value={storyDraft} onChange={(event) => setStoryDraft(event.target.value)} aria-label={`${activePlan.date}完整故事提示词`} /><div className="prompt-actions"><button className="primary-button" onClick={copyStoryPrompt}>复制完整提示词 <span>↗</span></button><button className="secondary-button" onClick={() => setStoryDraft(activePlan.story.prompt)}>恢复本日版本</button></div><p className="prompt-tip">建议：先在现场改“我要讲的重点”和“眼前看到的细节”，再复制给 ChatGPT。</p></aside></div>
        </section>}

        {activeView === "library" && <section className="module library-module">
          <div className="module-title"><div><p className="eyebrow">FREE TRAVEL LIBRARY / 集中挑选</p><h3>自由行备选库</h3><p>这里集中放 Excel「自由行参考」里已经提炼出的补充内容，以及邓紫棋相关的拍照打卡建议。已经出现在正式行程里的地点会自动从这里排除，避免重复；选中第 {activePlan.number} 天后，点击“加入今天”才会进入控制台草稿。</p></div><span className="shared-badge">{visibleFreeOptions.length} 个可选</span></div>
          <div className="library-howto"><b>使用方式</b><span>① 先选上方日期</span><span>② 在这里挑选备选项</span><span>③ 加入后到“现场控制台”改时间和顺序</span></div>
          <div className="library-filters" aria-label="筛选自由行备选">{libraryFilters.map((filter) => <button key={filter} className={libraryFilter === filter ? "active" : ""} onClick={() => setLibraryFilter(filter)}>{filter}</button>)}</div>
          <div className="library-grid">{visibleFreeOptions.map((option) => <article className={`library-card ${option.category === "邓紫棋 / 拍照" ? "gem-option" : ""}`} key={option.id}><div className="library-card-top"><span>{option.region}</span><em>{option.category}</em></div><h4>{option.title}</h4><p className="library-places">{option.places}</p><p>{option.story}</p><div className="library-card-bottom"><small>{option.timing}</small><button onClick={() => addFreeOption(option)}>加入第 {activePlan.number} 天 →</button></div><small className="library-source">{option.source}</small></article>)}</div>
        </section>}

        {activeView === "control" && <section className="module control-module">
          <div className="module-title"><div><p className="eyebrow">FIELD CONSOLE / 只给你</p><h3>现场调整，反写回今日行程。</h3><p>先排顺序，再补时间、地点和备注。每次改动都会先留在本机，最后点“保存并同步”。</p></div><div className="console-actions"><button className="secondary-button" onClick={resetPlan}>恢复正式方案</button><button className="primary-button" onClick={savePlan}>保存并同步 →</button></div></div>
          <div className="control-grid"><div className="editor-card"><div className="editor-head"><span>今天怎么走</span><small>长按拖动，或用 ↑↓</small></div><div className="console-modebar"><span className="console-mode-icon">↕</span><div><b>先排顺序，再补细节</b><small>{activePlan.activities.length} 个安排 · 手机上每一格都可以直接点开修改</small></div></div><div className="editable-list">{activePlan.activities.map((activity, index) => <div className={`editable-item ${draggingActivityId === activity.id ? "dragging" : ""}`} key={activity.id} onDragOver={(event) => event.preventDefault()} onDrop={(event) => dropActivity(event, activity.id)}><div className="editable-item-top"><button className="drag-handle" draggable onDragStart={(event) => startDragging(event, activity.id)} onDragEnd={() => setDraggingActivityId(null)} aria-label={`拖动第${index + 1}项`} title="长按或拖动调整顺序">↕</button><div><b>安排 {String(index + 1).padStart(2, "0")}</b><small>可拖动调整顺序</small></div><div className="item-actions"><button onClick={() => moveActivity(index, -1)} aria-label="上移" disabled={index === 0}>↑</button><button onClick={() => moveActivity(index, 1)} aria-label="下移" disabled={index === activePlan.activities.length - 1}>↓</button><button className="delete-button" onClick={() => removeActivity(activity.id)} aria-label="删除安排">×</button></div></div><div className="editable-fields"><label><span>时间</span><input className="time-input" value={activity.time} onChange={(event) => updateActivity(activity.id, "time", event.target.value)} aria-label="时间" /></label><label><span>安排</span><input value={activity.title} onChange={(event) => updateActivity(activity.id, "title", event.target.value)} aria-label="安排标题" /></label><label><span>地点</span><input value={activity.place} onChange={(event) => updateActivity(activity.id, "place", event.target.value)} aria-label="地点" /></label><label className="full-field"><span>提醒 / 备注</span><input value={activity.note} onChange={(event) => updateActivity(activity.id, "note", event.target.value)} aria-label="备注" /></label></div></div>)}</div><div className="add-row"><input value={newActivity} onChange={(event) => setNewActivity(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addActivity(); }} placeholder="加入地点、餐厅或临时安排" aria-label="新安排" /><button onClick={addActivity}>＋ 加入</button></div></div><aside className="console-side"><details className="editor-card compact-editor"><summary><span>交通方式</span><small>点击展开 · 每行一条</small></summary><textarea value={activePlan.transport.join("\n")} onChange={(event) => updatePlan((plan) => ({ ...plan, transport: event.target.value.split("\n") }))} aria-label="交通方式" /></details><details className="editor-card compact-editor"><summary><span>吃饭 / 休息</span><small>点击展开 · 每行一条</small></summary><textarea value={activePlan.meals.join("\n")} onChange={(event) => updatePlan((plan) => ({ ...plan, meals: event.target.value.split("\n") }))} aria-label="吃饭和休息" /></details><div className="sync-note"><span>↻</span><p><b>保存后自动反写</b>回到“今日行程”，你和老婆看到的就是这一版；故事模块不会被改动。</p></div></aside></div>
        </section>}
      </section>

      <section className="mobile-howto section-shell"><p className="eyebrow">HOW TO USE ON THE ROAD</p><div><b>先给老婆看“今日行程”</b><span>再切到“今日故事”自己讲</span><span>现场有变化，就进“控制台”调整并保存</span></div></section>
      <footer className="app-footer"><div><span className="brand-seal">EH</span><b>欧洲历史旅行手册</b></div><span>v.02 / ROME-FIRST / MOBILE</span></footer>
      <nav className="mobile-nav" aria-label="底部模块导航">{(Object.keys(viewCopy) as View[]).map((view) => <button key={view} className={activeView === view ? "active" : ""} onClick={() => setActiveView(view)}><span>{view === "plan" ? "⌂" : view === "story" ? "✦" : view === "library" ? "◇" : "↻"}</span>{viewCopy[view].label}</button>)}</nav>
      {toast && <div className="toast" role="status">{toast}<span>✓</span></div>}
    </main>
  );
}
