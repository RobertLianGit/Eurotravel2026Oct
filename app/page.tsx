"use client";

import { useEffect, useMemo, useState } from "react";

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
    route: ["全天自由活动", "可选：古罗马补充", "可选：圣天使堡一线"], transport: ["市内交通：步行 / 地铁 / 打车按当天选择", "自由日不锁死路线"], meals: ["午餐：当天路线附近自选", "晚餐：罗马市区自选"],
    activities: [
      { id: "d6-1", time: "上午", title: "自由选择一条补充线", place: "罗马", note: "古罗马 / 教皇罗马 / 休息三选一", kind: "free" },
      { id: "d6-2", time: "中午", title: "午餐", place: "当天决定", note: "可以在控制台里加入餐厅", kind: "meal" },
      { id: "d6-3", time: "下午", title: "继续自由活动", place: "罗马", note: "按体力和预约调整", kind: "free" },
    ],
    story: { title: "自由日不是空白，是你的版本", question: "自由时间怎样把正式路线变成自己的旅行？", lead: "正式方案在这里留出全天自由活动。今天的重点不是完成更多景点，而是决定你想把哪条历史线补完整。", body: "你可以回看前几天：斗兽场代表皇帝如何管理人群，梵蒂冈代表帝国如何被教会继承，佛罗伦萨又把罗马遗产变成了城邦竞争。现在请你选择一个缺口：补古罗马公共空间，补圣天使堡和教皇罗马，或者只在街道里观察这些历史怎样继续生活在今天。自由日的价值，是让你不必服从别人替你排好的顺序。", chapters: [{ label: "01", title: "补古罗马", text: "把前一天的帝国城市线再补一段。" }, { label: "02", title: "补教皇罗马", text: "把梵蒂冈之后的城市记忆继续延伸。" }, { label: "03", title: "什么都不补", text: "休息、吃饭和观察，也可以成为旅行材料。" }], prompt: "我在罗马自由日有这些选择：____。请帮我根据前几天已经讲过的帝国、教会和文艺复兴，安排一条不重复、节奏合理的半日或一日路线，并写出当天可以讲的完整故事。\n\n现场补充：" },
    source: "正式方案 PDF｜罗马全天自由活动；自由行参考第二 sheet 作为补充库",
  },
  {
    id: "day-07", number: "07", date: "10月2日", city: "罗马 → 柏林", tag: "隐藏时段", title: "罗马最后上午，给教皇罗马收尾",
    route: ["圣彼得大教堂 / 可选", "机场", "抵达柏林"], transport: ["U25082｜15:10 罗马 → 17:20 柏林", "预计 12:00 左右从市区前往机场，按实际接送调整"], meals: ["早餐：酒店附近", "午餐：机场 / 路上"],
    activities: [
      { id: "d7-1", time: "07:00", title: "圣彼得大教堂 / 穹顶", place: "梵蒂冈（可选）", note: "把帝国、教会和文艺复兴连成尾声", kind: "visit" },
      { id: "d7-2", time: "10:30", title: "回酒店取行李", place: "罗马酒店", note: "为机场留足余量", kind: "move" },
      { id: "d7-3", time: "15:10", title: "飞往柏林", place: "FCO → BER", note: "转入德国章节", kind: "move" },
    ],
    story: { title: "离开罗马之前，从皇帝走到教皇", question: "为什么圣彼得大教堂适合做罗马章节的结尾？", lead: "真实航班是下午起飞，因此上午可以作为隐藏时段使用。它不是多塞一个景点，而是给罗马的主线收一个尾。", body: "前几天看见的是异教罗马、皇帝罗马和文艺复兴城市；现在站在圣彼得大教堂，可以把故事收成一句话：帝国消失了，但罗马的道路、建筑和普世权威被新的机构继续使用。然后带着这条线去柏林，看欧洲如何进入国家时代。", chapters: [{ label: "01", title: "回望斗兽场", text: "从皇帝组织人群的城市出发。" }, { label: "02", title: "站在圣彼得", text: "看教会如何接过罗马的普世想象。" }, { label: "03", title: "飞向柏林", text: "从帝国时代进入民族国家时代。" }], prompt: "请把罗马最后上午写成 2 分钟告别故事：要把斗兽场、梵蒂冈和即将抵达的柏林连接起来，适合我在去机场路上讲给老婆听。\n\n原稿：" },
    source: "正式方案 PDF｜罗马→柏林；机票安排补充 U25082 15:10",
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
    route: ["卢浮宫", "蒙马特", "香榭丽舍", "埃菲尔铁塔", "塞纳河"], transport: ["巴黎市内：地铁 / 步行 / 车辆，以正式方案为准", "点位较多：现场可调整顺序"], meals: ["午餐：卢浮宫或市中心附近", "晚餐：塞纳河 / 酒店附近自选"],
    activities: [
      { id: "d10-1", time: "上午", title: "卢浮宫", place: "Louvre", note: "王宫如何变成公共博物馆", kind: "visit" },
      { id: "d10-2", time: "中午", title: "午餐 / 转场", place: "巴黎市区", note: "根据排队和体力调整", kind: "meal" },
      { id: "d10-3", time: "下午", title: "蒙马特 → 香榭丽舍", place: "Paris", note: "城市生活与国家大道", kind: "visit" },
      { id: "d10-4", time: "傍晚", title: "埃菲尔铁塔 / 塞纳河", place: "Eiffel Tower / Seine", note: "工业现代性收束今天", kind: "visit" },
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
    route: ["全天自由活动", "可选：先贤祠", "可选：荣军院 / 协和广场 / 巴士底广场"], transport: ["市内交通：当天决定", "可以在控制台加入具体餐厅、街区和交通方式"], meals: ["午餐：当天路线附近自选", "晚餐：巴黎市区自选"],
    activities: [
      { id: "d12-1", time: "上午", title: "选择一条补充线", place: "巴黎", note: "先贤祠 / 荣军院 / 协和广场 / 巴士底广场", kind: "free" },
      { id: "d12-2", time: "中午", title: "午餐", place: "当天决定", note: "可以加入你想去的餐厅", kind: "meal" },
      { id: "d12-3", time: "下午", title: "自由活动 / 购物 / 补景点", place: "巴黎", note: "根据体力和兴趣调整", kind: "free" },
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

type View = "plan" | "story" | "control";

export default function Home() {
  const [activeDayId, setActiveDayId] = useState("day-03");
  const [activeView, setActiveView] = useState<View>("plan");
  const [plans, setPlans] = useState<Record<string, DayPlan>>(initialPlans);
  const [storyDraft, setStoryDraft] = useState("");
  const [newActivity, setNewActivity] = useState("");
  const [toast, setToast] = useState("");

  const activePlan = plans[activeDayId] ?? initialPlans["day-03"];

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
          {(Object.keys(viewCopy) as View[]).map((view) => <button key={view} className={activeView === view ? "active" : ""} onClick={() => setActiveView(view)}><span className={`tab-icon ${view}`}>{view === "plan" ? "⌂" : view === "story" ? "✦" : "↻"}</span><span><b>{viewCopy[view].label}</b><small>{viewCopy[view].hint}</small></span></button>)}
        </nav>

        {activeView === "plan" && <section className="module plan-module">
          <div className="module-title"><div><p className="eyebrow">SHARED VIEW / 给两个人</p><h3>今天要去哪？</h3><p>这张是你和老婆共同看的版本。它只放具体安排：时间、地点、交通、吃饭，以及现场已经调整过的内容。</p></div><span className="shared-badge">✓ 两个人都看这张</span></div>
          <div className="plan-layout"><div className="timeline-card"><div className="card-topline"><span>今日路线</span><small>{activePlan.activities.length} 个安排</small></div><div className="route-ribbon">{activePlan.route.map((stop, index) => <span key={`${stop}-${index}`}><i>{String(index + 1).padStart(2, "0")}</i>{stop}</span>)}</div><div className="timeline">{activePlan.activities.map((activity) => <div className={`timeline-item ${activity.kind}`} key={activity.id}><div className="timeline-time">{activity.time}</div><div className="timeline-dot" /><div className="timeline-content"><div><b>{activity.title}</b><span>{activity.place}</span></div><p>{activity.note}</p></div></div>)}</div></div><aside className="side-info"><div className="info-card transport-card"><span className="info-icon">↗</span><div><small>交通方式</small>{activePlan.transport.map((item) => <p key={item}>{item}</p>)}</div></div><div className="info-card meal-card"><span className="info-icon">◇</span><div><small>吃饭 / 休息</small>{activePlan.meals.map((item) => <p key={item}>{item}</p>)}</div></div><div className="next-card"><small>今天的提醒</small><b>{activePlan.id === "day-03" ? "第三天固定是梵蒂冈" : activePlan.tag === "隐藏时段" ? "这是可以临场调整的时间" : "时间可以在现场控制台调整"}</b><button onClick={() => setActiveView("control")}>去调整今日安排 →</button></div></aside></div>
        </section>}

        {activeView === "story" && <section className="module story-module">
          <div className="module-title story-title"><div><p className="eyebrow">YOUR STORY / 给你讲</p><h3>{activePlan.story.title}</h3><p>{activePlan.story.question}</p></div><span className="story-length">完整故事<br /><b>{activePlan.story.chapters.length} 幕</b></span></div>
          <div className="story-lead"><span className="quote-mark">“</span><p>{activePlan.story.lead}</p></div>
          <div className="story-body"><div className="story-text"><p>{activePlan.story.body}</p><div className="chapter-list">{activePlan.story.chapters.map((chapter) => <article className="chapter" key={chapter.label}><span>{chapter.label}</span><div><h4>{chapter.title}</h4><p>{chapter.text}</p></div></article>)}</div></div><aside className="prompt-panel"><div className="prompt-panel-top"><span>口播提示词</span><small>可编辑 · 可发给 ChatGPT</small></div><textarea value={storyDraft} onChange={(event) => setStoryDraft(event.target.value)} aria-label={`${activePlan.date}完整故事提示词`} /><div className="prompt-actions"><button className="primary-button" onClick={copyStoryPrompt}>复制完整提示词 <span>↗</span></button><button className="secondary-button" onClick={() => setStoryDraft(activePlan.story.prompt)}>恢复本日版本</button></div><p className="prompt-tip">建议：先在现场改“我要讲的重点”和“眼前看到的细节”，再复制给 ChatGPT。</p></aside></div>
        </section>}

        {activeView === "control" && <section className="module control-module">
          <div className="module-title"><div><p className="eyebrow">FIELD CONSOLE / 只给你</p><h3>现场调整，反写回今日行程。</h3><p>你可以增加景点、改时间、调顺序、加入餐厅和交通。保存以后，回到“今日行程”，你和老婆看到的就是这一版。</p></div><div className="console-actions"><button className="secondary-button" onClick={resetPlan}>恢复正式方案</button><button className="primary-button" onClick={savePlan}>保存并同步 →</button></div></div>
          <div className="control-grid"><div className="editor-card"><div className="editor-head"><span>今日安排顺序</span><small>拖动感暂用上下箭头</small></div><div className="editable-list">{activePlan.activities.map((activity, index) => <div className="editable-item" key={activity.id}><div className="move-buttons"><button onClick={() => moveActivity(index, -1)} aria-label="上移">↑</button><button onClick={() => moveActivity(index, 1)} aria-label="下移">↓</button></div><input className="time-input" value={activity.time} onChange={(event) => updateActivity(activity.id, "time", event.target.value)} aria-label="时间" /><div className="editable-fields"><input value={activity.title} onChange={(event) => updateActivity(activity.id, "title", event.target.value)} aria-label="安排标题" /><input value={activity.place} onChange={(event) => updateActivity(activity.id, "place", event.target.value)} aria-label="地点" /><input value={activity.note} onChange={(event) => updateActivity(activity.id, "note", event.target.value)} aria-label="备注" /></div><button className="delete-button" onClick={() => removeActivity(activity.id)} aria-label="删除安排">×</button></div>)}</div><div className="add-row"><input value={newActivity} onChange={(event) => setNewActivity(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addActivity(); }} placeholder="加入一个地点、餐厅或临时安排" /><button onClick={addActivity}>＋ 加入</button></div></div><aside className="console-side"><div className="editor-card mini-editor"><div className="editor-head"><span>交通方式</span><small>每行一条</small></div><textarea value={activePlan.transport.join("\n")} onChange={(event) => updatePlan((plan) => ({ ...plan, transport: event.target.value.split("\n") }))} aria-label="交通方式" /></div><div className="editor-card mini-editor"><div className="editor-head"><span>吃饭 / 休息</span><small>每行一条</small></div><textarea value={activePlan.meals.join("\n")} onChange={(event) => updatePlan((plan) => ({ ...plan, meals: event.target.value.split("\n") }))} aria-label="吃饭和休息" /></div><div className="sync-note"><span>↻</span><p><b>反写逻辑</b>保存后，今日行程模块会立即读取这份调整；故事模块仍然保留你今天要讲的完整故事。</p></div></aside></div>
        </section>}
      </section>

      <section className="mobile-howto section-shell"><p className="eyebrow">HOW TO USE ON THE ROAD</p><div><b>先给老婆看“今日行程”</b><span>再切到“今日故事”自己讲</span><span>现场有变化，就进“控制台”调整并保存</span></div></section>
      <footer className="app-footer"><div><span className="brand-seal">EH</span><b>欧洲历史旅行手册</b></div><span>v.02 / ROME-FIRST / MOBILE</span></footer>
      <nav className="mobile-nav" aria-label="底部模块导航">{(Object.keys(viewCopy) as View[]).map((view) => <button key={view} className={activeView === view ? "active" : ""} onClick={() => setActiveView(view)}><span>{view === "plan" ? "⌂" : view === "story" ? "✦" : "↻"}</span>{viewCopy[view].label}</button>)}</nav>
      {toast && <div className="toast" role="status">{toast}<span>✓</span></div>}
    </main>
  );
}
