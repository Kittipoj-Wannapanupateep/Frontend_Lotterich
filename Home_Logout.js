document.addEventListener('DOMContentLoaded', function() {
    // Card rotation functionality
    const cards = document.querySelectorAll('.card');
    let currentIndex = 0;
    
    function rotateCards() {
        cards.forEach(card => {
            card.classList.remove('card-1', 'card-2', 'card-3');
        });
        
        cards.forEach((card, index) => {
            const newPosition = (index + currentIndex) % 3;
            card.classList.add(`card-${newPosition + 1}`);
        });
        
        currentIndex = (currentIndex + 1) % 3;
    }
    
    cards.forEach(card => {
        card.addEventListener('click', rotateCards);
    });
    
    rotateCards();

    // Scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe sections
    document.querySelectorAll('.home-section-1, .home-section-2, .features-overview').forEach(section => {
        observer.observe(section);
    });

    // Observe welcome text and image
    document.querySelectorAll('.welcome-text, .welcome-image-container').forEach(element => {
        observer.observe(element);
    });

    // Observe feature items
    document.querySelectorAll('.feature-item').forEach(item => {
        observer.observe(item);
    });
}); 