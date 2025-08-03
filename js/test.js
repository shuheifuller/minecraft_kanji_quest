import {addScore,archiveTest,isArchived} from './app.js';

// URL ?id=1
const params = new URLSearchParams(location.search);
const id = params.get('id') || '1';

const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 10000);

fetch('tests.json', { signal: controller.signal }).then(r=>{
  clearTimeout(timeoutId);
  if(!r.ok) throw new Error('Failed to load tests');
  return r.json();
}).then(data=>{
  const test = data.tests.find(t=>t.id===id);
  if(!test){
    const p = document.createElement('p');
    p.textContent = 'テストが見つかりません';
    document.body.appendChild(p);
    return;
  }

  // ヘッダー画像 & ストーリー
  document.getElementById('headerImg').src = `media/${test.image}`;
  document.getElementById('story').textContent = test.story;

  // 質問描画
  const qWrap = document.getElementById('questions');
  test.questions.forEach((q,idx)=>{
    const div=document.createElement('div');div.className='question';
    const p = document.createElement('p');
    p.textContent = `${idx+1}. ${q.q}`;
    div.appendChild(p);
    const ansDiv=document.createElement('div');ansDiv.className='answers';
    q.choices.forEach((c,i)=>{
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = `q${idx}`;
      input.value = i===q.correct?1:0;
      label.appendChild(input);
      label.appendChild(document.createTextNode(' ' + c));
      ansDiv.appendChild(label);
    });
    div.appendChild(ansDiv);
    const expDiv = document.createElement('div');
    expDiv.className = 'explanation';
    expDiv.textContent = q.explain;
    div.appendChild(expDiv);
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
    try {
      addScore({id,score,date:new Date().toLocaleString()});
      archiveTest(id);
    } catch(e) {
      console.error('Error saving score:', String(e).replace(/[\r\n]/g, ' '));
    }
    document.getElementById('checkBtn').disabled=true;
  });

  // 既にアーカイブならボタン無効
  if(isArchived(id)){
    document.getElementById('checkBtn').disabled=true;
  }
}).catch(err=>{
  const sanitizedError = String(err).replace(/[\r\n\t]/g, ' ').substring(0, 200);
  console.error('Error loading test:', sanitizedError);
  const p = document.createElement('p');
  p.textContent = 'テストの読み込みに失敗しました';
  document.body.appendChild(p);
});
