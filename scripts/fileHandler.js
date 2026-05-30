// ZIP unpacking, chat extraction, and video-thumbnail generation.

async function handleFile(file) {
    if (!file.name.endsWith('.zip')) {
        showStatus('Please select a valid ZIP file', 'error');
        return;
    }

    showStatus('Reading ZIP file...', 'info');
    loading.style.display = 'block';
    preview.style.display = 'none';

    try {
        const zip = await JSZip.loadAsync(file);
        let chatFile = null;
        const images = {};
        const videos = {};

        for (const filename in zip.files) {
            if (filename.endsWith('.txt')) {
                chatFile = zip.files[filename];
            } else if (filename.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                // Inline images as data URLs so the exported HTML works in any
                // window/tab without needing the original ZIP at hand.
                const blob = await zip.files[filename].async('blob');
                const reader = new FileReader();
                const dataUrl = await new Promise((resolve) => {
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(blob);
                });
                images[filename] = dataUrl;
            } else if (filename.match(/\.(mp4|mov|avi|mkv|webm|3gp)$/i)) {
                showStatus('Processing video files...', 'info');
                const blob = await zip.files[filename].async('blob');
                const thumbnail = await generateVideoThumbnail(blob);
                if (thumbnail) videos[filename] = thumbnail;
            }
        }

        if (!chatFile) throw new Error('No chat text file found in ZIP');

        const chatText = await chatFile.async('text');
        const parsedMessages = parseWhatsAppChat(chatText);
        chatData.allMessages = parsedMessages;
        chatData.messages = parsedMessages;
        chatData.images = images;
        chatData.videos = videos;

        showStatus(`Successfully loaded ${chatData.allMessages.length} messages`, 'success');
        openHtmlBtn.disabled = false;
        downloadHtmlBtn.disabled = false;

        dateFilter.style.display = 'block';
        populateDateRangeFromMessages();
        updateFilterInfo();
        updateButtonLabels();

        renderPreview();
        preview.style.display = 'block';
    } catch (error) {
        showStatus(`Error: ${error.message}`, 'error');
        openHtmlBtn.disabled = true;
        downloadHtmlBtn.disabled = true;
    } finally {
        loading.style.display = 'none';
    }
}

async function generateVideoThumbnail(videoBlob) {
    return new Promise((resolve) => {
        try {
            const video = document.createElement('video');
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            video.preload = 'metadata';
            video.muted = true;
            video.playsInline = true;

            video.onloadedmetadata = () => {
                // Seek to 1s in or 10% of duration, whichever is smaller.
                video.currentTime = Math.min(1, video.duration * 0.1);
            };

            video.onseeked = () => {
                try {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
                    URL.revokeObjectURL(video.src);
                    resolve(thumbnail);
                } catch (error) {
                    console.error('Error generating thumbnail:', error);
                    resolve(null);
                }
            };

            video.onerror = () => {
                console.error('Error loading video for thumbnail');
                URL.revokeObjectURL(video.src);
                resolve(null);
            };

            video.src = URL.createObjectURL(videoBlob);
            video.load();

            // Safety timeout if metadata/seek never fires.
            setTimeout(() => {
                if (video.src) URL.revokeObjectURL(video.src);
                resolve(null);
            }, 10000);
        } catch (error) {
            console.error('Error in generateVideoThumbnail:', error);
            resolve(null);
        }
    });
}
