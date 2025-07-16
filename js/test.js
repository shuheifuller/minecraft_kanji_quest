import {addScore,archiveTest,isArchived} from './app.js';

// URL ?id=1
const params = new URLSearchParams(location.search);
const id = params.get('id') || '1';

fetch('tests.json').then(r=>r.json()).then(data=>{
  const test = data.tests.find(t=>t.id===id);
  if(!test){document.body.innerHTML='<p>テストが見つかりません</p>';return;}

  // ヘッダー画像 & ストーリー
  document.getElementById('headerImg').src = `media/${test.image}`;
  document.getElementById('story').textContent = test.story;

  // 質問描画
  const qWrap = document.getElementById('questions');
  test.questions.forEach((q,idx)=>{
    const div=document.createElement('div');div.className='question';
    div.innerHTML=`<p>${idx+1}. ${q.q}</p>`;
    const ansDiv=document.createElement('div');ansDiv.className='answers';
    q.choices.forEach((c,i)=>{
      ansDiv.innerHTML+=`<label><input type="radio" name="q${idx}" value="${i===q.correct?1:0}"> ${c}</label>`;
    });
    div.appendChild(ansDiv);
    div.innerHTML+=`<div class="explanation">${q.explain}</div>`;
    qWrap.appendChild(div);
  });

  // 答え合わせ
  document.getElementById('checkBtn').addEventListener('click',()=>{
    let score=0;
    document.querySelectorAll('.question').forEach(q=>{
      const sel=q.querySelector('input[type=radio]:checked');
      const labels=q.querySelectorAll('label');
      const exp=q.querySelector('.explanation');
      labels.forEach(l=>l.classList.remove('correct','wrong'));
      if(sel){
        if(sel.value==='1'){score++;sel.parentElement.classList.add('correct');}
        else{
          sel.parentElement.classList.add('wrong');
          labels.forEach(l=>{if(l.querySelector('input').value==='1'){l.classList.add('correct');}});
        }
      }
      exp.style.display='block';
    });
    document.getElementById('result').textContent=`正解数：${score} / 10`;

    // スコア保存 & アーカイブ移動
    addScore({id,score,date:new Date().toLocaleString()});
    archiveTest(id);
    document.getElementById('checkBtn').disabled=true;
  });

  // 既にアーカイブならボタン無効
  if(isArchived(id)){
    document.getElementById('checkBtn').disabled=true;
  }
});
