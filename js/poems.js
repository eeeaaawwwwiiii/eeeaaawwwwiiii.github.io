/* 点击诗句特效 —— 李清照 / 辛弃疾 / 李白 / 李煜
 * 想加诗句：往 POEMS 数组里加一行字符串即可（记得用英文引号包住）。
 */
(function () {
  // 移动端不启用（避免滑动时误触）
  if (/Android|webOS|iPhone|iPod|iPad|BlackBerry|Mobile/i.test(navigator.userAgent)) return;

  var POEMS = [
    // —— 李清照 ——
    "知否，知否？应是绿肥红瘦",
    "莫道不销魂，帘卷西风，人比黄花瘦",
    "花自飘零水自流",
    "此情无计可消除，才下眉头，却上心头",
    "生当作人杰，死亦为鬼雄",
    "物是人非事事休，欲语泪先流",
    "只恐双溪舴艋舟，载不动许多愁",
    "寻寻觅觅，冷冷清清，凄凄惨惨戚戚",
    // —— 辛弃疾 ——
    "醉里挑灯看剑，梦回吹角连营",
    "众里寻他千百度",
    "那人却在，灯火阑珊处",
    "了却君王天下事，赢得生前身后名",
    "我见青山多妩媚，料青山见我应如是",
    "稻花香里说丰年，听取蛙声一片",
    "欲说还休，却道天凉好个秋",
    "青山遮不住，毕竟东流去",
    // —— 李白 ——
    "天生我材必有用，千金散尽还复来",
    "长风破浪会有时，直挂云帆济沧海",
    "举杯邀明月，对影成三人",
    "飞流直下三千尺，疑是银河落九天",
    "仰天大笑出门去，我辈岂是蓬蒿人",
    "十步杀一人，千里不留行",
    "抽刀断水水更流，举杯销愁愁更愁",
    "大鹏一日同风起，扶摇直上九万里",
    // —— 李煜 ——
    "问君能有几多愁？恰似一江春水向东流",
    "春花秋月何时了，往事知多少",
    "剪不断，理还乱，是离愁",
    "无言独上西楼，月如钩",
    "梦里不知身是客，一晌贪欢",
    "流水落花春去也，天上人间",
    "林花谢了春红，太匆匆",
    "自是人生长恨水长东"
  ];

  var last = -1;

  document.addEventListener("click", function (ev) {
    if (ev.button !== 0) return; // 只响应鼠标左键

    // 随机取一句，尽量不和上次重复
    var pick;
    do {
      pick = Math.floor(Math.random() * POEMS.length);
    } while (pick === last && POEMS.length > 1);
    last = pick;

    var el = document.createElement("span");
    el.className = "click-poem";
    el.textContent = POEMS[pick];

    // 先挂到页面量宽度，再修正位置（防止超出屏幕右边）
    el.style.visibility = "hidden";
    document.body.appendChild(el);
    var w = el.offsetWidth;
    var docW = document.documentElement.clientWidth;
    var left = Math.min(Math.max(ev.pageX - w / 2, 12), docW - w - 12);
    el.style.left = left + "px";
    el.style.top = (ev.pageY - 28) + "px";
    el.style.visibility = "visible";

    // 900ms 上浮渐隐后移除
    var t0 = performance.now();
    (function anim(t) {
      var p = (t - t0) / 900;
      if (p < 1) {
        el.style.transform = "translateY(" + (-26 * p) + "px)";
        el.style.opacity = 1 - p;
        requestAnimationFrame(anim);
      } else {
        el.remove();
      }
    })(performance.now());
  });
})();
