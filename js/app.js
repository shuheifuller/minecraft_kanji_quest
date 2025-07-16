/*==================================================
   app.js  –  共通ユーティリティ & 永続ストレージ管理
==================================================*/

/* ---------- ストレージキー ---------- */
const KEY_SCORE   = 'mc_kanji_scores';   // 配列 [{id,score,date}, ...]
const KEY_ARCHIVE = 'mc_kanji_archive';  // 配列 ["1","2",...]

export function getScores() {
  return JSON.parse(localStorage.getItem(KEY_SCORE) || '[]');
}

export function addScore(rec) {
  const list = getScores();
  list.push(rec);
  localStorage.setItem(KEY_SCORE, JSON.stringify(list));
}

export function getArchive() {
  return JSON.parse(localStorage.getItem(KEY_ARCHIVE) || '[]');
}

export function archiveTest(id) {
  const arr = getArchive();
  if (!arr.includes(id)) {
    arr.push(id);
    localStorage.setItem(KEY_ARCHIVE, JSON.stringify(arr));
  }
}

export function undoArchive(id) {
  const arr = getArchive().filter(x => x !== id);
  localStorage.setItem(KEY_ARCHIVE, JSON.stringify(arr));
}

export function isArchived(id) {
  return getArchive().includes(id);
}

export function totalScore() {
  return getScores().reduce((sum, rec) => sum + rec.score, 0);
}

/*==================================================
   効果音 – クリック SE
   iOS Safari 対策：Audio インスタンスを 1 度だけ生成し、
   再生時に currentTime を 0 へ巻き戻して即再生する。
==================================================*/
const clickSE = new Audio('media/click.mp3');
clickSE.volume = 0.5;  // 必要に応じて調整

/** ボタン類で呼び出す関数。クリック音を確実に鳴らす */
export function playClick() {
  try {
    clickSE.currentTime = 0; // 巻き戻し
    clickSE.play();         // iOS 15+ でもユーザ操作内であれば再生可能
  } catch (e) {
    // まれに play() がブロックされる場合は無視
    console.warn('SE play blocked', e);
  }
}
