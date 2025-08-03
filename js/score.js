import {getScores} from './app.js';
document.addEventListener('DOMContentLoaded',()=>{
  const tbody=document.getElementById('scoreBody');
  const fragment = document.createDocumentFragment();
  getScores().slice(-50).reverse().forEach(rec=>{
    const tr=document.createElement('tr');
    const td1 = document.createElement('td');
    td1.textContent = rec.id;
    const td2 = document.createElement('td');
    td2.textContent = rec.score;
    const td3 = document.createElement('td');
    td3.textContent = rec.date;
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    fragment.appendChild(tr);
  });
  tbody.appendChild(fragment);
});
