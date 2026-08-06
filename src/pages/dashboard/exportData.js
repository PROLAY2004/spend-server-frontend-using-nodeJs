import apiInterceptor from '../../api/interceptor.js';
import * as XLSX from 'xlsx-js-style';

const handleBtnClick = async (navigate, toast) => {
	try {
		const toastId = toast.loading('Generating Styled Excel file...', {
			theme: 'dark',
		});

		const response = await apiInterceptor(
			navigate,
			toast,
			'GET',
			'/user/dashboard/export',
		);
		const result = await response.json();

		if (!result.success) {
			toast.error(result.message, {
				position: 'top-right',
				theme: 'dark',
			});

			return false;
		}

		const { analytics, spendOverview, categoryOverview, rawRecords } =
			result.data;
		const summarySheetData = [
			['Analytics Data Spend Server'], // Row 0
			['Export Date:', analytics.date, '', '', '', ''], // Row 1
			[], // Row 2

			['ANALYTICS OVERVIEW'], // Row 3
			[
				'Total Records',
				'Due Record Count',
				'Paid Record Count',
				'Total Due Amount',
				'Total Saving',
				'Collected Amount',
			], // Row 4
			[
				analytics.totalRecords,
				analytics.dueCount,
				analytics.paidCount,
				`₹${analytics.totalDue}`,
				`₹${analytics.totalSavings}`,
				`₹${analytics.totalCollected}`,
			], // Row 5
			[], // Row 6

			['SPEND OVERVIEW'], // Row 7
			['Today', 'This Week', 'This Month', 'This Year', 'Lifetime', ''], // Row 8
			[
				`₹${spendOverview.today}`,
				`₹${spendOverview.week}`,
				`₹${spendOverview.month}`,
				`₹${spendOverview.year}`,
				`₹${spendOverview.lifetime}`,
				'',
			], // Row 9
			[], // Row 10

			['CATEGORY WISE DIVISION'], // Row 11
			['Category', 'Today', 'This Week', 'This Month', 'This Year', 'Lifetime'], // Row 12
		];

		// Append Category Data
		Object.keys(categoryOverview).forEach((cat) => {
			const data = categoryOverview[cat];
			summarySheetData.push([
				cat,
				`₹${data.today}`,
				`₹${data.week}`,
				`₹${data.month}`,
				`₹${data.year}`,
				`₹${data.lifetime}`,
			]);
		});

		const wsSummary = XLSX.utils.aoa_to_sheet(summarySheetData);

		// --- STYLING SHEET 1 ---

		// Reusable Styles
		const titleStyle = {
			font: { bold: true, sz: 16, color: { rgb: 'FFFFFF' } },
			fill: { fgColor: { rgb: '4F46E5' } },
			alignment: { horizontal: 'center', vertical: 'center' },
		};
		const sectionHeaderStyle = {
			font: { bold: true, sz: 12, color: { rgb: 'FFFFFF' } },
			fill: { fgColor: { rgb: '374151' } },
			alignment: { horizontal: 'center' },
		};
		const tableHeaderStyle = {
			font: { bold: true },
			fill: { fgColor: { rgb: 'F3F4F6' } },
			alignment: { horizontal: 'center' },
			border: { bottom: { style: 'thin', color: { rgb: '000000' } } },
		};
		const centerAlign = { alignment: { horizontal: 'center' } };

		// Apply Merges
		wsSummary['!merges'] = [
			{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }, // Merge Title (A1:F1)
			{ s: { r: 3, c: 0 }, e: { r: 3, c: 5 } }, // Merge Analytics Header
			{ s: { r: 7, c: 0 }, e: { r: 7, c: 5 } }, // Merge Spend Header
			{ s: { r: 11, c: 0 }, e: { r: 11, c: 5 } }, // Merge Category Header
		];

		// Helper to apply styles to specific rows
		const applyStyleToRow = (sheet, rowIndex, style, colCount = 6) => {
			for (let C = 0; C < colCount; ++C) {
				const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: C });
				if (!sheet[cellAddress]) sheet[cellAddress] = { t: 's', v: '' }; // Create empty cell if undefined
				sheet[cellAddress].s = style;
			}
		};

		// Apply Styles to specific rows (0-indexed)
		applyStyleToRow(wsSummary, 0, titleStyle); // Main Title
		wsSummary['A2'].s = { font: { bold: true } }; // Export Date Label

		applyStyleToRow(wsSummary, 3, sectionHeaderStyle); // Analytics Section
		applyStyleToRow(wsSummary, 4, tableHeaderStyle); // Analytics Columns
		applyStyleToRow(wsSummary, 5, centerAlign); // Analytics Values

		applyStyleToRow(wsSummary, 7, sectionHeaderStyle); // Spend Section
		applyStyleToRow(wsSummary, 8, tableHeaderStyle); // Spend Columns
		applyStyleToRow(wsSummary, 9, centerAlign); // Spend Values

		applyStyleToRow(wsSummary, 11, sectionHeaderStyle); // Category Section
		applyStyleToRow(wsSummary, 12, tableHeaderStyle); // Category Columns

		// Column Widths
		wsSummary['!cols'] = [
			{ wch: 25 },
			{ wch: 18 },
			{ wch: 18 },
			{ wch: 18 },
			{ wch: 18 },
			{ wch: 18 },
		];

		// 3. Build Sheet 2: Raw Records
		const wsRecords = XLSX.utils.json_to_sheet(rawRecords);

		// Apply Table Header Style to Row 0 of Sheet 2
		const recordCols = Object.keys(rawRecords[0] || {}).length;
		applyStyleToRow(wsRecords, 0, tableHeaderStyle, recordCols);

		// Column Widths for Sheet 2
		wsRecords['!cols'] = [
			{ wch: 12 },
			{ wch: 25 },
			{ wch: 22 },
			{ wch: 15 },
			{ wch: 15 },
			{ wch: 15 },
			{ wch: 15 },
			{ wch: 35 },
		];

		// 4. Create Workbook and Export
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, wsSummary, 'Analytics Overview');
		XLSX.utils.book_append_sheet(workbook, wsRecords, 'All Records Data');

		const fileName = `Spend_Analytics_${new Date().toISOString().split('T')[0]}.xlsx`;
		XLSX.writeFile(workbook, fileName);

		toast.update(toastId, {
			render: 'Excel exported successfully!',
			type: 'success',
			isLoading: false,
			autoClose: 3000,
		});
	} catch (error) {
		toast.update(toastId, {
			render: 'Failed to export data.',
			type: 'error',
			isLoading: false,
			autoClose: 3000,
		});

		return false;
	}
};

export default handleBtnClick;
