/* -------------------------------
   ストレージキー
--------------------------------*/
const KEY_SCORE   = 'mc_kanji_scores';   // {id,score,date}
const KEY_ARCHIVE = 'mc_kanji_archive';  // [id,...]

export function getScores(){
  return JSON.parse(localStorage.getItem(KEY_SCORE) || '[]');
}
export function addScore(rec){
  const list = getScores();
  list.push(rec);
  localStorage.setItem(KEY_SCORE, JSON.stringify(list));
}
export function getArchive(){
  return JSON.parse(localStorage.getItem(KEY_ARCHIVE) || '[]');
}
export function archiveTest(id){
  const arr = getArchive();
  if(!arr.includes(id)){arr.push(id);localStorage.setItem(KEY_ARCHIVE,JSON.stringify(arr));}
}
export function undoArchive(id){
  const arr = getArchive().filter(x=>x!==id);
  localStorage.setItem(KEY_ARCHIVE,JSON.stringify(arr));
}
export function isArchived(id){return getArchive().includes(id);}
export function totalScore(){
  return getScores().reduce((a,b)=>a+b.score,0);
}

/* 効果音 */
export function playClick(){
  const audio = new Audio('media/click.mp3');
  audio.volume = .5;
  audio.play();
}
