import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { CommonActions } from '@react-navigation/native';
import Constants from "expo-constants"

const Questionnaire = ({ navigation }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // Use an array instead of an object
  const [completed, setCompleted] = useState(false);

  const pythonBackend = Constants.expoConfig.extra.pythonBackend
  
  // Your questions and options from the provided data
  const questionsData = [
    "Do you feel sad or down most of the time?",
    "How do you feel about your future? Do you find yourself feeling discouraged?",
    "Do you feel like a failure or that you've failed more than others?",
    "Do you still enjoy things the way you used to, or has that changed?",
    "Do you feel guilty frequently or all the time?",
    "Do you feel like you deserve to be punished or that you are being punished?",
    "Are you disappointed in yourself or do you feel disgusted with yourself?",
    "How critical are you of yourself? Do you blame yourself for things going wrong?",
    "Have you had thoughts of harming or killing yourself?",
    "Do you find yourself crying more than usual, or feeling like you want to cry but can't?",
    "Do you feel more irritated or annoyed than usual?",
    "Have you lost interest in being around other people?",
    "Do you find it harder to make decisions than before?",
    "How do you feel about your appearance? Do you worry that you look unattractive?",
    "Are you able to work or do tasks as well as before, or has it become harder?",
    "Are you having trouble sleeping or waking up earlier than usual?",
    "Do you get tired easily, or feel too tired to do anything?",
    "Has your appetite changed? Do you find yourself eating less or losing weight?",
    "Have you noticed any significant weight loss recently?",
    "Are you more worried about your physical health, or experiencing any constant physical problems?"
  ];

  const optionsData = [
    ["I do not feel sad", "I feel sad", "I am sad all the time", "I can't stand it"],
    ["I am not discouraged", "I feel discouraged", "I have nothing to look forward to", "The future feels hopeless"],
    ["I don't feel like a failure", "I have failed more than average", "All I see is failure", "I am a complete failure"],
    ["I get satisfaction as usual", "I don't enjoy things anymore", "No satisfaction from anything", "I feel dissatisfied with everything"],
    ["I don't feel guilty", "I feel guilty often", "I feel guilty most of the time", "I feel guilty all the time"],
    ["I don't feel punished", "I may be punished", "I expect punishment", "I feel I am being punished"],
    ["I don't feel disappointed", "I am disappointed in myself", "I am disgusted with myself", "I hate myself"],
    ["I don't feel worse than others", "I criticize myself", "I blame myself constantly", "I blame myself for everything"],
    ["No thoughts of killing myself", "Thoughts but won't act", "I would like to kill myself", "I would kill myself if I could"],
    ["I don't cry more than usual", "I cry more than I used to", "I cry all the time", "I can't cry even if I want to"],
    ["I am not irritated", "I am slightly more irritated", "I am quite irritated", "I feel irritated all the time"],
    ["I haven't lost interest in people", "I am less interested in people", "I lost most of my interest", "I have no interest in people"],
    ["I make decisions well", "I delay decisions", "I struggle making decisions", "I can't make decisions at all"],
    ["I don't feel worse about my looks", "I worry about looking unattractive", "I feel I look permanently unattractive", "I believe I look ugly"],
    ["I work as well as before", "It takes effort to start work", "I have to push myself hard", "I can't do any work at all"],
    ["I sleep as usual", "I don't sleep as well as before", "I wake up early and can't sleep", "I wake up several hours early"],
    ["I don't get more tired", "I get tired easily", "I get tired doing anything", "I am too tired to do anything"],
    ["My appetite is normal", "My appetite isn't as good", "My appetite is worse", "I have no appetite"],
    ["I haven't lost much weight", "I lost more than 5 pounds", "I lost more than 10 pounds", "I lost more than 15 pounds"],
    ["I am not worried about health", "I am worried about aches and pains", "I am very worried about health issues", "I can't think of anything else but health"]
  ];
  
  // Convert the data into the structured format we need
  const questions = questionsData.map((question, index) => {
    return {
      id: index,
      text: question,
      options: optionsData[index].map((option, optIndex) => {
        return {
          id: optIndex, // Use numeric values (0, 1, 2, 3) for options
          text: option,
          value: optIndex // Store numeric value for scoring
        };
      })
    };
  });

  // Save progress after each answer
  useEffect(() => {
    saveProgress();
  }, [answers, currentQuestionIndex]);

  useEffect(() => {
    loadSavedProgress();
  }, []);

  const loadSavedProgress = async () => {
    try {
      const savedAnswers = await AsyncStorage.getItem('questionnaire_answers');
      const savedQuestion = await AsyncStorage.getItem('questionnaire_current_question');
      
      if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
      if (savedQuestion) setCurrentQuestionIndex(parseInt(savedQuestion));
    } catch (error) {
      console.error('Failed to load saved progress:', error);
    }
  };

  const saveProgress = async () => {
    try {
      await AsyncStorage.setItem('questionnaire_answers', JSON.stringify(answers));
      await AsyncStorage.setItem('questionnaire_current_question', currentQuestionIndex.toString());
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const clearSavedProgress = async () => {
    try {
      // await AsyncStorage.removeItem('questionnaire_answers');
      await AsyncStorage.removeItem('questionnaire_current_question');
      await AsyncStorage.removeItem('questionnaire_time_remaining');
    } catch (error) {
      console.error('Failed to clear saved progress:', error);
    }
  };
  
  const handleSelectOption = (questionId, optionId) => {
    const newAnswers = [...answers];
    newAnswers[questionId] = optionId; // Store the numeric value of the selected option
    setAnswers(newAnswers);
  };
  
  const handleNextQuestion = () => {
    // Form validation
    if (answers[currentQuestionIndex] === undefined) {
      Alert.alert(
        "No Answer Selected",
        "Please select an answer before proceeding.",
        [{ text: "OK" }]
      );
      return;
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCompleted(true);
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleSkipQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCompleted(true);
    }
  };
  
  const handleSubmit = async () => {
    console.log('Submitted answers:', answers);
    try {
      const response = await axios.post(`${pythonBackend}/predict`, { responses: answers });
      const data = await response.data;
  
      console.log(response.data);
      
      Alert.alert(
        "Submission Successful", // Title
        `You have completed the assessment.\n\n${data.depression_level} \n\n${data.feedback}`, // Message
        [
          { 
            text: "OK", 
            onPress: async () => {
              setTimeout(() => {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Initial' }],
                  })
                );
              }, 200);
              await clearSavedProgress();
            } 
          }
        ]
      );
    } catch (err) {
      console.log(err);
    }
  };
  
  const renderProgressBar = () => {
    const progress = (answers.filter(answer => answer !== undefined).length / questions.length) * 100;
    
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {answers.filter(answer => answer !== undefined).length} of {questions.length} answered
        </Text>
      </View>
    );
  };
  
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  
  if (completed) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.completedContainer}>
          <Text style={styles.completedText}>Assessment Completed</Text>
          
          {renderProgressBar()}
          
          <View style={styles.reviewContainer}>
            <Text style={styles.reviewTitle}>Review Your Responses</Text>
            
            <ScrollView style={styles.reviewScroll}>
              {questions.map((question, index) => {
                const answered = answers[question.id];
                let selectedOption = null;
                
                if (answered !== undefined) {
                  selectedOption = question.options.find(opt => opt.id === answered);
                }
                
                return (
                  <View key={question.id} style={styles.reviewItem}>
                    <Text style={styles.reviewQuestion}>
                      {index + 1}. {question.text}
                    </Text>
                    {selectedOption ? (
                      <Text style={styles.reviewAnswer}>
                        Your response: {selectedOption.text}
                      </Text>
                    ) : (
                      <Text style={styles.reviewNotAnswered}>Not answered</Text>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </View>
          
          <View style={styles.finalButtonsContainer}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setCompleted(false)}
            >
              <Text>Back to Questions</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.navigationButton, styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar style='light'/> */}
      <View style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Understanding You Better 🤗</Text>
        </View>
        
        {renderProgressBar()}
      </View>
      
      <View style={styles.questionContainer}>
        <Text style={styles.questionCounter}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Text>
        
        <Text style={styles.questionText}>{currentQuestion.text}</Text>
        
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                answers[currentQuestion.id] === option.id && styles.selectedOption,
              ]}
              onPress={() => handleSelectOption(currentQuestion.id, option.id)}
            >
              <Text style={[
                styles.optionText,
                answers[currentQuestion.id] === option.id && styles.selectedOptionText,
              ]}>
                {option.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.navigationContainer}>
        <TouchableOpacity 
          style={[
            styles.navigationButton,
            isFirstQuestion && styles.disabledButton,
          ]}
          onPress={handlePreviousQuestion}
          disabled={isFirstQuestion}
        >
          <Text style={styles.navigationButtonText}>Previous</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navigationButton}
          onPress={handleSkipQuestion}
        >
          <Text style={styles.navigationButtonText}>Skip</Text>
        </TouchableOpacity>
        
        {isLastQuestion ? (
          <TouchableOpacity 
            style={[styles.navigationButton, styles.finishButton]}
            onPress={() => {
              if (answers[currentQuestion.id]) {
                setCompleted(true);
              } else {
                Alert.alert(
                  "No Answer Selected",
                  "Please select an answer or use Skip if you want to leave this question unanswered.",
                  [{ text: "OK" }]
                );
              }
            }}
          >
            <Text style={{color: "white", fontStyle: "bold"}}>Finish</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.navigationButton, styles.nextButton]}
            onPress={handleNextQuestion}
          >
            <Text style={{color: "white"}}>Next</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    padding: 16,
    
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4a4a4a',
  },
  timerText: {
    textAlign: 'center',
    fontSize: 22,
    color: '#d9534f',
    marginBottom: 10,
  },
  progressContainer: {
    marginTop: 5,
    marginBottom: 5,
  },
  progressBackground: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8E67FD',
  },
  progressText: {
    textAlign: 'center',
    marginTop: 5,
    fontSize: 12,
    color: '#666',
  },
  questionContainer: {
    flex: 1,
    padding: 20,
  },
  questionCounter: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#777',
    fontSize: 16,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
    lineHeight: 28,
  },
  optionsContainer: {
    marginTop: 20,
  },
  optionButton: {
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    borderWidth: .1,
    borderColor: "#333"
  },
  selectedOption: {
    backgroundColor: '#8E67FD',
    borderColor: '#357ebd',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: '500',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  navigationButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: .1,
    borderColor: "#333"
  },
  disabledButton: {
    backgroundColor: '#f0f0f0',
    opacity: 0.5,
  },
  nextButton: {
    backgroundColor: '#8E67FD',
  },
  finishButton: {
    backgroundColor: '#5cb85c',
  },
  navigationButtonText: {
    fontWeight: '600',
    color: '#333',
  },
  completedContainer: {
    flex: 1,
    padding: 20,
  },
  completedText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#5cb85c',
  },
  reviewContainer: {
    flex: 1,
    marginVertical: 20,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  reviewScroll: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 10,
  },
  reviewItem: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#428bca',
  },
  reviewQuestion: {
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  reviewAnswer: {
    color: '#5cb85c',
    fontWeight: '500',
  },
  reviewNotAnswered: {
    color: '#d9534f',
    fontStyle: 'italic',
  },
  finalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  backButton: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000"
  },
  submitButton : {
    backgroundColor: "#8E67FD"
  },
  submitButtonText:  {
    color: "#fff"
  }
});

export default Questionnaire;