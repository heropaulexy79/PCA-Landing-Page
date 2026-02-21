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



// Toggle chat widget
const chatButton = document.getElementById("chat-button");
const chatBox = document.getElementById("chat-box");
const messages = document.getElementById("ai-messages");
const input = document.getElementById("ai-text");

chatButton.onclick = () => {
  chatBox.classList.toggle("open");
  chatBox.style.display = chatBox.classList.contains("open") ? "flex" : "none";
  chatBox.style.flexDirection = "column";
  input.focus();
};

// Auto scroll helper
function scrollToBottom() {
  messages.scrollTop = messages.scrollHeight;
}

// Create message bubble
function createBubble(text, type = "ai") {
  const bubble = document.createElement("div");
  bubble.classList.add("chat-bubble", type);
  bubble.innerText = text;
  messages.appendChild(bubble);
  scrollToBottom();
}

// Typing indicator
function showTyping() {
  const typing = document.createElement("div");
  typing.classList.add("chat-bubble", "ai", "typing");
  typing.id = "typing-indicator";

  typing.innerHTML = `
    <span></span>
    <span></span>
    <span></span>
  `;

  messages.appendChild(typing);
  scrollToBottom();
}

function removeTyping() {
  const typing = document.getElementById("typing-indicator");
  if (typing) typing.remove();
}

// Send message
async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  createBubble(message, "user");
  input.value = "";

  showTyping();

  try {
    const response = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    removeTyping();

    const reply =
      data.reply ||
      "I'm sorry, something went wrong. Please try again.";

    createBubble(reply, "ai");
  } catch (err) {
    removeTyping();
    createBubble("Connection issue. Please try again.", "ai");
  }
}

// Enter key send
input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});

// Auto scroll if user opens chat
// const observer = new MutationObserver(scrollToBottom);
// observer.observe(messages, { childList: true });