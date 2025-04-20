import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const screenWidth = Dimensions.get('window').width;

// Mock data for different time periods
const mockData = {
  thisWeek: {
    progressData: [
      { date: 'Mon', progress: 20 },
      { date: 'Tue', progress: 35 },
      { date: 'Wed', progress: 42 },
      { date: 'Thurs', progress: 55 },
      { date: 'Fri', progress: 60 },
      { date: 'Sat', progress: 48 },
      { date: 'Sun', progress: 54 },
    ],
    previousProgress: 60,
    wellnessData: {
      mood: { current: 22, total: 30 },
      sleep: { current: 27, total: 30 },
      appetite: { current: 19, total: 30 },
      energy: { current: 24, total: 30 },
      focus: { current: 21, total: 30 },
      lowStress: { current: 26, total: 30 },
      activity: { current: 20, total: 30 },
      hydration: { current: 28, total: 30 },
      interaction: { current: 7, total: 30 },
      gratitude: { current: 25, total: 30 }
    },
    sentimentData: [
      { name: 'Positive', percentage: 45, color: '#4CAF50' },
      { name: 'Neutral', percentage: 35, color: '#FFC107' },
      { name: 'Negative', percentage: 20, color: '#F44336' },
    ]
  },
  thisMonth: {
    progressData: [
      { date: 'Week1', progress: 30 },
      { date: 'Week2', progress: 45 },
      { date: 'Week3', progress: 65 },
      { date: 'Week4', progress: 55 },
    ],
    previousProgress: 40,
    wellnessData: {
      mood: { current: 29, total: 30 },
      sleep: { current: 23, total: 30 },
      appetite: { current: 26, total: 30 },
      energy: { current: 27, total: 30 },
      focus: { current: 20, total: 30 },
      lowStress: { current: 22, total: 30 },
      activity: { current: 28, total: 30 },
      hydration: { current: 21, total: 30 },
      interaction: { current: 30, total: 30 },
      gratitude: { current: 24, total: 30 }
    },
    sentimentData: [
      { name: 'Positive', percentage: 40, color: '#4CAF50' },
      { name: 'Neutral', percentage: 30, color: '#FFC107' },
      { name: 'Negative', percentage: 30, color: '#F44336' },
    ]
  },
  thisYear: {
    progressData: [
      { date: 'Jan', progress: 35 },
      { date: 'Feb', progress: 50 },
      { date: 'Mar', progress: 20 }
    ],
    previousProgress: 70,
    wellnessData: {
      mood: { current: 18, total: 30 },
      sleep: { current: 25, total: 30 },
      appetite: { current: 21, total: 30 },
      energy: { current: 29, total: 30 },
      focus: { current: 23, total: 30 },
      lowStress: { current: 27, total: 30 },
      activity: { current: 22, total: 30 },
      hydration: { current: 26, total: 30 },
      interaction: { current: 19, total: 30 },
      gratitude: { current: 28, total: 30 }
    },
    sentimentData: [
      { name: 'Positive', percentage: 60, color: '#4CAF50' },
      { name: 'Neutral', percentage: 25, color: '#FFC107' },
      { name: 'Negative', percentage: 15, color: '#F44336' },
    ]
  }
};

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('thisWeek');
  const [data, setData] = useState(mockData.thisWeek);

  useEffect(() => {
    setData(mockData[selectedPeriod]);
  }, [selectedPeriod]);

  const getProgressBarColor = (percentage) => {
    if (percentage < 40) return '#F44336'; // Red
    if (percentage < 70) return '#FFC107'; // Yellow
    return '#4CAF50'; // Green
  };

  const getProgressDifference = () => {
    const currentProgress = data.progressData[data.progressData.length - 1].progress;
    const difference = currentProgress - data.previousProgress;
    return {
      value: difference,
      isPositive: difference >= 0
    };
  };

  const progressDiff = getProgressDifference();

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => `#6E17FD`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    barPercentage: 0.7,
  };

  const pieChartData = data.sentimentData.map(item => ({
    name: item.name,
    percentage: item.percentage,
    color: item.color,
    legendFontColor: '#7F7F7F',
    legendFontSize: 12
  }));

  const sharePDF = async () => {
    try {
      const { uri } = await Print.printToFileAsync({
        html: generateHTML(),
        base64: false, // Don't encode it
      });
  
      // Share the PDF
      if (!(await Sharing.isAvailableAsync())) {
        alert("Sharing is not available on this device");
        return;
      }
  
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share Progress Report',
        UTI: 'com.adobe.pdf',
      });
  
    } catch (error) {
      console.error('Error sharing PDF', error);
    }
  };

  const generateHTML = () => {
    // ✅ Generate Bar Chart URL (Progress Data)
    const barChartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify({
      type: "bar",
      data: {
        labels: data.progressData.map(item => item.date),
        datasets: [{
          label: "Progress",
          data: data.progressData.map(item => item.progress),
          backgroundColor: "rgba(0, 119, 204, 0.8)"
        }]
      }
    }))}`;
  
    // ✅ Generate Pie Chart URL (Sentiment Analysis Data)
    const pieChartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify({
      type: "pie",
      data: {
        labels: data.sentimentData.map(item => item.name),
        datasets: [{
          data: data.sentimentData.map(item => item.percentage),
          backgroundColor: data.sentimentData.map(item => item.color)
        }]
      }
    }))}`;
  
    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            h1 { color: #0077CC; text-align: center; }
            .card { border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin: 10px 0; background: #f9f9f9; }
            .progress-bar { height: 20px; background-color: #eee; border-radius: 10px; margin: 10px 0; width: 100%; }
            .progress-fill { height: 20px; border-radius: 10px; }
            .stats { display: flex; flex-wrap: wrap; justify-content: space-between; }
            .stat-item { width: 48%; margin-bottom: 15px; }
            .chart-container { text-align: center; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h1>Progress Report</h1>
  
          <div class="card">
            <h2>Overall Progress</h2>
            <p><b>Current Progress:</b> ${data.progressData[data.progressData.length - 1].progress}%</p>
            <p><b>Previous Period:</b> ${data.previousProgress}%</p>
            <p><b>Change:</b> ${progressDiff.isPositive ? '+' : ''}${progressDiff.value}%</p>
          </div>
  
          <div class="chart-container">
            <h2>Progress Chart</h2>
            <img src="${barChartUrl}" alt="Progress Chart" width="100%" />
          </div>
  
          <div class="card">
            <h2>Wellness Metrics</h2>
            <div class="stats">
              ${Object.entries(data.wellnessData).map(([key, value]) => {
                const percentage = (value.current / value.total) * 100;
                return `
                  <div class="stat-item">
                    <h3>${key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                    <p>${value.current}/${value.total}</p>
                    <div class="progress-bar">
                      <div class="progress-fill" style="width: ${percentage}%; background-color: ${getProgressBarColor(percentage)}"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
  
          <div class="chart-container">
            <h2>Sentiment Analysis</h2>
            <img src="${pieChartUrl}" alt="Sentiment Analysis Pie Chart" width="100%" />
          </div>
        </body>
      </html>
    `;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Progress Tracker 📊</Text>
        <Text style={styles.subGreetingText}>Every milestone is a win</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedPeriod}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedPeriod(itemValue)}
          >
            <Picker.Item label="This Week" value="thisWeek" />
            <Picker.Item label="This Month" value="thisMonth" />
            <Picker.Item label="This Year" value="thisYear" />
          </Picker>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={[styles.sectionTitle, {marginBottom: 5}]}>Progress Over Time</Text>
        <Text style={styles.subGreetingText}>Scores throughtout the period</Text>
        <BarChart
          data={{
            labels: data.progressData.map(item => item.date),
            datasets: [
              {
                data: data.progressData.map(item => item.progress),
              }
            ]
          }}
          width={screenWidth - 100}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
          fromZero={true}
          showValuesOnTopOfBars={true}
          showBarTops={false}
          yAxisLabel=""
        />
      </View>

      <Card style={styles.progressCard}>
        <Card.Content>
          <Text style={styles.cardTitle}>Progress Summary</Text>
          <View style={styles.progressSummary}>
            <View>
              <Text style={styles.currentProgress}>
                {data.progressData[data.progressData.length - 1].progress}%
              </Text>
              <Text style={styles.progressLabel}>Current Progress</Text>
            </View>
            <View>
              <Text style={[
                styles.progressDifference,
                { color: progressDiff.isPositive ? '#4CAF50' : '#F44336' }
              ]}>
                {progressDiff.isPositive ? '+' : ''}{progressDiff.value}%
              </Text>
              <Text style={styles.progressLabel}>From Previous Period</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.wellnessContainer}>
        <Text style={styles.sectionTitle}>Wellness Metrics</Text>
        {Object.entries(data.wellnessData).map(([key, value]) => {
          const percentage = (value.current / value.total) * 100;
          return (
            <View key={key} style={styles.wellnessItem}>
              <View style={styles.wellnessHeader}>
                <Text style={styles.wellnessTitle}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                <Text style={styles.wellnessValue}>{value.current}/{value.total}</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { 
                      width: `${percentage}%`,
                      backgroundColor: getProgressBarColor(percentage)
                    }
                  ]} 
                />
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.sentimentContainer}>
        <Text style={[styles.sectionTitle, { marginBottom: 5 }]}>Sentiment Analysis</Text>
        <Text style={styles.subGreetingText}>Previous Chat history record</Text>
        <PieChart
          data={pieChartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          accessor="percentage"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      <TouchableOpacity style={styles.shareButton} onPress={sharePDF}>
        <Text style={styles.shareButtonText}>Share Report</Text>
        <Icon name="share-alt" size={20} color="#FFF" style={styles.shareIcon} />
      </TouchableOpacity>

      <View style={styles.footer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  pickerContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: .1,
    borderBlockColor: "#333"
  },
  picker: {
    height: 50,
    width: '100%',
  },
  chartContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: .1,
    borderBlockColor: "#333"
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  subGreetingText: {
    fontSize: 16,
    color: '#A1A4B2',
    marginBottom: 15
  },
  chart: {
    borderRadius: 10,
    marginVertical: 8,
    width: "100%"
  },
  progressCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: .1,
    borderBlockColor: "#333",
    elevation: 0,
    shadowColor: 0,
    backgroundColor: "#fff"
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  progressSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentProgress: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0077CC',
  },
  progressDifference: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  progressLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  wellnessContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: .1,
    borderBlockColor: "#333"
  },
  wellnessItem: {
    marginBottom: 16,
  },
  wellnessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  wellnessTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  wellnessValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3F51B5',
  },
  progressBarBackground: {
    height: 12,
    width: '100%',
    backgroundColor: '#E0E6ED',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 10,
    borderRadius: 6,
  },
  sentimentContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: .1,
    borderBlockColor: "#333"
  },
  pieChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 10,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#333333',
  },
  shareButton: {
    backgroundColor: '#8E67FD',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 30
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  shareIcon: {
    marginLeft: 8,
  },
  footer: {
    height: 20,
  }
});

export default Reports;