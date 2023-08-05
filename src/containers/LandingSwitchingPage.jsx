import React, { Component } from 'react'
import SearchFunctionSwitchingPage from './SearchFunctionSwitchingPage'
import TopBar from '../components/molecules/TopBar'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Icon, Image } from 'react-native'
import { Navigate } from 'react-router-dom'
import styles from '../utils/style_guide/MainWebpageStyle'
import { connect } from 'react-redux'
import TaggingPage from './TaggingPage'
import ProgressionPage from './ProgressionPage'
import LinkingPage from './LinkingPage'
import CheckEmptyObject from '../utils/CheckEmptyObject'
import Video1AnalysisPage from './Video1AnalysisPage'
import Video2AnalysisPage from './Video2AnalysisPage'
import Video3AnalysisPage from './Video3AnalysisPage'
import Video4AnalysisPage from './Video4AnalysisPage'
import Video5AnalysisPage from './Video5AnalysisPage'
import { api, basicAccountCreateUrl } from '../utils/backend_configuration/BackendConfig'
import GenerateRandomString from '../utils/GenerateRandomString'
import { setAnonSession } from '../store/Slices/AnonSessionSlice'
import ChannelSearchPage from './ChannelSearchPage'

class LandingSwitchingPage extends Component {
  constructor (props) {
    super(props)

    let usernameToUse = ''

    if (CheckEmptyObject(this.props.anonSession.anonSession)) {
      usernameToUse = 'antoine186@hotmail.com'

      const newAnonSessionId = GenerateRandomString(15)

      const payload = {
        firstName: newAnonSessionId,
        lastName: newAnonSessionId,
        emailAddress: newAnonSessionId,
        password: newAnonSessionId,
        dateBirth: new Date(),
        telephoneNumber: newAnonSessionId,
        telephoneAreaCode: newAnonSessionId,
        selectedCountryName: newAnonSessionId,
        selectedCountryCode: newAnonSessionId,
        selectedStateCode: newAnonSessionId,
        selectedStateName: newAnonSessionId,
        selectedCityName: newAnonSessionId,
        addressLine1: newAnonSessionId,
        addressLine2: newAnonSessionId,
        zipCode: newAnonSessionId,
        anonSessionSet: false
      }

      api.post(basicAccountCreateUrl, {
        accountCreationData: payload
      }, {
        withCredentials: true
      }
      ).then(response => {
        if (response.data.operation_success) {
          // this.props.setAccountData(accountCreationData)
          this.props.setAnonSession(newAnonSessionId)
          this.setState({ anonSessionSet: true })
        } else {
          this.forceUpdate()
        }
      }
      )
    } // else {
      // const newAnonSessionId = this.props.anonSession.anonSession
      // usernameToUse = newAnonSessionId.payload
    //}

    this.state = {
      userSessionValidated: this.props.userSession.validated,
      searchShow: false,
      tagShow: false,
      progression: false,
      linking: false,
      channelShow: true,
      video1Show: false,
      video2Show: false,
      video3Show: false,
      video4Show: false,
      video5Show: false
    }

    this.clearToggleChoice = this.clearToggleChoice.bind(this)
    this.toggleClickSearch = this.toggleClickSearch.bind(this)
    this.toggleClickTag = this.toggleClickTag.bind(this)
    this.toggleClickProgression = this.toggleClickProgression.bind(this)
    this.toggleClickLinking = this.toggleClickLinking.bind(this)
    this.toggleChannelShow = this.toggleChannelShow.bind(this)
    this.toggleVideo1Show = this.toggleVideo1Show.bind(this)
    this.toggleVideo2Show = this.toggleVideo2Show.bind(this)
    this.toggleVideo3Show = this.toggleVideo3Show.bind(this)
    this.toggleVideo4Show = this.toggleVideo4Show.bind(this)
    this.toggleVideo5Show = this.toggleVideo5Show.bind(this)
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.userSession !== this.props.userSession) {
      this.setState({ userSessionValidated: this.props.userSession.validated })
    }
  }

  clearToggleChoice () {
    this.setState({ searchShow: false })
    this.setState({ tagShow: false })
    this.setState({ progression: false })
    this.setState({ linking: false })
    this.setState({ channelShow: false })
    this.setState({ video1Show: false })
    this.setState({ video2Show: false })
    this.setState({ video3Show: false })
    this.setState({ video4Show: false })
    this.setState({ video5Show: false })
  }

  toggleClickSearch () {
    console.log('Toggling to search')
    this.clearToggleChoice()
    this.setState({ searchShow: true })
  }

  toggleClickTag () {
    console.log('Toggling to tagging')
    this.clearToggleChoice()
    this.setState({ tagShow: true })
  }

  toggleClickProgression () {
    console.log('Toggling to progression')
    this.clearToggleChoice()
    this.setState({ progression: true })
  }

  toggleClickLinking () {
    console.log('Toggling to linking')
    this.clearToggleChoice()
    this.setState({ linking: true })
  }

  toggleChannelShow () {
    console.log('Toggling to channel')
    this.clearToggleChoice()
    this.setState({ channelShow: true })
  }

  toggleVideo1Show () {
    console.log('Toggling to video 1')
    this.clearToggleChoice()
    this.setState({ video1Show: true })
  }

  toggleVideo2Show () {
    console.log('Toggling to video 2')
    this.clearToggleChoice()
    this.setState({ video2Show: true })
  }

  toggleVideo3Show () {
    console.log('Toggling to video 3')
    this.clearToggleChoice()
    this.setState({ video3Show: true })
  }

  toggleVideo4Show () {
    console.log('Toggling to video 4')
    this.clearToggleChoice()
    this.setState({ video4Show: true })
  }

  toggleVideo5Show () {
    console.log('Toggling to video 5')
    this.clearToggleChoice()
    this.setState({ video5Show: true })
  }

  render () {
    return (
      <View>
          <TopBar settingsEnabled={true} />
          <View style={styles.container}>
              <meta charset="utf-8" name="viewport" content="width=device-width, initial-scale=1.0" />
              <View style={styles.header}>
                {this.state.searchShow &&
                  <Text style={styles.titleText}>Emotional Machines Search (Beta)</Text>
                }
                {this.state.tagShow &&
                  <Text style={styles.titleText}>Emotional Machines Tagging (Beta)</Text>
                }
                {this.state.progression &&
                  <Text style={styles.titleText}>Emotional Machines Progression Charting (Beta)</Text>
                }
                {this.state.linking &&
                  <Text style={styles.titleText}>Emotional Machines Link Analysis (Beta)</Text>
                }
                {this.state.channelShow &&
                  <Text style={styles.titleText}>Emotional Machines Channel Analysis (Beta)</Text>
                }
                {this.state.video1Show &&
                  <Text style={styles.titleText}>Emotional Machines Video Analysis (Beta)</Text>
                }
                {this.state.video2Show &&
                  <Text style={styles.titleText}>Emotional Machines Video Analysis (Beta)</Text>
                }
                {this.state.video3Show &&
                  <Text style={styles.titleText}>Emotional Machines Video Analysis (Beta)</Text>
                }
                {this.state.video4Show &&
                  <Text style={styles.titleText}>Emotional Machines Video Analysis (Beta)</Text>
                }
                {this.state.video5Show &&
                  <Text style={styles.titleText}>Emotional Machines Video Analysis (Beta)</Text>
                }
              </View>
              <ToggleButtonGroup
                  // value={alignment}
                  exclusive
                  // onChange={handleAlignment}
              >
                  <ToggleButton value="channel" onClick={this.toggleChannelShow}>
                    <View>
                      <Image style={styles.image} source={require('../assets/images/profile-icon.png')} />
                      <Text>Click Me</Text>
                    </View>
                  </ToggleButton>
                  <ToggleButton value="video1" onClick={this.toggleVideo1Show}>
                    <View>
                      <Text>Video 1</Text>
                      <Image style={styles.image} source={require('../assets/images/YTPlayButton.png')} />
                      <Text>Click Me</Text>
                    </View>
                  </ToggleButton>
                  <ToggleButton value="video1" onClick={this.toggleVideo2Show}>
                    <View>
                      <Text>Video 2</Text>
                      <Image style={styles.image} source={require('../assets/images/YTPlayButton.png')} />
                      <Text>Click Me</Text>
                    </View>
                  </ToggleButton>
                  <ToggleButton value="video1" onClick={this.toggleVideo3Show}>
                    <View>
                      <Text>Video 3</Text>
                      <Image style={styles.image} source={require('../assets/images/YTPlayButton.png')} />
                      <Text>Click Me</Text>
                    </View>
                  </ToggleButton>
                  <ToggleButton value="video1" onClick={this.toggleVideo4Show}>
                    <View>
                      <Text>Video 4</Text>
                      <Image style={styles.image} source={require('../assets/images/YTPlayButton.png')} />
                      <Text>Click Me</Text>
                    </View>
                  </ToggleButton>
                  <ToggleButton value="video1" onClick={this.toggleVideo5Show}>
                    <View>
                      <Text>Video 5</Text>
                      <Image style={styles.image} source={require('../assets/images/YTPlayButton.png')} />
                      <Text>Click Me</Text>
                    </View>
                  </ToggleButton>
                  {/*
                  <ToggleButton value="tag" onClick={this.toggleClickTag}>
                      <Image style={styles.image} source={require('../assets/images/tag.jpg')} />
                  </ToggleButton>
                  */}
                  {/*
                  <ToggleButton value="linking" onClick={this.toggleClickLinking}>
                      <Image style={styles.image} source={require('../assets/images/node_graph.png')} />
                  </ToggleButton>
                  */}
              </ToggleButtonGroup>
              {this.state.searchShow &&
                <SearchFunctionSwitchingPage />
              }
              {this.state.tagShow &&
                <TaggingPage />
              }
              {this.state.progression &&
                <ProgressionPage />
              }
              {this.state.linking &&
                <LinkingPage />
              }
              {this.state.video1Show &&
                <Video1AnalysisPage />
              }
              {this.state.video2Show &&
                <Video2AnalysisPage />
              }
              {this.state.video3Show &&
                <Video3AnalysisPage />
              }
              {this.state.video4Show &&
                <Video4AnalysisPage />
              }
              {this.state.video5Show &&
                <Video5AnalysisPage />
              }
              {this.state.channelShow &&
                <ChannelSearchPage />
              }
          </View>
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    userSession: state.userSession,
    validSubscription: state.validSubscription,
    anonSession: state.anonSession
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setAnonSession: (value) => dispatch(setAnonSession(value))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LandingSwitchingPage)
