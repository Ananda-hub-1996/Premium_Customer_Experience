const app = document.getElementById('app');

const stages = [
  {
    key:'UNDERSTAND', label:'Customer Centricity', title:'Read the customer before you solve the problem.',
    customer:'“I’ve already come here twice. Every time someone tells me something different. Honestly, I’m getting tired of this.”',
    actions:[
      ['ACKNOWLEDGE','“I can see why that’s frustrating.”'],
      ['ASK','“Can you tell me what happened during your previous visits?”'],
      ['ACT','“Let me check your phone and bill.”'],
      ['DEFLECT','“You’ll have to speak to the person who handled it earlier.”']
    ],
    paths:{
      ACKNOWLEDGE:{customer:'“Exactly. I just don’t want to explain everything all over again.”', note:'You made space for the customer’s frustration. Now listen for what is underneath it.', finish:false},
      ASK:{customer:'“The first time I was told to come back today. Then someone else gave me a different answer.”', note:'You went straight to the experience behind the problem. That gives you something useful to respond to.', finish:true},
      ACT:{customer:'“That’s what they said last time. Can someone actually tell me what’s going on?”', note:'You moved toward action before understanding the experience. Rahul still doesn’t feel heard.', finish:false},
      DEFLECT:{customer:'“So I have to start all over again with someone else?”', note:'You passed the problem away before understanding it. Rahul feels like he has to do the work again.', finish:false}
    },
    move:'UNDERSTAND ME', beh:'Listen · Ask · Don’t assume', finishText:'You slowed the interaction down long enough to understand what Rahul was experiencing.'
  },
  {
    key:'CONNECT', label:'Customer Relation', title:'Make the customer feel seen while you help.',
    customer:'“The first time I was told to come back today. I came after work, and now I’m being told something else.”',
    actions:[
      ['ACKNOWLEDGE','“I can understand why you’d be frustrated after making another trip here.”'],
      ['EXPLAIN','“I wasn’t the person who spoke to you earlier.”'],
      ['REASSURE','“Don’t worry. I’ll get it sorted.”'],
      ['CORRECT','“Please calm down. I’ll check.”']
    ],
    paths:{
      ACKNOWLEDGE:{customer:'“Thanks. I just don’t want to feel like I’m being sent from one person to another.”', note:'You acknowledged the person, not just the problem. Rahul is more open to working through it with you.', finish:true},
      EXPLAIN:{customer:'“I know, but I’m the one who has had to come back.”', note:'The explanation may be true, but it doesn’t address Rahul’s experience.', finish:false},
      REASSURE:{customer:'“Okay… but can you actually tell me what happens next?”', note:'Reassurance without understanding can sound like a promise. Rahul needs to feel heard, not simply calmed.', finish:false},
      CORRECT:{customer:'“I am calm. I’m just frustrated.”', note:'Correcting the customer’s emotion can make the interaction feel less safe.', finish:false}
    },
    move:'CONNECT WITH ME', beh:'Attention · Respect · Warmth', finishText:'You made the interaction feel more human before moving into the solution.'
  },
  {
    key:'HELP', label:'Solution Orientation', title:'When the preferred answer is unavailable, look for what is possible.',
    customer:'“So you’re saying nothing can be done today?”',
    actions:[
      ['LIMIT','“Unfortunately, that’s the process. You’ll have to wait.”'],
      ['EXPLORE','“That option isn’t available today, but let me check what alternatives we can offer.”'],
      ['ESCALATE','“I’ll need to ask my manager.”'],
      ['CLOSE','“No, that’s not possible.”']
    ],
    paths:{
      LIMIT:{customer:'“So there’s really nothing you can do?”', note:'You explained the limitation, but stopped at what cannot be done. Try looking for the next possibility.', finish:false},
      EXPLORE:{customer:'“Okay. What options do I have?”', note:'You were honest about the limitation without making the limitation the end of the conversation.', finish:true},
      ESCALATE:{customer:'“Do I have to wait for your manager before I know what my options are?”', note:'Escalation may be necessary, but first consider what you can clarify or explore yourself.', finish:false},
      CLOSE:{customer:'“Then why did I come back today?”', note:'A hard stop can leave the customer with the problem and no path forward. Look for what is possible.', finish:false}
    },
    move:'HELP ME', beh:'Possibilities · Alternatives · Clarity', finishText:'You shifted the conversation from what cannot happen to what can happen.'
  },
  {
    key:'STAY', label:'Resolution Management', title:'The customer should not have to carry the handover.',
    customer:'“Okay. But then I have to explain everything again to someone else?”',
    actions:[
      ['PASS','“Yes, you’ll have to explain it to the concerned team.”'],
      ['HANDOVER','“I’ll tell them what happened.”'],
      ['OWN','“You shouldn’t have to repeat everything. I’ll brief the concerned team and make sure you know what happens next.”'],
      ['ESCALATE','“Let me call my manager.”']
    ],
    paths:{
      PASS:{customer:'“So I have to explain everything again?”', note:'The process may require a handover, but the customer shouldn’t have to carry the whole story with them.', finish:false},
      HANDOVER:{customer:'“Thanks. But how will I know what happens after that?”', note:'Passing information is useful. Closing the loop is what makes the experience feel complete.', finish:false},
      OWN:{customer:'“Okay. That makes it much easier. So what happens next?”', note:'You took ownership of the experience even though another person or team will complete the resolution.', finish:true},
      ESCALATE:{customer:'“Do we really need a manager for this?”', note:'A manager may help later, but first consider what ownership you can take yourself.', finish:false}
    },
    move:'STAY WITH ME', beh:'Ownership · Follow-through · Next steps', finishText:'You stayed with the customer through the handover instead of treating it as someone else’s problem.'
  }
];

