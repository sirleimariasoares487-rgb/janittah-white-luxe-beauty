const menuToggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav');
menuToggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',open);});
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

const form=document.getElementById('appointmentForm');
const msg=document.getElementById('formMessage');
form?.addEventListener('submit',(e)=>{
  e.preventDefault();
  const data=new FormData(form);
  const text=`Hello Janittah White Luxe Beauty!%0A%0AI would like to request an appointment.%0AName: ${encodeURIComponent(data.get('name'))}%0APhone: ${encodeURIComponent(data.get('phone'))}%0AService: ${encodeURIComponent(data.get('service'))}%0ADate: ${encodeURIComponent(data.get('date'))}%0ATime: ${encodeURIComponent(data.get('time'))}%0ANote: ${encodeURIComponent(data.get('message')||'None')}`;
  msg.innerHTML='Your booking request is ready. Opening WhatsApp…';
  // Replace this number with the salon's real WhatsApp number before launch.
  window.open(`https://wa.me/12025550187?text=${text}`,'_blank');
});
