/* 点击诗句特效 v2 —— 李清照 / 辛弃疾 / 李白 / 李煜
 * 效果：诗句随机大小 / 角度 / 摆动方向弹性弹出；点击处伴随绿色微烟花（火花 + 光圈）。
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

  var rand = function (a, b) { return a + Math.random() * (b - a); };
  var last = -1;

  /* —— 微烟花：一圈绿火花 + 一个扩散光圈 —— */
  function spawnSparks(x, y) {
    var ring = document.createElement("span");
    ring.className = "click-spark";
    ring.style.cssText =
      "left:" + x + "px;top:" + y + "px;width:14px;height:14px;" +
      "margin:-7px 0 0 -7px;border:2px solid rgba(122,197,85,.9);" +
      "background:transparent;box-sizing:border-box;";
    document.body.appendChild(ring);
    ring.animate(
      [
        { transform: "scale(.4)", opacity: 0.9 },
        { transform: "scale(2.6)", opacity: 0 }
      ],
      { duration: 420, easing: "ease-out" }
    ).onfinish = function () { ring.remove(); };

    var n = 12;
    for (var i = 0; i < n; i++) {
      var s = document.createElement("span");
      s.className = "click-spark";
      var size = rand(3, 5.5);
      var bright = Math.random() < 0.72;
      s.style.cssText =
        "left:" + x + "px;top:" + y + "px;width:" + size + "px;height:" + size + "px;" +
        "margin:" + (-size / 2) + "px 0 0 " + (-size / 2) + "px;background:" +
        (bright ? "#9ade74" : "#6fce4b") + ";box-shadow:0 0 6px " +
        (bright ? "rgba(154,222,116,.9)" : "rgba(111,206,75,.9)") + ";";
      document.body.appendChild(s);

      var ang = rand(0, Math.PI * 2);
      var dist = rand(26, 68);
      var dx = Math.cos(ang) * dist;
      var dy = Math.sin(ang) * dist * 0.72 - rand(6, 16); // 略微向上抛

      s.animate(
        [
          { transform: "translate(0,0) scale(1)", opacity: 1, offset: 0, easing: "cubic-bezier(.2,.8,.4,1)" },
          { transform: "translate(" + (dx * 0.82).toFixed(1) + "px," + (dy * 0.82).toFixed(1) + "px) scale(.95)", opacity: 0.9, offset: 0.6, easing: "ease-in" },
          { transform: "translate(" + dx.toFixed(1) + "px," + (dy + 26).toFixed(1) + "px) scale(.35)", opacity: 0, offset: 1 }
        ],
        { duration: rand(650, 950) }
      ).onfinish = function () { s.remove(); };
    }
  }

  /* —— 诗句：随机大小 / 倾斜 / 摆动，弹性弹出后上浮渐隐 —— */
  function spawnPoem(x, y) {
    var pick;
    do { pick = Math.floor(Math.random() * POEMS.length); } while (pick === last && POEMS.length > 1);
    last = pick;

    var el = document.createElement("span");
    el.className = "click-poem";
    el.textContent = POEMS[pick];
    el.style.fontSize = rand(17.5, 21).toFixed(1) + "px";
    el.style.visibility = "hidden";
    document.body.appendChild(el);

    var w = el.offsetWidth;
    var docW = document.documentElement.clientWidth;
    var left = Math.min(Math.max(x - w / 2, 12), docW - w - 12);
    el.style.left = left + "px";
    el.style.top = (y - 30) + "px";
    el.style.visibility = "visible";

    var sway = (Math.random() < 0.5 ? -1 : 1) * rand(8, 26);   // 随机左右摆
    var r0 = rand(-7, 7);                                        // 初始倾斜角
    var r1 = r0 + rand(-8, 8);                                   // 收尾倾斜角
    var rise = rand(30, 48);                                     // 上浮高度

    el.animate(
      [
        { transform: "translate(0,4px) scale(.55) rotate(" + r0.toFixed(1) + "deg)", opacity: 0, offset: 0, easing: "cubic-bezier(.34,1.56,.64,1)" },
        { transform: "translate(0,-6px) scale(1.08) rotate(" + (r0 * 0.6).toFixed(1) + "deg)", opacity: 1, offset: 0.22, easing: "ease-out" },
        { transform: "translate(" + (sway * 0.55).toFixed(1) + "px," + (-rise * 0.55).toFixed(1) + "px) scale(1) rotate(" + (r1 * 0.6).toFixed(1) + "deg)", opacity: 0.95, offset: 0.62, easing: "ease-in-out" },
        { transform: "translate(" + sway.toFixed(1) + "px," + (-rise).toFixed(1) + "px) scale(.92) rotate(" + r1.toFixed(1) + "deg)", opacity: 0, offset: 1 }
      ],
      { duration: rand(1150, 1450) }
    ).onfinish = function () { el.remove(); };
  }

  document.addEventListener("click", function (ev) {
    if (ev.button !== 0) return; // 只响应鼠标左键
    spawnSparks(ev.pageX, ev.pageY);
    spawnPoem(ev.pageX, ev.pageY);
  });
})();
