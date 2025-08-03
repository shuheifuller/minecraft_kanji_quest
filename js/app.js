/*==============================================================
  app.js  –  共通ユーティリティ / 永続データ管理 / 効果音
  --------------------------------------------------------------
  機能一覧
    - スコア保存・取得
    - アーカイブ保存・復元
    - 合計スコア計算
    - 最初の未完了テストID取得 (firstPendingId)
    - クリック効果音（Web Audio / 低レイテンシ）
  依存:
    - ブラウザ (localStorage, AudioContext)
    - media/click.mp3  … 効果音ファイル
==============================================================*/

/* ---------- ストレージキー ---------- */
export const KEY_SCORE   = 'mc_kanji_scores';   // 配列: [{ id, score, date }, ...]
export const KEY_ARCHIVE = 'mc_kanji_archive';  // 配列: ["1","2",...]

/* ---------- スコア関連 ---------- */
/** 全スコア取得 */
export const getScores = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY_SCORE) || '[]');
  } catch(e) {
    console.error('Error parsing scores:', e);
    return [];
  }
};

/** スコア追加 */
export const addScore = record => {
  const list = getScores();
  list.push(record);
  localStorage.setItem(KEY_SCORE, JSON.stringify(list));
};

/* ---------- アーカイブ関連 ---------- */
/** アーカイブ配列取得 */
export const getArchive = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY_ARCHIVE) || '[]');
  } catch(e) {
    console.error('Error parsing archive:', e);
    return [];
  }
};

/** テストIDをアーカイブへ追加（重複回避） */
export const archiveTest = id => {
  const arr = getArchive();
  const sid = String(id);
  if (!arr.includes(sid)) {
    arr.push(sid);
    localStorage.setItem(KEY_ARCHIVE, JSON.stringify(arr));
  }
};

/** アーカイブ解除 */
export const undoArchive = id => {
  const sid = String(id);
  const arr = getArchive().filter(x => x !== sid);
  localStorage.setItem(KEY_ARCHIVE, JSON.stringify(arr));
};

/** 指定IDがアーカイブ済みか */
export const isArchived = id => getArchive().includes(String(id));

/* ---------- 集計 ---------- */
/** 合計スコア（全テストの score 合計） */
export const totalScore = () =>
  getScores().reduce((sum, r) => sum + (r.score || 0), 0);

/* ---------- 進行制御 ---------- */
/**
 * 最初の未完了テストIDを返す。
 * @param {Array<{id:string|number}>} allTests - tests.json の tests 配列
 * @returns {string|null}
 */
export function firstPendingId(allTests) {
  if (!Array.isArray(allTests)) return null;
  const archived = new Set(getArchive().map(String));
  // id を数値ソート（非数値は末尾扱い）
  const sorted = [...allTests].sort((a, b) => {
    const ai = parseInt(a.id, 10);
    const bi = parseInt(b.id, 10);
    if (isNaN(ai) && isNaN(bi)) return 0;
    if (isNaN(ai)) return 1;
    if (isNaN(bi)) return -1;
    return ai - bi;
  });
  const pending = sorted.find(t => !archived.has(String(t.id)));
  return pending ? String(pending.id) : null;
}

/*==============================================================
  効果音（クリックSE） – Web Audio API 低レイテンシ実装
  --------------------------------------------------------------
  ポイント:
    - AudioContext を 1 度生成
    - click.mp3 を ArrayBuffer → AudioBuffer にデコード
    - 再生ごとに BufferSource を新規生成 (重複再生可)
    - iOS 初回タップで resume
==============================================================*/
export const audioCtx =
  new (window.AudioContext || window.webkitAudioContext)();

let clickBuffer = null;
let clickLoadError = false;

/* 効果音プリロード */
const loadClickSound = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch('media/click.mp3', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const buffer = await response.arrayBuffer();
    clickBuffer = await audioCtx.decodeAudioData(buffer);
  } catch (err) {
    console.error('click.mp3 load error:', String(err).replace(/[\r\n]/g, ' '));
    clickLoadError = true;
  }
};
loadClickSound();

/**
 * クリック効果音を再生
 * 読み込み前・失敗時は何もしない（例外は出さない）
 */
export function playClick() {
  if (clickLoadError || !clickBuffer) return;
  if (audioCtx.state === 'suspended') {
    // ユーザ操作イベント内なら resume 可能
    audioCtx.resume().catch(()=>{});
  }
  try {
    const src = audioCtx.createBufferSource();
    src.buffer = clickBuffer;
    src.connect(audioCtx.destination);
    src.start(0);
  } catch (e) {
    // 再生失敗は致命的ではないのでログのみ
    console.warn('SE play failed:', e);
  }
}

/*==============================================================
  オプション: ユーティリティ（必要に応じて今後拡張）
==============================================================*/
/**
 * 指定テストIDのスコア履歴を取得（なければ空配列）
 * @param {string|number} id
 * @returns {Array<{id:string,score:number,date:string}>}
 */
export function getScoreHistory(id) {
  const sid = String(id);
  return getScores().filter(r => String(r.id) === sid);
}

/**
 * デバッグ用: 全データをクリア（本番運用では呼ばない）
 * localStorage.removeItem(KEY_SCORE); localStorage.removeItem(KEY_ARCHIVE);
 */
export function _debugClearAll() {
  localStorage.removeItem(KEY_SCORE);
  localStorage.removeItem(KEY_ARCHIVE);
}
