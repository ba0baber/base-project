class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.init();
    }
    init() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.applyTheme(savedTheme);
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        this.animateSkills();
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                validateForm(contactForm);
            });
        }
    } 
    toggleTheme() {
        const currentTheme = document.body.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    } 
    applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        if (this.themeToggle) {
            const icon = this.themeToggle.querySelector('.theme-toggle-icon');
            const text = this.themeToggle.querySelector('.theme-toggle-text'); 
            if (theme === 'dark') {
                icon.textContent = '☀️';
                text.textContent = 'Светлая тема';
            } else {
                icon.textContent = '🌙';
                text.textContent = 'Тёмная тема';
            }
        }
    }
    
    animateSkills() {
        const skillProgresses = document.querySelectorAll('.skill-progress');
        skillProgresses.forEach(progress => {
            progress.style.transition = 'width 1.5s ease-in-out';
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    new ThemeManager();
   
    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
    });
});

function validateForm(form) {
    const name = form.querySelector('input[name="name"]');
    const email = form.querySelector('input[name="email"]');
    const message = form.querySelector('textarea[name="message"]');
    
    if (!name.value.trim()) {
        alert('Пожалуйста, введите ваше имя');
        name.focus();
        return false;
    }  
    if (!email.value.trim() || !email.value.includes('@')) {
        alert('Пожалуйста, введите корректный email');
        email.focus();
        return false;
    }
    if (!message.value.trim()) {
        alert('Пожалуйста, введите сообщение');
        message.focus();
        return false;
    }
    alert('Сообщение отправлено!');
    form.reset();
    return false; 
}