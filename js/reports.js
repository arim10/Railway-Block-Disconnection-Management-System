/**
 * Reports and Analytics Functions for Railway Block Management System
 */

// Generate dashboard report
function generateDashboardReport(records) {
    const stats = calculateStatistics(records);
    
    return {
        summary: {
            totalRecords: stats.total,
            completedRecords: stats.completed,
            pendingRecords: stats.pending,
            completionRate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
        },
        duration: {
            totalDuration: stats.totalDuration,
            totalDurationFormatted: minutesToHHMM(stats.totalDuration),
            averageDuration: stats.avgDuration,
            averageDurationFormatted: minutesToHHMM(stats.avgDuration),
            totalDelay: stats.totalDelay,
            totalDelayFormatted: minutesToHHMM(stats.totalDelay),
            averageDelay: stats.avgDelay,
            averageDelayFormatted: minutesToHHMM(stats.avgDelay)
        },
        departments: stats.byDepartment,
        workTypes: stats.byTypeOfWork,
        status: stats.byStatus
    };
}

// Generate detailed report
function generateDetailedReport(records, filters = {}) {
    const filtered = filterData(records, filters);
    const report = {
        generatedAt: new Date().toISOString(),
        filters: filters,
        totalRecords: filtered.length,
        records: filtered
    };
    
    return report;
}

// Generate department report
function generateDepartmentReport(records) {
    const departments = {};
    
    records.forEach(record => {
        const dept = record.DEPARTMENT || 'Unknown';
        if (!departments[dept]) {
            departments[dept] = {
                name: dept,
                totalRecords: 0,
                completedRecords: 0,
                pendingRecords: 0,
                totalDuration: 0,
                totalDelay: 0
            };
        }
        
        departments[dept].totalRecords++;
        
        const status = record.APPLIED_NOT_APPLIED_DONE || 'Pending';
        if (status === 'Done') {
            departments[dept].completedRecords++;
        } else {
            departments[dept].pendingRecords++;
        }
        
        departments[dept].totalDuration += parseInt(record.DURATION_AVAILED) || 0;
        departments[dept].totalDelay += parseInt(record.delay) || 0;
    });
    
    return Object.values(departments);
}

// Generate work type report
function generateWorkTypeReport(records) {
    const workTypes = {};
    
    records.forEach(record => {
        const type = record.TYPE_OF_WORK || 'Unknown';
        if (!workTypes[type]) {
            workTypes[type] = {
                name: type,
                totalRecords: 0,
                completedRecords: 0,
                pendingRecords: 0,
                totalDuration: 0
            };
        }
        
        workTypes[type].totalRecords++;
        
        const status = record.APPLIED_NOT_APPLIED_DONE || 'Pending';
        if (status === 'Done') {
            workTypes[type].completedRecords++;
        } else {
            workTypes[type].pendingRecords++;
        }
        
        workTypes[type].totalDuration += parseInt(record.DURATION_AVAILED) || 0;
    });
    
    return Object.values(workTypes);
}

// Generate time series report
function generateTimeSeriesReport(records) {
    const timeSeries = {};
    
    records.forEach(record => {
        const date = record.DATE_DISC;
        if (!date) return;
        
        if (!timeSeries[date]) {
            timeSeries[date] = {
                date: formatDateDisplay(date),
                totalRecords: 0,
                completedRecords: 0,
                totalDuration: 0
            };
        }
        
        timeSeries[date].totalRecords++;
        
        const status = record.APPLIED_NOT_APPLIED_DONE || 'Pending';
        if (status === 'Done') {
            timeSeries[date].completedRecords++;
        }
        
        timeSeries[date].totalDuration += parseInt(record.DURATION_AVAILED) || 0;
    });
    
    return Object.values(timeSeries).sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Export report as PDF (requires external library)
function exportReportAsPDF(reportTitle, reportData) {
    const printWindow = window.open('', '', 'height=600,width=800');
    
    let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${reportTitle}</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body { font-size: 11px; padding: 20px; font-family: Arial, sans-serif; }
                h2 { color: #0d6efd; margin-top: 20px; margin-bottom: 10px; border-bottom: 2px solid #0d6efd; padding-bottom: 5px; }
                h3 { color: #333; font-size: 14px; margin-top: 15px; }
                table { margin-top: 10px; margin-bottom: 20px; width: 100%; }
                th { background-color: #0d6efd; color: white; padding: 8px; text-align: left; }
                td { border-bottom: 1px solid #ddd; padding: 8px; }
                .stat-box { display: inline-block; margin: 10px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
                .stat-value { font-size: 18px; font-weight: bold; color: #0d6efd; }
                .stat-label { font-size: 12px; color: #666; }
                .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #0d6efd; padding-bottom: 10px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>${reportTitle}</h1>
                <p>Generated on: ${new Date().toLocaleString('en-IN')}</p>
            </div>
    `;
    
    // Add content based on report type
    if (reportData.summary) {
        htmlContent += `
            <h2>Executive Summary</h2>
            <div class="stat-box">
                <div class="stat-label">Total Records</div>
                <div class="stat-value">${reportData.summary.totalRecords}</div>
            </div>
            <div class="stat-box">
                <div class="stat-label">Completed</div>
                <div class="stat-value">${reportData.summary.completedRecords}</div>
            </div>
            <div class="stat-box">
                <div class="stat-label">Pending</div>
                <div class="stat-value">${reportData.summary.pendingRecords}</div>
            </div>
            <div class="stat-box">
                <div class="stat-label">Completion Rate</div>
                <div class="stat-value">${reportData.summary.completionRate}%</div>
            </div>
        `;
    }
    
    if (reportData.duration) {
        htmlContent += `
            <h2>Duration Analysis</h2>
            <table>
                <tr>
                    <th>Metric</th>
                    <th>Value</th>
                </tr>
                <tr>
                    <td>Total Duration</td>
                    <td>${reportData.duration.totalDurationFormatted}</td>
                </tr>
                <tr>
                    <td>Average Duration</td>
                    <td>${reportData.duration.averageDurationFormatted}</td>
                </tr>
                <tr>
                    <td>Total Delay</td>
                    <td>${reportData.duration.totalDelayFormatted}</td>
                </tr>
                <tr>
                    <td>Average Delay</td>
                    <td>${reportData.duration.averageDelayFormatted}</td>
                </tr>
            </table>
        `;
    }
    
    if (reportData.departments) {
        htmlContent += '<h2>By Department</h2><table><tr><th>Department</th><th>Count</th></tr>';
        Object.entries(reportData.departments).forEach(([dept, count]) => {
            htmlContent += `<tr><td>${dept}</td><td>${count}</td></tr>`;
        });
        htmlContent += '</table>';
    }
    
    if (reportData.workTypes) {
        htmlContent += '<h2>By Work Type</h2><table><tr><th>Type</th><th>Count</th></tr>';
        Object.entries(reportData.workTypes).forEach(([type, count]) => {
            htmlContent += `<tr><td>${type}</td><td>${count}</td></tr>`;
        });
        htmlContent += '</table>';
    }
    
    htmlContent += '</body></html>';
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    setTimeout(() => {
        printWindow.print();
    }, 250);
}