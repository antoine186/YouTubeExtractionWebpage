import React, { Component } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Icon, Image } from 'react-native'
import styles from '../utils/style_guide/MainWebpageStyle'
import { api, youtubeVideoAdhocAnalyse, youtubeRetrieveChannelResults, youtubeRetrieveVideoAdhocResults } from '../utils/backend_configuration/BackendConfig'
import ArticlesResultTableDataWrangler from './search_helper_functions/ArticlesResultTableDataWrangler'
import SearchOverallEmoResultTable from '../components/molecules/SearchOverallEmoResultTable'
import EmoEngagementStringFormatter from './search_helper_functions/EmoEngagementStringFormatter'
import YTCommentsBasicResultCard from '../components/molecules/YTCommentsBasicResultCard'
import { connect } from 'react-redux'
import YTCommentsOverallResultCard from '../components/molecules/YTCommentsOverallResultCard'
import { setAnonSession } from '../store/Slices/AnonSessionSlice'
import CheckEmptyObject from '../utils/CheckEmptyObject'
import ReaverageEmoBreakdown from '../utils/ReaverageEmoBreakdown'
import ExtractVideoId from '../utils/url_manipulator_helpers/ExtractVideoId'
import ClipLoader from 'react-spinners/ClipLoader'
import { activateVideoAdHocSmartRetrieval, deactivateVideoAdHocSmartRetrieval } from '../store/Slices/VideoAdHocSmartRetrievalSlice'
import Typography from '@mui/material/Typography'
import DateFormatterToNaturalLanguage from '../utils/DateFormatterToNaturalLanguage'
import CookieSessionChecker from '../utils/CookiesSessions/CookieSessionChecker'
import WaitInSeconds from '../utils/timing_utils/WaitInSeconds'
import { videoAdHocAnalysisSmartRetrievalLimit } from '../utils/smart_retrieval_configuration/SmartRetrievalConfiguration'
import { llmModel } from '../utils/llm_configuration/LlmConfiguration'
import YTCommentsDescriptionCard from '../components/molecules/YTCommentsDescriptionCard'
import CheckIfServerUpInsideSession from '../components/atoms/CheckIfServerUpInsideSession'
import ManualStoreClearing from '../utils/session_helpers/ManualStoreClearing'

const { vw, vh, vmin, vmax } = require('react-native-viewport-units')

