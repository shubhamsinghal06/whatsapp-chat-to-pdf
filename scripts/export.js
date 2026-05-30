// "Open" / "Download" actions that build a standalone HTML page from the
// currently-filtered chatData and either open it in a new tab or download it.

// CSS for the exported page. Kept inline (template-literal constant) because
// the downloaded file must be fully self-contained.
const EXPORT_PAGE_CSS = `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #e5ddd5;
            padding: 20px;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            background: #e5ddd5;
        }

        .header {
            background: #075E54;
            color: white;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
            text-align: center;
            position: relative;
        }

        .header h1 {
            font-size: 24px;
            margin-bottom: 5px;
        }

        .header p {
            font-size: 14px;
            opacity: 0.9;
        }

        .version {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 11px;
            background: rgba(255, 255, 255, 0.2);
            padding: 4px 8px;
            border-radius: 12px;
            font-weight: 600;
        }

        .print-info {
            background: #fff;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            text-align: center;
            border-left: 4px solid #25D366;
        }

        .message {
            margin-bottom: 12px;
            display: flex;
            clear: both;
        }

        .message.sent {
            justify-content: flex-end;
        }

        .message-content {
            max-width: 65%;
            padding: 8px 12px;
            border-radius: 8px;
            word-wrap: break-word;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            text-align: left;
        }

        .message.sent .message-content {
            background: #dcf8c6;
            border-bottom-right-radius: 2px;
        }

        .message.received .message-content {
            background: white;
            border-bottom-left-radius: 2px;
        }

        /* WhatsApp-style system notice (block/unblock/group events, etc.) */
        .message.system {
            justify-content: center;
        }

        .message.system .message-content {
            background: #FCF4CB;
            color: #54656F;
            font-size: 12.5px;
            text-align: center;
            border-radius: 7.5px;
            padding: 6px 12px;
            max-width: 80%;
            box-shadow: 0 1px 0.5px rgba(0, 0, 0, 0.13);
        }

        .message.system .message-text {
            font-size: 12.5px;
            color: #54656F;
            text-align: center;
        }

        /* WhatsApp-style call entry (voice/video/missed) */
        .message.call {
            justify-content: center;
        }

        .message.call .message-content {
            background: white;
            border-radius: 12px;
            padding: 8px 14px;
            max-width: 80%;
            box-shadow: 0 1px 0.5px rgba(0, 0, 0, 0.13);
            display: inline-flex;
            align-items: center;
            gap: 10px;
            text-align: left;
        }

        .message.call .call-icon {
            font-size: 18px;
            line-height: 1;
        }

        .message.call .call-text {
            font-size: 13.5px;
            color: #303030;
            font-weight: 500;
        }

        .message.call.missed .call-text {
            color: #E5526B;
        }

        .message-sender {
            font-weight: bold;
            color: #128C7E;
            font-size: 13px;
            margin-bottom: 3px;
            text-align: left;
        }

        .message-text {
            font-size: 14px;
            color: #303030;
            line-height: 1.4;
            white-space: pre-wrap;
            word-wrap: break-word;
        }

        .message-time {
            font-size: 11px;
            color: #667781;
            margin-top: 4px;
            text-align: right;
        }

        .message-image {
            max-width: 100%;
            border-radius: 8px;
            margin-top: 5px;
        }

        @media print {
            body {
                background: white;
            }

            .print-info {
                display: none;
            }

            .container {
                max-width: 100%;
            }
        }
`;

function openAsHtml() {
    console.log('Opening HTML with', chatData.messages.length, 'messages out of', chatData.allMessages.length, 'total');

    openHtmlBtn.classList.add('processing');
    const originalText = openHtmlBtn.textContent;
    openHtmlBtn.textContent = '⏳ Opening...';

    // setTimeout lets the button-state update paint before the heavy template work.
    setTimeout(() => {
        const senders = [...new Set(chatData.messages.map(m => m.sender))];
        const currentUser = senders[0];

        const htmlContent = generateHtmlContent(currentUser);

        const newWindow = window.open('', '_blank');
        newWindow.document.write(htmlContent);
        newWindow.document.close();

        openHtmlBtn.classList.remove('processing');
        openHtmlBtn.textContent = originalText;

        showStatus(`Chat opened in new tab with ${chatData.messages.length} filtered messages. Press Ctrl+P or Cmd+P to save as PDF!`, 'success');
    }, 100);
}

