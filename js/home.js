/*----------------------------------------
  home.js  –  ホーム画面初期化 + スコアリセット
----------------------------------------*/
import { totalScore, playClick, audioCtx } from './app.js';

const SCORE_KEY = 'mc_kanji_scores';

document.addEventListener('DOMContentLoaded', () => {
  const totalScoreSpan = document.getElementById('totalScore');
  const resetBtn       = document.getElementById('resetScoreBtn');
  const msgBox         = document.getElementById('conversionMsg');

  /* 総得点を表示 */
  function refreshTotal(){
    totalScoreSpan.textContent = totalScore();
  }
  refreshTotal();

  /* すべての .btn にクリック SE */
  document.querySelectorAll('.btn').forEach(btn =>
    btn.addEventListener('click', playClick)
  );

  /* リセットボタン */
  resetBtn.addEventListener('click', () => {
    playClick();
    const current = totalScore();
    if(current === 0){
      showMessage('まだ 0 点だから へんかんするものが ないよ！');
      return;
    }

    // 1点 = 1分 換算（要件）
    const minutes = current; // 必要なら係数変更可 (例: current * 2)
    // スコア履歴を消去
    localStorage.removeItem(SCORE_KEY);
    refreshTotal();

    showMessage(`おめでとう！${current}点が${minutes}分に へんかんされたよ！`);
  });

  /* 初回ユーザ操作で AudioContext/BGM を resume */
  const container = document.querySelector('.home-menu');
  if (container) {
    container.addEventListener('click', () => {
      if (audioCtx.state === 'suspended') audioCtx.resume().catch(()=>{});
      const bgm = document.getElementById('bgm');
      if (bgm && bgm.paused) {
        bgm.play().catch(e => {
          console.warn('BGM play failed:', String(e).replace(/[\r\n]/g, ' '));
        });
      }
    }, { once:true });
  }

  /* メッセージ表示ユーティリティ */
  let msgTimer = null;
  function showMessage(text){
    msgBox.textContent = text;
    msgBox.classList.add('show');
    if(msgTimer) clearTimeout(msgTimer);
    msgTimer = setTimeout(()=>{
      msgBox.classList.remove('show');
    }, 5000);
  }
});
