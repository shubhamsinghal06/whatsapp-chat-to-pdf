// Entry point: wires DOM events. Must load last so the helper functions and
// DOM-ref globals (from state.js) are defined first.

console.log('Script loaded!');
console.log('Elements found:', {
    uploadBox: !!uploadBox,
    fileInput: !!fileInput,
    openHtmlBtn: !!openHtmlBtn,
    downloadHtmlBtn: !!downloadHtmlBtn,
    dateFilter: !!dateFilter,
    clearFilterBtn: !!clearFilterBtn
});

uploadBox.addEventListener('click', () => {
    console.log('Upload box clicked, opening file picker...');
    fileInput.click();
});

uploadBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadBox.classList.add('drag-over');
});

uploadBox.addEventListener('dragleave', () => {
    uploadBox.classList.remove('drag-over');
});

uploadBox.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadBox.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFile(files[0]);
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) handleFile(e.target.files[0]);
});

openHtmlBtn.addEventListener('click', openAsHtml);
downloadHtmlBtn.addEventListener('click', downloadAsHtml);

startDateInput.addEventListener('change', updateDateFilter);
endDateInput.addEventListener('change', updateDateFilter);
clearFilterBtn.addEventListener('click', clearDateFilter);
