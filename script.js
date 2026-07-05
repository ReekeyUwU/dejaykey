let url = "";
const TRACKER_URL = 'https://link-tracker3.morning-surf-02e1.workers.dev/track';
const discordUserId = "1209220675303379046";

function countView() {
    if (!sessionStorage.getItem('viewed_reekey')) {
        fetch(TRACKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ link: 'reekey_de_views' })
        }).then(() => {
            sessionStorage.setItem('viewed_reekey', 'true');
        }).catch(e => console.error("View-Count konnte nicht gesendet werden:", e));
    }
}

function track(name, u) {
    fetch(TRACKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: name })
    }).catch(e => console.error("Tracking error:", e));

    if (u) window.open(u, '_blank');
}

function gate(u, name) {
    url = u;
    track(name);
    const el = document.getElementById('age-gate');
    el.style.display = 'flex';
    setTimeout(() => el.classList.add('open'), 10);
}

function hide() {
    const el = document.getElementById('age-gate');
    el.classList.remove('open');
    setTimeout(() => el.style.display = 'none', 300);
}

function go() { window.open(url, '_blank'); hide(); }

fetch('https://view.morning-surf-02e1.workers.dev/')
    .then(r => r.text())
    .then(d => { document.getElementById('view-count').innerText = d; })
    .catch(() => { document.getElementById('view-count').innerText = "—"; });

async function updateStatus() {
    try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${discordUserId}`);
        const json = await res.json();
        if (!json.success) return;

        const d = json.data;
        const dot = document.getElementById('widget-dot');
        const text = document.getElementById('widget-activity');
        const label = document.getElementById('widget-status-label');
        const colors = { 'online': '#43b581', 'idle': '#faa61a', 'dnd': '#f04747', 'offline': '#555' };
        const statusLabelMap = { 'online': 'Online', 'idle': 'Idle', 'dnd': 'DND', 'offline': 'Offline' };

        if (dot) dot.style.backgroundColor = colors[d.discord_status] || '#555';
        if (label) label.innerText = statusLabelMap[d.discord_status] || '';

        if (d.spotify) {
            if (text) text.innerText = `🎵 ${d.spotify.song} – ${d.spotify.artist}`;
        } else {
            const game = d.activities.find(a => a.type === 0);
            if (text) text.innerText = game ? `🎮 ${game.name}` : 'Discord';
        }
    } catch(e) { console.error("Lanyard-Fehler:", e); }
}

document.getElementById('card').style.opacity = "1";
countView();
updateStatus();
setInterval(updateStatus, 10000);
