const cfg = window.GDPS_CONFIG;
const $ = (s) => document.querySelector(s);
let activeCategory = 'main';
let selectedId = null;
let data = cfg.levels.map(x => ({...x, records: Array.isArray(x.records) ? [...x.records] : []}));

function escapeHTML(str='') { return String(str).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function badgeClass(d){ return d.toLowerCase().replace(/\s+/g,'-'); }
function visibleLevels(){
  const q = $('#search').value.trim().toLowerCase(); const diff = $('#difficulty').value;
  return data.filter(l => l.category===activeCategory && (!q || `${l.name} ${l.creator} ${l.verifier}`.toLowerCase().includes(q)) && (diff==='all' || l.difficulty===diff)).sort((a,b)=>a.rank-b.rank);
}
function renderStats(){
  const main = data.filter(l=>l.category==='main').length;
  const recs = data.reduce((n,l)=>n+l.records.length,0);
  const players = new Set(data.flatMap(l=>l.records.map(r=>r.player.toLowerCase()))).size;
  $('#stats').innerHTML = `<div><strong>${main}</strong><span>Main List Levels</span></div><div><strong>${data.length}</strong><span>Total Ranked</span></div><div><strong>${players}</strong><span>Players with records</span></div><div><strong>${recs}</strong><span>Verified records</span></div>`;
  $('#heroCount').textContent = main;
}
function renderList(){
  const list = visibleLevels();
  $('#levelList').innerHTML = list.length ? list.map(l => `<button class="level-row ${selectedId===l.id?'selected':''}" data-id="${l.id}"><span class="rank">#${l.rank}</span><span class="thumb ${l.color}"><span>${l.name[0]}</span></span><span class="level-main"><strong>${escapeHTML(l.name)}</strong><small>by ${escapeHTML(l.creator)}</small></span><span class="level-meta"><b class="difficulty ${badgeClass(l.difficulty)}">${escapeHTML(l.difficulty)}</b><small>${l.records.length} record${l.records.length!==1?'s':''}</small></span></button>`).join('') : `<div class="no-results"><h3>No levels found</h3><p>Try another search or filter.</p></div>`;
  document.querySelectorAll('.level-row').forEach(btn => btn.addEventListener('click', () => showDetails(btn.dataset.id)));
  if (!selectedId && list[0]) showDetails(list[0].id);
  else if (selectedId && !list.some(l=>l.id===selectedId)) { selectedId = null; $('#details').innerHTML = `<div class="empty"><div class="empty-icon">◈</div><h2>Select a level</h2><p>Choose a level on the left to see its records and information.</p></div>`; }
}
function showDetails(id){
  const l=data.find(x=>x.id===id); if(!l) return; selectedId=id;
  $('#details').innerHTML = `<div class="details-head"><div><span class="rank-big">#${l.rank}</span><span class="difficulty ${badgeClass(l.difficulty)}">${escapeHTML(l.difficulty)}</span></div><h2>${escapeHTML(l.name)}</h2><p>by <b>${escapeHTML(l.creator)}</b> · verified by <b>${escapeHTML(l.verifier)}</b></p></div><div class="preview ${l.color}"><div class="preview-title">${escapeHTML(l.name)}</div><div class="preview-id">Level ID ${escapeHTML(l.id)}</div></div><div class="details-actions"><a class="primary" target="_blank" rel="noopener" href="${escapeHTML(l.video)}">Watch Verification</a><span class="rating">Difficulty score <b>${l.rating}/10</b></span></div><p class="description">${escapeHTML(l.description)}</p><div class="records-head"><h3>Records</h3><span>${l.records.length} total</span></div><div class="records">${l.records.length ? l.records.map((r,i)=>`<a class="record" href="${escapeHTML(r.video)}" target="_blank" rel="noopener"><span>#${i+1}</span><b>${escapeHTML(r.player)}</b><span>${r.percent}%</span><span>${escapeHTML(r.hz||'—')}</span><span>↗</span></a>`).join('') : '<div class="no-record">No records have been verified yet.</div>'}</div>`;
  document.querySelectorAll('.level-row').forEach(x=>x.classList.toggle('selected',x.dataset.id===id));
}
function renderTeam(){ $('#teamList').innerHTML = cfg.team.map(t=>`<div class="person"><span class="avatar">${escapeHTML(t.name[0]||'?')}</span><span><b>${escapeHTML(t.name)}</b><small>${escapeHTML(t.role)}</small></span></div>`).join(''); }
function renderSubmitLevels(){ $('#submitLevel').innerHTML = data.map(l=>`<option value="${l.id}">#${l.rank} — ${escapeHTML(l.name)}</option>`).join(''); }

$('#search').addEventListener('input', renderList); $('#difficulty').addEventListener('change', renderList);
document.querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');activeCategory=tab.dataset.category;selectedId=null;renderList();}));
$('#submitForm').addEventListener('submit', e=>{
  e.preventDefault(); const id=$('#submitLevel').value; const level=data.find(l=>l.id===id); if(!level) return;
  const submissions=JSON.parse(localStorage.getItem('gdpsDemoSubmissions')||'[]'); submissions.push({level:id,levelName:level.name,player:$('#submitPlayer').value.trim(),percent:Number($('#submitPercent').value),hz:$('#submitHz').value.trim(),video:$('#submitVideo').value.trim(),date:new Date().toISOString(),status:'pending'}); localStorage.setItem('gdpsDemoSubmissions',JSON.stringify(submissions));
  e.target.reset(); alert('Record envoyé en attente de validation.');
});
$('#siteName').textContent=cfg.name; $('#siteTagline').textContent=cfg.tagline; $('#heroTitle').textContent=cfg.name; $('#heroDescription').textContent=cfg.description; document.title=cfg.name;
renderStats(); renderTeam(); renderSubmitLevels(); renderList();
