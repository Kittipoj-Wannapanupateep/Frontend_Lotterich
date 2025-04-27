// Line Chart
const ctxLine = document.getElementById('lineChart').getContext('2d');
const lineChart = new Chart(ctxLine, {
    type: 'line',
    data: {
        labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
            label: 'รายจ่าย',
            data: [80, 0, 320, 160, 720, 160],
            borderColor: '#ffd700',
            backgroundColor: 'rgba(255, 215, 0, 0.1)',
            fill: true,
            tension: 0.3
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { ticks: { color: '#fff' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
            y: { ticks: { color: '#fff' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }
        },
        plugins: {
            legend: { 
                display: true,
                position: 'top',
                labels: { color: '#fff' }
            }
        }
    }
});

// Donut Chart 1
new Chart(document.getElementById('donutChart1'), {
    type: 'doughnut',
    data: {
        labels: ['กำไร', 'ขาดทุน'],
        datasets: [{
            data: [20, 80],
            backgroundColor: ['#ffd700','#888']
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { 
                position: 'right',
                labels: { color: '#fff' }
            }
        }
    }
});

// Donut Chart 2
new Chart(document.getElementById('donutChart2'), {
    type: 'doughnut',
    data: {
        labels: ['ถูกรางวัล', 'ไม่ถูกรางวัล'],
        datasets: [{
            data: [7, 93],
            backgroundColor: ['#4caf50', '#888']
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { 
                position: 'right',
                labels: { color: '#fff' }
            }
        }
    }
}); 