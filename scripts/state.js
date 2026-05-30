// Shared application state and cached DOM references.
// Declared with `var` so they're attached to `window` and visible across
// all classic <script> tags in the page.

var chatData = {
    messages: [],
    images: {},
    videos: {},
    allMessages: []
};

var uploadBox = document.getElementById('uploadBox');
var fileInput = document.getElementById('fileInput');
var openHtmlBtn = document.getElementById('openHtmlBtn');
var downloadHtmlBtn = document.getElementById('downloadHtmlBtn');
var statusEl = document.getElementById('status');
var loading = document.getElementById('loading');
var loadingText = document.getElementById('loadingText');
var preview = document.getElementById('preview');
var chatPreview = document.getElementById('chatPreview');
var dateFilter = document.getElementById('dateFilter');
var startDateInput = document.getElementById('startDate');
var endDateInput = document.getElementById('endDate');
var filterInfo = document.getElementById('filterInfo');
var clearFilterBtn = document.getElementById('clearFilterBtn');
