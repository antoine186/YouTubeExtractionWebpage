import React, { Component } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Icon, Image } from 'react-native'
import styles from '../utils/style_guide/MainWebpageStyle'

class ServerNotAvailable extends Component {
  render () {
    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>Emotional Machines Is Down</Text>
            <Text style={styles.titleText}>
                Server unavailable, we are working hard to get back online!
            </Text>
        </View>
    )
  }
}

export default ServerNotAvailable
