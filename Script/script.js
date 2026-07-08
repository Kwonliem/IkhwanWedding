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
        alert("Berhasil disalin: " + textToCopy);
    }).catch(err => {
        alert("Gagal menyalin: " + err);
    });
}