/* 全ページ共通：画面に入ったものを「パン、パン、パン」と順に出す（木下 10-05「体験をよくするために全体モーションを」）
   ⭐ 隠すクラスは JS が付ける＝JS が動かないときは全部そのまま見える
   ⭐ 入れ子は外側だけ動かす（カードとその中の文字が二重に動かない）
   ⚠️ .float（ふわふわ浮く物）には触らない＝外側の箱ごと出す
   ⚠️ 動きを減らす設定の人には何もしない */
(function(){
  if(!('IntersectionObserver' in window)) return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var SEL = [
    'main .crumb', 'main .tag', 'main .kicker', 'main h1', 'main h2', 'main h3',
    'main .lead', 'main .sec-sub', 'main .cta', 'main .hero-ill', 'main .visual', 'main .stage',
    'main .frame > li', 'main .works > figure', 'main .wk-grid > *', 'main .face-in > *', 'main .face figure',
    'main table', 'main li', 'main figure', 'main p', 'main .btn'
  ].join(',');
  var els = [];
  document.querySelectorAll(SEL).forEach(function(el){
    if(el.closest('.rv')) return;                 // 外側がもう動く
    if(el.closest('.float') || el.classList.contains('float')) return;
    if(el.closest('details')) return;             // 閉じた「よくある質問」の中は、開いたときにすぐ見えるように触らない
    if(getComputedStyle(el).position === 'fixed') return;
    el.classList.add('rv');
    els.push(el);
  });
  var io = new IntersectionObserver(function(entries){
    // 同じときに入ってきた物を、上から・左から順に少しずつずらして出す
    var batch = entries.filter(function(e){ return e.isIntersecting; }).map(function(e){ return e.target; });
    batch.sort(function(a, b){
      var ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      return (ra.top - rb.top) || (ra.left - rb.left);
    });
    batch.forEach(function(el, i){
      el.style.setProperty('--rv-d', Math.min(i * 90, 720) + 'ms');
      el.classList.add('in');
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0 });
  els.forEach(function(el){ io.observe(el); });
  // 作品一覧のように後から足される物は、そのまま見せる（隠したままにしない）
})();
