import React, { Component } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Icon, Image } from 'react-native'
import styles from '../utils/style_guide/MainWebpageStyle'
import { api, checkStillAnalysingChannel, getPreviousChannelResult, channelUrl } from '../utils/backend_configuration/BackendConfig'
import SearchArticlesResultTable from '../components/molecules/SearchArticlesResultTable'
import ArticlesResultTableDataWrangler from './search_helper_functions/ArticlesResultTableDataWrangler'
import ClipLoader from 'react-spinners/ClipLoader'
import SearchOverallEmoResultTable from '../components/molecules/SearchOverallEmoResultTable'
import EmoEngagementStringFormatter from './search_helper_functions/EmoEngagementStringFormatter'
import EmoSearchBasicResultCard from '../components/molecules/EmoSearchBasicResultCard'
import { connect } from 'react-redux'
import EmoSearchOverallResultCard from '../components/molecules/EmoSearchOverallResultCard'
import { setAnonSession } from '../store/Slices/AnonSessionSlice'
import CheckEmptyObject from '../utils/CheckEmptyObject'
import GenerateRandomString from '../utils/GenerateRandomString'
import { setSearchTimeoutState } from '../store/Slices/SearchTimeoutSlice'

class ChannelAnalysisPage extends Component {
  constructor (props) {
    super(props)

    const newAnonSessionId = this.props.anonSession.anonSession
    const usernameToUse = newAnonSessionId.payload

    this.resultsRef = React.createRef()

    this.scrollToResults.bind(this)

    this.state = {
      channelInput: '',
      channelOverallEmoResultTableData: [],
      channelArticlesResultTableData: [],
      noResultsToReturn: false,
      noPreviousResults: true,
      channelInitiated: false,
      anyResponseFromServer: false,
      usernameToUse
    }

    const query = new URLSearchParams(window.location.search)

    if (query.get('canceled')) {
      console.log('Didnt manage to add 1 dollar')
    }

    api.post(checkStillAnalysingChannel, {
      username: usernameToUse
    }, {
      withCredentials: true
    }
    ).then(response => {
      if (response.data.operation_success) {
        console.log('Still analysing channel')

        console.log('Triggered timeout recovery')
        api.post(getPreviousChannelResult, {
          username: usernameToUse
        }, {
          withCredentials: true
        }
        ).then(response => {
          if (response.data.operation_success) {
            console.log('Previous channel analysis returned something!')
            console.log(response.data.responsePayload.previous_channel_result)
            this.setState({ channelInput: response.data.responsePayload.previous_search_result.search_input })
            this.setState({ noPreviousResults: false })
            this.populateOverallEmoResultTable(response.data.responsePayload.previous_channel_result)
            this.populateArticlesResultTable(response.data.responsePayload.previous_channel_result)
          } else {
            console.log('Search failed for an internal reason')
            this.setState({ noResultsToReturn: true })
            this.setState({ channelInitiated: false })
            this.setState({ noPreviousResults: true })
          }
        }
        ).catch(error => {
          console.log('No previous search results')
          this.setState({ noResultsToReturn: true })
          this.setState({ channelInitiated: false })
          this.setState({ noPreviousResults: true })
        })

        this.setState({ channelInitiated: true })
      }
    }
    ).catch(error => {
      console.log('Check channel analysis in progress failed')
      this.setState({ noPreviousResults: true })
    })
  }

