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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1000);
}

// Prevent scroll until opened
document.body.style.overflow = 'hidden';

// 2. Personalized Greeting
const params = new URLSearchParams(window.location.search);
const guestName = params.get('name');
if (guestName) {
    let names = decodeURIComponent(guestName.replace(/\+/g, ' ')).trim();
    let finalDisplay;

    // conditional check: split only if "and" is found
    const count = (names.match(/and/g) || []).length;
    if (count === 1) {
        console.log(names)
        finalDisplay = names.split('and').map((name) => {
            const trimmed = name.trim();
            return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
        }).join(' & ');
    } else if (count > 1) {
        const parts = names.split(/\s*and\s*/i).map(name => {
            const trimmed = name.trim();
            return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
        });

        // Join all except the last one with commas, then add the last one with &
        const lastPart = parts.pop();
        finalDisplay = parts.join(', ') + ' & ' + lastPart;
    } else {
        // 3. Fallback: Just capitalize the single name
        finalDisplay = names.charAt(0).toUpperCase() + names.slice(1);
    }
    const msgEl = document.getElementById('personalized-message');
    if (msgEl) {
        msgEl.innerHTML = `<strong>${finalDisplay}</strong>`;
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
// 4. RSVP Action
async function handleRSVP(e) {
    e.preventDefault();

    // Get button and original text for feedback
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerText;

    // 1. Disable and Show Loading State
    btn.disabled = true;
    btn.innerText = "SENDING...";
    btn.classList.add('opacity-70', 'cursor-not-allowed');

    const API_URL = "https://script.google.com/macros/s/AKfycbyZEmoP_S84klNGUj-A22coE1tSBd-0oo-ROBK0kyO1uZbPS33cfhFWPQWhwbNkcqM/exec";

    const name = document.getElementById('name').value;
    const attendingRadio = document.querySelector('input[name="attending"]:checked');
    const attending = attendingRadio ? attendingRadio.value : "No Response";
    const message = document.getElementById('message')?.value || "";
    const eventCode = document.getElementById("eventCode").value;

    const formData = new URLSearchParams();
    formData.append("eventCode", eventCode);
    formData.append("name", name);
    formData.append("attending", attending);
    formData.append("message", message);
    formData.append("timestamp", new Date().toISOString());

    try {
        await fetch(API_URL, {
            method: "POST",
            mode: "no-cors",
            cache: "no-cache",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData.toString()
        });

        // SUCCESS STATE
        btn.innerText = "SENT!";
        btn.classList.remove('animate-pulse');
        btn.classList.replace('bg-[#8c7c73]', 'bg-green-700');
        alert("Thank you! Your RSVP has been received.");

    } catch (error) {
        console.error("Submission Error:", error);
        alert("Submission failed. Please try again.");

        // 3. Reset Button on Error so they can try again
        btn.disabled = false;
        btn.innerText = originalText;
        btn.classList.remove('opacity-70', 'cursor-not-allowed', 'animate-pulse');
    }
}

