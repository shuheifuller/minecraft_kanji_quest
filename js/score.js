import {getScores} from './app.js';
document.addEventListener('DOMContentLoaded',()=>{
  const tbody=document.getElementById('scoreBody');
  getScores().slice(-50).reverse().forEach(rec=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${rec.id}</td><td>${rec.score}</td><td>${rec.date}</td>`;
    tbody.appendChild(tr);
  });
});