  scrollToLoading () {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    })
  }

  scrollToResults () {
    if (this.resultsRef.current !== null) {
      this.resultsRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  componentDidUpdate () {
    this.scrollToResults()
  }

  handleSubmit = (e) => {
    e.preventDefault()

    if (CheckEmptyObject(this.props.anonSession.anonSession)) {
      console.log('No anon session set')
      return
    }

    this.setState({ channelInitiated: true })
    this.setState({ noResultsToReturn: false })

    api.post(channelUrl, {
      channelInput: this.state.channelInput,
      username: this.state.usernameToUse
    }, {
      withCredentials: true
    }
    ).then(response => {
      this.setState({ anyResponseFromServer: true })

      if (response.data !== 'Error') {
        console.log('Channel analysis returned something!')
        this.setState({ channelInitiated: false })
        this.setState({ noPreviousResults: false })
        this.populateOverallEmoResultTable(response.data)
        this.populateArticlesResultTable(response.data)
        this.forceUpdate()
      } else {
        this.setState({ noResultsToReturn: true })
        this.setState({ channelInitiated: false })
        this.forceUpdate()
      }
    }
    ).catch(error => {
      // Also add 'ERR_EMPTY_RESPONSE'
      if (error.code === 'ERR_BAD_RESPONSE') {
      }

      console.log('Triggered timeout recovery')
      api.post(getPreviousChannelResult, {
        username: this.state.usernameToUse
      }, {
        withCredentials: true
      }
      ).then(response => {
        if (response.data.operation_success) {
          console.log('Previous channel analysis returned something!')
          this.setState({ channelInput: response.data.responsePayload.previous_search_result.search_input })
          this.setState({ noPreviousResults: false })
          this.populateOverallEmoResultTable(response.data.responsePayload.previous_search_result)
          this.populateArticlesResultTable(response.data.responsePayload.previous_search_result)
        } else {
          console.log('Search failed for an internal reason')
          this.setState({ noResultsToReturn: true })
          this.setState({ channelInitiated: false })
          this.setState({ noPreviousResults: true })
        }
      }
      ).catch(error => {
        console.log('No previous search results')
        this.setState({ noResultsToReturn: true })
        this.setState({ channelInitiated: false })
        this.setState({ noPreviousResults: true })
      })
    })
  }

  populateOverallEmoResultTable (data) {
    const searchOverallEmoResultTableData = []

    const overallEmoResultDict = {
      overall_emo: 'Overall Emotional Engagement with Search Topic Over All Articles Found!',
      emotional_engagement: EmoEngagementStringFormatter(data.average_emo_breakdown)
    }

    searchOverallEmoResultTableData.push(overallEmoResultDict)

    this.setState({ searchOverallEmoResultTableData })
    this.setState({ searchingInitiated: false })
  }

  populateArticlesResultTable (data) {
    const searchArticlesResultTableData = []

    const articlesResultsDict = ArticlesResultTableDataWrangler(data)

    searchArticlesResultTableData.push(
      articlesResultsDict.Happiest,
      articlesResultsDict.Angriest,
      articlesResultsDict.Disgusted,
      articlesResultsDict.Fearful,
      articlesResultsDict.Neutral,
      articlesResultsDict.Sadest,
      articlesResultsDict.Surprised
    )

    this.setState({ searchArticlesResultTableData })
  }

  /*
  date2String (dateArray) {
    let dateString = ''

    dateString = dateString + dateArray[1] + '/'
    dateString = dateString + dateArray[2] + '/'
    dateString = dateString + dateArray[0]

    return dateString
  } */

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
                <TouchableOpacity style={styles.searchBtn} onPress={this.handleSubmit}>
                  <Text style={styles.text}>ANALYSE</Text>
                </TouchableOpacity>
              }
            </View>
          </View>
          <br></br>
          {!this.state.channelInitiated &&
            <View style={styles.subcontainer}>
              <br></br>
              <br></br>
              <View>
                <Text style={styles.text}>How To Find Articles Leading Emotional Categories for any Week-long Period</Text>
              </View>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/KDeo65ZMf2A"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen></iframe>
              </View>
              <br></br>
            </View>
          }
          {this.state.channelInitiated &&
            <View>
              {this.scrollToLoading()}
              <br></br>
              <br></br>
              <Text style={styles.text}>
                Please Come Back in a Minute or Two...
              </Text>
              <Text style={styles.text}>
                Don't reissue the same query. If the page is blank within 5 min, we might still be searching!
              </Text>
              <br></br>
              <br></br>
              <View style={{ alignItems: 'center' }}>
                <ClipLoader
                  color={'#e75fa6'}
                  size={200}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </View>
            </View>
          }

          <br></br>
          {this.state.noResultsToReturn && !this.state.channelInitiated &&
            <Text style={styles.text}>
              No results retrieved for this YouTube channel...
            </Text>
          }
          {!this.state.channelInitiated && !this.state.noResultsToReturn && !this.state.noPreviousResults &&
          <View>
            <EmoSearchOverallResultCard resultData={this.state.channelOverallEmoResultTableData} />
            <EmoSearchBasicResultCard
              emoIcon={'😃'}
              articleData={this.state.channelArticlesResultTableData[0]}
            />
            <EmoSearchBasicResultCard
              emoIcon={'😡'}
              articleData={this.state.channelArticlesResultTableData[1]}
            />
            <EmoSearchBasicResultCard
              emoIcon={'🤢'}
              articleData={this.state.channelArticlesResultTableData[2]}
            />
            <EmoSearchBasicResultCard
              emoIcon={'😱'}
              articleData={this.state.channelArticlesResultTableData[3]}
            />
            <EmoSearchBasicResultCard
              emoIcon={'😐'}
              articleData={this.state.channelArticlesResultTableData[4]}
            />
            <EmoSearchBasicResultCard
              emoIcon={'😢'}
              articleData={this.state.channelArticlesResultTableData[5]}
            />
            <EmoSearchBasicResultCard
              emoIcon={'😯'}
              articleData={this.state.channelArticlesResultTableData[6]}
            />
          </View>
          }
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

export default connect(mapStateToProps, mapDispatchToProps)(ChannelAnalysisPage)