function downloadAsHtml() {
    console.log('Downloading HTML with', chatData.messages.length, 'messages out of', chatData.allMessages.length, 'total');

    downloadHtmlBtn.classList.add('processing');
    const originalText = downloadHtmlBtn.textContent;
    downloadHtmlBtn.textContent = '⏳ Generating...';

    setTimeout(() => {
        const senders = [...new Set(chatData.messages.map(m => m.sender))];
        const currentUser = senders[0];

        const htmlContent = generateHtmlContent(currentUser);

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `whatsapp-chat-${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        downloadHtmlBtn.classList.remove('processing');
        downloadHtmlBtn.textContent = originalText;

        showStatus(`HTML file downloaded with ${chatData.messages.length} filtered messages!`, 'success');
    }, 100);
}

function renderExportMessage(msg, currentUser) {
    if (msg.isSystem) {
        const callInfo = classifySystemMessage(msg.text);
        if (callInfo) {
            const icon = callInfo.isVideo ? '📹' : '📞';
            const missedClass = callInfo.isMissed ? ' missed' : '';
            return '<div class="message call' + missedClass + '">' +
                   '<div class="message-content">' +
                   '<span class="call-icon">' + icon + '</span>' +
                   '<span class="call-text">' + msg.text + '</span>' +
                   '</div>' +
                   '</div>';
        }
        return '<div class="message system">' +
               '<div class="message-content">' +
               '<div class="message-text">' + msg.text + '</div>' +
               '</div>' +
               '</div>';
    }

    const isSent = msg.sender === currentUser;
    let messageText = msg.text;
    let mediaHtml = '';

    const imageMatch = messageText.match(/<attached:\s*([^>]+)>/i) ||
                       messageText.match(/([^\s]+\.(jpg|jpeg|png|gif|webp))/i);
    if (imageMatch) {
        const imageName = imageMatch[1];
        if (chatData.images[imageName]) {
            mediaHtml = '<img class="message-image" src="' + chatData.images[imageName] + '" alt="Image">';
            messageText = messageText.replace(imageMatch[0], '').trim();
        }
    }

    const videoMatch = messageText.match(/([^\s]+\.(mp4|mov|avi|mkv|webm|3gp))/i);
    if (videoMatch) {
        const videoName = videoMatch[1];
        if (chatData.videos[videoName]) {
            mediaHtml = '<div style="position: relative; display: inline-block;">' +
                       '<img class="message-image" src="' + chatData.videos[videoName] + '" alt="Video thumbnail">' +
                       '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 48px; text-shadow: 0 0 10px rgba(0,0,0,0.5);">▶️</div>' +
                       '</div>';
            messageText = messageText.replace(videoMatch[0], '').trim();
        }
    }

    const parsedDate = parseMessageDate(msg.timestamp);
    const formattedTime = parsedDate ? formatDateTimeReadable(parsedDate) : msg.timestamp;

    return '<div class="message ' + (isSent ? 'sent' : 'received') + '">' +
           '<div class="message-content">' +
           '<div class="message-sender">' + msg.sender + '</div>' +
           mediaHtml +
           (messageText ? '<div class="message-text">' + messageText + '</div>' : '') +
           '<div class="message-time">' + formattedTime + '</div>' +
           '</div>' +
           '</div>';
}

function generateHtmlContent(currentUser) {
    const messagesHtml = chatData.messages.map(msg => renderExportMessage(msg, currentUser)).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WhatsApp Chat Export - ${chatData.messages.length} messages</title>
    <style>${EXPORT_PAGE_CSS}</style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="version">v1.1.0</div>
            <h1>WhatsApp Chat Export</h1>
            <p>${chatData.messages.length} messages</p>
        </div>

        <div class="print-info">
            <strong>📄 To Save as PDF:</strong><br>
            Click the <strong>Print</strong> button in your browser menu, then select <strong>"Save as PDF"</strong> as your destination.
        </div>

        <div class="messages">
${messagesHtml}
        </div>
    </div>
</body>
</html>`;
}
