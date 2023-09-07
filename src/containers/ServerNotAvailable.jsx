import React, { Component } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Icon, Image } from 'react-native'
import styles from '../utils/style_guide/MainWebpageStyle'
import CheckIfServerUpOutsideSession from '../components/atoms/CheckIfServerUpOutsideSession'
import { connect } from 'react-redux'
import { invalidateIsServerDown } from '../store/Slices/IsServerDownSlice'

class ServerNotAvailable extends Component {
  setServerUnavailable (serverUnavailable) {
    if (!serverUnavailable) {
      this.props.invalidateIsServerDown()
    }
  }

  render () {
    return (
        <View style={styles.container}>
            <CheckIfServerUpOutsideSession
              setServerUnavailable={this.setServerUnavailable.bind(this)}
            />
            <Text style={styles.titleText}>Emotional Machines Is Down</Text>
            <Text style={styles.titleText}>
                Server unavailable, we are working hard to get back online!
            </Text>
        </View>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    invalidateIsServerDown: (value) => dispatch(invalidateIsServerDown(value))
  }
}

export default connect(null, mapDispatchToProps)(ServerNotAvailable)
