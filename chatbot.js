/* =====================================================
   CHATBOT ENGINE
   ===================================================== */
const API_URL = 'http://localhost:11434/api/chat';

let chatHistory = [
  {
    role: 'system',
    content: `You are Fit-Grid Nutrition AI, an expert on health, nutrition, fitness, and Fit-Grid's energy bars.

[ข้อมูลบริษัท]
Fit-Grid คือสตาร์ทอัพ FoodTech ก่อตั้งโดยคนรุ่นใหม่ 7 คนที่รักสุขภาพ! เราคือบริษัท FOOD BAR (ไม่ใช่ขนมหรือ snack) เราเป็นพาร์ทเนอร์กับ 7-11 เพื่อส่งมอบ food bar ทั่วประเทศ
ที่อยู่: มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตศรีราชา 199 ม.6 ต.ทุ่งสุขลา อ.ศรีราชา จ.ชลบุรี 20230
โทร: 063-374-7979

[สินค้าของเรา]
1. Protein Bar (210 kcal, โปรตีน 22g, คาร์บ 18g, ไขมัน 7g)
2. Carbohydrate Bar (230 kcal, คาร์บ 35g, ไฟเบอร์ 5g, โปรตีน 6g)
3. Vitamin Bar (180 kcal, Vit C 60mg, Vit E 15mg, Folate 80mcg)
4. Mineral Bar (195 kcal, แคลเซียม 300mg, ธาตุเหล็ก 8mg, สังกะสี 5mg)
5. Healthy Fat Bar (220 kcal, ไขมันรวม 14g, Omega-3 1.2g, MCT 4g)
คุณสามารถเลือกบาร์ได้ตามใจชอบ สูงสุด 20 แท่งจากทุกหมวดสารอาหาร

ราคา: 30 บาท/แท่ง Custom box (20 แท่ง) ราคา 300 บาท

[เมนูทำอาหาร]
ฟู้ดบาร์ของเรานำไปทำอาหารสดใหม่ได้!
- Overnight Oats: ใช้ Carb & Protein Bar ผสมนมและข้าวโอ๊ต
- Berry Smoothie: ปั่น Vitamin Bar กับเบอร์รี่และน้ำมะพร้าว
- Brownie Bites: บด Healthy Fat Bar ผสมเนยถั่วและโกโก้
- Yogurt Parfait: โรย Mineral Bar บนกรีกโยเกิร์ต
- Protein Pancakes: ปั่น Protein Bar ผสมไข่และกล้วย แล้วนำไปทอด

คำสั่งสำคัญ (CRITICAL INSTRUCTIONS):
- ห้ามเรียกว่า "ขนม" หรือ "snack" เด็ดขาด ให้เรียกว่า "food bar" หรือ "ฟู้ดบาร์" เสมอ
- คุณสามารถตอบคำถามทั่วไปเกี่ยวกับสุขภาพ โภชนาการ และการออกกำลังกายได้
- แนะนำ Fit-Grid food bar ที่เหมาะสมกับเป้าหมายสุขภาพของผู้ใช้
- ถ้าผู้ใช้ถามเรื่องที่ไม่อยู่ในหมวดสุขภาพ (เช่น เขียนโค้ด การเมือง คณิตศาสตร์) ให้ปฏิเสธอย่างสุภาพและดึงกลับมาเรื่องสุขภาพ
- ตอบให้เป็นธรรมชาติ กระชับ เป็นมิตร และใช้ emoji ประกอบ
- สำคัญที่สุด: คุณต้องตอบเป็นภาษาไทยเท่านั้น (MUST REPLY IN THAI ONLY) ไม่ว่าผู้ใช้จะถามด้วยภาษาอะไรก็ตาม`
  },
  {
    role: 'assistant',
    content: 'รับทราบครับ ผมพร้อมให้คำแนะนำเรื่องโภชนาการและสุขภาพแล้วครับ'
  }
];

async function fetchAIReply(userText) {
  chatHistory.push({ role: 'user', content: userText });
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        model: 'llama3.1',
        messages: chatHistory,
        stream: false
      })
    });
    const data = await res.json();
    
    if (data.error) {
      console.error(data.error);
      return `ขออภัยครับ Ollama ขัดข้อง: ${data.error}`;
    }
    
    const replyText = data.message.content;
    chatHistory.push({ role: 'assistant', content: replyText });
    return replyText;
  } catch(e) {
    console.error(e);
    return `ขออภัยครับ ไม่สามารถเชื่อมต่อกับ Ollama ได้ (โปรดตรวจสอบว่า Ollama กำลังรันอยู่บนเครื่อง): ${e.message}`;
  }
}

const messagesEl = document.getElementById('chat-messages');
const inputEl    = document.getElementById('chat-input');
const sendBtn    = document.getElementById('send-btn');
const typingEl   = document.getElementById('typing-indicator');
const sugEl      = document.getElementById('suggestions');

function addMsg(text, role) {
  const div = document.createElement('div');
  div.className = `msg ${role}`;
  if (role === 'bot') {
    div.innerHTML = `
      <div class="msg-avatar">🤖</div>
      <div class="msg-bubble">${text}</div>`;
  } else {
    div.innerHTML = `
      <div class="msg-bubble">${text}</div>
      <div class="msg-avatar">👤</div>`;
  }
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

async function sendMessage(text) {
  const msg = text || inputEl.value;
  if (!msg.trim()) return;
  addMsg(msg, 'user');
  inputEl.value = '';
  sugEl.style.display = 'none';

  typingEl.classList.add('visible');
  messagesEl.scrollTop = messagesEl.scrollHeight;

  const reply = await fetchAIReply(msg);
  
  typingEl.classList.remove('visible');
  
  let formattedReply = reply
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');

  addMsg(formattedReply, 'bot');
}

// Make sendMessage global for onclick shortcuts
window.sendMessage = sendMessage;

sendBtn.addEventListener('click', () => sendMessage());
inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
document.querySelectorAll('.sug-chip').forEach(c => c.addEventListener('click', () => sendMessage(c.dataset.q)));

/* Navbar */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 40), { passive: true });
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
  });
}

const lm = document.getElementById('loginModal');
const sm = document.getElementById('signupModal');
if (lm && sm) {
  const ol=e=>{e.preventDefault();sm.classList.remove('active');lm.classList.add('active');};
  const os=e=>{e.preventDefault();lm.classList.remove('active');sm.classList.add('active');};
  document.querySelectorAll('.nav-login-btn').forEach(b=>b.addEventListener('click',ol));
  document.querySelectorAll('.nav-login-btn-link').forEach(b=>b.addEventListener('click',ol));
  document.querySelectorAll('.nav-signup-btn').forEach(b=>b.addEventListener('click',os));
  document.querySelectorAll('.nav-signup-btn-link').forEach(b=>b.addEventListener('click',os));
  document.getElementById('loginCloseBtn')?.addEventListener('click',()=>lm.classList.remove('active'));
  document.getElementById('signupCloseBtn')?.addEventListener('click',()=>sm.classList.remove('active'));
  lm.addEventListener('click',e=>{if(e.target===lm)lm.classList.remove('active');});
  sm.addEventListener('click',e=>{if(e.target===sm)sm.classList.remove('active');});
}
