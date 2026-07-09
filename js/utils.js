/**
 * Utility Functions for Railway Block Management System
 */

// Generate unique DISC ID
function generateDISCID() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `DISC-${timestamp}-${random}`;
}

// Format time to HH:MM format
function formatTime(timeString) {
    if (!timeString) return '';
    return timeString.substring(0, 5);
}

// Calculate minutes between two times
function calculateMinutesBetweenTimes(fromTime, toTime) {
    if (!fromTime || !toTime) return 0;
    
    const from = new Date(`2000-01-01 ${fromTime}`);
    const to = new Date(`2000-01-01 ${toTime}`);
    
    // Handle case where end time is next day
    if (to < from) {
        to.setDate(to.getDate() + 1);
    }
    
    return Math.round((to - from) / (1000 * 60));
}

// Convert minutes to HH:MM format
function minutesToHHMM(minutes) {
    if (!minutes || minutes === 0) return '0h';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
}

// Format date to DD-MM-YYYY
function formatDateDisplay(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

// Get current date in YYYY-MM-DD format
function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Get current time in HH:MM format
function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Show toast notification
function showToast(message, type = 'info', duration = 3000) {
    const toastEl = document.getElementById('loadingToast');
    const messageEl = document.getElementById('toastMessage');
    
    // Remove existing class
    toastEl.classList.remove('bg-info', 'bg-success', 'bg-danger', 'bg-warning');
    
    // Add new class
    toastEl.classList.add(`bg-${type}`);
    messageEl.textContent = message;
    
    // Create and show toast
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
    
    // Auto hide
    if (duration > 0) {
        setTimeout(() => {
            toast.hide();
        }, duration);
    }
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}

// Deep copy object
function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// Debounce function
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if online
function isOnline() {
    return navigator.onLine;
}

// Update sync status
function updateSyncStatus() {
    const statusEl = document.getElementById('syncStatus');
    if (isOnline()) {
        statusEl.innerHTML = '<i class="fas fa-cloud-check"></i> Online';
        statusEl.className = 'badge bg-success ms-2';
    } else {
        statusEl.innerHTML = '<i class="fas fa-wifi"></i> Offline';
        statusEl.className = 'badge bg-warning ms-2';
    }
}

// Print data
function printData(data, title = 'Report') {
    const printWindow = window.open('', '', 'height=600,width=800');
    
    let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${title}</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body { font-size: 12px; padding: 20px; }
                table { margin-top: 20px; }
                th, td { padding: 8px; border: 1px solid #ddd; }
                th { background-color: #0d6efd; color: white; }
                .header { text-align: center; margin-bottom: 20px; }
                .header h2 { margin-bottom: 5px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>${title}</h2>
                <p>Generated on: ${new Date().toLocaleString()}</p>
            </div>
    `;
    
    if (Array.isArray(data)) {
        htmlContent += '<table class="table table-striped"><thead><tr>';
        if (data.length > 0) {
            Object.keys(data[0]).forEach(key => {
                htmlContent += `<th>${key}</th>`;
            });
        }
        htmlContent += '</tr></thead><tbody>';
        data.forEach(item => {
            htmlContent += '<tr>';
            Object.values(item).forEach(value => {
                htmlContent += `<td>${value || '-'}</td>`;
            });
            htmlContent += '</tr>';
        });
        htmlContent += '</tbody></table>';
    }
    
    htmlContent += '</body></html>';
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    setTimeout(() => {
        printWindow.print();
    }, 250);
}

// Export to CSV
function exportToCSV(data, filename = 'export.csv') {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function convertToCSV(data) {
    let csv = '';
    
    if (Array.isArray(data) && data.length > 0) {
        const headers = Object.keys(data[0]);
        csv = headers.map(h => `"${h}"`).join(',') + '\n';
        
        data.forEach(item => {
            const row = headers.map(h => {
                const val = item[h];
                if (val === null || val === undefined) return '';
                return `"${String(val).replace(/"/g, '""')}"`;
            }).join(',');
            csv += row + '\n';
        });
    }
    
    return csv;
}

// Get unique values from array
function getUniqueValues(array, key) {
    const values = array.map(item => item[key]);
    return [...new Set(values)].filter(v => v);
}

// Sort array by key
function sortByKey(array, key, ascending = true) {
    return [...array].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        
        if (typeof aVal === 'string') {
            return ascending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        
        return ascending ? aVal - bVal : bVal - aVal;
    });
}

// Filter array by multiple conditions
function filterData(data, conditions) {
    return data.filter(item => {
        return Object.entries(conditions).every(([key, value]) => {
            if (!value) return true;
            if (Array.isArray(value)) {
                return value.includes(item[key]);
            }
            return String(item[key]).toLowerCase().includes(String(value).toLowerCase());
        });
    });
}

// Update online/offline status on load
window.addEventListener('load', updateSyncStatus);
window.addEventListener('online', updateSyncStatus);
window.addEventListener('offline', updateSyncStatus);