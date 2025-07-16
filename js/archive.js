import {getArchive,undoArchive} from './app.js';
document.addEventListener('DOMContentLoaded',()=>{
  const wrap=document.getElementById('archiveWrap');
  getArchive().forEach(id=>{
    const card=document.createElement('div');card.className='card';
    card.innerHTML=`テスト${id} <button class="btn" style="width:auto">Undo</button>`;
    card.querySelector('button').addEventListener('click',()=>{
      undoArchive(id);location.reload();
    });
    wrap.appendChild(card);
  });
});
