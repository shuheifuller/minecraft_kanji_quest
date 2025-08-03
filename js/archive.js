import {getArchive,undoArchive} from './app.js';
document.addEventListener('DOMContentLoaded',()=>{
  const wrap=document.getElementById('archiveWrap');
  try {
    getArchive().forEach(id=>{
      const card=document.createElement('div');card.className='card';
      card.textContent = `テスト${id} `;
      const button = document.createElement('button');
      button.className = 'btn';
      button.style.width = 'auto';
      button.textContent = 'Undo';
      button.addEventListener('click',()=>{
        undoArchive(id);location.reload();
      });
      card.appendChild(button);
      wrap.appendChild(card);
    });
  } catch(err) {
    console.error('Error loading archive:', err);
  }
});
