// WhatsApp chat-export parsing.
//
// Supports the most common export formats:
//   iOS:     [DD/MM/YY, HH:MM:SS AM/PM] Sender: Message    (brackets, no dash)
//   Android: DD/MM/YY, HH:MM - Sender: Message             (dash, no brackets)
//   Android: M/D/YY, H:MM AM/PM - Sender: Message
//
// Modern exports often include narrow no-break spaces (U+202F) before AM/PM
// and stray LTR/RTL marks (U+200E/U+200F); we normalize both before matching.

// `i` flag is important: some locales export with lowercase "am"/"pm".
// `isSystem: true` patterns match lines like "26/05/26, 8:37 am - You blocked
// this person." — there's no `sender:` segment, the whole post-dash chunk is
// the system notice text. The system pattern MUST be tried last so it doesn't
// swallow normal user messages.
const CHAT_LINE_PATTERNS = [
    // iOS bracket format with sender (no dash separator).
    { regex: /^\[(\d{1,2}\/\d{1,2}\/\d{2,4},?\s+\d{1,2}:\d{2}(?::\d{2})?\s*(?:[AP]M)?)\]\s+([^:]+):\s*(.*)$/i, isSystem: false },
    // Android dash format with sender (brackets optional).
    { regex: /^\[?(\d{1,2}\/\d{1,2}\/\d{2,4},?\s+\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AP]M)?)\]?\s*[-–]\s*([^:]+):\s*(.*)$/i, isSystem: false },
    { regex: /^(\d{1,2}\/\d{1,2}\/\d{2,4},?\s+\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AP]M)?)\s*[-–]\s*([^:]+):\s*(.*)$/i, isSystem: false },
    // Fallback: timestamp + dash + text (no sender, no colon). System notices
    // like "You blocked this person" or "You created group X" land here.
    { regex: /^\[?(\d{1,2}\/\d{1,2}\/\d{2,4},?\s+\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AP]M)?)\]?\s*[-–]\s*(.*)$/i, isSystem: true }
];

function normalizeLine(rawLine) {
    return rawLine
        .replace(/[\u202F\u00A0]/g, ' ')
        .replace(/[\u200E\u200F]/g, '')
        .trim();
}

function parseWhatsAppChat(text) {
    const messages = [];
    const lines = text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').split('\n');

    let currentMessage = null;

    for (const rawLine of lines) {
        const line = normalizeLine(rawLine);
        if (!line) continue;

        if (line.includes('Messages and calls are end-to-end encrypted') ||
            line.includes('Your security code with') ||
            line.includes('changed.')) {
            continue;
        }

        let matched = false;
        for (const { regex, isSystem } of CHAT_LINE_PATTERNS) {
            const match = line.match(regex);
            if (!match) continue;
            if (currentMessage) messages.push(currentMessage);
            currentMessage = isSystem
                ? { timestamp: match[1], sender: null, text: match[2].trim(), isSystem: true }
                : { timestamp: match[1], sender: match[2].trim(), text: match[3].trim(), isSystem: false };
            matched = true;
            break;
        }

        // Unmatched lines are continuations of the previous message.
        if (!matched && currentMessage) {
            currentMessage.text += '\n' + line;
        }
    }

    if (currentMessage) messages.push(currentMessage);

    if (messages.length === 0) {
        const sample = lines.map(normalizeLine).filter(Boolean).slice(0, 5);
        console.warn(
            'parseWhatsAppChat: no messages matched. Sample lines from your chat:\n' +
            sample.map((l, i) => `  [${i}] ${JSON.stringify(l)}`).join('\n')
        );
    }

    return messages.map(msg => {
        let text = msg.text;
        text = text.replace(/\(file attached\)/gi, '');
        text = text.replace(/Contact card omitted/gi, '📇 Contact card');
        text = text.replace(/<Media omitted>/gi, '🖼️ Media');
        text = text.replace(/image omitted/gi, '🖼️ Image');
        text = text.replace(/video omitted/gi, '🎥 Video');
        text = text.replace(/audio omitted/gi, '🎵 Audio');
        text = text.replace(/sticker omitted/gi, '😀 Sticker');
        text = text.replace(/GIF omitted/gi, '🎬 GIF');
        text = text.replace(/document omitted/gi, '📄 Document');
        return { ...msg, text: text.trim() };
    }).filter(msg => msg.text || msg.text === '');
}

// Returns the first non-system, non-null sender in a message list — used to
// decide which side of the chat is "you". Naive but matches prior behaviour;
// crucially skips system tiles whose sender is null (which would otherwise
// poison the lookup and make every real message render as received).
function inferCurrentUser(messages) {
    for (const msg of messages) {
        if (!msg.isSystem && msg.sender) return msg.sender;
    }
    return null;
}

// Looks at a system-message text and classifies it as a call entry if it
// matches typical WhatsApp call notices like:
//   "Voice call, 5 min"
//   "Video call"
//   "Missed voice call"
//   "Missed video call"
//   "Silenced call"
// Returns null for non-call system messages.
function classifySystemMessage(text) {
    if (!/\bcall\b/i.test(text)) return null;
    return {
        type: 'call',
        isVideo: /\bvideo\b/i.test(text),
        isMissed: /\bmissed\b/i.test(text)
    };
}

function parseMessageDate(timestamp) {
    // Examples handled: "1/15/24, 3:45 PM", "15/1/24, 15:45", "[15/01/2024, 15:45:30]"
    const cleanTimestamp = timestamp
        .replace(/[\[\]]/g, '')
        .replace(/[\u202F\u00A0]/g, ' ')
        .replace(/[\u200E\u200F]/g, '')
        .trim();

    try {
        const dateMatch = cleanTimestamp.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
        const timeMatch = cleanTimestamp.match(/(\d{1,2}):(\d{2})/);
        if (!dateMatch) return null;

        // Disambiguate DD/MM vs MM/DD: a value > 12 forces the role; otherwise
        // assume DD/MM/YY which is the global default for WhatsApp.
        const part1 = parseInt(dateMatch[1], 10);
        const part2 = parseInt(dateMatch[2], 10);
        let day, month;
        if (part1 > 12) {
            day = part1; month = part2;
        } else if (part2 > 12) {
            month = part1; day = part2;
        } else {
            day = part1; month = part2;
        }

        let year = parseInt(dateMatch[3], 10);
        if (year < 100) year += year < 50 ? 2000 : 1900;

        let hours = 0, minutes = 0;
        if (timeMatch) {
            hours = parseInt(timeMatch[1], 10);
            minutes = parseInt(timeMatch[2], 10);
            // Case-insensitive: handles "PM", "pm", "Pm", etc.
            if (/pm/i.test(cleanTimestamp) && hours < 12) hours += 12;
            else if (/am/i.test(cleanTimestamp) && hours === 12) hours = 0;
        }

        return new Date(year, month - 1, day, hours, minutes);
    } catch (error) {
        console.error('Error parsing date:', timestamp, error);
        return null;
    }
}
