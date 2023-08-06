import React, { Component } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Icon, Image } from 'react-native'
import styles from '../utils/style_guide/MainWebpageStyle'
import { api, channelUrl, youtubeRetrieveChannelResults } from '../utils/backend_configuration/BackendConfig'
import ArticlesResultTableDataWrangler from './search_helper_functions/ArticlesResultTableDataWrangler'
import SearchOverallEmoResultTable from '../components/molecules/SearchOverallEmoResultTable'
import EmoEngagementStringFormatter from './search_helper_functions/EmoEngagementStringFormatter'
import YTCommentsBasicResultCard from '../components/molecules/YTCommentsBasicResultCard'
import { connect } from 'react-redux'
import YTCommentsOverallResultCard from '../components/molecules/YTCommentsOverallResultCard'
import { setAnonSession } from '../store/Slices/AnonSessionSlice'
import CheckEmptyObject from '../utils/CheckEmptyObject'
import ReaverageEmoBreakdown from '../utils/ReaverageEmoBreakdown'

class ChannelSearchPage extends Component {
  constructor (props) {
    super(props)

    const newAnonSessionId = this.props.anonSession.anonSession
    const usernameToUse = newAnonSessionId.payload

    this.state = {
      channelInput: '',
    }

    api.post(youtubeRetrieveChannelResults, {
      username: usernameToUse
    }, {
      withCredentials: true
    }
    ).then(response => {
      if (response.data.operation_success) {
        this.setState({ channelInitiated: false })
        this.setState({ noPreviousResults: false })

        this.populateOverallEmoResultTable(response.data.responsePayload.top_5_average_emo_breakdown[this.state.videoNumber - 1])
        this.populateCommentsResultTable(response.data.responsePayload)
      }
    }
    ).catch(error => {
      console.log('Check channel analysis in progress failed')
      this.setState({ noPreviousResults: true })
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()

    if (CheckEmptyObject(this.props.anonSession.anonSession)) {
      console.log('No anon session set')
      return
    }

    this.setState({ channelInitiated: true })

    api.post(channelUrl, {
      channelInput: this.state.channelInput,
      username: this.state.usernameToUse
    }, {
      withCredentials: true
    }
    ).then(response => {
    }
    ).catch(error => {
      // Also add 'ERR_EMPTY_RESPONSE'
      if (error.code === 'ERR_BAD_RESPONSE') {
      }
    })
  }

  render () {
    return (
      <View style={styles.subcontainer}>
          <Text style={styles.text}>For support, please email antoine.tian@emomachines.xyz</Text>

        <View style={styles.innerContainer}>
          <View class="form-group form-row">
            <View class="col-10">
              <br></br>
              <br></br>
              <TextInput
                editable
                multiline
                numberOfLines={4}
                maxLength={40}
                value={this.state.channelInput}
                onChangeText={text => this.setState({ channelInput: text })}
                placeholder={'Search for your YouTube channel (result might take a few minutes)'}
                style={{ padding: 10, borderWidth: 2, borderColor: '#BC2BEA' }}
              />
              <br></br>
              {!this.state.channelInitiated &&
                <TouchableOpacity style={styles.analyseBtn} onPress={this.handleSubmit}>
                  <Text style={styles.text}>ANALYSE</Text>
                </TouchableOpacity>
              }
            </View>
          </View>
          <br></br>
        </View>
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    accountData: state.accountData,
    anonSession: state.anonSession
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setAnonSession: (value) => dispatch(setAnonSession(value)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelSearchPage)
