/**
 * IndexedDB Storage Functions for Railway Block Management System
 */

const DB_NAME = 'RailwayBlockDB';
const DB_VERSION = 1;
const STORE_NAME = 'records';

let db;

// Initialize IndexedDB
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => {
            console.error('Database failed to open');
            reject(request.error);
        };
        
        request.onsuccess = () => {
            db = request.result;
            console.log('Database opened successfully');
            resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
            db = event.target.result;
            
            // Create object store
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'DISC_ID' });
                objectStore.createIndex('DATE_DISC', 'DATE_DISC', { unique: false });
                objectStore.createIndex('DEPARTMENT', 'DEPARTMENT', { unique: false });
                objectStore.createIndex('TYPE_OF_WORK', 'TYPE_OF_WORK', { unique: false });
                objectStore.createIndex('APPLIED_NOT_APPLIED_DONE', 'APPLIED_NOT_APPLIED_DONE', { unique: false });
                console.log('Object store created');
            }
        };
    });
}

// Add/Update record
function saveRecord(record) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject('Database not initialized');
            return;
        }
        
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        
        // Add timestamp
        record.timestamp = new Date().toISOString();
        
        const request = objectStore.put(record);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(record);
    });
}

// Get all records
function getAllRecords() {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject('Database not initialized');
            return;
        }
        
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.getAll();
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
}

// Get record by DISC_ID
function getRecordByID(discID) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject('Database not initialized');
            return;
        }
        
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.get(discID);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
}

// Delete record
function deleteRecord(discID) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject('Database not initialized');
            return;
        }
        
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.delete(discID);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
    });
}

// Delete all records
function deleteAllRecords() {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject('Database not initialized');
            return;
        }
        
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.clear();
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
    });
}

// Get records by index
function getRecordsByIndex(indexName, value) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject('Database not initialized');
            return;
        }
        
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const objectStore = transaction.objectStore(STORE_NAME);
        const index = objectStore.index(indexName);
        const request = index.getAll(value);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
}

// Search records
function searchRecords(query) {
    return new Promise((resolve, reject) => {
        getAllRecords()
            .then(records => {
                const results = records.filter(record => {
                    const searchStr = query.toLowerCase();
                    return Object.values(record).some(value => {
                        if (value === null || value === undefined) return false;
                        return String(value).toLowerCase().includes(searchStr);
                    });
                });
                resolve(results);
            })
            .catch(reject);
    });
}

// Get records count
function getRecordsCount() {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject('Database not initialized');
            return;
        }
        
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.count();
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
}

// Export data as JSON
function exportDataAsJSON() {
    return new Promise((resolve, reject) => {
        getAllRecords()
            .then(records => {
                const dataStr = JSON.stringify(records, null, 2);
                const blob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `railway-block-backup-${new Date().getTime()}.json`;
                link.click();
                URL.revokeObjectURL(url);
                resolve();
            })
            .catch(reject);
    });
}

// Import data from JSON
function importDataFromJSON(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                
                if (!Array.isArray(data)) {
                    reject('Invalid JSON format');
                    return;
                }
                
                // Clear existing data
                deleteAllRecords()
                    .then(() => {
                        // Import new data
                        let importCount = 0;
                        data.forEach((record, index) => {
                            saveRecord(record)
                                .then(() => {
                                    importCount++;
                                    if (importCount === data.length) {
                                        resolve(importCount);
                                    }
                                })
                                .catch(err => reject(err));
                        });
                    })
                    .catch(reject);
            } catch (error) {
                reject('Error parsing JSON: ' + error.message);
            }
        };
        
        reader.onerror = () => reject('Error reading file');
        reader.readAsText(file);
    });
}

// Initialize DB on page load
document.addEventListener('DOMContentLoaded', () => {
    initDB().catch(err => console.error('Failed to initialize database:', err));
});