// BackgroundTask.js

import axios from 'axios';
import React, { useEffect } from 'react';
import BackgroundFetch from 'react-native-background-fetch';
import Constants from "expo-constants";

const BackgroundTask = () => {
  const nodeBackend = Constants.expoConfig?.extra?.nodeBackend;
  useEffect(() => {
    // Configure background fetch
    const configureBackgroundFetch = async () => {
      // Configure the background fetch behavior
      await BackgroundFetch.configure(
        {
          minimumFetchInterval: 15,  // Fetch every 15 minutes for testing, can be adjusted
          stopOnTerminate: false,     // Keep fetch running even after app is terminated
          startOnBoot: true,          // Start fetch task after device reboot
          enableHeadless: true,       // Enable headless task (fetch even if app is closed)
        },
        async (taskId) => {
          console.log('[BackgroundFetch] Task:', taskId);

          // Send data to your backend here (replace with actual API call)
          await sendToBackend();

          // Mark task as finished
          BackgroundFetch.finish(taskId);
        },
        (error) => {
          console.log('[BackgroundFetch] failed to start:', error);
        }
      );
    };

    // Initialize background fetch configuration
    configureBackgroundFetch();

    // Optional: add an event listener for when app is terminated
    BackgroundFetch.on('headless', async (event) => {
      console.log('[BackgroundFetch] Headless event:', event);
      await sendToBackend();
    });
  }, []);

  // Function to send data to the backend (implement your backend call here)
  const sendToBackend = async () => {
    console.log('✅ Sent data to backend');
    const response = await axios.get(`${nodeBackend}`);
    const data = response.data;
  };

  return null; // Since this component doesn't render anything visually
};

export default BackgroundTask;
