const socket = io();

const messages = document.getElementById('messages');
const chatForm = document.getElementById('chat-form');
const usernameInput = document.getElementById('username');
const iconInput = document.getElementById('icon');
const messageInput = document.getElementById('message');
const urlParams = new URLSearchParams(window.location.search);

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const user = usernameInput.value.trim();
  const icon = iconInput.value; // Get selected icon value
  const text = messageInput.value.trim();
  if (!user || !text) return;
  socket.emit('chat message', { user, icon, text });
  messageInput.value = '';
});

socket.on('message', (msg) => {
  const user = msg.user;
  const text = msg.text;
  let icon = msg.icon;
  if (icon.emoji == "") {
    icon = window.defaultIcon || {"emoji": "🏴"}
  }

  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  const displayName = icon ? `${icon.emoji} ${user}` : user;
  messageElement.innerHTML = `<strong>${displayName}:</strong> ${text}`;
  messages.appendChild(messageElement);
  messages.scrollTop = messages.scrollHeight; // Auto-scroll to the latest message
});

const queryMessages = urlParams.get('messages').split(',');
usernameInput.value = urlParams.get('username') || usernameInput.value;

for (let i = 0; i < queryMessages.length; i++) {
  messageInput.value = queryMessages[i];
  chatForm.dispatchEvent(new Event('submit'));
}