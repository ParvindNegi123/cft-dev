const exportToCSV = (data, fileName) => {

    // Convert the data to a CSV format
    const csvContent = convertToCSV(data);

    // Create a Blob containing the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv' });

    // Create a download link and trigger a click event
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();

    // Clean up the URL object
    URL.revokeObjectURL(url);
};

// Helper function to convert data to CSV format
const convertToCSV = (data) => {
    const csvRows = [];
    const headers = Object.keys(data[0]);

    // Add header row
    csvRows.push(headers.join(','));

    // Add data rows
    data.forEach((row) => {
        const values = headers.map((header) => row[header]);
        csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
};

export default exportToCSV;
