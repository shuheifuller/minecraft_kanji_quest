import {getArchive,undoArchive} from './app.js';
document.addEventListener('DOMContentLoaded',()=>{
  const wrap=document.getElementById('archiveWrap');
  try {
    const fragment = document.createDocumentFragment();
    getArchive().forEach(id=>{
      const card=document.createElement('div');card.className='card';
      card.textContent = `テスト${id} `;
      const button = document.createElement('button');
      button.className = 'btn';
      button.style.width = 'auto';
      button.textContent = 'Undo';
      button.addEventListener('click',()=>{
        try {
          undoArchive(id);
          // Instead of location.reload(), update DOM dynamically
          card.remove();
        } catch(e) {
          console.error('Error undoing archive:', String(e).replace(/[\r\n]/g, ' '));
          // Fallback to reload on error
          location.reload();
        }
      });
      card.appendChild(button);
      fragment.appendChild(card);
    });
    wrap.appendChild(fragment);
  } catch(err) {
    const sanitizedError = String(err).replace(/[\r\n]/g, ' ').substring(0, 200);
    console.error('Error loading archive:', sanitizedError);
    wrap.innerHTML = '<p style="color:#ff6666;">アーカイブの読み込みに失敗しました</p>';
  }
});
