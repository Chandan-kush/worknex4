// Sample conversations data
const conversations = [
    {
        id: 1,
        name: 'Rahul Electrician',
        service: 'Electrical Work',
        avatar: 'https://via.placeholder.com/48/ff6b6b/ffffff?text=R',
        lastMessage: 'I can come tomorrow at 10 AM',
        time: '2:30 PM',
        online: true,
        messages: [
            { type: 'worker', text: 'Hi, I received your service request', time: '2:15 PM' },
            { type: 'worker', text: 'What time works best for you?', time: '2:20 PM' },
            { type: 'user', text: 'Tomorrow morning would be great', time: '2:25 PM' },
            { type: 'worker', text: 'I can come tomorrow at 10 AM', time: '2:30 PM' }
        ]
    },
    {
        id: 2,
        name: 'Amit Plumber',
        service: 'Plumbing',
        avatar: 'https://via.placeholder.com/48/4ecdc4/ffffff?text=A',
        lastMessage: 'Thank you for the payment',
        time: '1:45 PM',
        online: true,
        messages: [
            { type: 'worker', text: 'Arrived at your location', time: '1:30 PM' },
            { type: 'user', text: 'Great, please come up', time: '1:32 PM' },
            { type: 'worker', text: 'Fixed the leaky tap', time: '1:40 PM' },
            { type: 'worker', text: 'Thank you for the payment', time: '1:45 PM' }
        ]
    },
    {
        id: 3,
        name: 'Rohit AC Technician',
        service: 'AC Maintenance',
        avatar: 'https://via.placeholder.com/48/95e1d3/ffffff?text=R',
        lastMessage: 'Your AC will need a new compressor',
        time: '11:20 AM',
        online: false,
        messages: [
            { type: 'worker', text: 'I inspected your AC unit', time: '11:10 AM' },
            { type: 'worker', text: 'Your AC will need a new compressor', time: '11:20 AM' },
            { type: 'user', text: 'How much will that cost?', time: '11:22 AM' }
        ]
    },
    {
        id: 4,
        name: 'Suresh Carpenter',
        service: 'Carpentry',
        avatar: 'https://via.placeholder.com/48/f38181/ffffff?text=S',
        lastMessage: 'I can make that custom bookshelf',
        time: '10:15 AM',
        online: true,
        messages: [
            { type: 'user', text: 'Can you build a custom bookshelf?', time: '10:05 AM' },
            { type: 'worker', text: 'Yes, I can make that custom bookshelf', time: '10:15 AM' },
            { type: 'worker', text: 'What are the dimensions?', time: '10:16 AM' }
        ]
    }
];

let currentConversation = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    renderConversationsList();
    setupEventListeners();
});

// Render conversations list
function renderConversationsList() {
    const listContainer = document.getElementById('conversationsList');
    listContainer.innerHTML = '';

    conversations.forEach(conv => {
        const item = document.createElement('div');
        item.className = 'conversation-item';
        item.dataset.conversationId = conv.id;

        item.innerHTML = `
            <img src="${conv.avatar}" alt="${conv.name}" class="conversation-avatar">
            <div class="conversation-content">
                <div class="conversation-name">${conv.name}</div>
                <div class="conversation-preview">${conv.lastMessage}</div>
                <div class="conversation-time">${conv.time}</div>
            </div>
        `;

        item.addEventListener('click', () => selectConversation(conv.id));
        listContainer.appendChild(item);
    });
}

// Select a conversation
function selectConversation(conversationId) {
    currentConversation = conversations.find(c => c.id === conversationId);

    if (!currentConversation) return;

    // Update active state in list
    document.querySelectorAll('.conversation-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-conversation-id="${conversationId}"]`).classList.add('active');

    // Show chat window and hide empty state
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('chatWindow').style.display = 'flex';

    // Update chat header
    document.getElementById('workerName').textContent = currentConversation.name;
    document.getElementById('serviceType').textContent = currentConversation.service;
    document.getElementById('workerAvatar').src = currentConversation.avatar;
    
    const statusElement = document.getElementById('onlineStatus');
    if (currentConversation.online) {
        statusElement.textContent = '🟢 Online';
        statusElement.style.color = '#28a745';
    } else {
        statusElement.textContent = '⚫ Offline';
        statusElement.style.color = '#999999';
    }

    // Render messages
    renderMessages();

    // Clear input
    document.getElementById('messageInput').value = '';
    document.getElementById('messageInput').focus();
}

// Render messages in chat
function renderMessages() {
    const messagesContainer = document.getElementById('messagesContainer');
    messagesContainer.innerHTML = '';

    currentConversation.messages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${msg.type}`;

        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'message-bubble';
        bubbleDiv.textContent = msg.text;

        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = msg.time;

        messageDiv.appendChild(bubbleDiv);
        messageDiv.appendChild(timeDiv);
        messagesContainer.appendChild(messageDiv);
    });

    // Auto scroll to bottom
    scrollToBottom();
}

// Scroll to bottom of messages
function scrollToBottom() {
    const container = document.getElementById('messagesContainer');
    container.scrollTop = container.scrollHeight;
}

// Send message
function sendMessage() {
    const input = document.getElementById('messageInput');
    const messageText = input.value.trim();

    if (!messageText || !currentConversation) return;

    // Get current time
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });

    // Add user message
    currentConversation.messages.push({
        type: 'user',
        text: messageText,
        time: time
    });

    // Clear input
    input.value = '';

    // Render messages
    renderMessages();

    // Simulate worker response after 1 second
    setTimeout(() => {
        addWorkerResponse();
    }, 1000);
}

// Simulate worker response
function addWorkerResponse() {
    if (!currentConversation) return;

    const responses = [
        'Got it! 👍',
        'Thanks for letting me know',
        'Sounds good to me',
        'Will do!',
        'No problem, I\'ll take care of it',
        'Perfect, I\'ll be there soon',
        'Understood, thank you',
        'Great, see you soon!'
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });

    currentConversation.messages.push({
        type: 'worker',
        text: randomResponse,
        time: time
    });

    renderMessages();
}

// Setup event listeners
function setupEventListeners() {
    const sendBtn = document.getElementById('sendBtn');
    const messageInput = document.getElementById('messageInput');
    const emojiIcon = document.querySelector('.emoji-icon');

    // Send button click
    sendBtn.addEventListener('click', sendMessage);

    // Enter key to send
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Emoji click
    emojiIcon.addEventListener('click', () => {
        insertEmoji('😊');
    });

    // Sign out button
    document.querySelector('.sign-out-btn').addEventListener('click', () => {
        alert('Signed out successfully!');
    });

    // New chat button
    document.querySelector('.new-chat-btn').addEventListener('click', () => {
        alert('Open new conversation dialog');
    });
}

// Insert emoji
function insertEmoji(emoji) {
    const input = document.getElementById('messageInput');
    input.value += emoji;
    input.focus();
}
