import {totalScore, playClick} from './app.js';

document.addEventListener('DOMContentLoaded',()=>{
  // 合計スコア表示
  document.getElementById('totalScore').textContent = totalScore();

  // すべてのボタンでクリック音
  document.querySelectorAll('.btn').forEach(btn=>{
    btn.addEventListener('click',playClick);
  });
});
