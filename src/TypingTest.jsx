import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const paragraphs = [
  "The quick brown fox jumps over the lazy dog. It's a common sentence that uses every letter of the alphabet.",
  "Never underestimate the power of a good book. It can transport you to new worlds and broaden your horizons.",
  "The sun always shines brightest after the rain. Remember that during your darkest moments.",
  "Technology has revolutionized the way we live, work, and communicate with each other.",
  "The only way to do great work is to love what you do. Find your passion and pursue it relentlessly.",
];

const TypingTest = () => {
  const [theme, setTheme] = useState("dark");
  const [paragraph, setParagraph] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [time, setTime] = useState(0);
  const [stats, setStats] = useState({ wpm: 0, cps: 0, accuracy: 0 });
  const [isStrictMode, setIsStrictMode] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  const intervalRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    generateNewParagraph();
  }, []);

  useEffect(() => {
    if (isTyping && !testFinished) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isTyping, testFinished]);

  useEffect(() => {
    if (time > 0 && !testFinished) {
      calculateStats();
    }
  }, [time, inputValue]);

  const generateNewParagraph = () => {
    const randomIndex = Math.floor(Math.random() * paragraphs.length);
    setParagraph(paragraphs[randomIndex]);
    resetTest();
  };

  const resetTest = () => {
    setInputValue("");
    setIsTyping(false);
    setTime(0);
    setStats({ wpm: 0, cps: 0, accuracy: 0 });
    setTestFinished(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    if (!isTyping && value.length > 0) {
      setIsTyping(true);
    }

    if (testFinished) return;

    setInputValue(value);

    if (value.length === paragraph.length) {
      setIsTyping(false);
      setTestFinished(true);
      calculateStats();
    }
  };

  const handleKeyDown = (e) => {
    if (isStrictMode && (e.key === "Backspace" || e.key === "Delete")) {
      e.preventDefault();
    }
  };

  const calculateStats = () => {
    const typedChars = inputValue.length;
    const correctChars = inputValue
      .split("")
      .filter((char, index) => char === paragraph[index]).length;

    const accuracy =
      typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 0;
    const cps = time > 0 ? Math.round(typedChars / time) : 0;
    const wpm = time > 0 ? Math.round(typedChars / 5 / (time / 60)) : 0;

    setStats({ wpm, cps, accuracy });
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  const getCharClass = (char, index) => {
    if (index < inputValue.length) {
      return char === inputValue[index] ? "correct" : "incorrect";
    }
    return "";
  };

  return (
    <div className={`container ${theme}`}>
      <div className="header">
        <h1>Typing Speed Test💻</h1>
        
      </div>
      <div className="paragraph-box">
        <p>
          {paragraph.split("").map((char, index) => (
            <span key={index} className={getCharClass(char, index)}>
              {char}
            </span>
          ))}
        </p>
      </div>
      <textarea
        ref={inputRef}
        className="typing-area"
        placeholder="Start Typing..."
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        disabled={testFinished}
      />
      <div className="stats-box">
        <div className="stat">
          <p>Time:</p>
        <span> {time}s</span>
      </div>
        <div className="stat">
          <p>Speed:</p>
          <span>{stats.cps} CPS</span>
        </div>
        <div className="stat">
          <p>Accuracy:</p>
          <span>{stats.accuracy}%</span>
        </div>
        <div className="stat">
          <p>WPM:</p>
          <span>{stats.wpm}</span>
        </div>
      </div>
      {/* <div className="stat">
        <span>Time: {time}s</span>
      </div> */}
      <div className="buttons-container">
        <button onClick={generateNewParagraph}>Restart</button>
        <button
          onClick={() => setIsStrictMode(!isStrictMode)}
          className={isStrictMode ? "active" : ""}
        >
          Strict Mode {isStrictMode ? "ON" : "OFF"}
        </button>
        <div className="">
        <button className="theme-btn" onClick={toggleTheme}>
          💡 {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
        </div>
      </div>
    </div>
  );
};

export default TypingTest;
