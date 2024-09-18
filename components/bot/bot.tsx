'use client'

import React, { useState } from 'react';
import axios from 'axios';
import { styles } from './css';

const App: React.FC = () => {
  const steps = [
    "What's your name(last name and middle name are optional)?",
    "What's your departure date?",
    "What's your Email address?",
    "Where is your destination?",
    "How many tickets do you want to book?",
  ];
  
  const prompt_arr = [
    "What's your full name? (Middle and last name are optional)?",
    "When is your departure date?(Please provide the month and day; the year is optional if it's this year)",
    "What's your email address? (We'll use this to send booking details)",
    "Where are you traveling to? (Please specify the city or country)",
    "How many tickets would you like to book? (Please enter a number)",
  ];

  const [messages, setMessages] = useState([
    { text: "Hello! I'm here to help you book tickets. Let's get started. What's your name?", fromBot: true },
  ]);

  const [currentStep, setCurrentStep] = useState(0); 
  const [formData, setFormData] = useState({
    name: '',
    departureDate: '',
    email: '',
    destination: '',
    tickets: '',
  });
  
  const [userInput, setUserInput] = useState('');
  
  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSend = async () => {
    // Handle send logic
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>
        <div style={styles.messages}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.message,
                ...(msg.fromBot ? styles.botMessage : styles.userMessage),
              }}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div style={styles.inputBox}>
          <input
            style={styles.input}
            value={userInput}
            onChange={handleUserInput}
            placeholder="Type your answer..."
          />
          <button style={styles.sendButton} onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
