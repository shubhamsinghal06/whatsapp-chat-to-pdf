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

// Click-to-expand lightbox for inline images (chat thumbnails + video thumbs).
// Event delegation keeps this working as the preview re-renders on filter
// changes without re-binding individual handlers.
(function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    if (!lightbox || !lightboxImg) return;

    const close = () => {
        lightbox.classList.remove('open');
        lightboxImg.src = '';
    };

    document.addEventListener('click', (e) => {
        const target = e.target;
        if (target && target.classList && target.classList.contains('message-image')) {
            lightboxImg.src = target.src;
            lightbox.classList.add('open');
            return;
        }
        // Click on overlay or close button closes the lightbox. Clicks on the
        // image itself bubble to the overlay too, so closing on overlay click
        // also closes when clicking outside the rendered image area.
        if (target === lightbox || (target && target.id === 'lightboxClose')) {
            close();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('open')) close();
    });
})();
