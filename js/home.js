/*----------------------------------------
  home.js  –  ホーム画面初期化
----------------------------------------*/
import { totalScore, playClick, audioCtx } from './app.js';

document.addEventListener('DOMContentLoaded', () => {
  /* 総得点を表示 */
  document.getElementById('totalScore').textContent = totalScore();

  /* すべての .btn にクリック SE を付与 */
  document.querySelectorAll('.btn').forEach(btn =>
    btn.addEventListener('click', playClick)
  );

  /* 初回ユーザ操作で AudioContext/BGM を resume */
  document.addEventListener('click', () => {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const bgm = document.getElementById('bgm');
    if (bgm && bgm.paused) bgm.play().catch(()=>{});
  }, { once:true });
});
