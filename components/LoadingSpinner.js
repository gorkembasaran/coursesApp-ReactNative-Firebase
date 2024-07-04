import { StyleSheet, Text, View } from 'react-native'
import {ActivityIndicator} from 'react-native';
import React from 'react'

export default function LoadingSpinner() {
  return (
    <View style={styles.container}>
        <ActivityIndicator size="large" />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor : 'white',
      }
})