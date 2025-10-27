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
    initProjectModals() {
        if (document.querySelector('.project-card')) {
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
    }

    showProjectModal(title, tech, description) {
        const modal = document.createElement('div');
        modal.className = 'project-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3>${title}</h3>
                <p class="modal-tech">${tech}</p>
                <div class="modal-description">
                    <p>${description}</p>
                    <div class="modal-screenshots">
                        <p><em>Скриншоты проекта будут добавлены позже...</em></p>
                    </div>
                    <div class="modal-links">
                        <a href="#" class="modal-link">🌐 Живая версия</a>
                        <a href="#" class="modal-link">💻 Исходный код</a>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    initProjectFilters() {
        if (document.querySelector('.projects-filter')) {
            const filterButtons = document.querySelectorAll('.filter-button');
            const projectCards = document.querySelectorAll('.project-card');
            
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    filterButtons.forEach(btn => btn.classList.remove('filter-button--active'));
                    button.classList.add('filter-button--active');
                    
                    const filter = button.textContent.toLowerCase();
                    
                    projectCards.forEach(card => {
                        if (filter === 'все') {
                            card.style.display = 'block';
                        } else {
                            const tech = card.querySelector('.project-card__tech').textContent.toLowerCase();
                            if (tech.includes(filter)) {
                                card.style.display = 'block';
                            } else {
                                card.style.display = 'none';
                            }
                        }
                    });
                });
            });
        }
    }

    initDiary() {
        if (document.querySelector('.add-entry-button')) {
            const addEntryButton = document.querySelector('.add-entry-button');
            addEntryButton.addEventListener('click', () => this.showAddEntryForm());
        }
    }

    showAddEntryForm() {
        const form = document.createElement('div');
        form.className = 'diary-modal';
        form.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3>Добавить запись в дневник</h3>
                <form id="addEntryForm">
                    <div class="form-group">
                        <label for="entryDate">Дата:</label>
                        <input type="date" id="entryDate" name="entryDate" required>
                    </div>
                    <div class="form-group">
                        <label for="entryText">Описание:</label>
                        <textarea id="entryText" name="entryText" required placeholder="Опишите, что вы изучили..."></textarea>
                    </div>
                    <div class="form-group">
                        <label for="entryStatus">Статус:</label>
                        <select id="entryStatus" name="entryStatus">
                            <option value="completed">Завершено</option>
                            <option value="progress">В процессе</option>
                            <option value="planned">Запланировано</option>
                        </select>
                    </div>
                    <button type="submit" class="submit-button">Добавить запись</button>
                </form>
            </div>
        `;
        
        document.body.appendChild(form);
        
        form.querySelector('.close-modal').addEventListener('click', () => form.remove());
        form.addEventListener('click', (e) => e.target === form && form.remove());
        
        form.querySelector('#addEntryForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addNewEntry(form);
        });
    }

    addNewEntry(form) {
        const date = form.querySelector('#entryDate').value;
        const text = form.querySelector('#entryText').value;
        const status = form.querySelector('#entryStatus').value;
        
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
            <span class="entry-status">${this.getStatusIcon(status)}</span>
        `;
        
        entriesList.appendChild(newEntry);
        form.remove();
        
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


function initProjectModals() {
}

function initProjectFilters() {
   
}

function initDiary() {
    
}