let stage = 0;
let selectedAction = null;

function shell(content, cls='') {
  app.innerHTML = `<div class="wrap ${cls} fade">${content}</div>`;
  window.scrollTo({top:0, behavior:'smooth'});
}

function progress(n) {
  return `<div class="stage-head"><div class="progress">${stages.map((s,i)=>`<i class="${i<n?'on':''} ${i===n?'current':''}"></i>`).join('')}</div><div class="progress-label">MOMENT ${n+1} OF 4</div></div>`;
}

function visual() {
  return `<div class="scene-visual"><div class="store-window"></div><div class="store-line"></div><div class="phone"></div><div class="bubble customer-b">RAHUL</div><div class="person customer"><div class="head"></div><div class="body"></div><div class="arm a"></div><div class="arm b"></div></div><div class="person advisor"><div class="head"></div><div class="body"></div><div class="arm a"></div><div class="arm b"></div></div><div class="bubble advisor-b">YOUR MOVE</div></div>`;
}

function opening() {
  shell(`<section class="hero"><div class="hero-inner"><div class="eyebrow">SALES IMAGE TRANSFORMATION</div><h1>PREMIUM<br>CUSTOMER EXPERIENCE</h1><div class="question">What makes a customer feel truly valued?</div><p class="sub">You’re about to step into a customer interaction. <strong>There isn’t always one perfect thing to say.</strong> What matters is how you read the situation and respond.</p><div class="pillars"><span>DIGNITY</span><span>PATIENCE</span><span>WARMTH</span></div><button class="cta" data-action="start">STEP INTO THE EXPERIENCE →</button></div></section>`);
}

function start() { stage=0; selectedAction=null; sceneIntro(); }

function sceneIntro() {
  const s = stages[stage];
  shell(`<section class="stage">${progress(stage)}<div class="scene"><div>${visual()}</div><div class="content"><div class="section-label">THE CUSTOMER</div><h2>Meet Rahul.</h2><p class="lead">You’re the sales advisor. Rahul has a concern — and he’s already frustrated.</p><div class="quote">${s.customer}</div><p class="lead">You have a few ways you could respond. <strong>Choose what you would actually say.</strong></p><button class="cta" data-action="conversation">ENTER THE CONVERSATION →</button></div></div></section>`);
}

function conversation() {
  const s = stages[stage];
  shell(`<section class="stage">${progress(stage)}<div class="scene"><div>${visual()}</div><div class="content"><div class="section-label">${s.label.toUpperCase()}</div><h2>${s.title}</h2><div class="customer-line"><div class="mini-avatar">R</div><div><span>RAHUL</span><p>${s.customer}</p></div></div><p class="lead">You’re in the moment. <strong>What do you want to say or do?</strong></p><div class="action-grid">${s.actions.map((a,i)=>`<button class="action" data-action="choose" data-index="${i}"><b>${a[0]}</b><span>${a[1]}</span></button>`).join('')}</div></div></div></section>`);
}

