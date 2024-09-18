'use client'

import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const steps = [
    "What's your name (last name and middle name are optional)?",
    "What's your booking date?",
    "Where is your destination?",
    "How many tickets do you want to book?",
  ];
  
  const prompt_arr = [
    "What's your full name? (Middle and last name are optional)?",
    "When is your booking date? (Please provide the month and day; the year is optional if it's this year)",
    "Where are you traveling to? (Please specify the city or country)",
    "How many tickets would you like to book? (Please enter a number)",
  ];

  const [messages, setMessages] = useState([
    { text: "Hello! I'm here to help you book tickets. Let's get started. What's your name?", fromBot: true },
  ]);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    bookingDate: '',
    destination: '',
    tickets: '',
  });
  
  const [userInput, setUserInput] = useState('');
  
  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const validateUserInput = async (input, step) => {
    const prompt = `The current step is asking for: ${prompt_arr[step]}. The user responded with: "${input}". Is this a valid response? If not, say "invalid". Also give explanation. Make the criteria loose.`;
    
    const data = {
      "model": "gpt-3.5-turbo-0125",
      "messages": [
        {
          "role": "system",
          "content": "You are a helpful assistant."
        },
        {
          "role": "user",
          "content": prompt
        }
      ]
    };

    try {
      const response = await axios({
        method: 'post',
        url: 'https://api.openai.com/v1/chat/completions',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        data: JSON.stringify(data)
      });

      console.log(response.data);
      return !response.data.choices[0].message.content.toLowerCase().includes("invalid");
    } catch (error) {
      console.error('Error:', error);
      throw error; 
    }
  };

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const isValid = await validateUserInput(userInput, currentStep);

    if (isValid) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: userInput, fromBot: false },
      ]);

      const updatedFormData = { ...formData };

      switch (currentStep) {
        case 0:
          updatedFormData.name = userInput;
          break;
        case 1:
          updatedFormData.bookingDate = userInput;
          break;
        case 2:
          updatedFormData.destination = userInput;
          break;
        case 3:
          updatedFormData.tickets = userInput;
          break;
        default:
          break;
      }

      setFormData(updatedFormData);
      setUserInput('');

      if (currentStep < steps.length - 1) {
        setTimeout(() => {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: steps[currentStep + 1], fromBot: true },
          ]);
        }, 1000);

        setCurrentStep(currentStep + 1);
      } else {
        setTimeout(() => {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: "Thank you! Here's the information you provided:", fromBot: true },
            { text: `Name: ${updatedFormData.name}`, fromBot: true },
            { text: `Booking Date: ${updatedFormData.bookingDate}`, fromBot: true },
            { text: `Destination: ${updatedFormData.destination}`, fromBot: true },
            { text: `Tickets: ${updatedFormData.tickets}`, fromBot: true },
            { text: "We'll now process your booking!", fromBot: true },
          ]);
        }, 1000);
      }
    } else {
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: `Sorry, your input "${userInput}" doesn't seem valid. ${steps[currentStep]}`, fromBot: true },
        ]);
      }, 1000);
      setUserInput(''); // Clear the input field
    }
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