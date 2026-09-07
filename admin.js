const client=window.supabase?.createClient(window.SUPABASE_URL||'',window.SUPABASE_PUBLISHABLE_KEY||'');
const loginView=document.getElementById('loginView'),appView=document.getElementById('appView'),loginMessage=document.getElementById('loginMessage');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const fmtDate=s=>s?new Date(`${s}T00:00:00`).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'}):'—';

async function isAdmin(){
  const {data:{user}}=await client.auth.getUser();
  if(!user)return false;
  const {data,error}=await client.from('profiles').select('is_admin').eq('id',user.id).single();
  return !error && data?.is_admin===true;
}
async function boot(){
  if(!client || !window.SUPABASE_URL || window.SUPABASE_URL.includes('YOUR_')){loginMessage.textContent='Configure config.js first.';return;}
  const {data:{session}}=await client.auth.getSession();
  if(session && await isAdmin()){loginView.hidden=true;appView.hidden=false;loadAll();}
}
document.getElementById('loginForm').addEventListener('submit',async e=>{
  e.preventDefault();loginMessage.textContent='Signing in…';
  const {error}=await client.auth.signInWithPassword({email:loginEmail.value,password:loginPassword.value});
  if(error){loginMessage.textContent=error.message;return}
  if(!(await isAdmin())){await client.auth.signOut();loginMessage.textContent='This account is not authorized as an admin.';return}
  loginView.hidden=true;appView.hidden=false;loadAll();
});
document.getElementById('logout').onclick=async()=>{await client.auth.signOut();location.reload()};
document.getElementById('refresh').onclick=loadAll;
document.getElementById('bookingFilter').onchange=loadBookings;
document.getElementById('messageFilter').onchange=loadMessages;

async function loadAll(){await Promise.all([loadBookings(),loadMessages()])}
async function loadBookings(){
  const filter=document.getElementById('bookingFilter').value;
  let q=client.from('appointments').select('*').order('preferred_date',{ascending:true}).order('preferred_time',{ascending:true});
  if(filter!=='all')q=q.eq('status',filter);
  const {data,error}=await q;
  const box=document.getElementById('appointments');
  if(error){box.innerHTML=`<div class="empty">${esc(error.message)}</div>`;return}
  const all=data||[];
  document.getElementById('pendingCount').textContent=all.filter(x=>x.status==='pending').length;
  const today=new Date().toISOString().slice(0,10); document.getElementById('todayCount').textContent=all.filter(x=>x.preferred_date===today).length;
  if(!all.length){box.innerHTML='<div class="empty">No appointment requests found.</div>';return}
  box.innerHTML=`<table class="table"><thead><tr><th>Customer</th><th>Service</th><th>Date / time</th><th>Notes</th><th>Status</th><th>Actions</th></tr></thead><tbody>${all.map(x=>`<tr><td><b>${esc(x.customer_name)}</b><br>${esc(x.customer_email)}</td><td>${esc(x.service)}</td><td>${fmtDate(x.preferred_date)}<br>${esc(x.preferred_time)}</td><td>${esc(x.notes||'—')}</td><td><span class="badge">${esc(x.status)}</span></td><td class="actions">${['approved','declined','completed'].map(s=>`<button data-b="${x.id}" data-s="${s}">${s}</button>`).join('')}</td></tr>`).join('')}</tbody></table>`;
  box.querySelectorAll('[data-b]').forEach(b=>b.onclick=async()=>{const {error}=await client.from('appointments').update({status:b.dataset.s}).eq('id',b.dataset.b);if(error)alert(error.message);else loadBookings()});
}
async function loadMessages(){
  const filter=document.getElementById('messageFilter').value;
  let q=client.from('support_messages').select('*').order('created_at',{ascending:false});
  if(filter==='unread')q=q.eq('status','unread'); else if(filter==='read')q=q.eq('status','read'); else if(filter==='replied')q=q.eq('status','replied');
  const {data,error}=await q; const box=document.getElementById('messages');
  if(error){box.innerHTML=`<div class="empty">${esc(error.message)}</div>`;return}
  const all=data||[]; document.getElementById('messageCount').textContent=all.filter(x=>x.status==='unread').length;
  if(!all.length){box.innerHTML='<div class="empty">No support messages found.</div>';return}
  box.innerHTML=`<table class="table"><thead><tr><th>Customer</th><th>Subject</th><th>Service</th><th>Message</th><th>Status</th><th>Actions</th></tr></thead><tbody>${all.map(x=>`<tr><td><b>${esc(x.customer_name)}</b><br>${esc(x.customer_email)}</td><td>${esc(x.subject)}</td><td>${esc(x.service||'—')}</td><td>${esc(x.message)}</td><td><span class="badge">${esc(x.status)}</span></td><td class="actions"><button data-m="${x.id}" data-s="read">Read</button><button data-m="${x.id}" data-s="replied">Replied</button></td></tr>`).join('')}</tbody></table>`;
  box.querySelectorAll('[data-m]').forEach(b=>b.onclick=async()=>{const {error}=await client.from('support_messages').update({status:b.dataset.s}).eq('id',b.dataset.m);if(error)alert(error.message);else loadMessages()});
}
boot();
