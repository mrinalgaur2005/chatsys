'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { styles } from './css';
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { Meteors } from '../ui/meteors';

interface Profile {
  id: string;
  userId: string;
  name: string;
  imageUrl: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const Bot = () => {
  const {toast} = useToast();
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
  const [profile, setProfile] = useState<Profile | null>(null);
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
  const [showMeteors, setShowMeteors] = useState(false);

  useEffect(() => {
    console.log('useEffect firing');
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/current-profile');
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
    setShowMeteors(true);
  }, []);

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const validateUserInput = async (input: string, step: number): Promise<boolean> => {
    const prompt_arr = [
      "What's your full name? (Middle and last name are optional)?",
      "When is your booking date? (Please provide the month and day; the year is optional if it's this year)",
      "Where are you traveling to? (Please specify the city or country)",
      "How many tickets would you like to book? (Please enter a number)",
    ];
    
    const prompt = `The current step is asking for: ${prompt_arr[step]}. The user responded with: "${input}". Is this a valid response? If not, say "invalid". Also give explanation. Make the criteria loose.`;

    const data = {
      model: 'gpt-3.5-turbo-0125',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
    };

    try {
      const response = await axios({
        method: 'post',
        url: 'https://api.openai.com/v1/chat/completions',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        data: JSON.stringify(data),
      });

      return !response.data.choices[0].message.content.toLowerCase().includes('invalid');
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };


  interface BookingData {
    name: string;
    destination: string;
    bookingDate: string; // Consider using a Date type if appropriate
    tickets: string; // Assuming this is a string representation of a number
  }

  const submitBooking = async (bookingData: BookingData) => {
    if (!profile) return;

    try {
      const response = await axios.post('/api/book-ticket', {
        name: bookingData.name,
        destination: bookingData.destination,
        date: bookingData.bookingDate,
        numberOfTickets: parseInt(bookingData.tickets,10),
        userId: profile.userId,
        
        // addedById: 'adminEmail@example.com', // Admin who adds the ticket
      });

      if (response.status === 200) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'Your booking was successful!', fromBot: true },
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'There was an issue with your booking. Please try again.', fromBot: true },
        ]);
      }
    } catch (error:any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
      console.error('Error submitting booking:', error.response?.data || error.message || error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'An error occurred while processing your booking.', fromBot: true },
      ]);
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

        submitBooking(updatedFormData);
      }
    } else {
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: `Sorry, your input "${userInput}" doesn't seem valid. ${steps[currentStep]}`, fromBot: true },
        ]);
      }, 1000);
      setUserInput('');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>
        <div className="text-black" style={styles.messages}>
          {messages.map((msg, index) => (
            <div
              className="text-black"
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
            className="text-black"
            style={styles.input}
            value={userInput}
            onChange={handleUserInput}
            placeholder="Type your answer..."
          />
          {showMeteors && <Meteors number={20} />} {/* Conditionally render meteors */}
          <button style={styles.sendButton} onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bot;
