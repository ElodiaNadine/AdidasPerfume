import { useState, useCallback } from 'react';
import { doc, setDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { APP_ID } from '../constants/firebase';
import { QUESTIONS } from '../constants/quiz';
import { RESULTS } from '../constants/results';
import { shuffleArray, generateVibeCode, mapAnswers } from '../utils/helpers';
import { getIpLocation } from '../utils/location';
import { calculateQuizResult } from '../utils/scoring';

/**
 * Custom hook for managing quiz state and logic
 */
export const useQuiz = (user, onQuizComplete = () => {}) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [shuffledQuestions, setShuffledQuestions] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [checkingHistory, setCheckingHistory] = useState(true);

  // Check if user already completed quiz
  const checkQuizHistory = useCallback(async () => {
    try {
      if (!user) {
        setShuffledQuestions(QUESTIONS.map(q => ({
          ...q,
          options: shuffleArray(q.options)
        })));
        setCheckingHistory(false);
        return;
      }

      const codesRef = collection(db, 'artifacts', APP_ID, 'public', 'data', 'vibe_codes');
      const q = query(codesRef, where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const existingData = querySnapshot.docs[0].data();
        const resultDetails = RESULTS[existingData.result];
        onQuizComplete({
          result: resultDetails,
          code: existingData.code,
          isExisting: true
        });
      } else {
        const randomized = QUESTIONS.map(q => ({
          ...q,
          options: shuffleArray(q.options)
        }));
        setShuffledQuestions(randomized);
      }
    } catch (error) {
      console.error("Error checking quiz history:", error);
      setShuffledQuestions(QUESTIONS.map(q => ({
        ...q,
        options: shuffleArray(q.options)
      })));
    } finally {
      setCheckingHistory(false);
    }
  }, [user, onQuizComplete]);

  // Handle answer selection
  const handleAnswer = useCallback((value) => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = value; // Update answer at current position
    setAnswers(newAnswers);

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      calculateResult(newAnswers);
    }
  }, [currentQ, answers]);

  // Navigate to previous question
  const goToPreviousQuestion = useCallback(() => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
    }
  }, [currentQ]);

  // Navigate to next question
  const goToNextQuestion = useCallback(() => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      calculateResult(answers);
    }
  }, [currentQ, answers]);

  // Calculate and save result
  const calculateResult = async (finalAnswers) => {
    setIsCalculating(true);
    
    try {
      const resultData = calculateQuizResult(finalAnswers);
      const uniqueCode = generateVibeCode();

      if (user) {
        const locationData = await getIpLocation();
        const answerMap = mapAnswers(finalAnswers);

        await setDoc(
          doc(db, 'artifacts', APP_ID, 'public', 'data', 'vibe_codes', uniqueCode),
          {
            code: uniqueCode,
            result: Object.keys(RESULTS).find(key => RESULTS[key].title === resultData.title),
            answers: answerMap,
            userLocation: locationData,
            redeemed: false,
            createdAt: serverTimestamp(),
            uid: user.uid
          }
        );
      }

      setTimeout(() => {
        setIsCalculating(false);
        onQuizComplete({
          result: resultData,
          code: uniqueCode,
          isExisting: false
        });
      }, 2000);
    } catch (error) {
      console.error("Error calculating result:", error);
      setIsCalculating(false);
    }
  };

  return {
    currentQ,
    answers,
    shuffledQuestions,
    isCalculating,
    checkingHistory,
    handleAnswer,
    goToPreviousQuestion,
    goToNextQuestion,
    checkQuizHistory
  };
};
