// Date-range filtering, info banner, and button-label updates.

function filterMessagesByDate(messages, startDate, endDate) {
    if (!startDate && !endDate) return messages;

    return messages.filter(msg => {
        const msgDate = parseMessageDate(msg.timestamp);
        if (!msgDate) return true; // keep unparseable messages

        const msgDateOnly = new Date(msgDate.getFullYear(), msgDate.getMonth(), msgDate.getDate());

        if (startDate && endDate) return msgDateOnly >= startDate && msgDateOnly <= endDate;
        if (startDate) return msgDateOnly >= startDate;
        if (endDate) return msgDateOnly <= endDate;
        return true;
    });
}

function updateDateFilter() {
    const startDate = startDateInput.value ? new Date(startDateInput.value) : null;
    const endDate = endDateInput.value ? new Date(endDateInput.value) : null;

    if (startDate && endDate && startDate > endDate) {
        showStatus('Start date must be before end date', 'error');
        return;
    }

    chatData.messages = filterMessagesByDate(chatData.allMessages, startDate, endDate);

    renderPreview();
    updateFilterInfo();
    updateButtonLabels();
}

function updateFilterInfo() {
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    if (!startDate && !endDate) {
        filterInfo.innerHTML = `💡 Leave empty to include all messages | Showing: ${chatData.messages.length} of ${chatData.allMessages.length} messages`;
    } else {
        const startStr = startDate ? formatDateReadableFromString(startDate) : 'beginning';
        const endStr = endDate ? formatDateReadableFromString(endDate) : 'end';
        filterInfo.innerHTML = `📅 Showing messages from ${startStr} to ${endStr} | ${chatData.messages.length} of ${chatData.allMessages.length} messages`;
    }
}

function populateDateRangeFromMessages() {
    // Always clear stale values from a previous load first.
    startDateInput.value = '';
    endDateInput.value = '';

    if (chatData.allMessages.length === 0) {
        console.warn('populateDateRangeFromMessages: no messages parsed from chat. Check parseWhatsAppChat patterns.');
        return;
    }

    // Scan ALL messages for true min/max dates — the first/last entries are
    // not guaranteed to be parseable (multi-line / edited exports).
    let firstDate = null;
    let lastDate = null;
    for (const msg of chatData.allMessages) {
        const date = parseMessageDate(msg.timestamp);
        if (!date) continue;
        if (!firstDate || date < firstDate) firstDate = date;
        if (!lastDate || date > lastDate) lastDate = date;
    }

    if (!firstDate || !lastDate) {
        console.warn(
            'populateDateRangeFromMessages: could not parse any timestamps. Sample:',
            chatData.allMessages.slice(0, 5).map(m => m.timestamp)
        );
        return;
    }

    startDateInput.value = formatDateForInput(firstDate);
    endDateInput.value = formatDateForInput(lastDate);

    filterInfo.innerHTML = `📅 Chat date range: ${formatDateReadable(firstDate)} to ${formatDateReadable(lastDate)} | Showing: ${chatData.messages.length} messages`;
}

function clearDateFilter() {
    startDateInput.value = '';
    endDateInput.value = '';
    chatData.messages = chatData.allMessages;
    renderPreview();
    filterInfo.innerHTML = `💡 Showing all messages | ${chatData.allMessages.length} messages`;
    updateButtonLabels();
}

function updateButtonLabels() {
    const messageCount = chatData.messages.length;
    const totalCount = chatData.allMessages.length;

    if (messageCount === totalCount) {
        openHtmlBtn.textContent = `Open as HTML Page (${messageCount} messages)`;
        downloadHtmlBtn.textContent = `Download HTML File (${messageCount} messages)`;
    } else {
        openHtmlBtn.textContent = `Open as HTML Page (${messageCount} of ${totalCount} messages)`;
        downloadHtmlBtn.textContent = `Download HTML File (${messageCount} of ${totalCount} messages)`;
    }
}
