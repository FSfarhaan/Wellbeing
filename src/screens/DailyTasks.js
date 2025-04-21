import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, Easing, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const DailyTasks = () => {
  const [timeLeft, setTimeLeft] = useState('');
  const data = [
    { id: 1, name: "Meditate for 5 minutes", completed: 0, total: 1, icon: "meditation", reward: "🧘 Calm Soul! +10 points" },
    { id: 2, name: "Read a book for 10 minutes", completed: 0, total: 1, icon: "book-open-page-variant", reward: "📚 Knowledge Seeker! +10 points" },
    { id: 3, name: "Go for a 5-minute walk", completed: 0, total: 1, icon: "walk", reward: "🚶 Step Master! +15 points" },
    { id: 4, name: "Make yourself your favorite drink", completed: 0, total: 1, icon: "coffee", reward: "☕ Treat Yourself! +10 points" },
    { id: 5, name: "Write down 3 things you're grateful for", completed: 0, total: 1, icon: "notebook-outline", reward: "🙏 Grateful Guru! +15 points" },
    { id: 6, name: "Stay off social media for 30 minutes", completed: 0, total: 1, icon: "cellphone-off", reward: "📴 Focus Champ! +20 points" },
    { id: 7, name: "Listen to calming music for 10 minutes", completed: 0, total: 1, icon: "music", reward: "🎵 Vibe Master! +10 points" },
    { id: 8, name: "Call or message a friend to check in", completed: 0, total: 1, icon: "account-voice", reward: "📞 Kind Soul! +15 points" },
    { id: 9, name: "Eat one fruit mindfully", completed: 0, total: 1, icon: "food-apple", reward: "🍎 Fruitful Effort! +10 points" },
    { id: 10, name: "Smile at yourself in the mirror", completed: 0, total: 1, icon: "emoticon-happy-outline", reward: "😊 Self-Love Star! +10 points" },
    { id: 11, name: "Journal how you're feeling today", completed: 0, total: 1, icon: "book-edit-outline", reward: "📝 Reflective Mind! +15 points" },
    { id: 12, name: "Stretch your body for 5 minutes", completed: 0, total: 1, icon: "yoga", reward: "🤸 Flex Champ! +10 points" },
    { id: 13, name: "Clean a small part of your room", completed: 0, total: 1, icon: "broom", reward: "🧼 Clean King/Queen! +15 points" },
    { id: 14, name: "Make your bed", completed: 0, total: 1, icon: "bed", reward: "🛏️ Neat Freak! +10 points" },
    { id: 15, name: "Drink a full glass of water", completed: 0, total: 1, icon: "cup-water", reward: "💧 Hydration Hero! +10 points" },
    { id: 16, name: "Spend 5 minutes with nature (or look outside)", completed: 0, total: 1, icon: "leaf", reward: "🌿 Nature Buddy! +15 points" },
    { id: 17, name: "Doodle or draw something — anything!", completed: 0, total: 1, icon: "palette", reward: "🎨 Creative Soul! +15 points" },
    { id: 18, name: "Learn one new fact today", completed: 0, total: 1, icon: "lightbulb-on-outline", reward: "💡 Brain Booster! +10 points" },
    { id: 19, name: "Organize your desktop or phone apps", completed: 0, total: 1, icon: "folder-move-outline", reward: "📂 Organized Mind! +10 points" },
    { id: 20, name: "Watch a motivational video", completed: 0, total: 1, icon: "youtube", reward: "🎬 Inspired! +15 points" },
    { id: 21, name: "Do 10 jumping jacks", completed: 0, total: 1, icon: "run-fast", reward: "🏃 Energy Burst! +10 points" },
    { id: 22, name: "Take 5 deep breaths slowly", completed: 0, total: 1, icon: "weather-windy", reward: "🌬️ Breathe Boss! +10 points" },
    { id: 23, name: "Compliment yourself out loud", completed: 0, total: 1, icon: "account-heart", reward: "💖 Self-Love Pro! +10 points" },
    { id: 24, name: "Write a short note to your future self", completed: 0, total: 1, icon: "note-edit-outline", reward: "📩 Time Traveler! +15 points" },
    { id: 25, name: "Declutter one drawer or shelf", completed: 0, total: 1, icon: "archive-outline", reward: "🗂️ Declutter King/Queen! +10 points" },
    { id: 26, name: "Go screen-free for 15 minutes", completed: 0, total: 1, icon: "monitor-off", reward: "📵 Digital Detoxer! +15 points" },
    { id: 27, name: "Sit in silence for 2 minutes", completed: 0, total: 1, icon: "volume-off", reward: "🤫 Peace Keeper! +10 points" },
    { id: 28, name: "Do a random act of kindness", completed: 0, total: 1, icon: "hand-heart", reward: "💝 Kindness Hero! +20 points" },
    { id: 29, name: "Light a candle or smell something nice", completed: 0, total: 1, icon: "candle", reward: "🕯️ Aroma Alchemist! +10 points" },
    { id: 30, name: "Visualize a goal for 2 minutes", completed: 0, total: 1, icon: "eye", reward: "🎯 Visionary! +15 points" },
  ];

  const [tasks, setTasks] = useState([]);
  const [streakDays, setStreakDays] = useState(0);
  const [totalPoints, setTotalPoints] = useState(100);
  const [showReward, setShowReward] = useState(false);
  const [currentReward, setCurrentReward] = useState('');
  const [allCompletedReward, setAllCompletedReward] = useState(false);
  
  // Animation values
  const rewardScale = useState(new Animated.Value(0))[0];
  const rewardOpacity = useState(new Animated.Value(0))[0];
  const confettiOpacity = useState(new Animated.Value(0))[0];

  const updateTaskCompletions = (tasksArray, completedArray) => {
    const updated = tasksArray.map((task, index) => ({
      ...task,
      completed: completedArray[index] || 0
    }));
    setTasks(updated);
  };
  

  useEffect(() => {
    const initializeTasks = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const storedDate = await AsyncStorage.getItem('date');
        const storedTasks = await AsyncStorage.getItem('tasks');
        const storedCompleted = await AsyncStorage.getItem('completed');
  
        if (!storedDate || !storedTasks || !storedCompleted) {

          // First time user or data missing
          const response = await axios.get('http://192.168.198.209:3000/api/tasks/getTasks');
          const newTasks = await response.data;
          console.log("1 ke andar aaya");
  
          await AsyncStorage.setItem('date', today);
          await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
          await AsyncStorage.setItem('completed', JSON.stringify([0, 0, 0]));
  
          setTasks(newTasks);
          updateTaskCompletions(newTasks, [0, 0, 0]);

          return;
        }
  
        if (storedDate === today) {
          console.log("2 ke andar aaya");
          // Same day, load from storage
          const parsedTasks = JSON.parse(storedTasks);
          const parsedCompleted = JSON.parse(storedCompleted);
          console.log("Tasks: " + parsedTasks);
          console.log("Completed: " + parsedCompleted);
          setTasks(parsedTasks);
          updateTaskCompletions(parsedTasks, parsedCompleted);
        } else {
          console.log("3 ke andar aaya");
          // New day
          const response = await axios.get('http://192.168.198.209:3000/api/tasks/getTasks');
          const newTasks = await response.data;
          console.log(newTasks);
  
          await AsyncStorage.setItem('date', today);
          await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
          await AsyncStorage.setItem('completed', JSON.stringify([0, 0, 0]));
  
          setTasks(newTasks);
          updateTaskCompletions(newTasks, [0, 0, 0]);
        }
      } catch (error) {
        console.error('Error initializing tasks:', error);
      }
    };
  
    initializeTasks();
  }, []);
  

  // Calculate time left until next day
  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diff = tomorrow - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check if all tasks are completed
  useEffect(() => {
    if(tasks.length === 0) return;
    const allCompleted = tasks.every(task => task.completed >= task.total);
    if (allCompleted && !allCompletedReward) {
      setAllCompletedReward(true);
      // Delay to let the last task reward animation finish
      setTimeout(() => {
        showRewardAnimation('🏆 All Tasks Completed! +50 BONUS POINTS! 🎉', true);
        setTotalPoints(prev => prev + 50);
        setStreakDays(prev => prev + 1);
      }, 1000);
    }
  }, [tasks]);

  // Animate reward popup
  const showRewardAnimation = (rewardText, isSpecial = false) => {
    setCurrentReward(rewardText);
    setShowReward(true);
    
    Animated.sequence([
      Animated.parallel([
        Animated.timing(rewardScale, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.elastic(1),
        }),
        Animated.timing(rewardOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(rewardScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // If it's a special reward (all tasks completed), show confetti
    if (isSpecial) {
      Animated.timing(confettiOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Hide confetti after some time
      setTimeout(() => {
        Animated.timing(confettiOpacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }).start();
      }, 3000);
    }

    // Hide reward after some time
    setTimeout(() => {
      Animated.timing(rewardOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setShowReward(false);
        rewardScale.setValue(0);
      });
    }, 2000);
  };

  // Progress calculation
  const calculateProgress = () => {
    const completedCount = tasks.reduce((sum, task) => sum + (task.completed >= task.total ? 1 : 0), 0);
    return (completedCount / tasks.length) * 100;
  };

  const progress = calculateProgress();

  // Handle task completion
  const handleTaskProgress = async (taskId) => {
    setTasks(prevTasks => {
      const updatedTasks = [...prevTasks];
      const taskIndex = updatedTasks.findIndex(task => task.id === taskId);
  
      if (taskIndex !== -1 && updatedTasks[taskIndex].completed < updatedTasks[taskIndex].total) {
        updatedTasks[taskIndex].completed += 1;
  
        // Save updated completions
        const completedArray = updatedTasks.map(t => t.completed);
        AsyncStorage.setItem('completed', JSON.stringify(completedArray));
  
        // Reward logic
        const rewardPoints = taskId === 2 ? 15 : 10;
        setTotalPoints(prev => prev + rewardPoints);
        showRewardAnimation(updatedTasks[taskIndex].reward);
  
        // Streak and all task complete check will be triggered by useEffect on tasks
      }
  
      return updatedTasks;
    });
  };  

  // Render confetti
  const renderConfetti = () => {
    const confetti = [];
    const colors = ['#ffbe0b', '#fb5607', '#ff006e', '#8338ec', '#3a86ff'];
    
    for (let i = 0; i < 30; i++) {
      const size = Math.random() * 8 + 5;
      confetti.push(
        <View
          key={i}
          style={{
            position: 'absolute',
            top: Math.random() * 300,
            left: Math.random() * 300,
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            transform: [
              { translateX: Math.random() * 100 - 50 },
              { translateY: Math.random() * 100 - 50 },
            ],
          }}
        />
      );
    }
    
    return confetti;
  };

  const handleClearData = async () => {
    await AsyncStorage.removeItem("tasks");
    await AsyncStorage.removeItem("date");
    await AsyncStorage.removeItem("completed");
  }

  return (
    <ScrollView style={styles.container}>
      {/* Animated Reward */}
      {showReward && (
        <Animated.View 
          style={[
            styles.rewardContainer,
            { 
              opacity: rewardOpacity,
              transform: [{ scale: rewardScale }] 
            }
          ]}
        >
          <Text style={styles.rewardText}>{currentReward}</Text>
        </Animated.View>
      )}

      {/* Confetti Animation */}
      <Animated.View style={[styles.confettiContainer, { opacity: confettiOpacity }]}>
        {renderConfetti()}
      </Animated.View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daily Health</Text>
        <Text style={styles.refreshText}>Refresh in: {timeLeft}</Text>
      </View>

      {/* Tasks */}
      {tasks.map((task) => (
        <View key={task.id} style={styles.taskContainer}>
          <View style={styles.taskIconContainer}>
            <MaterialCommunityIcons name={task.icon} size={24} color="#4a90e2" />
          </View>
          <View style={styles.taskDetails}>
            <Text style={styles.taskName}>{task.name}</Text>
          </View>
          <TouchableOpacity 
            style={[
              styles.advanceButton, 
              task.completed >= task.total ? styles.completedButton : {}
            ]}
            onPress={() => handleTaskProgress(task.id)}
            disabled={task.completed >= task.total}
          >
            <Text style={styles.advanceButtonText}>
              {task.completed >= task.total ? '✅ Done!' : 'Mark'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Streak Information */}
      <View style={styles.streakContainer}>
        <MaterialCommunityIcons name="fire" size={24} color="#ff6b6b" />
        <Text style={styles.streakText}>Streak: {streakDays} days 🔥</Text>
        <Text style={styles.pointsText}>{totalPoints} points ⭐</Text>
      </View>

      {/* Daily Motivation */}
      <View style={styles.motivationContainer}>
        <Text style={styles.motivationText}>
          "Small daily improvements lead to amazing results!" 💪
        </Text>
      </View>

      <Button onPress={handleClearData} title='Clear'>
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshText: {
    fontSize: 16,
    color: '#333',
  },
  progressContainer: {
    height: 40,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    width: '100%',
    borderRadius: 20,
    position: 'relative',
  },
  milestones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: '100%',
    alignItems: 'center',
  },
  milestone: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  milestoneActive: {
    backgroundColor: '#FFD700',
  },
  milestoneText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  milestoneEmoji: {
    position: 'absolute',
    top: -20,
    fontSize: 20,
  },
  trophyIcon: {
    position: 'absolute',
    top: -20,
  },
  taskContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  taskDetails: {
    flex: 1,
  },
  taskName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4a90e2',
    borderRadius: 4,
  },
  taskProgress: {
    fontSize: 12,
    color: '#666',
  },
  advanceButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 12,
  },
  completedButton: {
    backgroundColor: '#8bc34a',
  },
  advanceButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  streakText: {
    fontSize: 16,
    fontWeight: '500',
  },
  pointsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a90e2',
  },
  motivationContainer: {
    backgroundColor: '#FFF0C9',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  motivationText: {
    fontStyle: 'italic',
    color: '#8b4513',
    textAlign: 'center',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#8b4513',
    borderRadius: 10,
    padding: 12,
    marginTop: 'auto',
  },
  navButton: {
    paddingHorizontal: 16,
  },
  navButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  rewardContainer: {
    position: 'absolute',
    top: '40%',
    left: '10%',
    right: '10%',
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    borderRadius: 20,
    padding: 16,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  rewardText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#8b4513',
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
    pointerEvents: 'none',
  },
});

export default DailyTasks;