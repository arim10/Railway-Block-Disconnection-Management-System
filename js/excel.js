/**
 * Excel Export/Import Functions for Railway Block Management System
 */

// Export records to Excel
function exportToExcel(records, filename = 'railway-block-records.xlsx') {
    try {
        // Prepare data
        const data = records.map(record => ({
            'DISC ID': record.DISC_ID,
            'Station': record.STN,
            'Date': formatDateDisplay(record.DATE_DISC),
            'DN No': record.STN_DN_NO,
            'Purpose': record.PURPOSE,
            'Time Applied': record.TIME_APPLIED,
            'Duration Asked': record.DURATION_ASKED,
            'Allowed From': record.ALLOWED_FM,
            'Allowed To': record.ALLOWED_TO,
            'Duration Availed': record.DURATION_AVAILED,
            'Delay': record.delay,
            'Reconnection Time': record.RECONNECTION_TIME,
            'Remark': record.REMARK,
            'Done By': record.DONE_BY,
            'Mega Block': record.MEGA_BLOCK,
            'Gear Name': record.GEAR_NAME,
            'Gear Number': record.GEAR_NUMBER,
            'Section': record.SECTION,
            'Time Submission': record.TIME_SUBMISSION,
            'Block Window From': record.BLOCK_WINDOW_FM,
            'Block Window To': record.BLOCK_WINDOW_TO,
            'Type of Work': record.TYPE_OF_WORK,
            'Line Effected': record.LINE_EFFECTED,
            'Agree/Not Agree': record.AGREE_NOT_AGREE,
            'Status': record.APPLIED_NOT_APPLIED_DONE,
            'Site Details': record.SITE_DETAIL_REPERCUSSIONS,
            'Type of Block': record.TYPE_OF_BLOCK,
            'SR No': record.SR_NO_BLANK,
            'Department': record.DEPARTMENT,
            'From/To Station': record.FROM_TO_STN_BLANK,
            'Board': record.BOARD_BLANK,
            'Allowed': record.ALLOWED_BLANK,
            'JSG BD OPTG': record.JSG_BD_OPTG,
            'Good Work': record.GOOD_WORK,
            'Nakli Board': record.NAKLI_BOARD,
            'Nakli Station To': record.NAKLI_STN_TO,
            'Nakli KM From': record.NAKLI_KM_FM,
            'Nakli KM To': record.NAKLI_KM_TO,
            'Resources': record.RESOURCES,
            'Dept': record.DEPT,
            'SPL RTN': record.SPL_RTN
        }));

        // Create workbook and worksheet
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Records');

        // Set column widths
        const maxWidth = 20;
        worksheet['!cols'] = Array(Object.keys(data[0] || {}).length).fill({ wch: maxWidth });

        // Write file
        XLSX.writeFile(workbook, filename);
        showToast('Excel file exported successfully', 'success');
    } catch (error) {
        console.error('Export error:', error);
        showToast('Error exporting to Excel: ' + error.message, 'danger');
    }
}