class VideoAdHocAnalysisPage extends Component {
  constructor (props) {
    super(props)

    WaitInSeconds(1)

    this.resultsRef = React.createRef()

    this.scrollToResults.bind(this)

    let commentsAcquisitionInitiated
    if (this.props.videoAdHocSmartRetrieval.validated) {
      console.log('Toggling comments acquisition initiated to True')
      commentsAcquisitionInitiated = true
    } else {
      commentsAcquisitionInitiated = false
      console.log('Toggling comments acquisition initiated to False')
    }

    this.state = {
      youtubeVideoInput: '',
      channelOverallEmoResultTableData: [],
      channelYTCommentsResultTableData: [],
      noResultsToReturn: false,
      noPreviousResults: true,
      commentsAcquisitionInitiated,
      anyResponseFromServer: false,
      // usernameToUse,
      // videoNumber: 5,
      videoEmbeddedUrl: '',
      topNAnger: '',
      topNDisgust: '',
      topNFear: '',
      topNJoy: '',
      topNNeutral: '',
      topNSadness: '',
      topNSurprise: '',
      top_n_anger_average_emo_breakdown: '',
      top_n_disgust_average_emo_breakdown: '',
      top_n_fear_average_emo_breakdown: '',
      top_n_joy_average_emo_breakdown: '',
      top_n_neutral_average_emo_breakdown: '',
      top_n_sadness_average_emo_breakdown: '',
      top_n_surprise_average_emo_breakdown: '',
      oneSecond: 1000,
      intervalId: '',
      username: this.props.accountData.accountData.payload.emailAddress,
      smartRetrievalOnGoing: false,
      publisher: '',
      video_title: '',
      published_date: '',
      notEnoughComments: false,
      hideHappyCard: false,
      hideAngryCard: false,
      hideFearCard: false,
      hideSurprisedCard: false,
      hideNeutralCard: false,
      hideSadCard: false,
      hideDisgustCard: false,
      numberOfSmartRetrievalAttempts: 0,
      videoDescription: '',
      serverUnavailable: false
    }

    // this.intervalRetrievalInnerFunction.bind(this)

    api.post(youtubeRetrieveVideoAdhocResults, {
      username: this.props.accountData.accountData.payload.emailAddress
    }, {
      withCredentials: true
    }
    ).then(response => {
      if (response.data.operation_success) {
        this.setState({ commentsAcquisitionInitiated: false })
        this.setState({ noPreviousResults: false })

        this.setState({ youtubeVideoInput: response.data.responsePayload.video_id })

        this.setState({ videoDescription: response.data.responsePayload.video_approximated_description })

        this.populateOverallEmoResultTable(response.data.responsePayload.average_emo_breakdown)
        this.populateCommentsResultTable(response.data.responsePayload)
      } else {
        if (response.data.error_message === 'still_analysing') {
          console.log('Comments still being analysed')

          this.props.activateVideoAdHocSmartRetrieval()

          console.log('Smart retrieval toggle is ' + this.props.videoAdHocSmartRetrieval.validated)
          if (this.props.videoAdHocSmartRetrieval.validated) {
            this.retrievePreviousResults()
          }
        } else {
          console.log('Nothing to return')
          this.props.deactivateVideoAdHocSmartRetrieval()
        }
      }
    }
    ).catch(error => {
      switch (error.response.status) {
        case 503:
          this.setState({ serverUnavailable: true })
          break
        case 502:
          this.setState({ serverUnavailable: true })
          break
        default:
          break
      }
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

  componentDidUpdate (prevProps, prevState) {
    this.scrollToResults()

    console.log('Component did update')
    console.log(prevProps.videoAdHocSmartRetrieval.validated)
    console.log(this.props.videoAdHocSmartRetrieval.validated)
    if (prevProps.videoAdHocSmartRetrieval.validated !== this.props.videoAdHocSmartRetrieval.validated) {
      console.log('Forcing an update')

      if (this.props.videoAdHocSmartRetrieval.validated) {
        console.log('Toggling comments acquisition initiated to True')
        this.retrievePreviousResults()
        this.setState({ commentsAcquisitionInitiated: true })
      } else {
        console.log('Toggling comments acquisition initiated to False')
        this.setState({ commentsAcquisitionInitiated: false })
      }

      this.forceUpdate()
    }
  }

  handleCommentAcquisitionSubmit = (e) => {
    e.preventDefault()

    this.clearEmoResults()

    const videoId = ExtractVideoId(this.state.youtubeVideoInput)

    this.setState({ commentsAcquisitionInitiated: true })
    this.setState({ noResultsToReturn: false })
    this.setState({ notEnoughComments: false })

    api.post(youtubeVideoAdhocAnalyse, {
      youtubeVideoInput: videoId,
      username: this.props.accountData.accountData.payload.emailAddress,
      llmModel
    }, {
      withCredentials: true
    }
    ).then(response => {
      this.setState({ anyResponseFromServer: true })

      if (response.data.operation_success) {
        console.log('Video adhoc analysis returned something!')
        this.setState({ commentsAcquisitionInitiated: false })
        this.setState({ noPreviousResults: false })
        this.setState({ videoDescription: response.data.responsePayload.video_approximated_description })
        this.populateOverallEmoResultTable(response.data)
        this.populateCommentsResultTable(response.data)
        this.forceUpdate()
      } else {
        if (response.data.error_message === 'not_enough_time_elapsed') {
          console.log('Not enough time elapsed')
          if (this.props.videoAdHocSmartRetrieval.validated) {
            this.retrievePreviousResults()
          } else {
            this.simpleAdHocRetrieve()
          }
        } else if (response.data.error_message === 'not_enough_comments_to_generate_video_description') {
          console.log('Not enough comments to perform analysis')
          this.setState({ notEnoughComments: true })
          this.setState({ commentsAcquisitionInitiated: false })
        } else {
          console.log('Nothing returned at all')
          this.setState({ noResultsToReturn: true })
          this.setState({ commentsAcquisitionInitiated: false })
          this.forceUpdate()
        }
      }
    }
    ).catch(error => {
      // Also add 'ERR_EMPTY_RESPONSE'
      if (error.code === 'ERR_BAD_RESPONSE') {
        console.log('Did not get a response yet, setting up smart retrieval')
        this.props.activateVideoAdHocSmartRetrieval()
        this.retrievePreviousResults()
      }

      switch (error.response.status) {
        case 503:
          this.setState({ serverUnavailable: true })
          break
        case 502:
          this.setState({ serverUnavailable: true })
          break
        default:
          break
      }
    })
  }

  populateOverallEmoResultTable (data) {
    const channelOverallEmoResultTableData = []

    if (data.anger_percentage * 100 < 10) {
      console.log('Hide anger card')
      this.setState({ hideAngryCard: true })
    } else {
      this.setState({ hideAngryCard: false })
    }

    if (data.disgust_percentage * 100 < 10) {
      console.log('Hide disgust card')
      this.setState({ hideDisgustCard: true })
    } else {
      this.setState({ hideDisgustCard: false })
    }

    if (data.fear_percentage * 100 < 10) {
      console.log('Hide fearful card')
      this.setState({ hideFearCard: true })
    } else {
      this.setState({ hideFearCard: false })
    }

    if (data.joy_percentage * 100 < 10) {
      console.log('Hide happy card')
      this.setState({ hideHappyCard: true })
    } else {
      this.setState({ hideHappyCard: false })
    }

    if (data.neutral_percentage * 100 < 10) {
      console.log('Hide neutral card')
      this.setState({ hideNeutralCard: true })
    } else {
      this.setState({ hideNeutralCard: false })
    }

    if (data.sadness_percentage * 100 < 10) {
      console.log('Hide sadness card')
      this.setState({ hideSadCard: true })
    } else {
      this.setState({ hideSadCard: false })
    }

    if (data.surprise_percentage * 100 < 10) {
      console.log('Hide surprise card')
      this.setState({ hideSurprisedCard: true })
    } else {
      this.setState({ hideSurprisedCard: false })
    }

    const overallEmoResultDict = {
      overall_emo: 'Overall Emotional Engagement with Search Topic Over All Articles Found!',
      // emotional_engagement: EmoEngagementStringFormatter(data.average_emo_breakdown.average_emo_breakdown)
      emotional_engagement: EmoEngagementStringFormatter(data)
    }

    channelOverallEmoResultTableData.push(overallEmoResultDict)

    this.setState({ channelOverallEmoResultTableData })
    this.setState({ channelInitiated: false })
  }

  populateCommentsResultTable (data) {
    const channelYTCommentsResultTableData = []

    const articlesResultsTopVideoDict = ArticlesResultTableDataWrangler(data.video_data)

    channelYTCommentsResultTableData.push(
      articlesResultsTopVideoDict.Happiest,
      articlesResultsTopVideoDict.Angriest,
      articlesResultsTopVideoDict.Disgusted,
      articlesResultsTopVideoDict.Fearful,
      articlesResultsTopVideoDict.Neutral,
      articlesResultsTopVideoDict.Sadest,
      articlesResultsTopVideoDict.Surprised
    )

    const top_n_anger_average_emo_breakdown = EmoEngagementStringFormatter(ReaverageEmoBreakdown(data.top_n_anger).emo_breakdown)
    const top_n_disgust_average_emo_breakdown = EmoEngagementStringFormatter(ReaverageEmoBreakdown(data.top_n_disgust).emo_breakdown)
    const top_n_fear_average_emo_breakdown = EmoEngagementStringFormatter(ReaverageEmoBreakdown(data.top_n_fear).emo_breakdown)
    const top_n_joy_average_emo_breakdown = EmoEngagementStringFormatter(ReaverageEmoBreakdown(data.top_n_joy).emo_breakdown)
    const top_n_neutral_average_emo_breakdown = EmoEngagementStringFormatter(ReaverageEmoBreakdown(data.top_n_neutral).emo_breakdown)
    const top_n_sadness_average_emo_breakdown = EmoEngagementStringFormatter(ReaverageEmoBreakdown(data.top_n_sadness).emo_breakdown)
    const top_n_surprise_average_emo_breakdown = EmoEngagementStringFormatter(ReaverageEmoBreakdown(data.top_n_surprise).emo_breakdown)

    this.setState({ top_n_anger_average_emo_breakdown })
    this.setState({ top_n_disgust_average_emo_breakdown })
    this.setState({ top_n_fear_average_emo_breakdown })
    this.setState({ top_n_joy_average_emo_breakdown })
    this.setState({ top_n_neutral_average_emo_breakdown })
    this.setState({ top_n_sadness_average_emo_breakdown })
    this.setState({ top_n_surprise_average_emo_breakdown })

    this.setState({ topNAnger: data.top_n_anger })
    this.setState({ topNDisgust: data.top_n_disgust })
    this.setState({ topNFear: data.top_n_fear })
    this.setState({ topNJoy: data.top_n_joy })
    this.setState({ topNNeutral: data.top_n_neutral })
    this.setState({ topNSadness: data.top_n_sadness })
    this.setState({ topNSurprise: data.top_n_surprise })

    this.setState({ videoEmbeddedUrl: data.video_data.url })
    this.setState({ channelYTCommentsResultTableData })
    this.setState({ publisher: data.video_data.publisher })
    this.setState({ published_date: DateFormatterToNaturalLanguage(data.video_data.published_date) })
    this.setState({ video_title: data.video_data.title })
  }

  /*
    youtubeVideoInput: '',
    channelOverallEmoResultTableData: [],
    channelYTCommentsResultTableData: [],
    noResultsToReturn: false,
    noPreviousResults: true,
    commentsAcquisitionInitiated,
    anyResponseFromServer: false,
    // usernameToUse,
    // videoNumber: 5,
    videoEmbeddedUrl: '',
    topNAnger: '',
    topNDisgust: '',
    topNFear: '',
    topNJoy: '',
    topNNeutral: '',
    topNSadness: '',
    topNSurprise: '',
    top_n_anger_average_emo_breakdown: '',
    top_n_disgust_average_emo_breakdown: '',
    top_n_fear_average_emo_breakdown: '',
    top_n_joy_average_emo_breakdown: '',
    top_n_neutral_average_emo_breakdown: '',
    top_n_sadness_average_emo_breakdown: '',
    top_n_surprise_average_emo_breakdown: '',
    oneSecond: 1000,
    intervalId: '',
    username: this.props.accountData.accountData.payload.emailAddress,
    smartRetrievalOnGoing: false,
    publisher: '',
    video_title: '',
    published_date: ''
  */

  clearEmoResults () {
    this.setState({ channelOverallEmoResultTableData: [] })

    this.setState({ top_n_anger_average_emo_breakdown: '' })
    this.setState({ top_n_disgust_average_emo_breakdown: '' })
    this.setState({ top_n_fear_average_emo_breakdown: '' })
    this.setState({ top_n_joy_average_emo_breakdown: '' })
    this.setState({ top_n_neutral_average_emo_breakdown: '' })
    this.setState({ top_n_sadness_average_emo_breakdown: '' })
    this.setState({ top_n_surprise_average_emo_breakdown: '' })

    this.setState({ topNAnger: '' })
    this.setState({ topNDisgust: '' })
    this.setState({ topNFear: '' })
    this.setState({ topNJoy: '' })
    this.setState({ topNNeutral: '' })
    this.setState({ topNSadness: '' })
    this.setState({ topNSurprise: '' })

    this.setState({ videoEmbeddedUrl: '' })
    this.setState({ channelYTCommentsResultTableData: [] })
    this.setState({ publisher: '' })
    this.setState({ published_date: '' })
    this.setState({ video_title: '' })
  }

  retrievePreviousResults () {
    function intervalRetrievalInnerFunction (self) {
      console.log('Smart retrieval')

      const videoId = ExtractVideoId(self.state.youtubeVideoInput)
      self.setState({ notEnoughComments: false })

      console.log('Smart retrieval attempt number: ' + self.state.numberOfSmartRetrievalAttempts)

      api.post(youtubeRetrieveVideoAdhocResults, {
        username: self.state.username,
        youtubeVideoInput: videoId
      }, {
        withCredentials: true
      }
      ).then(response => {
        if (response.data.operation_success) {
          self.setState({ commentsAcquisitionInitiated: false })
          self.setState({ noPreviousResults: false })

          self.setState({ youtubeVideoInput: response.data.responsePayload.video_id })

          self.setState({ videoDescription: response.data.responsePayload.video_approximated_description })
          self.populateOverallEmoResultTable(response.data.responsePayload.average_emo_breakdown)
          self.populateCommentsResultTable(response.data.responsePayload)

          console.log('Clearing smart retrieval interval')
          self.props.deactivateVideoAdHocSmartRetrieval()
          self.setState({ numberOfSmartRetrievalAttempts: 0 })
          clearInterval(self.state.intervalId)
        } else {
          if (self.state.numberOfSmartRetrievalAttempts >= videoAdHocAnalysisSmartRetrievalLimit) {
            console.log('Clearing smart retrieval interval')
            self.setState({ noResultsToReturn: true })
            self.setState({ commentsAcquisitionInitiated: false })
            self.props.deactivateVideoAdHocSmartRetrieval()
            self.setState({ numberOfSmartRetrievalAttempts: 0 })
            clearInterval(self.state.intervalId)
          } else {
            const newNumberOfSmartRetrievalAttempts = self.state.numberOfSmartRetrievalAttempts + 1
            console.log('Incrementing the number of smart retrieval attempts to ' + newNumberOfSmartRetrievalAttempts)
            self.setState({ numberOfSmartRetrievalAttempts: self.state.numberOfSmartRetrievalAttempts + 1 })
          }

          if (response.data.error_message === 'still_analysing') {
            console.log('Comments still being analysed')
          } else {
            console.log('Nothing returned at all')
            self.setState({ noResultsToReturn: true })
            self.setState({ commentsAcquisitionInitiated: false })
            self.props.deactivateVideoAdHocSmartRetrieval()
            self.setState({ numberOfSmartRetrievalAttempts: 0 })
            clearInterval(self.state.intervalId)
            self.forceUpdate()
          }
        }
      }
      ).catch(error => {
        switch (error.response.status) {
          case 503:
            this.setState({ serverUnavailable: true })
            self.props.deactivateVideoAdHocSmartRetrieval()
            self.setState({ numberOfSmartRetrievalAttempts: 0 })
            clearInterval(self.state.intervalId)
            break
          case 502:
            this.setState({ serverUnavailable: true })
            self.props.deactivateVideoAdHocSmartRetrieval()
            self.setState({ numberOfSmartRetrievalAttempts: 0 })
            clearInterval(self.state.intervalId)
            break
          default:
            break
        }
      })
    }

    const self = this
    const intervalId = setInterval(function () { intervalRetrievalInnerFunction(self) }, 5 * this.state.oneSecond)
    this.setState({ intervalId })
  }

  simpleAdHocRetrieve () {
    const videoId = ExtractVideoId(this.state.youtubeVideoInput)

    api.post(youtubeRetrieveVideoAdhocResults, {
      username: this.state.username,
      youtubeVideoInput: videoId
    }, {
      withCredentials: true
    }
    ).then(response => {
      if (response.data.operation_success) {
        this.setState({ commentsAcquisitionInitiated: false })
        this.setState({ noPreviousResults: false })

        this.setState({ youtubeVideoInput: response.data.responsePayload.video_id })

        this.setState({ videoDescription: response.data.responsePayload.video_approximated_description })
        this.populateOverallEmoResultTable(response.data.responsePayload.average_emo_breakdown)
        this.populateCommentsResultTable(response.data.responsePayload)

        clearInterval(this.state.intervalId)
      } else {
        console.log('Nothing returned at all')
        this.setState({ noResultsToReturn: true })
        this.setState({ commentsAcquisitionInitiated: false })
        this.forceUpdate()
      }
    }
    ).catch(error => {
      switch (error.response.status) {
        case 503:
          this.setState({ serverUnavailable: true })
          break
        case 502:
          this.setState({ serverUnavailable: true })
          break
        default:
          break
      }
    })
  }

  setServerUnavailable (setServerUnavailable) {
    this.setState({ setServerUnavailable })
  }

  render () {
    if (this.state.serverUnavailable) {
      return (
        <ManualStoreClearing />
      )
    } else {
      return (
        <View style={styles.subcontainer}>
            <CheckIfServerUpInsideSession
              setServerUnavailable={this.setServerUnavailable.bind(this)}
              serverUnavailable={this.state.serverUnavailable}
            />
            <CookieSessionChecker />
            <Text style={styles.text}>For support, please email antoine.tian@emomachines.xyz</Text>
  
          <View style={styles.innerContainer}>
            <View class="form-group form-row">
              <View class="col-10">
                <br></br>
                <br></br>
                <TextInput
                  editable
                  multiline
                  numberOfLines={6}
                  maxLength={200}
                  value={this.state.youtubeVideoInput}
                  onChangeText={text => this.setState({ youtubeVideoInput: text })}
                  placeholder={'Try inputting a youtube video url... (result might take a few minutes)'}
                  style={{ padding: 10, borderWidth: 2, borderColor: '#BC2BEA' }}
                />
              </View>
            </View>
            <br></br>
            {!this.state.commentAcquisitionInitiated &&
              <TouchableOpacity style={styles.analyseBtn} onPress={this.handleCommentAcquisitionSubmit}>
                <Text style={styles.text}>ANALYSE</Text>
              </TouchableOpacity>
            }
            {this.state.noResultsToReturn &&
              <View>
                <br></br>
                <Text style={styles.errorText}>
                  Could not retrieve video comments. Maybe your URL is incorrect!
                </Text>
                <br></br>
              </View>
            }
            {this.state.notEnoughComments &&
              <View>
                <br></br>
                <Text style={styles.errorText}>
                  The video has fewer than 50 comments, we are unable to perform good enough analysis...
                </Text>
                <br></br>
              </View>
            }
            {this.state.commentsAcquisitionInitiated &&
            <View>
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
            <br></br>
  
            {!this.state.commentsAcquisitionInitiated && !this.state.noResultsToReturn && !this.state.noPreviousResults && !this.state.notEnoughComments &&
              <View>
                <Typography sx={{ fontSize: 1.2 * this.state.sizeScaler * vh }} color="text.secondary">
                  {this.state.video_title}
                </Typography>
                <Typography sx={{ fontSize: 1.2 * this.state.sizeScaler * vh }} color="text.secondary">
                  {this.state.publisher}
                </Typography>
                <Typography sx={{ fontSize: 1.2 * this.state.sizeScaler * vh }} color="text.secondary">
                  {this.state.published_date}
                </Typography>
              </View>
            }
            {!this.state.commentsAcquisitionInitiated && !this.state.noResultsToReturn && !this.state.noPreviousResults && !this.state.notEnoughComments &&
              <View>
                <br></br>
                {this.state.videoEmbeddedUrl === '' &&
                  this.simpleAdHocRetrieve()
                }
                <iframe
                    width="560"
                    height="315"
                    src={this.state.videoEmbeddedUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen></iframe>
              </View>
            }
  
            <br></br>
            <br></br>
  
            {!this.state.commentsAcquisitionInitiated && !this.state.noResultsToReturn && !this.state.noPreviousResults && !this.state.notEnoughComments &&
            <View>
              <br></br>
              <View style={styles.innerContainer}>
                <YTCommentsDescriptionCard descriptionData={this.state.videoDescription} />
              </View>
              <br></br>
              <View style={styles.innerContainer}>
                <YTCommentsOverallResultCard resultData={this.state.channelOverallEmoResultTableData} />
              </View>
              <br></br>
              <View style={styles.innerContainer}>
                <YTCommentsBasicResultCard
                  emoIcon={'😃'}
                  commentsData={this.state.channelYTCommentsResultTableData[0]}
                  topNComments={this.state.topNJoy}
                  topNEmoBreakdown={this.state.top_n_joy_average_emo_breakdown}
                  hideCard={this.state.hideHappyCard}
                />
                <YTCommentsBasicResultCard
                  emoIcon={'😡'}
                  commentsData={this.state.channelYTCommentsResultTableData[1]}
                  topNComments={this.state.topNAnger}
                  topNEmoBreakdown={this.state.top_n_anger_average_emo_breakdown}
                  hideCard={this.state.hideAngryCard}
                />
                <YTCommentsBasicResultCard
                  emoIcon={'🤢'}
                  commentsData={this.state.channelYTCommentsResultTableData[2]}
                  topNComments={this.state.topNDisgust}
                  topNEmoBreakdown={this.state.top_n_disgust_average_emo_breakdown}
                  hideCard={this.state.hideDisgustCard}
                />
                <YTCommentsBasicResultCard
                  emoIcon={'😱'}
                  commentsData={this.state.channelYTCommentsResultTableData[3]}
                  topNComments={this.state.topNFear}
                  topNEmoBreakdown={this.state.top_n_fear_average_emo_breakdown}
                  hideCard={this.state.hideFearCard}
                />
                <YTCommentsBasicResultCard
                  emoIcon={'😐'}
                  commentsData={this.state.channelYTCommentsResultTableData[4]}
                  topNComments={this.state.topNNeutral}
                  topNEmoBreakdown={this.state.top_n_neutral_average_emo_breakdown}
                  hideCard={this.state.hideNeutralCard}
                />
                <YTCommentsBasicResultCard
                  emoIcon={'😢'}
                  commentsData={this.state.channelYTCommentsResultTableData[5]}
                  topNComments={this.state.topNSadness}
                  topNEmoBreakdown={this.state.top_n_sadness_average_emo_breakdown}
                  hideCard={this.state.hideSadCard}
                />
                <YTCommentsBasicResultCard
                  emoIcon={'😯'}
                  commentsData={this.state.channelYTCommentsResultTableData[6]}
                  topNComments={this.state.topNSurprise}
                  topNEmoBreakdown={this.state.top_n_surprise_average_emo_breakdown}
                  hideCard={this.state.hideSurprisedCard}
                />
              </View>
            </View>
            }
          </View>
        </View>
      )
    }
  }
}

const mapStateToProps = state => {
  return {
    accountData: state.accountData,
    videoAdHocSmartRetrieval: state.videoAdHocSmartRetrieval
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    activateVideoAdHocSmartRetrieval: (value) => dispatch(activateVideoAdHocSmartRetrieval(value)),
    deactivateVideoAdHocSmartRetrieval: (value) => dispatch(deactivateVideoAdHocSmartRetrieval(value))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoAdHocAnalysisPage)
