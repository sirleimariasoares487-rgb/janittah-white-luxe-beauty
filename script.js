const menuToggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav');
menuToggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',open);});
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

document.querySelectorAll('[data-service]').forEach(link=>{
  link.addEventListener('click',()=>{
    const select=document.querySelector('#appointmentForm select[name="service"]');
    if(select) select.value=link.dataset.service;
  });
});

const client = window.supabase?.createClient(window.SUPABASE_URL || '', window.SUPABASE_PUBLISHABLE_KEY || '');

async function submitTo(table, payload){
  if(!client || !window.SUPABASE_URL || window.SUPABASE_URL.includes('YOUR_')){
    throw new Error('Supabase is not configured yet. Complete SUPABASE_SETUP.md first.');
  }
  const {error}=await client.from(table).insert(payload);
  if(error) throw error;
}

const form=document.getElementById('appointmentForm');
const msg=document.getElementById('formMessage');
form?.addEventListener('submit',async(e)=>{
  e.preventDefault();
  msg.textContent='Sending your booking request…';
  const data=Object.fromEntries(new FormData(form).entries());
  try{
    await submitTo('appointments',{
      customer_name:data.name.trim(),
      customer_email:data.email.trim().toLowerCase(),
      service:data.service,
      preferred_date:data.date,
      preferred_time:data.time,
      notes:data.message?.trim() || null
    });
    form.reset();
    msg.textContent='Booking request received. The salon will review it from the admin dashboard.';
  }catch(err){ console.error(err); msg.textContent='We could not send the request yet. Please try again after the site database is configured.'; }
});

const supportForm=document.getElementById('supportForm');
const supportMessage=document.getElementById('supportMessage');
supportForm?.addEventListener('submit',async(e)=>{
  e.preventDefault();
  supportMessage.textContent='Sending your support message…';
  const data=Object.fromEntries(new FormData(supportForm).entries());
  try{
    await submitTo('support_messages',{
      customer_name:data.name.trim(),
      customer_email:data.email.trim().toLowerCase(),
      subject:data.subject.trim(),
      service:data.service || null,
      message:data.message.trim()
    });
    supportForm.reset();
    supportMessage.textContent='Your message has been sent securely to the support dashboard.';
  }catch(err){ console.error(err); supportMessage.textContent='We could not send the message yet. Please try again after the site database is configured.'; }
});
