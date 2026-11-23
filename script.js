const services = [
  ['24/7 support counseling','A steady, confidential point of contact when life feels unsafe or overwhelming.'],
  ['Crisis intervention','Immediate guidance and referrals for moments that need a calm next step.'],
  ["Children's therapy",'Age-aware support that gives children space to process, heal and grow.'],
  ['Referrals for assistance','Navigation to trusted social, housing, medical and community resources.'],
  ['Career development','Practical encouragement and resources to help people move forward with confidence.'],
  ['Court assistance','Support preparing for court-related steps and finding the right resources.'],
  ['Cultural sensitivity training','Learning that helps organizations serve northern New Jersey with more understanding.'],
  ['Food pantry & shelter','Food access and emergency pathways for low-income families and individuals.'],
  ['Foster parent assistance','A helping hand for foster families navigating care, systems and change.'],
  ['Immigration paperwork','Plain-language support to make complex paperwork feel more manageable.'],
  ['Translation assistance','Language access so people can understand options and be understood.'],
  ['Anger management','Workshops and coaching that create safer patterns for families and relationships.'],
  ['Benefits & social services','Help with housing, health insurance, food stamps and related applications.'],
];
const programs = [
  ['01','Domestic violence awareness','Every October, WAFAA joins the national movement to create awareness, honor survivors and help prevent violence across northern New Jersey.','October / community education'],
  ['02','Anger management & dating violence','Safe workshops create room for advice, accountability and practical support for people who need a way forward.','Workshops / speakers welcome'],
  ['03','Weekly food donations','Every Thursday, food is distributed to seniors, people with special needs and religious institutions. The goal is to reach further.','Every Thursday / essentials'],
  ['04','Thanksgiving & Christmas','Seasonal fundraising helps provide free turkeys and gifts to neighbors who need extra care during the holidays.','Seasonal / family support'],
  ['05','Mustard Seed Communities','Through this partnership, WAFAA supports children and adults with disabilities in the Dominican Republic with diapers and baby formula.','Partnership / Dominican Republic'],
];
const achievements = [['2012','Parents of the Year Award','Recognized by Governor Chris Christie; also received a Certificate of Recognition from the Passaic County Board of Freeholders.'],['2011','Special Congressional Recognition','Honored during Assemblywoman Nellie Pou’s annual Women’s History Month celebration.'],['2010','Ambassador for Peace','Awarded by the Universal Peace Federation for commitment to community and peace-building.']];
const supporters = ['Governor Christopher Christie','US Senator Jon Corzine','Congressman Bill Pascrell','Sheriff Richard Berdnik','Senator Cory Booker','AmeriCorps','PNC Bank','NJCDC','Saint Joseph’s Healthcare System'];

const servicesEl = document.querySelector('#services');
servicesEl.innerHTML = services.map(([title,text], i) => `<article class="service-item" data-reveal="up"><div class="service-item__top"><span class="service-item__number">${String(i + 1).padStart(2,'0')}</span><span>${i % 2 ? '◌' : '♡'}</span></div><h3>${title}</h3><p>${text}</p><span class="service-item__arrow">↗</span></article>`).join('');


document.querySelector('#program-list').innerHTML = programs.map(([number,title,text,meta], i) => `<div class="program-row ${i === 0 ? 'program-row--open' : ''}"><button class="program-row__trigger" aria-expanded="${i === 0}"><span class="program-row__number">${number}</span><span class="program-row__title">${title}</span><span>⌄</span></button><div class="program-row__content"><p>${text}</p><span>${meta}</span></div></div>`).join('') + '<div class="program-list__tail"><span>Also creating pathways for community service, college internships, summer youth programs and more.</span><span>✦</span></div>';
document.querySelector('#achievements').innerHTML = achievements.map(([year,title,text]) => `<div class="timeline-item"><span class="timeline-item__year">${year}</span><div><h3>${title}</h3><p>${text}</p></div></div>`).join('');
document.querySelector('#supporters').innerHTML = supporters.map(name => `<span>${name}</span>`).join('');

const menuToggle = document.querySelector('#menu-toggle');
const nav = document.querySelector('#site-nav');
menuToggle.addEventListener('click', () => { nav.classList.toggle('site-nav--open'); menuToggle.textContent = nav.classList.contains('site-nav--open') ? '×' : '☰'; });
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { nav.classList.remove('site-nav--open'); menuToggle.textContent = '☰'; }));

document.addEventListener('click', event => {
  const trigger = event.target.closest('.program-row__trigger');
  if (trigger) {
    const row = trigger.closest('.program-row');
    const open = row.classList.toggle('program-row--open');
    trigger.setAttribute('aria-expanded', String(open));
  }
});

const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { 
  entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); 
} }), { threshold: .12, rootMargin: '0px 0px -48px 0px' });
document.querySelectorAll('[data-reveal]').forEach(element => revealObserver.observe(element));

const formCopy = {
  support: ['Client intake','Tell us what you need.','A few details help us guide you faster.'],
  volunteer: ['Volunteer interest','Bring your energy.','Tell us how you’d like to show up.'],
  contact: ['Say hello','We’re listening.','Send a note to the WAFAA team.'],
};
let activeKind = 'support';
function setFormKind(kind) {
  activeKind = kind;
  document.querySelectorAll('.form-tabs button').forEach(button => button.classList.toggle('is-active', button.dataset.kind === kind));
  const [label,title,description] = formCopy[kind];
  document.querySelector('#form-label').textContent = label;
  document.querySelector('#form-title').textContent = title;
  document.querySelector('#form-description').textContent = description;
}
document.querySelectorAll('.form-tabs button').forEach(button => button.addEventListener('click', () => setFormKind(button.dataset.kind)));
document.querySelectorAll('[data-form-kind]').forEach(link => link.addEventListener('click', () => setTimeout(() => setFormKind(link.dataset.formKind), 20)));

document.querySelector('#contact-form').addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector('button[type="submit"]');
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = 'Sending…';
  const data = Object.fromEntries(new FormData(form));
  try {
    await fetch('/api/follow-up', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, kind: activeKind }) });
  } catch (error) {
    console.warn('Follow-up notification unavailable', error);
  }
  form.innerHTML = `<div class="form-success"><div class="form-success__icon">✓</div><span class="eyebrow"><span class="eyebrow__line"></span> Message received</span><h3>Thank you for reaching out.</h3><p>Your note is ready for the WAFAA team to follow up. If this is urgent, please call <a href="tel:9737662406">973 – 766 – 2406</a> now.</p><button class="text-link" id="send-another" type="button">Send another note ↗</button></div>`;
  document.querySelector('#send-another').addEventListener('click', () => window.location.reload());
  void originalText;
});
