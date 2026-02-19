// --- Final Mobile Navigation Toggle ---
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');

    navToggle.addEventListener('click', () => {
        // We toggle the class on the BODY element
        document.body.classList.toggle('nav-open');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (document.body.classList.contains('nav-open')) {
                document.body.classList.remove('nav-open');
            }
        });
    });
});

// Accordion handling
    function toggleAcc(el){
      const item = el.closest('.acc-item');
      const body = item.querySelector('.acc-body');
      const opened = body.style.height && body.style.height !== '0px';
      // close all
      document.querySelectorAll('.acc-body').forEach(b=>{b.style.height='0'});
      document.querySelectorAll('.acc-item .acc-head div').forEach(d=>d.textContent='+');
      if(!opened){
        const h = item.querySelector('.acc-body-inner').offsetHeight;
        body.style.height = h + 20 + 'px';
        el.querySelector('div').textContent='–';
      }
    }

    // Simple contact form handler (no backend) — shows a success state and resets form
    // function submitForm(e){
    //   e.preventDefault();
    //   const name = document.getElementById('name').value.trim();
    //   const email = document.getElementById('email').value.trim();
    //   const phone = document.getElementById('phone').value.trim();
    //   if(!name || !email || !phone){ alert('Please complete the required fields.'); return }
    //   // sim: show a success message
    //   const btn = document.querySelector('#contactForm button');
    //   const prev = btn.innerHTML;
    //   btn.disabled = true; btn.innerHTML = 'Sending...';
    //   setTimeout(()=>{
    //     btn.disabled = false; btn.innerHTML = prev;
    //     alert('Thanks ' + name + '! Your request has been received. We will contact you shortly.');
    //     document.getElementById('contactForm').reset();
    //   },900);
    // }

    // Smooth scroll for nav links
    document.querySelectorAll('nav a[href^="#"]').forEach(a=>{
      a.addEventListener('click', e=>{ e.preventDefault(); const id = a.getAttribute('href').slice(1); document.getElementById(id).scrollIntoView({behavior:'smooth'}); });
    });

    // Open first accordion by default
    document.addEventListener('DOMContentLoaded', ()=>{
      const firstHead = document.querySelector('.acc-item .acc-head');
      if(firstHead) toggleAcc(firstHead);
    });

    // Fade-in on scroll observer
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

fadeEls.forEach(el => observer.observe(el));

// Button ripple on click (centered ripple)
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ripple = document.createElement('span');
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add('ripple');
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});
// Stagger fade-in for products
document.querySelectorAll('#products .product-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.15}s`;
});

const swiper = new Swiper('.services-slider', {
  slidesPerView: 4,
  spaceBetween: 20,
  loop: true, // Infinite loop
  autoplay: {
    delay: 3000, // Slide every 3 seconds
    disableOnInteraction: false, // Continue autoplay even after user interacts
  },
  loop: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    320: { slidesPerView: 1, spaceBetween: 10 },
    640: { slidesPerView: 2, spaceBetween: 15 },
    1024: { slidesPerView: 4, spaceBetween: 20 }
  }
});

const chatButton = document.getElementById("chat-button");
const chatBox = document.getElementById("chat-box");

chatButton.onclick = () => {
  chatBox.style.display = chatBox.style.display === "flex" ? "none" : "flex";
  chatBox.style.flexDirection = "column";
};

async function sendAI() {
  const input = document.getElementById("ai-text");
  const messages = document.getElementById("ai-messages");
  
  const text = input.value;
  if (!text) return;

  messages.innerHTML += `<div><b>You:</b> ${text}</div>`;
  input.value = "";

  const res = await fetch("/.netlify/functions/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  });

  const data = await res.json();
  messages.innerHTML += `<div><b>AI:</b> ${data.aiReply}</div>`;
  messages.scrollTop = messages.scrollHeight;
}
