const urlParams = new URLSearchParams(window.location.search);
const guestName = urlParams.get('to') || 'Tamu Undangan';
document.getElementById('guest-name').innerText = guestName;

document.getElementById('open-btn').addEventListener('click', () => {
    document.getElementById('opening-page').classList.add('hidden');
    document.body.classList.remove('locked');
    window.scrollTo(0, 0);
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


document.getElementById('rsvp-form').addEventListener('submit', function(e) {
    e.preventDefault();

    
    const nama = document.getElementById('nama').value;
    const kehadiran = document.getElementById('kehadiran').value;
    const ucapan = document.getElementById('ucapan').value;

    
    if(nama && kehadiran && ucapan) {
        
        const messageList = document.getElementById('messages-list');
        const newMessage = document.createElement('div');
        newMessage.classList.add('message-item');

        
        let badgeStyle = '';
        if(kehadiran === 'Hadir') {
            badgeStyle = 'background-color: #e6f4ea; color: #1e8e3e;'; 
        } else {
            badgeStyle = 'background-color: #fce8e6; color: #d93025;'; 
        }

        
        newMessage.innerHTML = `
            <div class="message-header">
                <span class="message-name">${nama}</span>
                <span class="message-badge" style="${badgeStyle}">${kehadiran}</span>
            </div>
            <div class="message-body">
                "${ucapan}"
            </div>
        `;

        
        messageList.prepend(newMessage);

        
        showToast("Terima kasih atas doa dan ucapannya!");

        
        document.getElementById('rsvp-form').reset();
    }
});