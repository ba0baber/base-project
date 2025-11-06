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
        this.initProjectModals();
        this.initProjectFilters();
        this.initDiary();
        this.initContactForm();
        this.initResumeDownload();
        this.initAccessibility(); 
    }
    initAccessibility() {
        if (!document.querySelector('.skip-link')) {
            const skipLink = document.createElement('a');
            skipLink.href = '#main-content';
            skipLink.className = 'skip-link';
            skipLink.textContent = 'Перейти к основному содержимому';
            document.body.insertBefore(skipLink, document.body.firstChild);
        }
        const main = document.querySelector('main');
        if (main && !main.id) {
            main.id = 'main-content';
        }

        const nav = document.querySelector('.nav');
        if (nav && !nav.getAttribute('aria-label')) {
            nav.setAttribute('aria-label', 'Основная навигация');
        }

        this.enhanceModalsAccessibility();
    }

    enhanceModalsAccessibility() {

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

    initResumeDownload() {
        const downloadBtn = document.getElementById('downloadResume');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                const link = document.createElement('a');
                link.href = 'assets/resume.pdf';
                link.download = 'Резюме_Есина_Варвара.pdf';
                
                fetch(link.href)
                    .then(response => {
                        if (response.ok) {
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            alert('Резюме скачивается...');
                        } else {
                            alert('Файл резюме не найден. Пожалуйста, свяжитесь со мной для получения резюме.');
                        }
                    })
                    .catch(error => {
                        console.error('Ошибка:', error);
                        alert('Произошла ошибка при скачивании резюме.');
                    });
            });
        }
    }

    initProjectModals() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.filter-button')) {
                    const title = card.querySelector('.project-card__title').textContent;
                    const tech = card.querySelector('.project-card__tech').textContent;
                    const description = card.querySelector('p').textContent;
                    this.showProjectModal(title, tech, description);
                }
            });
        });
    }

    showProjectModal(title, tech, description) {
        const modal = document.createElement('div');
        modal.className = 'project-modal';

        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'modal-title');
        
        modal.innerHTML = `
            <div class="modal-content">
                <button class="close-modal" aria-label="Закрыть диалоговое окно">
                    &times;
                    <span class="visually-hidden">Закрыть</span>
                </button>
                <h3 id="modal-title">${title}</h3>
                <p class="modal-tech">${tech}</p>
                <div class="modal-description">
                    <p>${description}</p>
                    <div class="modal-screenshots">
                        <p><em>Скриншоты проекта будут добавлены позже...</em></p>
                    </div>
                    <div class="modal-links">
                        <a href="#" class="modal-link" aria-label="Посмотреть живую версию проекта ${title}">
                            <span aria-hidden="true">🌐</span>
                            Живая версия
                        </a>
                        <a href="#" class="modal-link" aria-label="Посмотреть исходный код проекта ${title}">
                            <span aria-hidden="true">💻</span>
                            Исходный код
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }

    initProjectFilters() {
        const filterButtons = document.querySelectorAll('.filter-button');
        const projectCards = document.querySelectorAll('.project-card');
        
        filterButtons.forEach(button => {
            button.setAttribute('role', 'button');
            button.setAttribute('aria-pressed', button.classList.contains('filter-button--active') ? 'true' : 'false');
            
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => {
                    btn.classList.remove('filter-button--active');
                    btn.setAttribute('aria-pressed', 'false');
                });
                button.classList.add('filter-button--active');
                button.setAttribute('aria-pressed', 'true');
                
                const filter = button.getAttribute('data-filter');
                
                projectCards.forEach(card => {
                    const tech = card.getAttribute('data-tech');
                    
                    if (filter === 'all') {
                        card.style.display = 'block';
                        card.removeAttribute('aria-hidden');
                    } else {
                        if (tech && tech.includes(filter)) {
                            card.style.display = 'block';
                            card.removeAttribute('aria-hidden');
                        } else {
                            card.style.display = 'none';
                            card.setAttribute('aria-hidden', 'true');
                        }
                    }
                });
            });
        });
    }

    initDiary() {
        const addEntryButton = document.querySelector('.add-entry-button');
        if (addEntryButton) {
            addEntryButton.addEventListener('click', () => this.showAddEntryForm());
        }
    }

    showAddEntryForm() {
        const modal = document.createElement('div');
        modal.className = 'diary-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'diary-title');
        
        modal.innerHTML = `
            <div class="modal-content">
                <button class="close-modal" aria-label="Закрыть форму добавления записи">
                    &times;
                    <span class="visually-hidden">Закрыть</span>
                </button>
                <h3 id="diary-title">Добавить запись в дневник</h3>
                <form id="addEntryForm">
                    <div class="form-group">
                        <label for="entryDate">Дата:</label>
                        <input type="date" id="entryDate" name="entryDate" required
                               aria-required="true">
                    </div>
                    <div class="form-group">
                        <label for="entryText">Описание:</label>
                        <textarea id="entryText" name="entryText" required 
                                  placeholder="Опишите, что вы изучили..." 
                                  rows="3"
                                  aria-required="true"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="entryStatus">Статус:</label>
                        <select id="entryStatus" name="entryStatus">
                            <option value="completed">Завершено</option>
                            <option value="progress">В процессе</option>
                            <option value="planned">Запланировано</option>
                        </select>
                    </div>
                    <div class="form-buttons">
                        <button type="submit" class="submit-button">Добавить запись</button>
                        <button type="button" class="cancel-button">Отмена</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const today = new Date().toISOString().split('T')[0];
        modal.querySelector('#entryDate').value = today;
        
        modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        modal.querySelector('.cancel-button').addEventListener('click', () => modal.remove());
        
        modal.querySelector('#addEntryForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addNewEntry(modal);
        });
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }

    addNewEntry(modal) {
        const date = modal.querySelector('#entryDate').value;
        const text = modal.querySelector('#entryText').value;
        const status = modal.querySelector('#entryStatus').value;
        
        if (!date || !text) {
            alert('Пожалуйста, заполните все поля');
            return;
        }
        
        const formattedDate = new Date(date).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long'
        });
        
        const entriesList = document.querySelector('.entries-list');
        const newEntry = document.createElement('div');
        newEntry.className = `entry-item entry-item--${status}`;
        newEntry.innerHTML = `
            <span class="entry-date">${formattedDate}</span>
            <span class="entry-text">${text}</span>
            <span class="entry-status" aria-label="Статус: ${this.getStatusText(status)}">
                ${this.getStatusIcon(status)}
            </span>
        `;
        
        entriesList.insertBefore(newEntry, entriesList.firstChild);
        modal.remove();
        
        newEntry.style.animation = 'fadeInUp 0.6s ease-out';
        
        alert('Запись успешно добавлена!');
    }

    getStatusIcon(status) {
        const icons = {
            completed: '✓',
            progress: '⟳',
            planned: '○'
        };
        return icons[status] || '○';
    }

    getStatusText(status) {
        const texts = {
            completed: 'Завершено',
            progress: 'В процессе',
            planned: 'Запланировано'
        };
        return texts[status] || 'Неизвестно';
    }

    initContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            const inputs = contactForm.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                if (input.hasAttribute('required')) {
                    input.setAttribute('aria-required', 'true');
                }
            });

            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.validateContactForm(contactForm);
            });
            
            const cancelButton = contactForm.querySelector('.cancel-button');
            if (cancelButton) {
                cancelButton.addEventListener('click', () => {
                    contactForm.reset();
                });
            }
        }
    }

    validateContactForm(form) {
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
}

document.addEventListener('DOMContentLoaded', function() {
    new ThemeManager();
   
    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
    });
});