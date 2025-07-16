/*----------------------------------------
  home.js  –  ホーム画面用スクリプト
----------------------------------------*/
import { totalScore, playClick } from './app.js';

document.addEventListener('DOMContentLoaded', () => {
  /* 合計スコアを右上バッジへ表示 */
  document.getElementById('totalScore').textContent = totalScore();

  /* すべての .btn クリック時に SE 再生 */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', playClick);
  });
});
