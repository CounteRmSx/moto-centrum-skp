document.addEventListener('DOMContentLoaded', () => {

    /*       1. MENU MOBILNE (HAMBURGER)*/
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const isActive = navMenu.classList.toggle('active');
            mobileToggle.setAttribute('aria-expanded', isActive);
            
            // Zmiana ikony z paska na krzyżyk
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.className = isActive ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
            }
        });

        // Zamknij menu po kliknięciu w jakikolwiek link nawigacji
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileToggle.setAttribute('aria-expanded', 'false');
                    const icon = mobileToggle.querySelector('i');
                    if (icon) icon.className = 'fa-solid fa-bars';
                }
            });
        });
    }

    /* 2. PRZEŁĄCZNIK MOTYWU (DARK / LIGHT MODE) */
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');

    // Wczytanie zapisanego motywu z localStorage
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeToggle) {
            themeToggle.querySelector('i').className = 'fa-solid fa-sun';
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            
            // Zmiana ikony i zapis w localStorage
            themeToggle.querySelector('i').className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    /*
       3. SEKCJA FAQ */
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains('active');

            // Zamknij wszystkie pozostałe elementy FAQ
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });

            // Otwórz kliknięty element (jeśli nie był otwarty)
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });

    /*
       4. KARUZELA ZDJĘĆ */
    const track = document.getElementById('slider-track');
    const slides = document.querySelectorAll('.slider-slide');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    const indicatorsContainer = document.getElementById('slider-indicators');

    if (track && slides.length > 0) {
        let currentIndex = 0;
        const totalSlides = slides.length;
        let autoplayTimer = null;

        // Dynamiczne tworzenie kropek (wskaźników)
        if (indicatorsContainer) {
            indicatorsContainer.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const indicator = document.createElement('button');
                indicator.classList.add('slider-indicator');
                if (i === 0) indicator.classList.add('active');
                indicator.setAttribute('aria-label', `Przejdź do zdjęcia ${i + 1}`);
                indicator.addEventListener('click', () => goToSlide(i));
                indicatorsContainer.appendChild(indicator);
            }
        }

        const indicators = document.querySelectorAll('.slider-indicator');

        function updateSlider() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            indicators.forEach((ind, i) => {
                ind.classList.toggle('active', i === currentIndex);
            });
        }

        function goToSlide(index) {
            currentIndex = index;
            updateSlider();
            resetAutoplay();
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateSlider();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateSlider();
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetAutoplay();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetAutoplay();
            });
        }

        // Automatyczne przewijanie co 5 sekund
        function startAutoplay() {
            autoplayTimer = setInterval(nextSlide, 5000);
        }

        function resetAutoplay() {
            clearInterval(autoplayTimer);
            startAutoplay();
        }

        startAutoplay();
    }

    /* 5. WALIDACJA FORMULARZA KONTAKTOWEGO */
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        const nameInput = document.getElementById('name');
        const phoneInput = document.getElementById('phone');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        const formStatus = document.getElementById('form-status');

        const showError = (input, errorEl, message) => {
            input.classList.add('invalid');
            if (errorEl) errorEl.textContent = message;
        };

        const clearError = (input, errorEl) => {
            input.classList.remove('invalid');
            if (errorEl) errorEl.textContent = '';
        };

        // Imię: min 3 znaki, brak cyfr, dopuszczalne litery, spacje i myślniki
        const validateName = (name) => {
            const trimmed = name.trim();
            const hasDigits = /\d/.test(trimmed);
            const validChars = /^[a-zA-Za-zęóąśłżźćŃĘÓĄŚŁŻŹĆ\s-]+$/.test(trimmed);
            return trimmed.length >= 3 && !hasDigits && validChars;
        };

        const validateEmail = (email) => {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
        };

        const validatePhone = (phone) => {
            return /^(\+48\s?)?\d{3}[\s-]?\d{3}[\s-]?\d{3}$/.test(phone.trim());
        };

        const validateMessage = (msg) => {
            return msg.trim().length >= 10;
        };

        // Sprawdzanie pola przy opuszczeniu (blur) oraz w trakcie pisania (input)
        const setupFieldValidation = (input, errorId, validateFn, errorMsg) => {
            const errorEl = document.getElementById(errorId);

            input.addEventListener('blur', () => {
                if (!validateFn(input.value)) {
                    showError(input, errorEl, errorMsg);
                } else {
                    clearError(input, errorEl);
                }
            });

            input.addEventListener('input', () => {
                if (input.classList.contains('invalid') && validateFn(input.value)) {
                    clearError(input, errorEl);
                }
            });
        };

        setupFieldValidation(nameInput, 'name-error', validateName, 'Wpisz poprawne imię i nazwisko (min. 3 litery, bez cyfr).');
        setupFieldValidation(phoneInput, 'phone-error', validatePhone, 'Wprowadź poprawny 9-cyfrowy numer telefonu.');
        setupFieldValidation(emailInput, 'email-error', validateEmail, 'Wprowadź poprawny adres e-mail.');
        setupFieldValidation(messageInput, 'message-error', validateMessage, 'Wiadomość musi mieć co najmniej 10 znaków.');

        // Walidacja końcowa przy wysłaniu
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const isNameValid = validateName(nameInput.value);
            const isPhoneValid = validatePhone(phoneInput.value);
            const isEmailValid = validateEmail(emailInput.value);
            const isMessageValid = validateMessage(messageInput.value);

            if (!isNameValid) showError(nameInput, document.getElementById('name-error'), 'Wpisz poprawne imię i nazwisko (min. 3 litery, bez cyfr).');
            if (!isPhoneValid) showError(phoneInput, document.getElementById('phone-error'), 'Wprowadź poprawny 9-cyfrowy numer telefonu.');
            if (!isEmailValid) showError(emailInput, document.getElementById('email-error'), 'Wprowadź poprawny adres e-mail.');
            if (!isMessageValid) showError(messageInput, document.getElementById('message-error'), 'Wiadomość musi mieć co najmniej 10 znaków.');

            if (isNameValid && isPhoneValid && isEmailValid && isMessageValid) {
                formStatus.className = 'form-status success';
                formStatus.textContent = 'Dziękujemy! Twoja wiadomość została wysłana. Skontaktujemy się niebawem.';
                contactForm.reset();

                setTimeout(() => {
                    formStatus.className = 'form-status';
                    formStatus.textContent = '';
                }, 5000);
            } else {
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Uzupełnij poprawnie wszystkie pola formularza.';
            }
        });
    }

    /*    6. PRZYCISK POWROTU NA GÓRĘ */
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

});