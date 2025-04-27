
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the monthly spending chart
    const chartCanvas = document.getElementById('monthlySpendingChart');
    if (chartCanvas instanceof HTMLCanvasElement) {
        const ctx = chartCanvas.getContext('2d');
        if (ctx) {
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['สัปดาห์ที่ 1', 'สัปดาห์ที่ 2', 'สัปดาห์ที่ 3', 'สัปดาห์ที่ 4'],
                    datasets: [{
                        label: 'จำนวนเงินที่ใช้ซื้อสลาก (บาท)',
                        data: [80, 240, 0, 160],
                        backgroundColor: 'rgba(255, 215, 0, 0.5)',
                        borderColor: 'rgba(255, 215, 0, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'จำนวนเงิน (บาท)',
                                color: '#ffffff'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#ffffff'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'สัปดาห์',
                                color: '#ffffff'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#ffffff'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: '#FFD700'
                            }
                        }
                    }
                }
            });
        }
    }

    // Handle "บันทึกเพิ่มทันที" button click
    document.querySelector('.latest-ticket .btn-primary')?.addEventListener('click', function() {
        window.location.href = 'Collection_Login.html';
    });

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
                
                // Stagger the animation of child elements in section 1
                if (entry.target.classList.contains('home-section-1')) {
                    const children = entry.target.querySelectorAll('.welcome-text, .latest-ticket-container');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('visible');
                        }, index * 200); // Delay each child's animation
                    });
                }
            }
        });
    }, observerOptions);

    // Observe sections
    document.querySelectorAll('.home-section-1, .home-section-2, .home-section-3').forEach(section => {
        observer.observe(section);
    });

    // Observe latest results elements
    document.querySelectorAll('.latest-results, .section-title, .draw-date, .prize-container').forEach(element => {
        observer.observe(element);
    });

    // Observe prize items
    document.querySelectorAll('.prize-item').forEach(item => {
        observer.observe(item);
    });

    // Observe chart-box and stats-box elements (for section 3 animation)
    document.querySelectorAll('.chart-box, .stats-box').forEach(element => {
        observer.observe(element);
    });
});
