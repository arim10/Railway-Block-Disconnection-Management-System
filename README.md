# Railway Block & Disconnection Management System

## Overview
A comprehensive offline Progressive Web Application (PWA) for managing railway blocks and disconnection operations. This system enables seamless data entry, management, reporting, and analytics for railway block operations.

## Features

### Core Functionality
✅ **Responsive Design** - Bootstrap 5 responsive UI for all devices
✅ **Offline Support** - Full offline capability with IndexedDB storage
✅ **Progressive Web App** - Installable as native app on mobile/desktop
✅ **Data Persistence** - All data stored locally in IndexedDB

### Data Management
✅ **Auto-generated DISC ID** - Unique identification for each record
✅ **Complete CRUD Operations** - Create, Read, Update, Delete functionality
✅ **Advanced Search** - Search across all fields
✅ **Filter by Department** - Filter records by department
✅ **Filter by Type of Work** - Filter by work type
✅ **Filter by Status** - Filter by application status
✅ **Multi-column Sort** - Sort by date, DISC ID, and other fields

### Calculations & Validation
✅ **Auto-calculated Duration** - Calculates duration from allowed times
✅ **Auto-calculated Delay** - Calculates delay automatically
✅ **Date Validation** - Validates date format and values
✅ **Time Validation** - Validates time format and values
✅ **Form Validation** - Real-time field validation
✅ **Required Field Validation** - Ensures all required fields are filled

### Reporting & Export
✅ **Excel Export (.xlsx)** - Export records to Excel format
✅ **Excel Import** - Import data from Excel files
✅ **Print Functionality** - Print records directly
✅ **JSON Backup** - Backup data as JSON format
✅ **JSON Restore** - Restore data from JSON backup
✅ **Dashboard Analytics** - Visual charts and statistics

### Dashboard
✅ **Total Records** - Count of all records
✅ **Completed Records** - Count of completed records
✅ **Pending Records** - Count of pending records
✅ **Total Duration** - Sum of all durations
✅ **Department Chart** - Records distribution by department
✅ **Work Type Chart** - Records distribution by work type

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Bootstrap 5.3
- **Icons**: Font Awesome 6.4
- **Storage**: IndexedDB (Offline)
- **Excel**: SheetJS (XLSX)
- **Charts**: Chart.js
- **PWA**: Service Worker, Web Manifest

## Project Structure

```
railway-block-management/
├── index.html              # Main HTML file
├── manifest.json           # PWA Manifest
├── service-worker.js       # Service Worker for offline support
├── css/
│   └── style.css          # Custom styles
├── js/
│   ├── app.js             # Main application logic
│   ├── storage.js         # IndexedDB operations
│   ├── validation.js      # Form validation functions
│   ├── calculations.js    # Calculation functions
│   ├── excel.js           # Excel import/export
│   ├── reports.js         # Reporting functions
│   └── utils.js           # Utility functions
└── README.md              # This file
```

## Database Schema

### Records Store (IndexedDB)

Key fields stored for each railway block record:

- **DISC_ID** (Primary Key) - Unique disconnection ID
- **STN** - Station name
- **DATE_DISC** - Disconnection date
- **STN_DN_NO** - Station DN number
- **PURPOSE** - Purpose of disconnection
- **TIME_APPLIED** - Time of application
- **DURATION_ASKED** - Duration requested (minutes)
- **ALLOWED_FM** - Allowed from time
- **ALLOWED_TO** - Allowed to time
- **DURATION_AVAILED** - Duration utilized (auto-calculated)
- **delay** - Delay amount (auto-calculated)
- **RECONNECTION_TIME** - Time of reconnection
- **REMARK** - Additional remarks
- **DONE_BY** - Person who completed the task
- **DEPARTMENT** - Department responsible
- **TYPE_OF_WORK** - Type of work performed
- **APPLIED_NOT_APPLIED_DONE** - Status (Applied/Not Applied/Done)
- **MEGA_BLOCK** - Is it a mega block?
- **GEAR_NAME** - Equipment/Gear name
- **GEAR_NUMBER** - Equipment number (S&T)
- **SECTION** - Railway section
- **TIME_SUBMISSION** - Submission time
- **BLOCK_WINDOW_FM** - Block window start time
- **BLOCK_WINDOW_TO** - Block window end time
- **LINE_EFFECTED** - Line affected
- **AGREE_NOT_AGREE** - Approval status
- **SITE_DETAIL_REPERCUSSIONS** - Site details and repercussions
- **TYPE_OF_BLOCK** - Type of block
- **SR_NO_BLANK** - SR number (blank field)
- **FROM_TO_STN_BLANK** - From/To stations (blank field)
- **BOARD_BLANK** - Board (blank field)
- **ALLOWED_BLANK** - Allowed (blank field)
- **JSG_BD_OPTG** - JSG Board OPTG for copy
- **GOOD_WORK** - Good work status
- **NAKLI_BOARD** - Nakli board info
- **NAKLI_STN_TO** - Nakli station to
- **NAKLI_KM_FM** - Nakli km from
- **NAKLI_KM_TO** - Nakli km to
- **RESOURCES** - Resources used
- **DEPT** - Department
- **SPL_RTN** - Special return info

