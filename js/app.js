/**
 * Main Application Logic for Railway Block Management System
 */

let currentEditID = null;
let allRecords = [];

// Initialize application
async function initApp() {
    try {
        // Initialize database
        await initDB();
        console.log('App initialized');
        
        // Load records
        await loadAllRecords();
        
        // Setup event listeners
        setupEventListeners();
        
        // Populate form with auto-generated DISC ID
        const entryForm = document.getElementById('entryForm');
        if (entryForm) {
            document.getElementById('DISC_ID').value = generateDISCID();
        }
        
        // Update dashboard
        updateDashboard(allRecords);
        
    } catch (error) {
        console.error('App initialization error:', error);
        showToast('Failed to initialize app: ' + error.message, 'danger');
    }
}

// Load all records from database
async function loadAllRecords() {
    try {
        allRecords = await getAllRecords();
        console.log(`Loaded ${allRecords.length} records`);
        refreshDataTable();
        updateDashboard(allRecords);
    } catch (error) {
        console.error('Error loading records:', error);
        showToast('Error loading records: ' + error.message, 'danger');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('[data-tab]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = link.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
    
    // Form submission
    const entryForm = document.getElementById('entryForm');
    if (entryForm) {
        entryForm.addEventListener('submit', handleFormSubmit);
        attachCalculationListeners(entryForm);
    }
    
    // Search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    // Filters
    document.getElementById('filterDepartment')?.addEventListener('change', refreshDataTable);
    document.getElementById('filterTypeOfWork')?.addEventListener('change', refreshDataTable);
    document.getElementById('filterStatus')?.addEventListener('change', refreshDataTable);
    document.getElementById('sortBy')?.addEventListener('change', refreshDataTable);
    
    // Tools
    document.getElementById('exportExcel')?.addEventListener('click', handleExportExcel);
    document.getElementById('printBtn')?.addEventListener('click', handlePrint);
    document.getElementById('backupBtn')?.addEventListener('click', handleBackup);
    document.getElementById('restoreBtn')?.addEventListener('click', handleRestore);
    document.getElementById('clearDataBtn')?.addEventListener('click', handleClearData);
    
    // Hidden file input for restore
    document.getElementById('restoreFileInput')?.addEventListener('change', handleRestoreFile);
}

// Switch tab
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    
    // Remove active class from nav links
    document.querySelectorAll('[data-tab]').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected tab
    const tabElement = document.getElementById(tabName);
    if (tabElement) {
        tabElement.style.display = 'block';
    }
    
    // Add active class to clicked link
    document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
    
    // Refresh data if switching to data-table
    if (tabName === 'data-table') {
        populateFilters();
        refreshDataTable();
    }
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const validation = validateForm(form);
    
    if (!validation.valid) {
        showToast('Please fill all required fields correctly', 'danger');
        return;
    }
    
    try {
        const formData = new FormData(form);
        const record = Object.fromEntries(formData);
        
        // Save record
        showToast('Saving record...', 'info', 0);
        await saveRecord(record);
        
        showToast('Record saved successfully', 'success');
        
        // Reset form
        form.reset();
        document.getElementById('DISC_ID').value = generateDISCID();
        
        // Reload data
        await loadAllRecords();
        
        // Switch to data table
        setTimeout(() => {
            switchTab('data-table');
        }, 500);
        
    } catch (error) {
        console.error('Save error:', error);
        showToast('Error saving record: ' + error.message, 'danger');
    }
}

// Refresh data table
function refreshDataTable() {
    const searchTerm = document.getElementById('searchInput')?.value || '';
    const departmentFilter = document.getElementById('filterDepartment')?.value || '';
    const typeOfWorkFilter = document.getElementById('filterTypeOfWork')?.value || '';
    const statusFilter = document.getElementById('filterStatus')?.value || '';
    const sortBy = document.getElementById('sortBy')?.value || 'date-desc';
    
    // Filter records
    let filtered = allRecords;
    
    if (searchTerm) {
        filtered = filtered.filter(record => {
            return Object.values(record).some(value => {
                if (!value) return false;
                return String(value).toLowerCase().includes(searchTerm.toLowerCase());
            });
        });
    }
    
    if (departmentFilter) {
        filtered = filtered.filter(r => r.DEPARTMENT === departmentFilter);
    }
    
    if (typeOfWorkFilter) {
        filtered = filtered.filter(r => r.TYPE_OF_WORK === typeOfWorkFilter);
    }
    
    if (statusFilter) {
        filtered = filtered.filter(r => r.APPLIED_NOT_APPLIED_DONE === statusFilter);
    }
    
    // Sort records
    switch (sortBy) {
        case 'date-asc':
            filtered = sortByKey(filtered, 'DATE_DISC', true);
            break;
        case 'disc-asc':
            filtered = sortByKey(filtered, 'DISC_ID', true);
            break;
        case 'date-desc':
        default:
            filtered = sortByKey(filtered, 'DATE_DISC', false);
    }
    
    // Render table
    renderTable(filtered);
}

// Render data table
function renderTable(records) {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (records.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center text-muted py-4">No records found</td></tr>';
        return;
    }
    
    records.forEach(record => {
        const status = record.APPLIED_NOT_APPLIED_DONE || 'Pending';
        let statusBadge = '<span class="status-pending">Pending</span>';
        
        if (status === 'Done') {
            statusBadge = '<span class="status-completed">Done</span>';
        } else if (status === 'Applied') {
            statusBadge = '<span class="status-done">Applied</span>';
        }
        
        const row = `
            <tr>
                <td><strong>${record.DISC_ID}</strong></td>
                <td>${record.STN || '-'}</td>
                <td>${formatDateDisplay(record.DATE_DISC) || '-'}</td>
                <td>${record.DEPARTMENT || '-'}</td>
                <td>${record.TYPE_OF_WORK || '-'}</td>
                <td>${record.DURATION_AVAILED || 0}</td>
                <td>${record.delay || 0}</td>
                <td>${statusBadge}</td>
                <td>
                    <button class="btn btn-sm btn-primary btn-icon" onclick="viewRecord('${record.DISC_ID}')" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning btn-icon" onclick="editRecord('${record.DISC_ID}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-icon" onclick="deleteRecordConfirm('${record.DISC_ID}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// View record
function viewRecord(discID) {
    const record = allRecords.find(r => r.DISC_ID === discID);
    if (!record) {
        showToast('Record not found', 'danger');
        return;
    }
    
    let html = '<div class="row">';
    
    const fields = [
        { label: 'DISC ID', value: record.DISC_ID },
        { label: 'Station', value: record.STN },
        { label: 'Date', value: formatDateDisplay(record.DATE_DISC) },
        { label: 'DN No', value: record.STN_DN_NO },
        { label: 'Purpose', value: record.PURPOSE },
        { label: 'Time Applied', value: record.TIME_APPLIED },
        { label: 'Duration Asked', value: record.DURATION_ASKED },
        { label: 'Allowed From', value: record.ALLOWED_FM },
        { label: 'Allowed To', value: record.ALLOWED_TO },
        { label: 'Duration Availed', value: record.DURATION_AVAILED },
        { label: 'Delay', value: record.delay },
        { label: 'Reconnection Time', value: record.RECONNECTION_TIME },
        { label: 'Remark', value: record.REMARK },
        { label: 'Done By', value: record.DONE_BY },
        { label: 'Department', value: record.DEPARTMENT },
        { label: 'Type of Work', value: record.TYPE_OF_WORK },
        { label: 'Status', value: record.APPLIED_NOT_APPLIED_DONE },
        { label: 'Mega Block', value: record.MEGA_BLOCK }
    ];
    
    fields.forEach(field => {
        html += `
            <div class="col-md-6 mb-3">
                <strong>${field.label}:</strong>
                <p class="text-muted">${field.value || '-'}</p>
            </div>
        `;
    });
    
    html += '</div>';
    
    document.getElementById('viewModalBody').innerHTML = html;
    new bootstrap.Modal(document.getElementById('viewModal')).show();
}

// Edit record
function editRecord(discID) {
    currentEditID = discID;
    const record = allRecords.find(r => r.DISC_ID === discID);
    
    if (!record) {
        showToast('Record not found', 'danger');
        return;
    }
    
    // Populate form in modal
    let html = `<form id="editForm">`;
    
    const fields = [
        'DISC_ID', 'STN', 'DATE_DISC', 'STN_DN_NO', 'PURPOSE', 'TIME_APPLIED', 'DURATION_ASKED',
        'ALLOWED_FM', 'ALLOWED_TO', 'RECONNECTION_TIME', 'REMARK', 'DONE_BY', 'MEGA_BLOCK',
        'GEAR_NAME', 'GEAR_NUMBER', 'SECTION', 'TIME_SUBMISSION', 'BLOCK_WINDOW_FM',
        'BLOCK_WINDOW_TO', 'TYPE_OF_WORK', 'LINE_EFFECTED', 'AGREE_NOT_AGREE',
        'APPLIED_NOT_APPLIED_DONE', 'SITE_DETAIL_REPERCUSSIONS', 'TYPE_OF_BLOCK', 'SR_NO_BLANK',
        'DEPARTMENT', 'FROM_TO_STN_BLANK', 'BOARD_BLANK', 'ALLOWED_BLANK', 'DURATION_AVAILED',
        'JSG_BD_OPTG', 'GOOD_WORK', 'NAKLI_BOARD', 'NAKLI_STN_TO', 'NAKLI_KM_FM', 'NAKLI_KM_TO',
        'RESOURCES', 'DEPT', 'SPL_RTN', 'delay'
    ];
    
    fields.forEach(field => {
        const value = record[field] || '';
        const readonly = field === 'DISC_ID' ? 'readonly' : '';
        const fieldType = ['DATE_DISC', 'DATE_DISC'].includes(field) ? 'date' : 
                         ['TIME_APPLIED', 'ALLOWED_FM', 'ALLOWED_TO', 'RECONNECTION_TIME', 'TIME_SUBMISSION', 'BLOCK_WINDOW_FM', 'BLOCK_WINDOW_TO'].includes(field) ? 'time' :
                         ['DURATION_ASKED', 'DURATION_AVAILED', 'delay', 'NAKLI_KM_FM', 'NAKLI_KM_TO'].includes(field) ? 'number' : 'text';
        
        html += `
            <div class="mb-2">
                <label class="form-label">${field.replace(/_/g, ' ')}</label>
                <input type="${fieldType}" class="form-control" name="${field}" value="${value}" ${readonly}>
            </div>
        `;
    });
    
    html += '</form>';
    
    document.getElementById('editModalBody').innerHTML = html;
    
    // Handle save
    document.getElementById('saveEditBtn').onclick = async () => {
        const form = document.getElementById('editForm');
        const formData = new FormData(form);
        const updatedRecord = Object.fromEntries(formData);
        
        try {
            await saveRecord(updatedRecord);
            showToast('Record updated successfully', 'success');
            bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
            await loadAllRecords();
        } catch (error) {
            showToast('Error updating record: ' + error.message, 'danger');
        }
    };
    
    new bootstrap.Modal(document.getElementById('editModal')).show();
}

// Delete record confirmation
function deleteRecordConfirm(discID) {
    if (confirm(`Are you sure you want to delete record ${discID}?`)) {
        deleteRecordById(discID);
    }
}

// Delete record
async function deleteRecordById(discID) {
    try {
        showToast('Deleting record...', 'info', 0);
        await deleteRecord(discID);
        showToast('Record deleted successfully', 'success');
        await loadAllRecords();
    } catch (error) {
        showToast('Error deleting record: ' + error.message, 'danger');
    }
}

// Handle search
function handleSearch() {
    refreshDataTable();
}

// Populate filter dropdowns
function populateFilters() {
    const departments = getUniqueValues(allRecords, 'DEPARTMENT');
    const workTypes = getUniqueValues(allRecords, 'TYPE_OF_WORK');
    
    const deptSelect = document.getElementById('filterDepartment');
    const workSelect = document.getElementById('filterTypeOfWork');
    
    if (deptSelect) {
        const currentValue = deptSelect.value;
        deptSelect.innerHTML = '<option value="">All Departments</option>';
        departments.forEach(dept => {
            deptSelect.innerHTML += `<option value="${dept}">${dept}</option>`;
        });
        deptSelect.value = currentValue;
    }
    
    if (workSelect) {
        const currentValue = workSelect.value;
        workSelect.innerHTML = '<option value="">All Types</option>';
        workTypes.forEach(type => {
            workSelect.innerHTML += `<option value="${type}">${type}</option>`;
        });
        workSelect.value = currentValue;
    }
}

// Export to Excel
async function handleExportExcel() {
    try {
        const records = await getAllRecords();
        exportToExcel(records);
    } catch (error) {
        showToast('Error exporting: ' + error.message, 'danger');
    }
}

// Print
function handlePrint() {
    const records = allRecords;
    printData(records, 'Railway Block Management Records');
}

// Backup
async function handleBackup() {
    try {
        showToast('Creating backup...', 'info', 0);
        await exportDataAsJSON();
        showToast('Backup created successfully', 'success');
    } catch (error) {
        showToast('Error creating backup: ' + error.message, 'danger');
    }
}

// Restore
function handleRestore() {
    document.getElementById('restoreFileInput').click();
}

// Handle restore file
async function handleRestoreFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
        showToast('Restoring data...', 'info', 0);
        const count = await importDataFromJSON(file);
        showToast(`${count} records restored successfully`, 'success');
        await loadAllRecords();
    } catch (error) {
        showToast('Error restoring: ' + error.message, 'danger');
    }
    
    // Reset input
    e.target.value = '';
}

// Clear all data
function handleClearData() {
    if (confirm('Are you sure you want to delete ALL data? This cannot be undone!')) {
        deleteAllRecords()
            .then(() => {
                showToast('All data cleared successfully', 'success');
                allRecords = [];
                refreshDataTable();
                updateDashboard([]);
            })
            .catch(error => showToast('Error clearing data: ' + error.message, 'danger'));
    }
}

// Initialize app on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initApp);