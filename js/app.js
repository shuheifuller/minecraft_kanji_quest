/*==================================================
   app.js  –  共通ユーティリティ & ストレージ管理
==================================================*/
export const KEY_SCORE   = 'mc_kanji_scores';
export const KEY_ARCHIVE = 'mc_kanji_archive';

/* ---------- ストレージ ---------- */
export const getScores   = () => JSON.parse(localStorage.getItem(KEY_SCORE)   || '[]');
export const getArchive  = () => JSON.parse(localStorage.getItem(KEY_ARCHIVE) || '[]');
export const addScore    = r => { const s=getScores(); s.push(r); localStorage.setItem(KEY_SCORE,JSON.stringify(s)); };
export const archiveTest = id=>{ const a=getArchive(); if(!a.includes(id)){a.push(id);localStorage.setItem(KEY_ARCHIVE,JSON.stringify(a));}};
export const undoArchive = id=>{ const a=getArchive().filter(x=>x!==id); localStorage.setItem(KEY_ARCHIVE,JSON.stringify(a));};
export const isArchived  = id=> getArchive().includes(id);
export const totalScore  = () => getScores().reduce((t,r)=>t+r.score,0);

/*==================================================
   効果音 (click.mp3) – 低レイテンシ版
==================================================*/
export const audioCtx = new (window.AudioContext||window.webkitAudioContext)();
let clickBuffer = null;

/* クリック SE をプリロードして AudioBuffer に保持 */
fetch('media/click.mp3')
  .then(r => r.arrayBuffer())
  .then(buf => audioCtx.decodeAudioData(buf))
  .then(decoded => { clickBuffer = decoded; })
  .catch(err   => console.error('click.mp3 load error', err));

/** ボタン用：AudioContext が resume されていなければ resume→再生 */
export function playClick() {
  if (!clickBuffer) return;               // まだロード中
  if (audioCtx.state === 'suspended') {   // iOS 初回タップ対策
    audioCtx.resume();
  }
  const src = audioCtx.createBufferSource();
  src.buffer = clickBuffer;
  src.connect(audioCtx.destination);
  src.start(0);                           // 即時発音
}
