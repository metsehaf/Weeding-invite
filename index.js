// 1. Envelope Logic
function openEnvelope() {
    const envelope = document.getElementById("main-envelope");
    const scene = document.getElementById("scene");

    envelope.classList.add("open");

    // Card starts sliding after flap begins
    setTimeout(() => {
        envelope.querySelector(".letter-card")
            .style.transform = "translateY(-120%)";
        document.getElementById("main-content")
            .classList.remove("opacity-0");
    }, 1200);

    // After flap fully opens (8s), slide scene
    setTimeout(() => {
        scene.classList.add("scene-reveal");
        document.body.style.overflow = "auto";
    }, 1200);
    setTimeout(() => {
        document.body.classList.remove("locked");
        // Ensure we are at the top of the content
        content.scrollTop = 0;
    }, 1000);
}

// Prevent scroll until opened
document.body.style.overflow = 'hidden';

// 2. Personalized Greeting
const params = new URLSearchParams(window.location.search);
const guestName = params.get('name');
if (guestName) {
    const name = decodeURIComponent(guestName.replace(/\+/g, ' '));
    const msgEl = document.getElementById('personalized-message');
    if (msgEl) {
        msgEl.innerHTML = `<strong>${name}</strong>, we can't wait to share our special day with you. Help us capture our wedding with Joy.`;
    }
}

// 3. Countdown
const targetDate = new Date("August 1, 2026 17:00:00").getTime();
setInterval(() => {
    const now = new Date().getTime();
    const diff = targetDate - now;
    if (diff <= 0) return;

    const days = Math.floor(diff / (86400000));
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    if (document.getElementById('days')) {
        document.getElementById('days').innerText = days.toString().padStart(2, '0');
        document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
        document.getElementById('minutes').innerText = mins.toString().padStart(2, '0');
        document.getElementById('seconds').innerText = secs.toString().padStart(2, '0');
    }
}, 1000);

// 4. RSVP Action
function handleRSVP(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const attendingRadio = document.querySelector('input[name="attending"]:checked');
    const status = attendingRadio ? attendingRadio.value : 'No Response';
    window.location.href = `mailto:wedding@example.com?subject=RSVP: ${status} - ${name}&body=Guest: ${name}%0D%0AStatus: ${status}`;
}