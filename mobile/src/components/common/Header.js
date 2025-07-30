import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Header({ title, subtitle, showBack, onBack, actions }) {
  return (
    <Appbar.Header style={styles.header}>
      {showBack && (
        <Appbar.BackAction onPress={onBack} />
      )}
      <Appbar.Content 
        title={title}
        subtitle={subtitle}
        titleStyle={styles.title}
        subtitleStyle={styles.subtitle}
      />
      {actions && actions.map((action, index) => (
        <Appbar.Action 
          key={index}
          icon={action.icon}
          onPress={action.onPress}
        />
      ))}
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#27548A',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#E5E7EB',
    fontSize: 14,
  },
});