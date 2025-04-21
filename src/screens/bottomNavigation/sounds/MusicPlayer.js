import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Share,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  BackHandler
} from 'react-native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// const { width, height } = Dimensions.get('window');

const musicData = [
  {
    id: '1',
    title: 'Night island',
    category: 'SLEEP MUSIC',
    audio: require('../../../../assets/audio/rain.mp3'),
    // duration: 3600, // 60 minutes in seconds
    background: require('../../../../assets/sounds/rain.jpeg'),
    color: '#1E2A59'
  },
];

const MusicPlayerScreen = ({ route }) => {
  const musicId = route?.params?.musicId || '1';
  const currentMusic = musicData.find(item => item.id === musicId) || musicData[0];
  const navigation = useNavigation();
  
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const positionRef = useRef(position);

  useEffect(() => {
    loadAudio();

    const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => true
    );
    
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      backHandler.remove();
    };
  }, []);

  const handleBackPress = () => {
    stopAndUnloadAudio(); // Stop and unload audio
    navigation.goBack(); // Navigate back
    return true; // Prevent default back behavior
  };

  const stopAndUnloadAudio = async () => {
    if (sound) {
      try {
        await sound.stopAsync(); // Stop playback
        await sound.unloadAsync(); // Unload the audio
      } catch (error) {
        console.log('Error stopping/unloading audio', error);
      }
    }
  };

  const loadAudio = async () => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        currentMusic.audio,
        {
          shouldPlay: false,
          isLooping: true,
          staysActiveInBackground: true,
          shouldCorrectPitch: true,
          progressUpdateIntervalMillis: 1000,
        },
        updatePlaybackStatus
      );
      setSound(newSound);
    } catch (error) {
      console.log('Error loading sound', error);
    }
  };

  const togglePlayPause = async () => {
    if (!sound) return;

    try {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.log('Error toggling play/pause', error);
    }
  };

  const updatePlaybackStatus = (status) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis / 1000);
      positionRef.current = status.positionMillis / 1000;
      
      if (!duration && status.durationMillis) {
        setDuration(status.durationMillis / 1000);
      }
    }
  };

  const skipForward = async () => {
    if (!sound) return;
    
    const newPosition = Math.min(positionRef.current + 15, duration);
    try {
      await sound.setPositionAsync(newPosition * 1000);
      setPosition(newPosition);
    } catch (error) {
      console.log('Error skipping forward', error);
    }
  };

  const skipBackward = async () => {
    if (!sound) return;
    
    const newPosition = Math.max(positionRef.current - 15, 0);
    try {
      await sound.setPositionAsync(newPosition * 1000);
      setPosition(newPosition);
    } catch (error) {
      console.log('Error skipping backward', error);
    }
  };

  const onSliderValueChange = async (value) => {
    if (!sound) return;
    
    try {
      await sound.setPositionAsync(value * 1000);
      setPosition(value);
    } catch (error) {
      console.log('Error setting position', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this amazing ${currentMusic.title} soundtrack I'm listening to!`,
        title: currentMusic.title,
      });
    } catch (error) {
      console.log('Error sharing', error);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <ImageBackground
      source={currentMusic.background}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.roundButton}>
            <Ionicons name="close" size={24} color="#FFF" />
          </TouchableOpacity>
          
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.roundButton} onPress={toggleFavorite}>
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={24} 
                color={isFavorite ? "#FF6B6B" : "#FFF"} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.roundButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Music Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{currentMusic.title}</Text>
          <Text style={styles.category}>{currentMusic.category}</Text>
        </View>
        
        {/* Player Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.secondaryButton} onPress={skipBackward}>
            <Ionicons name="play-back-outline" size={24} color="#FFF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.primaryButton} onPress={togglePlayPause}>
            <Ionicons 
              name={isPlaying ? "pause" : "play"} 
              size={32} 
              color="#1E2A59" 
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={skipForward}>
            <Ionicons name="play-forward-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            onValueChange={onSliderValueChange}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
            thumbTintColor="#FFFFFF"
          />
          
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(16, 24, 64, 0.85)',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  headerRight: {
    flexDirection: 'row',
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  category: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.7,
    marginTop: 8,
    textAlign: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  primaryButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  secondaryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    marginBottom: 50,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -10,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.7,
  },
});

export default MusicPlayerScreen;