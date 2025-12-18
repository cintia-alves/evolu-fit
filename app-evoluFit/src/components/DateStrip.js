import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '../context/ThemeContext'; // Importe o hook

const DateStrip = ({ data }) => {
  const { theme } = useAppTheme(); // Use o tema

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={[styles.monthText, { color: theme.colors.secondaryText }]}>
        Novembro, 2025
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {data.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={[
              styles.dayCard, 
              { backgroundColor: item.active ? theme.colors.primary : theme.colors.surface }
            ]}
          >
            <Text style={[
              styles.dayText, 
              { color: item.active ? '#FFF' : theme.colors.secondaryText }
            ]}>
              {item.day}
            </Text>
            <Text style={[
              styles.dateText, 
              { color: item.active ? '#FFF' : theme.colors.text }
            ]}>
              {item.date}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  monthText: { marginBottom: 10, paddingHorizontal: 20 },
  scroll: { paddingHorizontal: 15, paddingVertical: 4 },
  dayCard: {
    width: 60,
    height: 70,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 2,
  },
  dayText: { fontSize: 10, marginBottom: 4 },
  dateText: { fontSize: 16, fontWeight: 'bold' },
});

export default DateStrip;