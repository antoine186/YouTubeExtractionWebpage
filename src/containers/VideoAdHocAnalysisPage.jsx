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

class VideoAdHocAnalysisPage extends Component {
  constructor (props) {
    super(props)

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
      smartRetrievalOnGoing: false
    }

    this.intervalRetrievalInnerFunction.bind(this)

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
        }
      }
    }
    )
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

    const videoId = ExtractVideoId(this.state.youtubeVideoInput)

    this.setState({ commentsAcquisitionInitiated: true })
    this.setState({ noResultsToReturn: false })

    api.post(youtubeVideoAdhocAnalyse, {
      youtubeVideoInput: videoId,
      username: this.props.accountData.accountData.payload.emailAddress
    }, {
      withCredentials: true
    }
    ).then(response => {
      this.setState({ anyResponseFromServer: true })

      if (response.data.operation_success) {
        console.log('Video adhoc analysis returned something!')
        this.setState({ commentsAcquisitionInitiated: false })
        this.setState({ noPreviousResults: false })
        this.populateOverallEmoResultTable(response.data)
        this.populateCommentsResultTable(response.data)
        this.forceUpdate()
      } else {
        if (response.data.error_message === 'not_enough_time_elapsed') {
          console.log('Not enough time elapsed')
          if (this.props.videoAdHocSmartRetrieval.validated) {
            this.retrievePreviousResults()
          }
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
        if (this.props.videoAdHocSmartRetrieval.validated) {
          this.retrievePreviousResults()
        }
      }
      /*
      console.log('Triggered timeout recovery')
      api.post(youtubeRetrieveChannelResults, {
        username: this.props.accountData.accountData.payload.emailAddress
      }, {
        withCredentials: true
      }
      ).then(response => {
        if (response.data.operation_success) {
          console.log('Previous channel analysis returned something!')
          this.setState({ youtubeVideoInput: response.data.responsePayload.previous_search_result.search_input })
          this.setState({ noPreviousResults: false })
          this.populateOverallEmoResultTable(response.data.responsePayload.previous_search_result)
          this.populateCommentsResultTable(response.data.responsePayload.previous_search_result)
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
      }) */
    })
  }

  populateOverallEmoResultTable (data) {
    const channelOverallEmoResultTableData = []

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
  }

  retrievePreviousResults () {
    const intervalId = setInterval(this.intervalRetrievalInnerFunction, 5 * this.state.oneSecond)
    this.setState({ intervalId })
  }

  intervalRetrievalInnerFunction () {
    console.log('Smart retrieval')

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

        this.populateOverallEmoResultTable(response.data.responsePayload.average_emo_breakdown)
        this.populateCommentsResultTable(response.data.responsePayload)

        clearInterval(this.state.intervalId)
      } else {
        if (response.data.error_message === 'still_analysing') {
          console.log('Comments still being analysed')
        } else {
          console.log('Nothing returned at all')
          this.setState({ noResultsToReturn: true })
          this.setState({ commentsAcquisitionInitiated: false })
          this.props.deactivateVideoAdHocSmartRetrieval()
          this.forceUpdate()
        }
      }
    }
    )
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

          {!this.state.commentsAcquisitionInitiated && !this.state.noResultsToReturn && !this.state.noPreviousResults &&
            <iframe
                width="560"
                height="315"
                src={this.state.videoEmbeddedUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen></iframe>
          }

          <br></br>
          <br></br>

          {!this.state.commentsAcquisitionInitiated && !this.state.noResultsToReturn && !this.state.noPreviousResults &&
          <View>
            <br></br>
            <YTCommentsOverallResultCard resultData={this.state.channelOverallEmoResultTableData} />
            <br></br>
            <View style={styles.innerContainer}>
              <YTCommentsBasicResultCard
                emoIcon={'😃'}
                commentsData={this.state.channelYTCommentsResultTableData[0]}
                topNComments={this.state.topNJoy}
                topNEmoBreakdown={this.state.top_n_joy_average_emo_breakdown}
              />
              <YTCommentsBasicResultCard
                emoIcon={'😡'}
                commentsData={this.state.channelYTCommentsResultTableData[1]}
                topNComments={this.state.topNAnger}
                topNEmoBreakdown={this.state.top_n_anger_average_emo_breakdown}
              />
              <YTCommentsBasicResultCard
                emoIcon={'🤢'}
                commentsData={this.state.channelYTCommentsResultTableData[2]}
                topNComments={this.state.topNDisgust}
                topNEmoBreakdown={this.state.top_n_disgust_average_emo_breakdown}
              />
              <YTCommentsBasicResultCard
                emoIcon={'😱'}
                commentsData={this.state.channelYTCommentsResultTableData[3]}
                topNComments={this.state.topNFear}
                topNEmoBreakdown={this.state.top_n_fear_average_emo_breakdown}
              />
              <YTCommentsBasicResultCard
                emoIcon={'😐'}
                commentsData={this.state.channelYTCommentsResultTableData[4]}
                topNComments={this.state.topNNeutral}
                topNEmoBreakdown={this.state.top_n_neutral_average_emo_breakdown}
              />
              <YTCommentsBasicResultCard
                emoIcon={'😢'}
                commentsData={this.state.channelYTCommentsResultTableData[5]}
                topNComments={this.state.topNSadness}
                topNEmoBreakdown={this.state.top_n_sadness_average_emo_breakdown}
              />
              <YTCommentsBasicResultCard
                emoIcon={'😯'}
                commentsData={this.state.channelYTCommentsResultTableData[6]}
                topNComments={this.state.topNSurprise}
                topNEmoBreakdown={this.state.top_n_surprise_average_emo_breakdown}
              />
            </View>
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
