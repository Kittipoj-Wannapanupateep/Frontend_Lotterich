// Initialize the chart when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeChart();
    initializeEventListeners();
});

// Initialize the bar chart for Top 5 numbers
function initializeChart() {
    const ctx = document.getElementById('topNumbersChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['12', '34', '56', '78', '90'],
            datasets: [{
                label: 'จำนวนครั้งที่ถูกรางวัล',
                data: [15, 12, 10, 8, 7],
                backgroundColor: '#FFD700',
                borderColor: '#FFD700',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                },
                x: {
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
                        color: '#ffffff'
                    }
                }
            }
        }
    });
}

// Initialize event listeners
function initializeEventListeners() {
    // Handle draw date selection
    const drawDateSelect = document.getElementById('drawDate');
    if (drawDateSelect) {
        drawDateSelect.addEventListener('change', function() {
            // Here you would typically fetch new data based on the selected date
            console.log('Selected date:', this.value);
        });
    }

    // Handle number checker form submission
    const numberInput = document.getElementById('numberInput');
    const checkButton = document.querySelector('.checker-form .btn-primary');
    const errorMessage = document.getElementById('numberError');
    
    if (checkButton && numberInput) {
        // Only allow numeric input
        numberInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
            // Hide error message when user starts typing
            if (errorMessage) {
                errorMessage.textContent = '';
                errorMessage.classList.remove('show');
            }
        });

        checkButton.addEventListener('click', function() {
            const number = numberInput.value.trim();
            if (number && /^\d{2,6}$/.test(number)) {
                // Here you would typically fetch the number's history
                console.log('Checking number:', number);
                
                // Example of how the result would be displayed
                const resultBox = document.querySelector('.result-box');
                if (resultBox) {
                    const resultText = resultBox.querySelector('p');
                    const winningDates = resultBox.querySelector('.winning-dates ul');
                    
                    if (resultText) {
                        resultText.textContent = `เลข ${number} ถูกรางวัลทั้งหมด 3 ครั้ง`;
                    }
                    
                    if (winningDates) {
                        // This would be populated with actual data from the backend
                        winningDates.innerHTML = `
                            <li>เคยถูกรางวัลเลขสองตัวท้าย งวดวันที่ 16/03/2024</li>
                            <li>เคยถูกรางวัลเลขสามตัวท้าย งวดวันที่ 01/03/2024</li>
                            <li>เคยถูกรางวัลเลขสามตัวหน้า งวดวันที่ 16/02/2024</li>
                        `;
                    }
                }
                // Hide error message if validation passes
                if (errorMessage) {
                    errorMessage.textContent = '';
                    errorMessage.classList.remove('show');
                }
            } else {
                // Show error message
                if (errorMessage) {
                    errorMessage.textContent = 'กรุณากรอกเลข 2-6 หลักเท่านั้น';
                    errorMessage.classList.add('show');
                }
            }
        });
    }
} 