## Installation

### Local Setup
1. Clone the repository
2. Open `index.html` in a modern web browser
3. The app will work offline automatically

### Install as PWA
1. Open the app in a compatible browser (Chrome, Edge, Firefox)
2. Click the install button in the address bar
3. Or use the browser menu: "Install app"
4. App will be installed as a standalone application

## Usage

### Creating a New Entry
1. Navigate to **New Entry** tab
2. Fill in all required fields (marked with *)
3. Optional fields can be left blank
4. Duration and Delay will auto-calculate
5. Click **Save Record**

### Viewing Records
1. Go to **All Records** tab
2. View all saved records in a table
3. Use search to find specific records
4. Filter by Department, Type of Work, or Status
5. Sort by Latest, Oldest, or DISC ID

### Editing Records
1. Click the **Edit** button (pencil icon) for any record
2. Modify the fields in the modal
3. Click **Save Changes**

### Deleting Records
1. Click the **Delete** button (trash icon)
2. Confirm the deletion

### Exporting Data
1. Go to **Tools** menu
2. Select **Export to Excel** to download as .xlsx file
3. Or **Print** to print records

### Backup & Restore
1. **Backup JSON** - Downloads all data as JSON file
2. **Restore JSON** - Select a JSON backup file to restore
3. **Clear All Data** - Deletes all records (careful!)

## Keyboard Shortcuts
- `Ctrl+N` / `Cmd+N` - New Entry
- `Ctrl+P` / `Cmd+P` - Print
- `Ctrl+S` / `Cmd+S` - Save Form

## Browser Compatibility

| Browser | Support |
|---------|--------|
| Chrome 88+ | ✅ Full |
| Edge 88+ | ✅ Full |
| Firefox 87+ | ✅ Full |
| Safari 14+ | ✅ Partial (PWA limited) |
| Mobile Safari | ✅ Partial (PWA limited) |

## Data Security & Privacy

- **No Server Communication** - All data stays on your device
- **Local Storage Only** - Uses IndexedDB for client-side storage
- **No Cloud Sync** - Data is not backed up to any server
- **User Control** - You have complete control over backup/restore

## Performance Optimization

- **Lazy Loading** - Charts and heavy components load on demand
- **Debounced Search** - Search is debounced to avoid excessive queries
- **Efficient Rendering** - Only visible elements are rendered
- **Cached Assets** - Service Worker caches all assets for offline use

## Troubleshooting

### App not working offline?
- Check if Service Worker is registered (F12 > Application > Service Workers)
- Clear browser cache and reinstall app
- Check browser console for errors

### Data not saving?
- Ensure IndexedDB is enabled in browser
- Check if storage quota is exceeded
- Try clearing browser cache

### Excel import not working?
- Ensure Excel file has correct column headers
- Check file is in .xlsx format
- Verify all required columns are present

## Future Enhancements

- [ ] Cloud synchronization option
- [ ] Multi-user support with role-based access
- [ ] Advanced analytics and dashboard
- [ ] Email report generation
- [ ] Mobile app (React Native/Flutter)
- [ ] Database migration tools
- [ ] Data encryption at rest
- [ ] API integration for backend sync

## Support & Contribution

For issues, feature requests, or contributions, please open an issue or pull request on GitHub.

## License

MIT License - Feel free to use in your projects

## Author

Developed for Railway Block Management Systems

---

**Version**: 1.0.0
**Last Updated**: 2024
**Status**: Production Ready ✅