// Import records from Excel
function importFromExcel(file) {
    return new Promise((resolve, reject) => {
        try {
            const reader = new FileReader();

            reader.onload = (event) => {
                try {
                    const data = new Uint8Array(event.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const records = XLSX.utils.sheet_to_json(worksheet);

                    // Map Excel columns to database fields
                    const mappedRecords = records.map(record => ({
                        DISC_ID: record['DISC ID'] || generateDISCID(),
                        STN: record['Station'] || '',
                        DATE_DISC: record['Date'] || '',
                        STN_DN_NO: record['DN No'] || '',
                        PURPOSE: record['Purpose'] || '',
                        TIME_APPLIED: record['Time Applied'] || '',
                        DURATION_ASKED: record['Duration Asked'] || 0,
                        ALLOWED_FM: record['Allowed From'] || '',
                        ALLOWED_TO: record['Allowed To'] || '',
                        DURATION_AVAILED: record['Duration Availed'] || 0,
                        delay: record['Delay'] || 0,
                        RECONNECTION_TIME: record['Reconnection Time'] || '',
                        REMARK: record['Remark'] || '',
                        DONE_BY: record['Done By'] || '',
                        MEGA_BLOCK: record['Mega Block'] || '',
                        GEAR_NAME: record['Gear Name'] || '',
                        GEAR_NUMBER: record['Gear Number'] || '',
                        SECTION: record['Section'] || '',
                        TIME_SUBMISSION: record['Time Submission'] || '',
                        BLOCK_WINDOW_FM: record['Block Window From'] || '',
                        BLOCK_WINDOW_TO: record['Block Window To'] || '',
                        TYPE_OF_WORK: record['Type of Work'] || '',
                        LINE_EFFECTED: record['Line Effected'] || '',
                        AGREE_NOT_AGREE: record['Agree/Not Agree'] || '',
                        APPLIED_NOT_APPLIED_DONE: record['Status'] || '',
                        SITE_DETAIL_REPERCUSSIONS: record['Site Details'] || '',
                        TYPE_OF_BLOCK: record['Type of Block'] || '',
                        SR_NO_BLANK: record['SR No'] || '',
                        DEPARTMENT: record['Department'] || '',
                        FROM_TO_STN_BLANK: record['From/To Station'] || '',
                        BOARD_BLANK: record['Board'] || '',
                        ALLOWED_BLANK: record['Allowed'] || '',
                        JSG_BD_OPTG: record['JSG BD OPTG'] || '',
                        GOOD_WORK: record['Good Work'] || '',
                        NAKLI_BOARD: record['Nakli Board'] || '',
                        NAKLI_STN_TO: record['Nakli Station To'] || '',
                        NAKLI_KM_FM: record['Nakli KM From'] || '',
                        NAKLI_KM_TO: record['Nakli KM To'] || '',
                        RESOURCES: record['Resources'] || '',
                        DEPT: record['Dept'] || '',
                        SPL_RTN: record['SPL RTN'] || ''
                    }));

                    resolve(mappedRecords);
                } catch (error) {
                    reject('Error processing Excel file: ' + error.message);
                }
            };

            reader.onerror = () => reject('Error reading file');
            reader.readAsArrayBuffer(file);
        } catch (error) {
            reject('Error importing Excel: ' + error.message);
        }
    });
}

// Generate Excel template
function generateExcelTemplate() {
    const template = [{
        'DISC ID': 'DISC-001',
        'Station': 'Sample Station',
        'Date': '01-01-2024',
        'DN No': 'DN-001',
        'Purpose': 'Maintenance',
        'Time Applied': '10:00',
        'Duration Asked': 120,
        'Allowed From': '10:00',
        'Allowed To': '12:00',
        'Duration Availed': 120,
        'Delay': 0,
        'Reconnection Time': '12:00',
        'Remark': 'Sample remark',
        'Done By': 'Engineer Name',
        'Mega Block': 'No',
        'Gear Name': 'Gear A',
        'Gear Number': 'GN-001',
        'Section': 'Section 1',
        'Time Submission': '09:30',
        'Block Window From': '10:00',
        'Block Window To': '14:00',
        'Type of Work': 'Maintenance',
        'Line Effected': 'Line 1',
        'Agree/Not Agree': 'Agree',
        'Status': 'Done',
        'Site Details': 'Details here',
        'Type of Block': 'Block Type 1',
        'SR No': 'SR-001',
        'Department': 'Engineering',
        'From/To Station': 'Station A to B',
        'Board': 'Board Name',
        'Allowed': 'Yes',
        'JSG BD OPTG': 'JSG Info',
        'Good Work': 'Yes',
        'Nakli Board': 'Board Name',
        'Nakli Station To': 'Station Name',
        'Nakli KM From': 10.5,
        'Nakli KM To': 15.5,
        'Resources': 'Resource list',
        'Dept': 'Department',
        'SPL RTN': 'SPL Info'
    }];

    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    XLSX.writeFile(workbook, 'railway-block-template.xlsx');
    showToast('Template downloaded successfully', 'success');
}