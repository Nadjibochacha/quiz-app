import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  const decodeEntities = (html) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = html;
    return textarea.value;
  };

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const checkAnswer = (answer) => {
    if (answer === questions[currentQuestion].correct_answer) {
      setScore(score + 1);
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowScore(true);
    }
  };

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await axios.get('https://opentdb.com/api.php?amount=10');
        const formattedQ = response.data.results.map((ques) => ({
          ...ques,
          question: decodeEntities(ques.question),
          incorrect_answers: ques.incorrect_answers.map(decodeEntities),
          correct_answer: decodeEntities(ques.correct_answer),
        }));
        setQuestions(formattedQ);
      } catch (error) {
        console.log('error: ' + error);
      }
    }
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      const options = [...questions[currentQuestion].incorrect_answers, questions[currentQuestion].correct_answer];
      setShuffledOptions(shuffleArray(options));
    }
  }, [currentQuestion, questions]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-300 to-blue-600">
      <div className="text-center text-white bg-white bg-opacity-90 py-12 px-8 w-full max-w-md rounded-lg shadow-lg">
        <h1 className="font-bold text-4xl text-blue-900 uppercase mb-6">Quiz App</h1>
        {questions.length > 0 ? (
          showScore ? (
            <div>
              <h2 className="font-bold text-xl text-blue-800 py-4">Your score: {score} / {questions.length}</h2>
              <button className="bg-green-600 hover:bg-green-500 text-white rounded-lg px-6 py-3 font-bold uppercase transition duration-300 ease-in-out" onClick={() => window.location.reload()}>Restart</button>
            </div>
          ) : (
            <div>
              <h2 className="font-bold text-2xl text-blue-800 mb-4">Question {currentQuestion + 1} / {questions.length}</h2>
              <p className="text-lg text-gray-800 mb-6">Q: {questions[currentQuestion].question}</p>
              <div className="grid grid-cols-1 gap-4">
                {shuffledOptions.map((option, i) => (
                  <button
                    className="bg-blue-500 hover:bg-blue-400 text-white rounded-lg px-5 py-3 font-semibold transition duration-300 ease-in-out"
                    key={i}
                    onClick={() => checkAnswer(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )
        ) : (
          <div className="flex justify-center">
            <div className="loader"></div>
            <p className="ml-4 text-lg text-white">Loading questions...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
