const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const messages = document.getElementById('messages');

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  userInput.value = '';

  const loadingMsg = addMessage('<div class="flex items-center gap-2"><div class="spinner"></div><span>Analyzing...</span></div>', 'bot');


  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer (INSERT YOUR OPENAI API KEY HERE)'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: "You are a compassionate medical AI assistant. When given written language, analyze it for early signs of neurodegenerative disease, particularly Alzheimer's and mild cognitive impairment. Look for reduced vocabulary richness, word-finding difficulty, short or incomplete sentences, repetition, confusion, or loss of coherence. Always give a gentle summary and encourage follow-up with a doctor if concerning patterns appear."},
          { role: 'user', content: text }
        ],
        max_tokens: 100
      })
    });
    const data = await response.json();
    loadingMsg.remove();
    if (data.choices && data.choices[0]) {
      addMessage(data.choices[0].message.content, 'bot');
    } else {
      addMessage('Sorry, I could not analyze your text. Please try again.', 'bot');
    }
  } catch (err) {
    loadingMsg.remove();
    addMessage('Error contacting AI. Check your connection or API key.', 'bot');
  }
});

function addMessage(content, sender) {
  const div = document.createElement('div');
  div.innerHTML = content;
  div.className = sender === 'user'
    ? 'user-message bg-purple-700 text-white p-3 rounded-lg shadow max-w-[75%] ml-auto'
    : 'bot-message bg-purple-100 text-purple-800 p-3 rounded-lg shadow max-w-[75%]';
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return div;
}
