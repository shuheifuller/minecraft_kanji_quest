/* ---------- 効果音 (クリックSE) ---------- */
const clickSE = new Audio('media/click.mp3');
clickSE.volume = 0.5;

/** クリック音を確実に鳴らす */
export function playClick() {
  try {
    clickSE.currentTime = 0;   // 巻き戻し
    clickSE.play();            // iOS 15+ OK (ユーザ操作内)
  } catch(e){
    /* まれに play() が失敗した場合は無視 */
    console.warn('SE play blocked', e);
  }
}
