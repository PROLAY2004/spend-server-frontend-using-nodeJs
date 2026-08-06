export default function pdfDownloader(data) {
	const { pdfData, fileName } = data;
	const byteCharacters = atob(pdfData);
	const byteNumbers = new Array(byteCharacters.length);

	for (let i = 0; i < byteCharacters.length; i++) {
		byteNumbers[i] = byteCharacters.charCodeAt(i);
	}

	const byteArray = new Uint8Array(byteNumbers);
	const blob = new Blob([byteArray], { type: 'application/pdf' });
	const blobUrl = URL.createObjectURL(blob);
	const link = document.createElement('a');

	link.href = blobUrl;
	link.download = fileName;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(blobUrl);

    return true;
}
