const firebaseConfig = {
    apiKey: "AIzaSyDddh8Ua-4CRt0DlEyx9ps65YlE2n2JCuY",
    authDomain: "wedding-wardah-ikhwan.firebaseapp.com",
    projectId: "wedding-wardah-ikhwan",
    storageBucket: "wedding-wardah-ikhwan.firebasestorage.app",
    messagingSenderId: "399328237574",
    appId: "1:399328237574:web:6e839158d29f80dacb8b87"
};


firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const messagesRef = database.ref('weddingMessages');

const urlParams = new URLSearchParams(window.location.search);
const guestName = urlParams.get('to') || 'Tamu Undangan';
document.getElementById('guest-name').innerText = guestName;
document.getElementById('nama').value = guestName;

const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
let isPlaying = false;

document.getElementById('open-btn').addEventListener('click', () => {
    document.getElementById('opening-page').classList.add('hidden');
    document.body.classList.remove('locked');
    window.scrollTo(0, 0);

    bgMusic.play().then(() => {
        isPlaying = true;
        musicToggle.classList.add('visible');
        musicToggle.classList.add('spin-animation');
    }).catch((e) => {
        musicToggle.classList.add('visible');
    });
});

musicToggle.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicToggle.classList.remove('spin-animation');
    } else {
        bgMusic.play();
        musicToggle.classList.add('spin-animation');
    }
    isPlaying = !isPlaying;
});

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up').forEach(element => {
    observer.observe(element);
});

function copyText(elementId) {
    const textToCopy = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
        showToast("Berhasil disalin: " + textToCopy);
    }).catch(err => {
        showToast("Gagal menyalin!");
    });
}

function showToast(message) {
    const toast = document.getElementById('custom-toast');
    toast.innerText = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

const messageList = document.getElementById('messages-list');

messagesRef.on('value', (snapshot) => {
    messageList.innerHTML = '';
    const data = snapshot.val();
    if (data) {
        const keys = Object.keys(data);
        keys.reverse().forEach(key => {
            const msg = data[key];
            const newMessage = document.createElement('div');
            newMessage.classList.add('message-item');
            
            let badgeStyle = msg.kehadiran === 'Hadir' ? 'background-color: #e6f4ea; color: #1e8e3e;' : 'background-color: #fce8e6; color: #d93025;';
            
            newMessage.innerHTML = `
                <div class="message-header">
                    <span class="message-name">${msg.nama}</span>
                    <span class="message-badge" style="${badgeStyle}">${msg.kehadiran}</span>
                </div>
                <div class="message-body">
                    "${msg.ucapan}"
                </div>
            `;
            messageList.appendChild(newMessage);
        });
    }
});

document.getElementById('rsvp-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const nama = document.getElementById('nama').value;
    const kehadiran = document.getElementById('kehadiran').value;
    const ucapan = document.getElementById('ucapan').value;

    if (nama && kehadiran && ucapan) {
        const newMessageObj = {
            nama: nama,
            kehadiran: kehadiran,
            ucapan: ucapan,
            timestamp: Date.now()
        };
        
        messagesRef.push(newMessageObj).then(() => {
            showToast("Terima kasih atas doa dan ucapannya!");
            document.getElementById('ucapan').value = '';
            document.getElementById('kehadiran').value = '';
        }).catch((error) => {
            showToast("Gagal mengirim ucapan!");
        });
    }
});