function act(i) {
  const s = stages[stage];
  const a = s.actions[i];
  const p = s.paths[a[0]];
  selectedAction = a[1];
  shell(`<section class="stage reaction-screen">${progress(stage)}<div class="conversation-result"><div class="result-top"><div class="section-label">YOU SAID</div><div class="your-line"><span>YOU</span><p>${a[1]}</p></div></div><div class="result-arrow">↓</div><div class="customer-response"><div class="section-label">RAHUL RESPONDS</div><div class="customer-reaction">${p.customer}</div><p>${p.note}</p></div>${p.finish ? `<div class="notice"><div class="section-label">NOTICE THE DIFFERENCE</div><h3>${s.finishText}</h3><p><strong>${s.move}</strong><br>${s.label} · ${s.beh}</p></div><button class="cta" data-action="complete">CONTINUE →</button>` : `<div class="adapt"><div class="section-label">THE CONVERSATION ISN’T OVER</div><h3>Rahul is still looking to you.</h3><p>You can adapt. In a real interaction, one response doesn’t have to define the whole experience.</p><button class="cta" data-action="retry">RESPOND AGAIN →</button></div>`}</div></section>`);
}

function retry() { conversation(); }
function completeStage() { if(stage<3){stage++; sceneIntro();} else reveal(); }

function reveal() {
  shell(`<section class="reveal"><div class="section-label">NOW NAME WHAT YOU EXPERIENCED</div><h2>You just made four moves that changed the interaction.</h2><div class="reveal-grid">${stages.map((s,i)=>`<div class="move"><div class="num">0${i+1}</div><h3>${s.key}</h3><p>${s.label}<br><strong>${s.move}</strong></p></div>`).join('')}</div><p class="lead" style="max-width:700px">Premium service isn’t about having the perfect script. It’s about understanding the person, adapting in the moment, and taking ownership of the experience.</p><button class="cta" data-action="premium">SEE THE BIGGER IDEA →</button></section>`);
}

function premium() {
  shell(`<section class="reveal"><div class="section-label">WHAT DOES “VALUED” FEEL LIKE?</div><h2>The customer may forget your exact words.</h2><p class="lead" style="max-width:650px">But they remember how the interaction made them feel.</p><div class="feelings"><div class="feeling"><h3>DIGNITY</h3><p>I feel respected.</p></div><div class="feeling"><h3>PATIENCE</h3><p>I feel heard.</p></div><div class="feeling"><h3>WARMTH</h3><p>I feel comfortable.</p></div></div><div class="experience-loop"><span>READ</span><i>→</i><span>RESPOND</span><i>→</i><span>NOTICE</span><i>→</i><span>ADAPT</span></div><button class="cta" data-action="reflection">YOUR NEXT CUSTOMER →</button></section>`);
}

function reflection() {
  shell(`<section class="stage"><div class="reflection"><div class="section-label">YOUR NEXT CUSTOMER</div><h2>What will you pay more attention to?</h2><p class="lead">Choose one behaviour you want to carry into your next customer interaction.</p><div class="choice-grid">${stages.map((s,i)=>`<button class="commit" data-action="commit" data-index="${i}"><span class="commit-key">${s.key}</span><h3>${s.move}</h3><p>${['I’ll listen before assuming.','I’ll make the customer feel heard.','I’ll look for what can be done.','I’ll take ownership of the next step.'][i]}</p></button>`).join('')}</div><div id="commit"></div></div></section>`);
}

function commit(i) {
  document.querySelectorAll('.commit').forEach((b,n)=>b.classList.toggle('selected',n===i));
  document.getElementById('commit').innerHTML=`<div class="response good"><div class="tag">YOUR NEXT MOVE</div><h3>${stages[i].move}</h3><p>Take it into your next customer interaction. Notice what changes.</p><button class="cta next" data-action="closing">FINISH EXPERIENCE →</button></div>`;
}

function closing() {
  shell(`<section class="close"><div class="eyebrow">SALES IMAGE TRANSFORMATION · PREMIUM CUSTOMER EXPERIENCE</div><h2>MAKE THEM<br>FEEL VALUED.</h2><p>Premium service isn’t remembered only by what you did. It’s remembered by how the customer felt while you did it.</p><button class="cta" data-action="opening">EXPERIENCE IT AGAIN</button><div class="small">One interaction can change the entire experience.</div></section>`);
}

document.addEventListener('click', (e) => {
  const button = e.target.closest('[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  if (action === 'start') start();
  else if (action === 'conversation') conversation();
  else if (action === 'choose') act(Number(button.dataset.index));
  else if (action === 'retry') retry();
  else if (action === 'complete') completeStage();
  else if (action === 'premium') premium();
  else if (action === 'reflection') reflection();
  else if (action === 'commit') commit(Number(button.dataset.index));
  else if (action === 'closing') closing();
  else if (action === 'opening') opening();
});

document.getElementById('restart').addEventListener('click', opening);
opening();
