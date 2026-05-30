// In-app message preview rendering (first 50 messages).

function renderPreview() {
    chatPreview.innerHTML = '';
    // Show the LAST 50 messages of the (filtered) set in chronological order,
    // so the most recent message is at the bottom — natural chat-view flow.
    const previewMessages = chatData.messages.slice(-50);
    const senders = [...new Set(chatData.messages.map(m => m.sender))];
    const currentUser = senders[0]; // assume first sender is the current user

    previewMessages.forEach(msg => {
        chatPreview.appendChild(createPreviewMessage(msg, currentUser));
    });

    // Auto-scroll the preview pane to the bottom so the newest message is
    // visible immediately after a filter change. `preview` is the outer
    // scrollable container; falling back to chatPreview just in case.
    const scroller = preview && preview.scrollHeight > preview.clientHeight ? preview : chatPreview;
    scroller.scrollTop = scroller.scrollHeight;
}

function createPreviewMessage(msg, currentUser) {
    const messageDiv = document.createElement('div');

    if (msg.isSystem) {
        const callInfo = classifySystemMessage(msg.text);
        if (callInfo) {
            messageDiv.className = `message call${callInfo.isMissed ? ' missed' : ''}`;
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';

            const iconSpan = document.createElement('span');
            iconSpan.className = 'call-icon';
            iconSpan.textContent = callInfo.isVideo ? '📹' : '📞';

            const textSpan = document.createElement('span');
            textSpan.className = 'call-text';
            textSpan.textContent = msg.text;

            contentDiv.appendChild(iconSpan);
            contentDiv.appendChild(textSpan);
            messageDiv.appendChild(contentDiv);
            return messageDiv;
        }

        messageDiv.className = 'message system';
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        textDiv.textContent = msg.text;
        contentDiv.appendChild(textDiv);
        messageDiv.appendChild(contentDiv);
        return messageDiv;
    }

    messageDiv.className = `message ${msg.sender === currentUser ? 'sent' : 'received'}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    // Always show sender name. CSS keeps it left-aligned within the bubble.
    const senderDiv = document.createElement('div');
    senderDiv.className = 'message-sender';
    senderDiv.textContent = msg.sender;
    contentDiv.appendChild(senderDiv);

    let messageText = msg.text;
    const imageMatch = messageText.match(/<attached:\s*([^>]+)>/i) ||
                       messageText.match(/([^\s]+\.(jpg|jpeg|png|gif|webp))/i);
    const videoMatch = messageText.match(/([^\s]+\.(mp4|mov|avi|mkv|webm|3gp))/i);

    if (imageMatch) {
        const imageName = imageMatch[1];
        if (chatData.images[imageName]) {
            const img = document.createElement('img');
            img.className = 'message-image';
            img.src = chatData.images[imageName];
            contentDiv.appendChild(img);
            messageText = messageText.replace(imageMatch[0], '').trim();
        }
    }

    if (videoMatch) {
        const videoName = videoMatch[1];
        if (chatData.videos[videoName]) {
            const videoContainer = document.createElement('div');
            videoContainer.className = 'message-video';
            videoContainer.style.position = 'relative';

            const img = document.createElement('img');
            img.className = 'message-image';
            img.src = chatData.videos[videoName];

            const playIcon = document.createElement('div');
            playIcon.innerHTML = '▶️';
            playIcon.style.position = 'absolute';
            playIcon.style.top = '50%';
            playIcon.style.left = '50%';
            playIcon.style.transform = 'translate(-50%, -50%)';
            playIcon.style.fontSize = '48px';
            playIcon.style.textShadow = '0 0 10px rgba(0,0,0,0.5)';
            playIcon.style.pointerEvents = 'none';

            videoContainer.appendChild(img);
            videoContainer.appendChild(playIcon);
            contentDiv.appendChild(videoContainer);
            messageText = messageText.replace(videoMatch[0], '').trim();
        }
    }

    if (messageText) {
        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        textDiv.style.whiteSpace = 'pre-wrap';
        textDiv.textContent = messageText;
        contentDiv.appendChild(textDiv);
    }

    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    const parsedDate = parseMessageDate(msg.timestamp);
    timeDiv.textContent = parsedDate ? formatDateTimeReadable(parsedDate) : msg.timestamp;
    contentDiv.appendChild(timeDiv);

    messageDiv.appendChild(contentDiv);
    return messageDiv;
}
