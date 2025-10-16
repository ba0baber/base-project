class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = this.themeToggle?.querySelector('.theme-toggle__icon');
        this.themeText = this.themeToggle?.querySelector('.theme-toggle__text');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }
    init() {
        this.applyTheme(this.currentTheme);
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }    
        this.animateSkills();
    }
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }
    applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);   
        if (this.themeIcon && this.themeText) {
            if (theme === 'dark') {
                this.themeIcon.textContent = '☀️';
                this.themeText.textContent = 'Светлая тема';
            } else {
                this.themeIcon.textContent = '🌙';
                this.themeText.textContent = 'Тёмная тема';
            }
        }
    }    
    animateSkills() {
        const skillProgresses = document.querySelectorAll('.skill-progress');
        skillProgresses.forEach(progress => {
            const percent = progress.style.width;
            progress.style.width = '0%';
            setTimeout(() => {
                progress.style.width = percent;
            }, 500);
        });
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});