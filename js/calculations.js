/**
 * Calculation Functions for Railway Block Management System
 */

// Calculate duration availed
function calculateDurationAvailed(allowedFrom, allowedTo) {
    if (!allowedFrom || !allowedTo) return 0;
    return calculateMinutesBetweenTimes(allowedFrom, allowedTo);
}

// Calculate delay
function calculateDelay(durationAsked, durationAvailed) {
    if (!durationAsked || !durationAvailed) return 0;
    const delay = parseInt(durationAvailed) - parseInt(durationAsked);
    return delay >= 0 ? delay : 0;
}

// Attach calculation listeners to form
function attachCalculationListeners(formElement) {
    const allowedFmField = formElement.querySelector('#ALLOWED_FM');
    const allowedToField = formElement.querySelector('#ALLOWED_TO');
    const durationAvailedField = formElement.querySelector('#DURATION_AVAILED');
    const durationAskedField = formElement.querySelector('#DURATION_ASKED');
    const delayField = formElement.querySelector('#delay');
    
    // Function to update calculations
    function updateCalculations() {
        // Calculate duration availed
        const durationAvailed = calculateDurationAvailed(
            allowedFmField.value,
            allowedToField.value
        );
        durationAvailedField.value = durationAvailed;
        
        // Calculate delay
        const delay = calculateDelay(
            durationAskedField.value,
            durationAvailed
        );
        delayField.value = delay;
    }
    
    // Add event listeners
    if (allowedFmField) allowedFmField.addEventListener('change', updateCalculations);
    if (allowedToField) allowedToField.addEventListener('change', updateCalculations);
    if (durationAskedField) durationAskedField.addEventListener('change', updateCalculations);
}

// Calculate statistics from records
function calculateStatistics(records) {
    const stats = {
        total: records.length,
        completed: 0,
        pending: 0,
        totalDuration: 0,
        totalDelay: 0,
        avgDuration: 0,
        avgDelay: 0,
        byDepartment: {},
        byTypeOfWork: {},
        byStatus: {}
    };
    
    records.forEach(record => {
        // Count by status
        const status = record.APPLIED_NOT_APPLIED_DONE || 'Pending';
        if (status === 'Done') {
            stats.completed++;
        } else {
            stats.pending++;
        }
        
        // Update status count
        stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
        
        // Calculate durations
        const durationAvailed = parseInt(record.DURATION_AVAILED) || 0;
        const delay = parseInt(record.delay) || 0;
        
        stats.totalDuration += durationAvailed;
        stats.totalDelay += delay;
        
        // Count by department
        const dept = record.DEPARTMENT || 'Unknown';
        stats.byDepartment[dept] = (stats.byDepartment[dept] || 0) + 1;
        
        // Count by type of work
        const type = record.TYPE_OF_WORK || 'Unknown';
        stats.byTypeOfWork[type] = (stats.byTypeOfWork[type] || 0) + 1;
    });
    
    // Calculate averages
    if (stats.total > 0) {
        stats.avgDuration = Math.round(stats.totalDuration / stats.total);
        stats.avgDelay = Math.round(stats.totalDelay / stats.total);
    }
    
    return stats;
}

// Update dashboard with statistics
function updateDashboard(records) {
    const stats = calculateStatistics(records);
    
    // Update stat cards
    document.getElementById('totalRecords').textContent = stats.total;
    document.getElementById('completedRecords').textContent = stats.completed;
    document.getElementById('pendingRecords').textContent = stats.pending;
    document.getElementById('totalDuration').textContent = minutesToHHMM(stats.totalDuration);
    
    // Update charts
    updateDepartmentChart(stats.byDepartment);
    updateTypeOfWorkChart(stats.byTypeOfWork);
}

// Create sample chart (requires Chart.js)
function updateDepartmentChart(data) {
    const canvas = document.getElementById('departmentChart');
    if (!canvas) return;
    
    // Destroy existing chart if exists
    if (window.departmentChart instanceof Chart) {
        window.departmentChart.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    window.departmentChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(data),
            datasets: [{
                data: Object.values(data),
                backgroundColor: [
                    '#0d6efd',
                    '#198754',
                    '#ffc107',
                    '#dc3545',
                    '#0dcaf0',
                    '#6f42c1'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function updateTypeOfWorkChart(data) {
    const canvas = document.getElementById('workTypeChart');
    if (!canvas) return;
    
    // Destroy existing chart if exists
    if (window.workTypeChart instanceof Chart) {
        window.workTypeChart.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    window.workTypeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(data),
            datasets: [{
                label: 'Number of Records',
                data: Object.values(data),
                backgroundColor: '#0d6efd',
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}