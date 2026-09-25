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
  priorityReminder?: {
    label: string;
    title: string;
    body: string;
    items: string[];
  };
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
  region: "罗马" | "佛罗伦萨" | "柏林" | "巴黎";
  category: "历史补线" | "邓紫棋 / 拍照" | "机位 / 出片" | "美食 / 餐厅" | "伴手礼 / 购物";
  title: string;
  places: string;
  story: string;
  timing: string;
  source: string;
  sourceUrl?: string;
  locationKeys?: string[];
  shotGuide?: Array<{ nav: string; stand: string; frame: string; bestTime: string }>;
  dayIds?: string[];
};

type MapPoint = {
  name: string;
  query: string;
  kind: "hotel" | "visit" | "move" | "optional" | "context";
  note?: string;
  travelMode?: "walk" | "taxi" | "transit";
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

type FieldGuideStop = {
  number: string;
  status: "必看" | "宫内寻找" | "顺路观察" | "可选补线";
  titleZh: string;
  titleFr: string;
  address: string;
  directions: string;
  onsite: string;
  history: string;
  practical: string;
  navigationUrl?: string;
  sourceUrl: string;
};

type DayFieldGuide = {
  eyebrow: string;
  title: string;
  dateNote: string;
  intro: string;
  routeNote: string;
  stops: FieldGuideStop[];
};

const dayFieldGuides: Record<string, DayFieldGuide> = {
  "day-10": {
    eyebrow: "LOUVRE MUST-SEE / 卢浮宫第一目标",
    title: "《自由引导人民》｜La Liberté guidant le peuple",
    dateNote: "10月5日 · 卢浮宫上午",
    intro: "这幅画描绘的是1830年七月革命，不是1789年法国大革命。先找到德农馆一层700号展厅，再从远到近看旗帜、人物、尸体和远处的巴黎圣母院。",
    routeNote: "馆内路线：入口后跟随 Aile Denon（德农馆）→ Peintures françaises（法国绘画）→ Salles Rouges（红厅）→ Salle Mollien 700。展厅可能临时调整，进馆后再用官方导览确认一次。",
    stops: [
      {
        number: "01",
        status: "必看",
        titleZh: "《自由引导人民》",
        titleFr: "La Liberté guidant le peuple",
        address: "Musée du Louvre · Aile Denon · Niveau 1 · Salle Mollien 700",
        directions: "在卢浮宫内寻找“Denon / Peintures françaises / Salles Rouges / Salle Mollien 700”指示。不要只导航到金字塔后就结束。",
        onsite: "先退到能看完整画面的距离：从前景尸体向上看人群和三色旗；再走近看自由女神的弗里吉亚帽、赤脚和身边不同阶层的人。",
        history: "德拉克洛瓦把1830年巴黎街垒画成历史与寓言的结合：自由既像古典女神，也像正在踩过瓦砾向前的普通人。",
        practical: "目前官方位置为德农馆一层700号厅；作品2024年完成修复并重新展出。",
        navigationUrl: "https://www.google.com/maps/search/?api=1&query=Mus%C3%A9e+du+Louvre%2C+Paris%2C+France",
        sourceUrl: "https://www.louvre.fr/en/explore/the-palace/think-big",
      },
    ],
  },
  "day-11": {
    eyebrow: "VERSAILLES REVOLUTION WALK / 凡尔赛革命现场",
    title: "第11天｜拿着手机就能走的双语路线",
    dateNote: "2026年10月6日 · 星期二",
    intro: "你到凡尔赛的日期，正好与1789年10月6日王室被迫离开凡尔赛同月同日。下面按实际参观顺序排列；法语名称可以直接给工作人员看，也可以复制到地图搜索。",
    routeNote: "推荐顺序：军队广场 → 凡尔赛宫内三个观察点 → 12:30后步行去网球厅。三级会议旧址只在时间和车辆安排允许时增加；不要为了它影响返回巴黎的正式行程。",
    stops: [
      {
        number: "01",
        status: "顺路观察",
        titleZh: "军队广场",
        titleFr: "Place d’Armes",
        address: "Place d’Armes, 78000 Versailles, France",
        directions: "这是凡尔赛宫正门外的大广场。下车或从车站走向王宫时就会经过，不需要另买票。面对宫门时，王宫在正前方。",
        onsite: "先不要急着拍宫殿，转身看广场尺度。1789年10月5日晚，拉法耶特率领的国民卫队曾部署在这里，来自巴黎的人群也聚集在宫门外。",
        history: "这里是王权、军队和要求面包的巴黎群众直接相遇的空间。",
        practical: "全天可到达；属于公共广场。",
        navigationUrl: "https://www.google.com/maps/search/?api=1&query=Place+d%27Armes%2C+78000+Versailles%2C+France",
        sourceUrl: "https://en.chateauversailles.fr/discover/history/key-dates/departure-king-1789",
      },
      {
        number: "02",
        status: "宫内寻找",
        titleZh: "皇家歌剧院",
        titleFr: "Opéra Royal",
        address: "Château de Versailles · Aile du Nord（凡尔赛宫北翼内部）",
        directions: "进入凡尔赛宫后询问工作人员：“Où se trouve l’Opéra Royal ?” 普通参观路线不保证进入歌剧院内部，能看到入口或听讲解即可。",
        onsite: "记住1789年10月1日：王室卫队在这里举行宴会。巴黎舆论将宴会与粮食危机并置，成为进军凡尔赛的导火索之一。",
        history: "这是旧制度在凡尔赛举行的最后一次大型宫廷宴会所在地。",
        practical: "历史点明确，但内部通常取决于当天开放或导览，不要把“必须入内”作为行程前提。",
        sourceUrl: "https://en.chateauversailles.fr/discover/estate/palace/royal-opera",
      },
      {
        number: "03",
        status: "宫内寻找",
        titleZh: "王后卧室",
        titleFr: "Chambre de la Reine",
        address: "Grand Appartement de la Reine · Château de Versailles（王后大套房内）",
        directions: "跟随宫内“Grand Appartement de la Reine / Queen’s State Apartment”路线进入王后卧室。站在参观通道面对床铺时，寻找床龛左侧的小门。",
        onsite: "1789年10月6日清晨，玛丽·安托瓦内特就是从床龛左侧小门进入内廷走廊，转往国王套房。现场重点是那扇小门，不只是床和织物。",
        history: "“群众攻入凡尔赛”在这里变成一扇逃生门和一条宫内走廊。",
        practical: "王后大套房目前属于公开参观区域，但仍以当天宫方封闭情况为准。",
        sourceUrl: "https://www.chateauversailles.fr/decouvrir/domaine/chateau/grand-appartement-reine",
      },
      {
        number: "04",
        status: "顺路观察",
        titleZh: "大理石庭院",
        titleFr: "Cour de Marbre",
        address: "Château de Versailles · au cœur de la Cour Royale（王宫中央、皇家庭院最里面）",
        directions: "从王宫正面依次看荣誉庭院、皇家庭院，最里面黑白相间铺地的小庭院就是大理石庭院。若参观动线无法进入，在正面可见位置观察即可。",
        onsite: "1789年10月6日，人群聚集在这里要求王室露面。抬头看中央建筑与阳台，理解群众如何把宫廷礼仪空间变成政治现场。",
        history: "这里见证了国王答应前往巴黎；当天王室离开后再也没有回来常住。",
        practical: "属于宫殿核心空间；实际可到位置受安保和参观动线影响。",
        sourceUrl: "https://en.chateauversailles.fr/discover/history/key-dates/departure-king-1789",
      },
      {
        number: "05",
        status: "必看",
        titleZh: "网球厅（网球厅宣誓旧址）",
        titleFr: "Salle du Jeu de Paume",
        address: "1 rue du Jeu de Paume, 78000 Versailles, France",
        directions: "结束宫殿参观后回到城市一侧，从凡尔赛宫步行约10分钟。直接复制法语名称或完整地址导航，不要误搜巴黎的同名美术馆。",
        onsite: "进入后看北端的大型宣誓画、墙上一圈签署者姓名与中央的巴伊雕像。1789年6月20日，代表宣誓在制定宪法前绝不解散。",
        history: "这里把“向国王请求改革”推进成了“国民议会自己代表法国”。",
        practical: "2026年公布安排：周二至周日12:30—18:30，17:45停止入场；免费、自由参观。建议12:30以后到。",
        navigationUrl: "https://www.google.com/maps/search/?api=1&query=Salle+du+Jeu+de+Paume%2C+1+rue+du+Jeu+de+Paume%2C+78000+Versailles%2C+France",
        sourceUrl: "https://www.chateauversailles.fr/decouvrir/domaine/salle-jeu-paume",
      },
      {
        number: "06",
        status: "可选补线",
        titleZh: "国王娱乐事务馆（三级会议旧址）",
        titleFr: "Hôtel des Menus-Plaisirs",
        address: "22 avenue de Paris, 78000 Versailles, France",
        directions: "从网球厅继续导航约12—15分钟；入口地址用22 avenue de Paris。现在这里是“Centre de musique baroque de Versailles”。",
        onsite: "1789年5月5日三级会议在这里开幕，6月17日第三等级代表宣布成立国民议会。原大会厅是院内临时木结构，后来已拆除，不要期待看到完整旧会场。",
        history: "政治革命首先在这里发生：代表们开始争论究竟是国王，还是国民，拥有最高政治权力。",
        practical: "以外观和遗址为主，不保证普通游客进入院内；若时间紧，保留网球厅，取消这一站。",
        navigationUrl: "https://www.google.com/maps/search/?api=1&query=H%C3%B4tel+des+Menus-Plaisirs%2C+22+avenue+de+Paris%2C+78000+Versailles%2C+France",
        sourceUrl: "https://en.versailles-tourisme.com/l-hotel-des-menus-plaisirs.html",
      },
    ],
  },
};

const freeOptions: FreeOption[] = [
  { id: "paris-versailles-treaty", region: "巴黎", category: "历史补线", title: "凡尔赛和约：一战之后的欧洲", places: "凡尔赛宫 / 镜厅 / 巴黎", story: "把凡尔赛从路易十四的王权延伸到1919年的战后秩序：旧王宫如何成为重新划分欧洲的地方。", timing: "巴黎自由日或凡尔赛日之后", source: "Excel 自由行参考（已提炼）", locationKeys: ["凡尔赛宫"] },
  { id: "paris-concorde", region: "巴黎", category: "历史补线", title: "协和广场：王权与革命争夺同一块空间", places: "协和广场", story: "从路易十五广场、革命时期的断头台，到今天的城市轴线，讲公共空间如何反复改名、改写。", timing: "巴黎自由日半日", source: "Excel 自由行参考（已提炼）", locationKeys: ["协和广场"] },
  { id: "paris-bastille", region: "巴黎", category: "历史补线", title: "巴士底广场：一座消失的监狱如何变成革命符号", places: "巴士底广场 / 圣安东尼街区", story: "现场已经看不到完整的巴士底监狱，但正因为它消失了，记忆才更依赖地图、纪念柱和公共叙事。", timing: "巴黎自由日下午", source: "Excel 自由行参考（已提炼）", locationKeys: ["巴士底广场"] },
  { id: "paris-pantheon", region: "巴黎", category: "历史补线", title: "先贤祠：法国决定记住谁", places: "先贤祠 / 拉丁区", story: "从教堂到国家陵寝，讲法国如何把宗教空间改造成公共记忆的名单。", timing: "巴黎自由日上午", source: "Excel 自由行参考（已提炼）", locationKeys: ["先贤祠"] },
  { id: "paris-invalides", region: "巴黎", category: "历史补线", title: "荣军院：拿破仑与战争国家", places: "荣军院 / 拿破仑墓", story: "把拿破仑从个人英雄拉回国家机器：战争、荣誉、军队和国家记忆如何彼此绑定。", timing: "巴黎自由日或返程前半天", source: "Excel 自由行参考（已提炼）", locationKeys: ["荣军院"] },
  { id: "paris-bartholomew", region: "巴黎", category: "历史补线", title: "圣巴托洛缪之夜：宗教战争如何进入城市记忆", places: "巴黎历史中心 / 卢浮宫—塞纳河一线", story: "把法国宗教战争放进城市空间：王权、天主教、胡格诺派和暴力记忆怎样叠在同一座首都里。", timing: "适合做一条历史故事线，不必专门赶景点", source: "Excel 自由行参考（已提炼）" },
  { id: "gem-fly-away", region: "巴黎", category: "邓紫棋 / 拍照", title: "《Fly Away》MV 巴黎取景地｜已确认", places: "巴黎地铁 → 卢浮宫 → 埃菲尔铁塔", story: "索尼音乐的发布资料明确写到 MV 取景于巴黎，并点出地铁、卢浮宫和埃菲尔铁塔。网站把它标成‘MV取景’，不把它误写成 2025 年演唱会期间到访。建议按‘地铁转场—卢浮宫—铁塔夜景’保留镜头逻辑。", timing: "第10天转场时预留30–45分钟", source: "索尼音乐官方资料 / Official MV", sourceUrl: "https://www.sonymusic.com.tw/news/gem-20200123/", shotGuide: [{ nav: "地铁：优先用当天实际换乘站，不为 MV 单独绕路", stand: "站在站台边缘安全线内，人物靠墙，镜头沿站台纵深拍", frame: "前景是站台线和灯光，人物走入画面；不拍陌生乘客正脸", bestTime: "跟随第10天转场，30分钟即可" }, { nav: "卢浮宫：金字塔入口，Cour Napoléon 中央", stand: "站在金字塔外侧台阶或广场边缘，人物向金字塔走", frame: "人物放画面下1/3，金字塔和宫墙形成对称背景", bestTime: "开馆前后或闭馆前，避开正午硬光" }, { nav: "埃菲尔铁塔：Avenue de Camoëns 台阶顶端", stand: "站在台阶顶端向铁塔方向拍，人物站在台阶中轴线偏右", frame: "用台阶栏杆做引导线，拍半身和全身各一张", bestTime: "日落前45分钟；夜景需另留时间" }] },
  { id: "gem-zenith", region: "巴黎", category: "邓紫棋 / 拍照", title: "邓紫棋巴黎演唱会场馆｜已确认", places: "Le Zénith Paris–La Villette · 19区", story: "I AM GLORIA 海外首站于 2025 年 1 月 21 日在 Zénith Paris–La Villette 举行。这里是明确的演出场馆打卡，不代表她在演出期间还去过周边哪些店或景点。", timing: "第12天自由日；若专程去，单独预留半天", source: "演出场馆 / 巡演公开资料", sourceUrl: "https://www.offi.fr/concerts/le-zenith-3401/gem-2696312.html" },
  { id: "gem-paris-vlog", region: "巴黎", category: "邓紫棋 / 拍照", title: "邓紫棋本人巴黎 Vlog｜街头、店铺与摩托车镜头", places: "巴黎街头 / 店铺内 / 摩托车场景（具体地址未公开）", story: "GEM 本人发布的巴黎 Vlog 和公开笔记能确认她在巴黎拍了街头生活、店铺内和骑摩托车的画面，但没有给出可核验的店名或街道地址。可以复刻‘城市生活感’，不能把某家店写成她确定去过。", timing: "第12天自由日：作为生活感拍照主题，不必追地址", source: "GEM 官方巴黎 Vlog", sourceUrl: "https://www.youtube.com/watch?v=NOq4l9tWM2w" },
  { id: "gem-paris-unclear-clues", region: "巴黎", category: "邓紫棋 / 拍照", title: "演唱会期间的餐馆 / 麦当劳线索｜待核验", places: "小红书粉丝线索：餐馆、麦当劳（没有确认地址）", story: "小红书站内能看到‘之前麦当劳偶遇邓紫棋的小哥被剪进 Vlog’以及演唱会期间餐馆营业内容，但这些是粉丝或商家内容，不足以证明她本人去过哪一家。先保留为线索，现场不要按此安排专程打卡。", timing: "出发前若找到原图地址，再决定是否加入自由日", source: "小红书站内检索｜邓紫棋 巴黎 吃饭", sourceUrl: "https://www.xiaohongshu.com/search_result?keyword=%E9%82%93%E7%B4%AB%E6%A3%8B%20%E5%B7%B4%E9%BB%8E%20%E5%90%83%E9%A5%AD" },
  { id: "paris-left-bank-photo", region: "巴黎", category: "邓紫棋 / 拍照", title: "左岸生活感拍照备选", places: "圣日耳曼大街 → Café de Flore / Les Deux Magots → 艺术桥", story: "如果想拍‘人在巴黎’而不只是地标，可以用咖啡馆、街角和塞纳河完成一条轻松的人像线。", timing: "第12天自由日下午", source: "巴黎官方旅游资料 / 拍照备选" },
  { id: "florence-photo-hotspots", region: "佛罗伦萨", category: "机位 / 出片", title: "佛罗伦萨高频机位线｜具体站位版", places: "Piazza del Duomo → Ponte Santa Trinita → Piazzale Michelangelo", story: "这张卡不再只写‘穹顶、老桥、米开朗基罗广场’，而是给出到现场可直接输入导航的点名、站位和画面。9 月 30 日学院美术馆 + 巴杰罗国家博物馆已经很满，建议把这条线放到其他自由时段，最多选两个点。", timing: "佛罗伦萨自由时段；日落优先留给 Piazzale Michelangelo", source: "佛罗伦萨官方旅游资料 / 图片与路线参考", sourceUrl: "https://www.feelflorence.it/en/experiences-itineraries/18-panoramic-views", locationKeys: ["米开朗基罗广场"], shotGuide: [{ nav: "Piazza del Duomo：圣母百花大教堂南侧 Via Roma 入口", stand: "站在 Piazza San Giovanni 与 Via Roma 交界，向西北拍穹顶与钟楼", frame: "人物贴近画面右侧，穹顶放左上；用广场人流做尺度", bestTime: "上午光线较均匀；避开中午仰拍" }, { nav: "Ponte Santa Trinita：桥中央靠南侧人行道", stand: "面向东，看 Ponte Vecchio；两人站在桥拱线旁，不堵通道", frame: "把 Ponte Vecchio 放中景，阿诺河放前景，拍横构图", bestTime: "日落前30–45分钟；比老桥桥面更容易拍全" }, { nav: "Piazzale Michelangelo：导航到广场中央露台", stand: "从 Rampe del Poggi 上来后，站到面向市中心的栏杆前", frame: "正前方依次是 Palazzo Vecchio、圣母百花穹顶、Ponte Vecchio；拍全景和人物背影", bestTime: "日落前45分钟到蓝调时刻；上山不要卡博物馆闭馆时间" }] },
  { id: "florence-food-day4", region: "佛罗伦萨", category: "美食 / 餐厅", title: "9月29日｜领主广场—大教堂顺路吃", places: "Trippaio del Porcellino · Piazza del Mercato Nuovo / Panini Toscani · Piazza del Duomo 34/R", story: "朋友实吃推荐，按新增美第奇礼拜堂后的路线重新落位。乌菲兹和领主广场结束后，先在 Trippaio del Porcellino 吃 lampredotto（牛肚包）；若不吃牛肚，就继续走到大教堂旁的 Panini Toscani。两家都以快餐为主，吃完继续向北去美第奇礼拜堂，不为吃饭折返。", timing: "9月29日 13:30 左右；牛肚摊遇长队直接改 Panini Toscani", source: "朋友《意大利饮食攻略—2023修订》+ 2026 营业状态核验", sourceUrl: "https://feelflorence.it/en/points-interest/nencioni-orazio-trippaio-del-porcellino" },
  { id: "florence-food-day5", region: "佛罗伦萨", category: "美食 / 餐厅", title: "9月30日｜两座美术馆之间轻午餐，晚上吃牛排", places: "Nobile Bistrò · Piazza Madonna degli Aldobrandini 13/R / I’Tuscani 3 · Via Dante Alighieri 18/3R", story: "朋友攻略里的 Nobile Bistrò 位于学院美术馆与巴杰罗之间，适合坐下吃 panino、沙拉或简餐；把更费时间的佛罗伦萨 T 骨牛排留到两馆结束后，I’Tuscani 3 仍在原址营业。牛排按重量计价，落座前先确认克数、价格与熟度；晚餐建议预约。", timing: "9月30日：中午 Nobile Bistrò；晚餐 I’Tuscani 3", source: "朋友《意大利饮食攻略—2023修订》+ 店铺当前页面核验", sourceUrl: "https://ituscani3.eatbu.com/?lang=en" },
  { id: "florence-gifts", region: "佛罗伦萨", category: "伴手礼 / 购物", title: "佛罗伦萨伴手礼｜皮具、市场与地方食品", places: "San Lorenzo 市场 / Sant’Ambrogio 市场", story: "佛罗伦萨适合把伴手礼和老城步行结合：先看皮具、纸品和地方食品，再决定是否购买。皮具要现场看做工、材质和退换条件，不因为‘佛罗伦萨’标签就直接下单。", timing: "佛罗伦萨自由时段或返程前", source: "佛罗伦萨官方市场资料", sourceUrl: "https://www.feelflorence.it/en/experiences-itineraries/markets-florence" },
  { id: "berlin-photo-hotspots", region: "柏林", category: "机位 / 出片", title: "柏林补充机位｜具体站位版", places: "Oberbaumbrücke → East Side Gallery → Frankfurter Tor", story: "勃兰登堡门、查理检查站已经在正式行程里，这张卡只补三个可直接导航的机位：桥上拍城市、墙画拍历史、中央绿化带拍电视塔。不是再增加一整天景点。", timing: "柏林自由时段；按顺路选一到两个", source: "visitBerlin 官方｜图片与路线参考", sourceUrl: "https://www.visitberlin.de/en/photo-spots-berlin", locationKeys: ["东边画廊"], shotGuide: [{ nav: "Oberbaumbrücke：导航到桥中央人行道", stand: "站在桥中央向市中心方向（西侧）看，避开自行车道", frame: "把 Spree 河放下方，电视塔和桥塔放中远景；两人靠栏杆拍侧身", bestTime: "日落前30分钟；桥上风大，带外套" }, { nav: "East Side Gallery：从 Warschauer Straße 入口沿 Mühlenstraße 向市中心走", stand: "到‘兄弟之吻’或‘Trabi’壁画前，站在墙对面人行道", frame: "人物不要贴墙，留出整幅壁画；用墙的横向延伸拍走路镜头", bestTime: "上午 8–10 点人少；正式行程已去过则只拍补充画面" }, { nav: "Frankfurter Tor：Karl-Marx-Allee 中央绿化带", stand: "站在两座双塔之间的中轴线上，面向西看电视塔方向", frame: "双塔做左右框景，电视塔压在远处中间；适合竖构图", bestTime: "蓝调时刻，等两侧路灯亮起" }] },
  { id: "berlin-food-route", region: "柏林", category: "美食 / 餐厅", title: "柏林吃什么｜猪肘、Döner、Currywurst", places: "市中心 / Markthalle Neun / 老牌德餐馆", story: "近期结果集中在猪肘、Döner、Currywurst、老牌德餐和亚洲菜。建议把‘传统德国菜’和‘街头快餐’分成两顿，不要一天连续安排多个重口味正餐。", timing: "柏林正式行程的午餐或晚餐", source: "小红书站内检索 / VisitBerlin", sourceUrl: "https://www.xiaohongshu.com/search_result?keyword=%E6%9F%8F%E6%9E%97%20%E7%BE%8E%E9%A3%9F" },
  { id: "berlin-gifts", region: "柏林", category: "伴手礼 / 购物", title: "柏林伴手礼｜Ampelmann 与 Rausch 巧克力", places: "Ampelmann 专卖店 / Rausch 巧克力", story: "近期站内结果明确出现柏林交通灯小人和 Rausch 巧克力。它们比泛泛的‘柏林纪念品’更容易形成城市记忆；购买前仍要看店铺位置和当天是否顺路。", timing: "柏林自由时段或离境前", source: "小红书站内检索｜柏林伴手礼", sourceUrl: "https://www.xiaohongshu.com/search_result?keyword=%E6%9F%8F%E6%9E%97%20%E4%BC%B4%E6%89%8B%E7%A4%BC" },
  { id: "paris-photo-hotspots", region: "巴黎", category: "机位 / 出片", title: "巴黎补充机位｜具体站位版", places: "Avenue de Camoëns → Pont de Bir-Hakeim → Rue Saint-Dominique", story: "巴黎不再只写‘战神广场 / 铁塔远景 / 蒙马特’。这三个点都能直接输入导航，并且各自对应不同画面：台阶中轴、桥梁几何、街道透视。第 10 天只选一个即可，避免为拍照反复穿城。", timing: "第10天铁塔段择一；第12天自由日可走完整小线", source: "巴黎铁塔官方｜图片与路线参考", sourceUrl: "https://www.toureiffel.paris/en/news/recreation/best-spots-photographing-eiffel-tower", shotGuide: [{ nav: "Avenue de Camoëns：导航到 Avenue de Camoëns 台阶顶端", stand: "站在台阶最上方，面向西南的铁塔；人物站中段，不挡住上下楼", frame: "台阶扶手做引导线，拍一张全身、一张半身；这是最省时间的铁塔人像位", bestTime: "日出或日落前；官方也特别推荐这里的结构感" }, { nav: "Pont de Bir-Hakeim：导航到桥中央的人行通道", stand: "站在桥中央拱架下的步道，朝铁塔方向拍；不要站在自行车道", frame: "用桥梁横梁和 Seine 做几何前景，人物走动比摆拍自然", bestTime: "傍晚至夜间；蓝调时刻最容易兼顾天空和灯光" }, { nav: "Rue Saint-Dominique：从 29 Rue Saint-Dominique 一带向铁塔方向走", stand: "在街道两侧找不挡车流的人行道位置，向铁塔方向拍透视", frame: "让街道两侧建筑夹出铁塔，不必走到铁塔脚下；适合竖构图", bestTime: "上午或日落前；行人多时拍‘走入巴黎’的生活感" }] },
  { id: "paris-food-route", region: "巴黎", category: "美食 / 餐厅", title: "巴黎吃什么｜法餐、马卡龙与下午茶", places: "正式路线沿线 / 玛黑区 / 左岸", story: "近期结果的高频方向是本地法餐、牛排馆、马卡龙、下午茶和 Brunch。先按当天景点位置挑店，再核对营业时间和预约要求，不直接把搜索热度等同于餐厅质量。", timing: "巴黎第10—12天按路线现场选择", source: "小红书站内检索｜巴黎美食", sourceUrl: "https://www.xiaohongshu.com/search_result?keyword=%E5%B7%B4%E9%BB%8E%20%E7%BE%8E%E9%A3%9F" },
  { id: "paris-gifts", region: "巴黎", category: "伴手礼 / 购物", title: "巴黎伴手礼｜玛黑区、博物馆商店与 10–20 欧元选项", places: "玛黑区 / 博物馆商店 / Bacha Coffee", story: "近期结果里有‘一站式购齐附地图’、玛黑区 6 店路线、10–20 欧元平价伴手礼、博物馆商店和 Bacha Coffee。适合留给巴黎自由日，先确定预算，再按区域集中购买。", timing: "第12天自由日或返程前半天", source: "小红书站内检索 / 巴黎官方旅游资料", sourceUrl: "https://www.xiaohongshu.com/search_result?keyword=%E5%B7%B4%E9%BB%8E%20%E4%BC%B4%E6%89%8B%E7%A4%BC" },
  { id: "rome-food-day2", region: "罗马", category: "美食 / 餐厅", title: "9月27日｜斗兽场—特莱维沿线的朋友实吃清单", places: "Fatamorgana Monti / Grezzo Raw Chocolate / Pane e Salame / La Carbonara", story: "从斗兽场出来若走 Monti，可在 Fatamorgana（Piazza degli Zingari 5）吃 gelato，或在 Grezzo（Via Urbana 130）短休；到特莱维附近，Pane e Salame（Via di Santa Maria in Via 19）适合快速午餐。若晚上仍想吃正统罗马面，可预约 La Carbonara（Via Panisperna 214）。这张卡已替代原先泛泛的‘罗马美食’推荐。", timing: "9月27日按实际走到的位置四选一，不要为了吃饭折返", source: "朋友《意大利饮食攻略—2023修订》+ 店铺官方页面核验", sourceUrl: "https://www.lacarbonara.it/" },
  { id: "rome-food-vatican", region: "罗马", category: "美食 / 餐厅", title: "9月28日｜梵蒂冈出口的一支冰淇淋", places: "Old Bridge Gelateria · Viale dei Bastioni di Michelangelo 5", story: "朋友攻略里最适合直接嵌入梵蒂冈日的一家：就在梵蒂冈城墙外，当前仍营业。把它当博物馆前后 15—20 分钟的休息点即可，不另加远距离餐厅；正餐仍以预约和参观节奏为先。", timing: "圣彼得大教堂或梵蒂冈博物馆前后；排队太长就跳过", source: "朋友《意大利饮食攻略—2023修订》+ Old Bridge 官方页面", sourceUrl: "https://gelateriaoldbridge.com/contatti/" },
  { id: "rome-food-testaccio", region: "罗马", category: "美食 / 餐厅", title: "10月1日｜Testaccio 午饭：坐下休息版 + 市场版", places: "Mercato Testaccio → Taverna Volpetti / Mordi e Vai → Volpetti Salumeria", story: "首选 14:00 预约 Taverna Volpetti（Via Alessandro Volta 8）：它与朋友推荐的老牌熟食店 Volpetti 同源，能坐下慢慢吃，适合你不想太累的要求。若时间被前两站拖晚，就在市场 Box 15 的 Mordi e Vai 点 allesso、picchiapò、肉丸或香肠西兰花 panino，排队取号但出餐快。朋友攻略里的 Pizzeria da Remo 只适合晚餐；Romeo 当前经营状态不可靠，已经移出推荐。", timing: "13:35 先逛市场，14:00 午餐；市场周一至周六 7:00—15:30", source: "朋友《意大利饮食攻略—2023修订》+ Mercato / Volpetti / Taverna 官方页面核验", sourceUrl: "https://www.mercatoditestaccio.it/info/" },
  { id: "rome-gifts", region: "罗马", category: "伴手礼 / 购物", title: "罗马伴手礼｜意大利平价礼物与梵蒂冈主题", places: "历史中心 / 梵蒂冈周边 / 本土品牌店", story: "近期结果的方向包括意大利平价伴手礼、本土品牌、Venchi、梵蒂冈主题纪念品和冰箱贴。梵蒂冈日优先买小而轻的纸品或纪念章，巧克力和液体类留意行李空间。", timing: "第3天梵蒂冈结束后或第6天自由日", source: "小红书站内检索｜罗马伴手礼", sourceUrl: "https://www.xiaohongshu.com/search_result?keyword=%E7%BD%97%E9%A9%AC%20%E4%BC%B4%E6%89%8B%E7%A4%BC" },
  { id: "berlin-unter-den-linden", region: "柏林", category: "历史补线", title: "菩提树下大街：国家大道的形成", places: "Unter den Linden / 新岗哨 / 博物馆岛外观", story: "把普鲁士王权、帝国首都、战争记忆和今天的柏林大道放到一条步行线上。", timing: "第9天飞巴黎前隐藏时段", source: "Excel 自由行参考（已提炼）", locationKeys: ["菩提树下大街"] },
  { id: "rome-gem-unverified", region: "罗马", category: "邓紫棋 / 拍照", title: "邓紫棋罗马具体地点：待核实入口", places: "现场照片 / 链接 → 再加入罗马路线", story: "目前没有足够可靠的公开资料确认她在罗马的具体打卡地点。这里先保留入口，不把候选地点误写成她去过。", timing: "罗马自由日集中核对", source: "待你补充照片或链接" },
  { id: "rome-photo-line", region: "罗马", category: "邓紫棋 / 拍照", title: "罗马人像拍照候选线｜具体站位版", places: "Trevi Fountain 东侧小巷 → Piazza di Spagna 西侧台阶", story: "这不是已确认的邓紫棋同款地点，而是一条现场能直接执行的轻量人像线。两个点步行约 8–12 分钟，拍完即可回到正式路线，不需要增加新景点。", timing: "第6天自由日上午；人多时只拍一个点", source: "罗马拍照备选 / 路线参考", shotGuide: [{ nav: "Trevi Fountain：导航到 Via delle Muratte 与喷泉交界", stand: "不要挤到喷泉池边，站在东侧入口附近面向西拍", frame: "让喷泉落在人物肩后，拍半身；早到比找‘无游客角度’更有效", bestTime: "07:30–09:00，光线柔和且人少" }, { nav: "Piazza di Spagna：导航到 Scalinata di Spagna 下方广场", stand: "站在广场下方偏西侧，面向台阶；人物站在台阶侧边", frame: "用台阶斜线和上方教堂做背景，避免坐在台阶上摆拍", bestTime: "上午 09:00 前或傍晚；按现场拥挤程度取舍" }] },
  { id: "rome-jasmine", region: "罗马", category: "邓紫棋 / 拍照", title: "圣彼得穹顶远景拍照候选｜具体站位版", places: "Giardino degli Aranci 观景台 → 马耳他骑士团钥匙孔", story: "不再进入梵蒂冈内部，改从阿文蒂诺山拍圣彼得穹顶远景；这条线比‘茉莉花步道’更容易导航和理解，也能把拍照与罗马历史收束结合起来。", timing: "第6天自由日下午；两个点相邻，预留60–90分钟", source: "罗马官方旅游资料 / 图片与路线参考", sourceUrl: "https://www.turismoroma.it/en/places/savello-park-or-orange-garden", shotGuide: [{ nav: "Giardino degli Aranci：导航到 Piazza Pietro D'Illiria 入口", stand: "穿过花园走到面向台伯河的观景台栏杆", frame: "圣彼得穹顶在远处偏右，人物背影放画面左侧；适合横构图", bestTime: "日落前40分钟；官方列为罗马观景点" }, { nav: "Buco della Serratura：导航到 Piazza dei Cavalieri di Malta", stand: "排队到骑士团大门钥匙孔前，镜头贴近但不要触碰", frame: "钥匙孔内的圣彼得穹顶是特写，人物不要挡住后面的人", bestTime: "日落前后；排队时间不可控，赶时间可取消" }] },
];

const dailyReferenceIds: Record<string, string[]> = {
  "day-02": ["rome-food-day2"],
  "day-03": ["rome-food-vatican", "rome-gifts"],
  "day-04": ["florence-photo-hotspots", "florence-food-day4", "florence-gifts"],
  "day-05": ["florence-food-day5", "florence-gifts"],
  "day-06": ["rome-food-testaccio"],
  "day-08": ["berlin-food-route", "berlin-gifts"],
  "day-10": ["gem-fly-away", "paris-photo-hotspots", "paris-food-route"],
  "day-11": ["paris-food-route", "paris-gifts"],
};

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
      { name: "领主广场", query: "Piazza della Signoria, Florence", kind: "visit", coordinates: [43.7696, 11.2558] },
      { name: "圣母百花大教堂", query: "Cathedral of Santa Maria del Fiore, Florence", kind: "visit", coordinates: [43.7731, 11.256], note: "城邦竞争的公共宣言" },
      { name: "天堂之门", query: "Gates of Paradise, Florence", kind: "visit", coordinates: [43.7734, 11.2552] },
      { name: "美第奇礼拜堂", query: "Cappelle Medicee, Florence", kind: "visit", coordinates: [43.775, 11.2535], note: "入口在圣洛伦佐背面；看君主礼拜堂与米开朗基罗新圣器室" },
    ],
    relationship: "佛罗伦萨核心景点都在老城步行范围内。按乌菲兹—领主广场—大教堂—美第奇礼拜堂向北收束，最后从圣洛伦佐一带回酒店，比原来的来回折返更省力。",
    note: "美第奇礼拜堂是单独售票的国家博物馆，入口在圣洛伦佐教堂背面的 Piazza di Madonna degli Aldobrandini 6；9 月 29 日周二开放至 18:50，最后入场 18:10。",
  },
  "day-05": {
    city: "佛罗伦萨",
    subtitle: "9 月 30 日：酒店 → 学院美术馆 → 巴杰罗",
    center: [43.773, 11.258],
    bbox: [11.235, 43.755, 11.275, 43.79],
    hotel: hotelAnchors.florence,
    points: [
      { name: "学院美术馆", query: "Galleria dell'Accademia, Florence", kind: "visit", coordinates: [43.7769, 11.2589], note: "已确定安排：米开朗基罗《大卫》" },
      { name: "巴杰罗国家博物馆", query: "Museo Nazionale del Bargello, Florence", kind: "visit", coordinates: [43.7704, 11.2577], note: "新增安排：重点提醒，不要忘记" },
      { name: "佛罗伦萨老城 / 晚餐", query: "Historic Centre of Florence", kind: "optional", coordinates: [43.7715, 11.2555], note: "两馆之间或参观后自由安排" },
    ],
    relationship: "9 月 30 日两座博物馆都在佛罗伦萨老城步行范围内：学院美术馆在北侧，巴杰罗国家博物馆在大教堂与领主广场之间，酒店从车站一侧向东进入老城。",
    note: "9 月 30 日正式显示为学院美术馆 + 巴杰罗国家博物馆；巴杰罗是新增安排，现场不要漏掉。",
  },
  "day-06": {
    city: "罗马",
    subtitle: "博尔盖塞 → 米尔维安大桥 → Testaccio｜少走路版",
    center: [41.88, 12.478],
    bbox: [12.43, 41.79, 12.52, 41.95],
    hotel: hotelAnchors.rome,
    points: [
      { name: "博尔盖塞美术馆", query: "Galleria Borghese, Rome", kind: "visit", travelMode: "taxi", coordinates: [41.9142, 12.4922], note: "10:00 预约；建议 09:25 抵达" },
      { name: "米尔维安大桥", query: "Ponte Milvio, Rome", kind: "visit", travelMode: "taxi", coordinates: [41.9352, 12.4663], note: "看古桥与罗马北部街区生活" },
      { name: "Gondi Bistrot", query: "Gondi Bistrot Ponte Milvio, Rome", kind: "optional", coordinates: [41.9371, 12.4657], note: "桥北端坐下喝咖啡；1959 年起的家庭店" },
      { name: "Testaccio 市场", query: "Mercato Testaccio, Rome", kind: "visit", travelMode: "taxi", coordinates: [41.8778, 12.4746], note: "先逛再吃；周一至周六 07:00—15:30" },
      { name: "Taverna Volpetti", query: "Taverna Volpetti, Rome", kind: "visit", coordinates: [41.8809, 12.4775], note: "14:00 预约午餐；坐下休息版首选" },
      { name: "Volpetti Salumeria", query: "Volpetti Salumeria, Rome", kind: "optional", coordinates: [41.882, 12.4773], note: "朋友攻略原推荐；午饭后顺路看老牌熟食店" },
    ],
    relationship: "三段都建议打车：博尔盖塞到米尔维安大桥约 15—25 分钟；桥边喝完咖啡后到 Testaccio 约 25—35 分钟。Testaccio 内只走市场—Taverna—Volpetti 这一小段。",
    note: "白天的桥区和 Testaccio 市场核心并非所谓‘贼窝’；主要风险仍是罗马常见的拥挤场所扒窃。手机不要放桌边，包拉链朝身前；跨区可用 Uber（比较 Taxi / Black）或官方白色出租车。",
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
    subtitle: "巴黎酒店 → 凡尔赛宫 → 网球厅 → 凯旋门 → 巴黎圣母院",
    center: [48.82, 2.25],
    bbox: [2.08, 48.78, 2.40, 48.90],
    hotel: hotelAnchors.paris,
    points: [
      { name: "军队广场 / Place d’Armes", query: "Place d'Armes, Versailles", kind: "visit", coordinates: [48.8032, 2.1244], note: "宫门外：1789年10月5—6日群众与国民卫队聚集处", displayOffset: [0, 4] },
      { name: "凡尔赛宫 / Château de Versailles", query: "Palace of Versailles", kind: "visit", coordinates: [48.8049, 2.1204], note: "宫内寻找皇家歌剧院、王后卧室小门和大理石庭院", displayOffset: [-4, -3] },
      { name: "网球厅 / Salle du Jeu de Paume", query: "Salle du Jeu de Paume, 1 rue du Jeu de Paume, Versailles", kind: "visit", coordinates: [48.801004, 2.123831], note: "革命必看：免费；12:30后开放", displayOffset: [4, 2] },
      { name: "三级会议旧址 / Hôtel des Menus-Plaisirs", query: "Hôtel des Menus-Plaisirs, 22 avenue de Paris, Versailles", kind: "optional", coordinates: [48.800397, 2.133727], note: "可选外观补线；时间紧时取消" },
      { name: "凯旋门", query: "Arc de Triomphe, Paris", kind: "visit", coordinates: [48.8738, 2.295], note: "革命与帝国重新写国家叙事" },
      { name: "巴黎圣母院", query: "Notre-Dame de Paris", kind: "visit", coordinates: [48.853, 2.3499] },
    ],
    relationship: "先在宫内完成三个革命观察点，再从宫殿城市一侧步行约10分钟到网球厅；Menus-Plaisirs只作可选补线，之后返回巴黎市区。",
    note: "网球厅已加入第11天正式补线；2026年10月6日是星期二，按目前公布安排12:30后可免费参观。出发前仍需复核临时闭馆信息。",
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
  const mode = point.travelMode === "taxi" ? "打车段" : point.travelMode === "transit" || point.kind === "move" || km > 8 ? "交通段" : `步行约 ${Math.max(3, Math.round(km * 12))} 分钟`;
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
    route: ["斗兽场", "万神殿", "特莱维喷泉", "真理之口", "西班牙广场"], transport: ["酒店 → 斗兽场：步行 / 地铁，以酒店位置调整", "市中心景点之间：步行串联"], meals: ["午餐：特莱维附近 Pane e Salame；若走 Monti 则按 Fatamorgana / Grezzo 顺路休息", "晚餐：可预约 Monti 的 La Carbonara；不为餐厅折返"],
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
    route: ["圣彼得大教堂", "梵蒂冈博物馆", "西斯廷教堂"], transport: ["罗马酒店 → 梵蒂冈：步行 / 地铁 / 车程，以酒店位置调整", "梵蒂冈内部：按预约时间入场"], meals: ["午餐：梵蒂冈周边按预约节奏解决", "甜点休息：Old Bridge Gelateria（城墙外 Viale dei Bastioni di Michelangelo 5）", "晚餐：回罗马市区后自选"],
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
    route: ["前往佛罗伦萨", "乌菲兹美术馆", "领主广场", "午餐", "圣母百花大教堂 / 天堂之门", "美第奇礼拜堂"], transport: ["罗马 → 佛罗伦萨：按正式方案交通", "佛罗伦萨市区：按乌菲兹—领主广场—大教堂—圣洛伦佐向北步行，减少折返"], meals: ["午餐：领主广场附近的 Trippaio del Porcellino；不吃牛肚则到大教堂旁 Panini Toscani", "晚餐：美第奇礼拜堂结束后回酒店 / 市区自选"],
    activities: [
      { id: "d4-1", time: "上午", title: "前往佛罗伦萨", place: "罗马 → 佛罗伦萨", note: "从帝国城市进入城邦城市", kind: "move" },
      { id: "d4-2", time: "10:30", title: "乌菲兹美术馆", place: "Uffizi Gallery", note: "美第奇如何用艺术打造公共声望", kind: "visit" },
      { id: "d4-3", time: "13:00", title: "领主广场", place: "Piazza della Signoria", note: "就在乌菲兹外，把美第奇收藏放回城市政治空间", kind: "visit" },
      { id: "d4-4", time: "13:30", title: "午餐 / 休息", place: "Mercato Nuovo / 老城", note: "首选 Trippaio del Porcellino；不吃牛肚就去 Panini Toscani", kind: "meal" },
      { id: "d4-5", time: "14:30", title: "百花大教堂 / 洗礼堂", place: "Duomo", note: "看城市竞争如何变成建筑高度；洗礼堂内部穹顶马赛克正在修复", kind: "visit" },
      { id: "d4-6", time: "16:30–17:40", title: "美第奇礼拜堂", place: "Cappelle Medicee · Piazza di Madonna degli Aldobrandini 6", note: "新增正式安排；看君主礼拜堂、新圣器室，以及米开朗基罗的《昼》《夜》《晨》《暮》", kind: "visit" },
    ],
    story: { title: "佛罗伦萨为什么能接过罗马的火炬？", question: "一个银行家族怎样把城邦竞争变成自己的王朝记忆？", lead: "今天不是从帝国跳进美术馆，而是沿着乌菲兹、领主广场、大教堂和美第奇礼拜堂，看城市公共荣耀怎样一步步变成美第奇家族的权力。", body: "佛罗伦萨的银行、广场、教堂和美术馆共同说明了一件事：财富本身不会自动变成合法性。美第奇家族必须把银行赚来的钱转化为建筑、画作和公共荣耀，让整座城市不断重复一个印象——这个家族有能力让佛罗伦萨变得更伟大。乌菲兹展示他们如何收藏和编排艺术；领主广场提醒你，这座城市曾以共和国和公共政治理解自己；百花大教堂则把城市竞争变成所有人都能看见的天际线。最后进入美第奇礼拜堂，公共荣耀开始收进家族陵墓：君主礼拜堂用昂贵石材展示王朝身份，米开朗基罗的新圣器室却用《昼》《夜》《晨》《暮》讨论时间、死亡和权力。第二天再去学院美术馆和巴杰罗，米开朗基罗与多纳太罗就不再只是几位天才，而是佛罗伦萨不断塑造自身形象的艺术家。", chapters: [{ label: "01", title: "乌菲兹：家族收藏城市", text: "美第奇把财富转化为艺术，也获得解释佛罗伦萨过去的权力。" }, { label: "02", title: "广场与大教堂：公共的佛罗伦萨", text: "共和国政治和城市竞争，把权力公开放进广场与天际线。" }, { label: "03", title: "美第奇礼拜堂：公共荣耀变成王朝记忆", text: "从君主礼拜堂到米开朗基罗新圣器室，看家族如何安排自己的死亡与永恒。" }, { label: "04", title: "明天补雕塑线", text: "学院美术馆的《大卫》和巴杰罗的多纳太罗，会把今天的美第奇故事重新拉回城市与公民。" }], prompt: "请把佛罗伦萨两天的故事串起来：第一天按乌菲兹—领主广场—百花大教堂—美第奇礼拜堂行走，第二天去学院美术馆和巴杰罗国家博物馆。重点讲‘城邦竞争如何让美第奇把银行财富变成公共荣耀，再把公共荣耀变成王朝记忆’，并加入美第奇礼拜堂君主礼拜堂、米开朗基罗新圣器室和《昼》《夜》《晨》《暮》的现场观察。写成我可以现场口播的 7 分钟故事。\n\n原稿：" },
    source: "正式方案 PDF｜罗马→佛罗伦萨；你的新增安排：美第奇礼拜堂；Musei del Bargello 官方 2026 开放信息",
  },
  {
    id: "day-05", number: "05", date: "9月30日", city: "佛罗伦萨", tag: "重点日", title: "学院与巴杰罗：把佛罗伦萨的雕塑线补完整",
    route: ["学院美术馆", "巴杰罗国家博物馆", "佛罗伦萨老城步行"], transport: ["酒店 → 学院美术馆：步行 / 市内交通，以预约时间为准", "学院美术馆 → 巴杰罗国家博物馆：佛罗伦萨老城步行串联"], meals: ["午餐：两馆之间的 Nobile Bistrò，简餐并坐下休息", "晚餐：I’Tuscani 3 吃佛罗伦萨牛排，建议预约并先确认重量价格"],
    priorityReminder: { label: "务必记住 / 9 月 30 日", title: "学院美术馆 + 巴杰罗国家博物馆", body: "今天已经确定去学院美术馆；新增的巴杰罗国家博物馆必须单独记住，不要只看完《大卫》就漏掉巴杰罗。两馆可以串成一条‘米开朗基罗—多纳太罗—佛罗伦萨雕塑传统’的完整补充线，具体先后按预约时间调整。", items: ["学院美术馆｜Galleria dell’Accademia｜已确定安排：重点看米开朗基罗《大卫》", "巴杰罗国家博物馆｜Museo Nazionale del Bargello｜新增安排：重点提醒，不要忘记"] },
    activities: [
      { id: "d5-1", time: "上午", title: "学院美术馆", place: "Galleria dell’Accademia", note: "已确定安排；重点看米开朗基罗《大卫》", kind: "visit" },
      { id: "d5-2", time: "中午", title: "午餐 / 步行转场", place: "学院美术馆 → 巴杰罗国家博物馆", note: "按预约与体力安排，不要赶路", kind: "meal" },
      { id: "d5-3", time: "下午", title: "巴杰罗国家博物馆", place: "Museo Nazionale del Bargello", note: "新增安排；重点看多纳太罗与佛罗伦萨雕塑传统", kind: "visit" },
      { id: "d5-4", time: "傍晚", title: "佛罗伦萨老城 / 晚餐", place: "佛罗伦萨市区", note: "把两座博物馆的雕塑线收进今天的故事", kind: "free" },
    ],
    story: { title: "为什么同一座佛罗伦萨，要用两座博物馆讲雕塑？", question: "从《大卫》到多纳太罗，佛罗伦萨如何把艺术变成城市身份？", lead: "今天是佛罗伦萨第二天：先看学院美术馆的《大卫》，再去巴杰罗国家博物馆，把一件名作放回更长的雕塑传统里。", body: "学院美术馆最容易被记成‘去看《大卫》’，但今天真正要讲的是：为什么佛罗伦萨要把一个理想公民塑造成巨大的裸体英雄。米开朗基罗的《大卫》不是孤立的美术名作，它借用了圣经故事，也回应了佛罗伦萨作为共和国、城邦和美第奇政治中心的自我想象。看完学院美术馆，再去巴杰罗国家博物馆，视线要从一件最著名的雕像扩展开：这里收藏和展示的雕塑，让你看到多纳太罗等艺术家怎样把古典人体、宗教人物和公共纪念转化为佛罗伦萨的城市语言。两馆连起来，故事就从‘我看到了《大卫》’变成‘这座城为什么反复用雕塑塑造自己’。这也正好接上昨天的乌菲兹、百花大教堂和领主广场：银行财富、教堂高度、公共广场和雕塑英雄，其实都是城邦在争夺信用与身份。", chapters: [{ label: "01", title: "学院美术馆：一个理想公民", text: "《大卫》不只是人体美，也承载佛罗伦萨对勇气、警醒和城市自主的想象。" }, { label: "02", title: "巴杰罗：一条雕塑传统", text: "新增的巴杰罗不能漏掉；它让多纳太罗与佛罗伦萨雕塑的公共、宗教和宫廷背景重新出现。" }, { label: "03", title: "两馆合成一条线", text: "从一件巨作回到一座城市，理解艺术如何成为城邦的政治语言。" }], prompt: "请把 9 月 30 日佛罗伦萨第二天写成我可以现场口播的 6 分钟完整故事：上午学院美术馆看米开朗基罗《大卫》，下午巴杰罗国家博物馆看多纳太罗与佛罗伦萨雕塑传统。必须把两座博物馆和昨天的乌菲兹、百花大教堂、领主广场连接起来，讲清楚城邦为什么用艺术塑造城市身份；每到一个馆都告诉我现场应该观察什么。\n\n原稿：" },
    source: "你的最新安排｜9 月 30 日学院美术馆 + 巴杰罗国家博物馆",
  },
  {
    id: "day-06", number: "06", date: "10月1日", city: "罗马", tag: "轻松街区日", title: "从收藏家的罗马，走到普通人的罗马",
    route: ["博尔盖塞美术馆", "米尔维安大桥", "桥边咖啡", "Testaccio 市场", "Taverna Volpetti / Mordi e Vai", "Volpetti Salumeria"], transport: ["三段跨区移动都建议 Uber（比较 Taxi / Black）或官方白色出租车；不要用公交换乘消耗体力", "Testaccio 只走市场—午饭—Volpetti，街区内步行约 600—900 米"], meals: ["咖啡：Gondi Bistrot（Piazzale di Ponte Milvio 5/6/7）", "午餐首选：14:00 预约 Taverna Volpetti；迟到备选：市场 Box 15 的 Mordi e Vai", "晚餐：留白；若临时想吃 Pizzeria da Remo，再按当天营业与排队决定"],
    photoIdeas: ["博尔盖塞结束后不要在公园继续长走，直接打车去米尔维安大桥。", "桥上拍一张台伯河与古桥，再到桥北端坐下喝咖啡；这段重在休息和看人。", "Testaccio 不追求景点数量：市场摊位、Piazza Testaccio、Volpetti 的熟食柜台，就是街区生活本身。"],
    priorityReminder: { label: "10 月 1 日已确定", title: "博尔盖塞 + 米尔维安大桥 + Testaccio", body: "Testaccio 不是去看一座明星景点，而是体验罗马的市场、熟食店、工人区饮食传统和日常生活。为了少走路，三段跨区移动都打车，街区内只走最短的小环线。", items: ["10:00—12:00｜博尔盖塞美术馆", "12:20—13:10｜米尔维安大桥 + Gondi Bistrot 咖啡", "13:40—15:30｜Testaccio 市场 + 午餐 + Volpetti"] },
    activities: [
      { id: "d6-1", time: "09:25", title: "提前抵达", place: "博尔盖塞美术馆", note: "预约 10:00；留出安检、存包和找入口时间", kind: "move" },
      { id: "d6-2", time: "10:00–12:00", title: "博尔盖塞美术馆", place: "Galleria Borghese", note: "两小时看贝尼尼、卡拉瓦乔；结束后不再长走公园", kind: "visit" },
      { id: "d6-3", time: "12:20–13:10", title: "米尔维安大桥 + 咖啡", place: "Ponte Milvio → Gondi Bistrot", note: "桥上短走、看台伯河；桥北端坐下喝咖啡，观察本地街区日常", kind: "free" },
      { id: "d6-4", time: "13:10–13:40", title: "打车去 Testaccio", place: "Ponte Milvio → Mercato Testaccio", note: "避开公交换乘；下车点设在市场入口", kind: "move" },
      { id: "d6-5", time: "13:40–14:00", title: "Testaccio 市场", place: "Mercato Testaccio", note: "市场 15:30 关，必须先看；重点看蔬果、奶酪、肉铺与熟食摊", kind: "visit" },
      { id: "d6-6", time: "14:00–15:10", title: "午餐 / 休息", place: "Taverna Volpetti", note: "首选提前预约；想更市井则改去市场 Box 15 的 Mordi e Vai", kind: "meal" },
      { id: "d6-7", time: "15:10–15:40", title: "Volpetti / Piazza Testaccio", place: "Via Marmorata 47 → Piazza Testaccio", note: "看熟食柜台和街区广场；累了就取消广场，直接打车回酒店", kind: "free" },
      { id: "d6-8", time: "15:40 后", title: "打车回酒店休息", place: "Testaccio → Warmthotel", note: "下午不再加景点；晚餐按体力决定", kind: "move" },
    ],
    story: { title: "Testaccio：罗马为什么也要看市场和饭桌？", question: "看完贵族收藏，怎样在同一天看见普通罗马人的城市？", lead: "上午的博尔盖塞是贵族把财富、权力和艺术集中进一座别墅；下午的 Testaccio 则把罗马放回市场、屠宰业、熟食店和居民的饭桌。", body: "博尔盖塞美术馆里的贝尼尼和卡拉瓦乔，代表的是被家族收藏、被精心展示的罗马。离开美术馆去米尔维安大桥，城市从室内重新回到道路与河流：这座桥长期是罗马北方入口，今天桥边的咖啡馆和居民生活又给它加上了当代的一层。最后到 Testaccio，真正要看的不是‘又一个古迹’，而是城市怎样吃饭。古代的货物沿台伯河进入这里，破碎的油罐堆成 Monte Testaccio；近代屠宰场又让牛杂和所谓 quinto quarto 成为街区味道。今天的市场、Volpetti 和罗马面食把这些历史留在日常里。你在摊位前看到的奶酪、肉铺、蔬果和 panino，不是景点布景，而是罗马继续生活的方式。", chapters: [{ label: "01", title: "博尔盖塞：被收藏的罗马", text: "贵族家族把艺术变成身份、权力和审美秩序。" }, { label: "02", title: "米尔维安：道路上的罗马", text: "古桥曾连接罗马与北方，今天则是居民喝咖啡、见面和散步的地方。" }, { label: "03", title: "Testaccio：被吃出来的罗马", text: "港口、陶罐山、屠宰场和市场，共同形成这片工人街区的饮食传统。" }], prompt: "请把 10 月 1 日的博尔盖塞美术馆、米尔维安大桥和 Testaccio 写成一段 5 分钟现场故事。重点不是景点百科，而是从贵族收藏、城市道路讲到普通罗马人的市场与饭桌；最后解释 Testaccio 的 Monte dei Cocci、旧屠宰场和 quinto quarto 为什么塑造了罗马菜。\n\n现场补充：" },
    source: "你的最新安排｜10 月 1 日博尔盖塞 + 米尔维安大桥 + Testaccio；朋友《意大利饮食攻略—2023修订》；店铺与市场官方页面 2026 核验",
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
    route: ["军队广场 / Place d’Armes", "凡尔赛宫 / Château de Versailles", "网球厅 / Salle du Jeu de Paume", "凡尔赛花园", "凯旋门", "巴黎圣母院"], transport: ["巴黎 ↔ 凡尔赛：按正式方案交通", "宫殿 → 网球厅：从城市一侧出宫，步行约10分钟；导航 1 rue du Jeu de Paume", "凡尔赛 → 巴黎市区：车辆 / RER 以安排为准"], meals: ["午餐：网球厅参观后在凡尔赛周边安排", "晚餐：巴黎市区自选"],
    activities: [
      { id: "d11-1", time: "上午", title: "凡尔赛宫革命观察点", place: "Château de Versailles", note: "依次寻找 Place d’Armes、Opéra Royal、Chambre de la Reine 左侧小门、Cour de Marbre", kind: "visit" },
      { id: "d11-2", time: "12:30后", title: "网球厅｜革命必看", place: "Salle du Jeu de Paume · 1 rue du Jeu de Paume", note: "从凡尔赛宫步行约10分钟；免费；按2026年公布安排周二开放至18:30，17:45停止入场", kind: "visit" },
      { id: "d11-3", time: "中午", title: "凡尔赛花园 / 午餐", place: "Versailles", note: "三级会议旧址 Hôtel des Menus-Plaisirs 只在时间和车辆安排允许时增加", kind: "meal" },
      { id: "d11-4", time: "下午", title: "凯旋门", place: "Arc de Triomphe", note: "革命动员被重新写成国家叙事", kind: "visit" },
      { id: "d11-5", time: "傍晚", title: "巴黎圣母院", place: "Notre-Dame", note: "中世纪城市与现代国家叠在一起", kind: "visit" },
    ],
    story: { title: "10月6日：王室离开凡尔赛的同一天", question: "法国的最高权力，怎样从国王身上转向了“国民”？", lead: "你在2026年10月6日来到凡尔赛；1789年的同一天，路易十六一家被迫离开这里，凡尔赛从此不再是法国君主的常住宫殿。", body: "今天先在军队广场看群众、军队与宫门相遇的空间，再进王宫寻找皇家歌剧院、王后卧室床龛左侧的小门和大理石庭院。离开宫殿后步行到网球厅，把时间拨回1789年6月20日：代表们宣誓在制定宪法前绝不解散。革命在凡尔赛最关键的变化，不是先砍掉一个国王，而是先提出一个新的政治问题——法国究竟属于国王，还是属于组成国家的人民？下午回到巴黎，凯旋门会让你看到革命释放出的群众动员如何被拿破仑重新集中为国家荣耀；巴黎圣母院则提醒我们，现代法国仍然叠在更古老的城市和宗教记忆上。", chapters: [{ label: "01", title: "五月：三级会议", text: "Hôtel des Menus-Plaisirs里，财政危机把三个等级召集到一起，也把“谁代表法国”变成公开冲突。" }, { label: "02", title: "六月：网球厅宣誓", text: "代表们不再只是向国王陈情，而以国民议会的名义要求制定宪法。" }, { label: "03", title: "十月：王室离开", text: "妇女进军凡尔赛后，王室被带往巴黎；政治中心也离开了王宫。" }, { label: "04", title: "革命之后的国家", text: "凯旋门把革命与战争动员写进帝国和民族国家的纪念体系。" }], prompt: "请把2026年10月6日的凡尔赛行程写成一段可以现场讲给老婆听的8分钟故事。必须使用中法双语地点名，并按现场顺序讲：Place d’Armes、Opéra Royal、Chambre de la Reine床龛左侧小门、Cour de Marbre、Salle du Jeu de Paume；Hôtel des Menus-Plaisirs只作为时间允许的补线。讲清1789年5月三级会议、6月20日网球厅宣誓、10月5—6日妇女进军和王室离开的因果关系。\n\n现场补充：" },
    source: "正式方案 PDF｜凡尔赛、凯旋门、巴黎圣母院；凡尔赛宫、凡尔赛市与旅游局官方资料补充革命现场",
  },
  {
    id: "day-12", number: "12", date: "10月7日", city: "巴黎", tag: "自由日", title: "把巴黎的缝隙补成自己的线",
    route: ["全天自由活动", "音乐打卡备选", "可选：先贤祠 / 革命记忆线"], transport: ["市内交通：当天决定", "可以在控制台加入具体餐厅、街区、拍照点和交通方式"], meals: ["午餐：当天路线附近自选", "晚餐：巴黎市区自选"],
    photoIdeas: ["已确认的邓紫棋巴黎打卡候选：Le Zénith Paris–La Villette，她曾在这里举行巴黎演出；适合做粉丝打卡，不必和历史景点硬塞在同一天。", "GEM 本人公开巴黎 Vlog 能看到街头、店铺和摩托车生活镜头，但没有公开店名或具体地址；可以复刻氛围，不要把粉丝猜测当成她的行程。", "演唱会期间的餐馆、麦当劳等目前只有小红书粉丝或商家线索，没有足够证据确认具体店址；网站已放进‘待核验’卡片。", "如果只想拍《Fly Away》同款，优先放回第 10 天，不建议第 12 天再重复卢浮宫和铁塔。"],
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
  const libraryFilters = ["全部", "罗马", "佛罗伦萨", "柏林", "巴黎", "机位 / 出片", "美食 / 餐厅", "伴手礼 / 购物", "邓紫棋 / 拍照"];
  const dailyReferenceOptions = useMemo(() => (dailyReferenceIds[activePlan.id] ?? []).map((id) => freeOptions.find((option) => option.id === id)).filter((option): option is FreeOption => Boolean(option)), [activePlan.id]);
  const dailyReferenceIdSet = useMemo(() => new Set(Object.values(dailyReferenceIds).flat()), []);
  const scheduledText = useMemo(() => Object.values(plans).map((plan) => [plan.route.join(" "), ...plan.activities.map((activity) => `${activity.title} ${activity.place}`)].join(" ")).join(" ").toLocaleLowerCase(), [plans]);
  const visibleFreeOptions = useMemo(() => freeOptions.filter((option) => {
    const alreadyScheduled = option.locationKeys?.some((key) => scheduledText.includes(key.toLocaleLowerCase())) ?? false;
    const matchesFilter = libraryFilter === "全部" || option.region === libraryFilter || option.category === libraryFilter;
    return matchesFilter && !alreadyScheduled && !dailyReferenceIdSet.has(option.id);
  }), [dailyReferenceIdSet, libraryFilter, scheduledText]);

  useEffect(() => {
    try {
      const currentStored = window.localStorage.getItem("eurotravel-plans-v4");
      const legacyStored = window.localStorage.getItem("eurotravel-plans-v3");
      if (currentStored) {
        window.setTimeout(() => setPlans({ ...initialPlans, ...JSON.parse(currentStored) }), 0);
      } else if (legacyStored) {
        window.setTimeout(() => {
          const legacyPlans = JSON.parse(legacyStored) as Record<string, DayPlan>;
          const migratedPlans = { ...initialPlans, ...legacyPlans, "day-05": initialPlans["day-05"] };
          window.localStorage.setItem("eurotravel-plans-v3-backup", legacyStored);
          window.localStorage.setItem("eurotravel-plans-v4", JSON.stringify(migratedPlans));
          setPlans(migratedPlans);
        }, 0);
      }
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
    window.localStorage.setItem("eurotravel-plans-v4", JSON.stringify(plans));
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
          {dailyReferenceOptions.length > 0 && <section className="daily-reference"><div className="daily-reference-head"><div><p className="eyebrow">TODAY&apos;S NEARBY NOTES / 跟着今天走</p><h4>今天沿线的机位、吃饭和伴手礼参考</h4><p>这些内容是根据今天正式要去的地方筛出来的，只做现场参考，不会自动变成正式停靠。想加入时再点“加入今天”。</p></div><span>正式行程优先</span></div><div className="daily-reference-grid">{dailyReferenceOptions.map((option) => <article className={`daily-reference-card ${option.category === "邓紫棋 / 拍照" ? "gem-option" : ""}`} key={option.id}><div className="library-card-top"><span>{option.region}</span><em>{option.category}</em></div><h5>{option.title}</h5><p className="library-places">导航：{option.places}</p><p className="daily-reference-story">{option.story}</p>{option.shotGuide && <div className="spot-guide">{option.shotGuide.map((spot, index) => <div className="spot-guide-item" key={spot.nav}><b>{String(index + 1).padStart(2, "0")}</b><div><strong>{spot.nav}</strong><span><i>站位</i>{spot.stand}</span><span><i>画面</i>{spot.frame}</span><span><i>时段</i>{spot.bestTime}</span></div></div>)}</div>}<div className="daily-reference-actions"><small>{option.timing}</small><button onClick={() => addFreeOption(option)}>加入今天 →</button></div>{option.sourceUrl && <small className="library-source"><a href={option.sourceUrl} target="_blank" rel="noreferrer">图片 / 路线参考 ↗</a></small>}</article>)}</div></section>}
          <div className="plan-layout"><div className="timeline-card"><div className="card-topline"><span>今日路线</span><small>{activePlan.activities.length} 个安排</small></div><div className="route-ribbon">{activePlan.route.map((stop, index) => <span key={`${stop}-${index}`}><i>{String(index + 1).padStart(2, "0")}</i>{stop}</span>)}</div><div className="timeline">{activePlan.activities.map((activity) => <div className={`timeline-item ${activity.kind}`} key={activity.id}><div className="timeline-time">{activity.time}</div><div className="timeline-dot" /><div className="timeline-content"><div><b>{activity.title}</b><span>{activity.place}</span></div><p>{activity.note}</p></div></div>)}</div></div><aside className="side-info"><div className="info-card transport-card"><span className="info-icon">↗</span><div><small>交通方式</small>{activePlan.transport.map((item) => <p key={item}>{item}</p>)}</div></div><div className="info-card meal-card"><span className="info-icon">◇</span><div><small>吃饭 / 休息</small>{activePlan.meals.map((item) => <p key={item}>{item}</p>)}</div></div>{activePlan.photoIdeas && <div className="info-card photo-card"><span className="info-icon">✦</span><div><small>拍照 / 打卡建议</small>{activePlan.photoIdeas.map((item) => <p key={item}>{item}</p>)}</div></div>}<div className="next-card"><small>今天的提醒</small><b>{activePlan.id === "day-03" ? "第三天固定是梵蒂冈" : activePlan.tag === "隐藏时段" ? "这是可以临场调整的时间" : "时间可以在现场控制台调整"}</b><button onClick={() => setActiveView("control")}>去调整今日安排 →</button></div></aside></div>
          {dayFieldGuides[activePlan.id] && (() => { const guide = dayFieldGuides[activePlan.id]; return <section className={`field-guide ${activePlan.id === "day-11" ? "revolution-guide" : "museum-guide"}`} aria-label={guide.title}><div className="field-guide-head"><div><p className="eyebrow">{guide.eyebrow}</p><h4>{guide.title}</h4><p>{guide.intro}</p></div><span>{guide.dateNote}</span></div><div className="field-route-note"><b>照着走</b><p>{guide.routeNote}</p></div><div className="field-stop-list">{guide.stops.map((stop) => <article className="field-stop" key={`${stop.number}-${stop.titleFr}`}><div className="field-stop-index"><span>{stop.number}</span><em>{stop.status}</em></div><div className="field-stop-content"><div className="field-stop-title"><h5>{stop.titleZh}</h5><strong>{stop.titleFr}</strong></div><p className="field-address"><b>位置 / Adresse</b>{stop.address}</p><div className="field-stop-details"><p><b>怎么到 / Accès</b>{stop.directions}</p><p><b>现场看什么 / À voir</b>{stop.onsite}</p><p><b>为什么重要 / Histoire</b>{stop.history}</p><p><b>开放提醒 / À savoir</b>{stop.practical}</p></div><div className="field-stop-actions">{stop.navigationUrl && <a className="primary-button" href={stop.navigationUrl} target="_blank" rel="noreferrer">打开地图导航 ↗</a>}<a className="secondary-button" href={stop.sourceUrl} target="_blank" rel="noreferrer">查看官方资料 ↗</a></div></div></article>)}</div></section>; })()}
          {activePlan.priorityReminder && <section className="priority-reminder" aria-label={activePlan.priorityReminder.label}><div className="priority-reminder-head"><span className="priority-mark">!</span><div><p className="eyebrow">{activePlan.priorityReminder.label}</p><h4>{activePlan.priorityReminder.title}</h4></div><strong>新增安排</strong></div><p className="priority-reminder-body">{activePlan.priorityReminder.body}</p><div className="priority-reminder-items">{activePlan.priorityReminder.items.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><b>{item}</b></div>)}</div></section>}
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
          <div className="library-grid">{visibleFreeOptions.map((option) => <article className={`library-card ${option.category === "邓紫棋 / 拍照" ? "gem-option" : ""}`} key={option.id}><div className="library-card-top"><span>{option.region}</span><em>{option.category}</em></div><h4>{option.title}</h4><p className="library-places">{option.places}</p><p>{option.story}</p><div className="library-card-bottom"><small>{option.timing}</small><button onClick={() => addFreeOption(option)}>加入第 {activePlan.number} 天 →</button></div><small className="library-source">{option.sourceUrl ? <a href={option.sourceUrl} target="_blank" rel="noreferrer">来源：{option.source} ↗</a> : option.source}</small></article>)}</div>
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
