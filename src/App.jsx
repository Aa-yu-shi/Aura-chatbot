import { useState, useRef, useEffect } from 'react';
import './index.css';

// Predefined chatbot logic (No API/DB)
const botResponses = {
  greetings: ["Hello. I'm here to listen. How are you feeling today?", "Welcome. Take a deep breath. What's on your mind?", "Good to see you. How has your day been treating you?"],
  sadness: ["I'm so sorry you're feeling this way. Sometimes sitting with your feelings is the bravest thing you can do.", "It's completely okay to not be okay. I'm here for you.", "Sadness can feel heavy. Remember to be gentle with yourself right now."],
  anxiety: ["Anxiety can be really overwhelming. Try taking a slow, deep breath: inhale for 4 seconds, exhale for 6.", "I hear that you're feeling anxious. Ground yourself by noticing three things you can see around you.", "It's understandable to feel tense. Let's take this one moment at a time."],
  stress: ["It sounds like you have a lot on your plate. Remember that it's okay to step back and take a break.", "Stress can exhaust both mind and body. What is one small thing you can do for yourself today?", "When everything feels urgent, pausing is powerful."],
  gratitude: ["It's wonderful that you can see the light even on tough days.", "Holding onto those small moments of peace is so important.", "Thank you for sharing that with me."],
  goodbye: ["Take care of yourself. I'll be here whenever you need a quiet space.", "Goodbye for now. Remember to breathe.", "Wishing you moments of peace today. Farewell."],
  default: ["I hear you. Tell me more about that.", "That sounds challenging. How does that make you feel to say out loud?", "I'm holding space for you to share whatever comes up.", "Thank you for being open. It takes courage to share."]
};

const keywords = {
  sadness: ['sad', 'depressed', 'crying', 'unhappy', 'lonely', 'miserable', 'heartbroken', 'grief'],
  anxiety: ['anxious', 'panic', 'worry', 'worried', 'nervous', 'scared', 'fear', 'overwhelmed'],
  stress: ['stress', 'stressed', 'tired', 'exhausted', 'burnout', 'busy', 'pressure', 'hard'],
  gratitude: ['thank', 'thanks', 'good', 'happy', 'better', 'grateful', 'appreciate'],
  greetings: ['hi', 'hello', 'hey', 'start', 'begin'],
  goodbye: ['bye', 'goodbye', 'end', 'leave', 'exit']
};

function getBotResponse(input) {
  const lowerInput = input.toLowerCase();
  
  let intentMatch = 'default';
  
  for (const [intent, words] of Object.entries(keywords)) {
    if (words.some(word => lowerInput.includes(word))) {
      intentMatch = intent;
      break;
    }
  }

  const responses = botResponses[intentMatch];
  return responses[Math.floor(Math.random() * responses.length)];
}

export default function App() {
  const [messages, setMessages] = useState([
    { text: "Welcome to Aura. A quiet space for your thoughts. How are you feeling today?", sender: "bot", id: Date.now() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage = { text: inputValue, sender: "user", id: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate thinking time before answering
    setTimeout(() => {
      const responseText = getBotResponse(userMessage.text);
      setMessages(prev => [...prev, { text: responseText, sender: "bot", id: Date.now() + 1 }]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // 1.5s - 2.5s delay
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleQuickReply = (text) => {
    setInputValue(text);
    // Optionally trigger send immediately or let user edit
  };

  // Format time (e.g., "10:30 AM")
  const formatTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Background Shapes */}
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>
      <div className="bg-shape shape-3"></div>

      <div className="app-container glass-panel">
        <header className="chat-header">
          <h1>Aura</h1>
          <p>A tranquil space for your mind</p>
        </header>

        <main className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
              <div className="message-text">
                {msg.text}
              </div>
              <div className="message-time">{formatTime()}</div>
              
              {/* Add optional quick replies for the first bot message just to make it interactive feeling */}
              {msg.id === messages[0].id && msg.sender === 'bot' && (
                <div className="quick-replies">
                  <button className="quick-reply-btn" onClick={() => handleQuickReply("I'm feeling anxious.")}>I'm feeling anxious</button>
                  <button className="quick-reply-btn" onClick={() => handleQuickReply("Just feeling a bit sad today.")}>A bit sad today</button>
                  <button className="quick-reply-btn" onClick={() => handleQuickReply("I'm overwhelmed.")}>Overwhelmed</button>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="message-wrapper bot">
              <div className="message-text typing-indicator">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        <footer className="chat-input-container">
          <input
            type="text"
            className="chat-input"
            placeholder="Share your thoughts gently..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            autoFocus
          />
          <button 
            className="send-button" 
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            aria-label="Send message"
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.4 20.4l17.45-7.48a1 1 0 000-1.84L3.4 3.6a.993.993 0 00-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.06-.87.49-.87.99l.01 4.61c0 .71.73 1.2 1.39.92z" />
            </svg>
          </button>
        </footer>
      </div>
    </>
  );
}
