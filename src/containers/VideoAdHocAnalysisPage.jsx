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

class VideoAdHocAnalysisPage extends Component {
  constructor (props) {
    super(props)

    const newAnonSessionId = this.props.anonSession.anonSession
    const usernameToUse = newAnonSessionId.payload

    this.resultsRef = React.createRef()

    this.scrollToResults.bind(this)

    this.state = {
      youtubeVideoInput: '',
      channelOverallEmoResultTableData: [],
      channelYTCommentsResultTableData: [],
      noResultsToReturn: false,
      noPreviousResults: true,
      commentsAcquisitionInitiated: false,
      anyResponseFromServer: false,
      //usernameToUse,
      //videoNumber: 5,
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
      top_n_surprise_average_emo_breakdown: ''
    }

    const query = new URLSearchParams(window.location.search)

    if (query.get('canceled')) {
      console.log('Didnt manage to add 1 dollar')
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

  handleCommentAcquisitionSubmit = (e) => {
    e.preventDefault()

    if (CheckEmptyObject(this.props.anonSession.anonSession)) {
      console.log('No anon session set')
      return
    }

    this.setState({ commentsAcquisitionInitiated: true })
    this.setState({ noResultsToReturn: false })

    api.post(channelUrl, {
      youtubeVideoInput: this.state.youtubeVideoInput,
      username: this.props.accountData.accountData.payload.emailAddress
    }, {
      withCredentials: true
    }
    ).then(response => {
      this.setState({ anyResponseFromServer: true })

      if (response.data !== 'Error') {
        console.log('Channel analysis returned something!')
        this.setState({ commentsAcquisitionInitiated: false })
        this.setState({ noPreviousResults: false })
        this.populateOverallEmoResultTable(response.data)
        this.populateCommentsResultTable(response.data)
        this.forceUpdate()
      } else {
        this.setState({ noResultsToReturn: true })
        this.setState({ commentsAcquisitionInitiated: false })
        this.forceUpdate()
      }
    }
    ).catch(error => {
      // Also add 'ERR_EMPTY_RESPONSE'
      if (error.code === 'ERR_BAD_RESPONSE') {
      }

      console.log('Triggered timeout recovery')
      api.post(youtubeRetrieveChannelResults, {
        username: this.state.usernameToUse
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
      })
    })
  }

  populateOverallEmoResultTable (data) {
    const channelOverallEmoResultTableData = []

    const overallEmoResultDict = {
      overall_emo: 'Overall Emotional Engagement with Search Topic Over All Articles Found!',
      //emotional_engagement: EmoEngagementStringFormatter(data.average_emo_breakdown.average_emo_breakdown)
      emotional_engagement: EmoEngagementStringFormatter(data.average_emo_breakdown)
    }

    channelOverallEmoResultTableData.push(overallEmoResultDict)

    this.setState({ channelOverallEmoResultTableData })
    this.setState({ channelInitiated: false })
  }

  populateCommentsResultTable (data) {
    const channelYTCommentsResultTableData = []

    const articlesResultsTopVideoDict = ArticlesResultTableDataWrangler(data.top_5_videos[this.state.videoNumber - 1])

    channelYTCommentsResultTableData.push(
      articlesResultsTopVideoDict.Happiest,
      articlesResultsTopVideoDict.Angriest,
      articlesResultsTopVideoDict.Disgusted,
      articlesResultsTopVideoDict.Fearful,
      articlesResultsTopVideoDict.Neutral,
      articlesResultsTopVideoDict.Sadest,
      articlesResultsTopVideoDict.Surprised
    )

    let top_n_anger_average_emo_breakdown = EmoEngagementStringFormatter(ReaverageEmoBreakdown(data.top_5_top_n_anger[this.state.videoNumber - 1]).emo_breakdown)
    let top_n_disgust_average_emo_breakdown = EmoEngagementStringFormatter(ReaverageEmoBreakdown(data.top_5_top_n_disgust[this.state.videoNumber - 1]).emo_breakdown)
    let top_n_fear_average_emo_breakdown = EmoEngagementStringFormatter(ReaverageEmoBreakdown(data.top_5_top_n_fear[this.state.videoNumber - 1]).emo_breakdown)
    let top_n_joy_average_emo_breakdown = EmoEngagementStringFormatter(ReaverageEmoBreakdown(data.top_5_top_n_joy[this.state.videoNumber - 1]).emo_breakdown)
    let top_n_neutral_average_emo_breakdown = EmoEngagementStringFormatter(ReaverageEmoBreakdown(data.top_5_top_n_neutral[this.state.videoNumber - 1]).emo_breakdown)
    let top_n_sadness_average_emo_breakdown = EmoEngagementStringFormatter(ReaverageEmoBreakdown(data.top_5_top_n_sadness[this.state.videoNumber - 1]).emo_breakdown)
    let top_n_surprise_average_emo_breakdown = EmoEngagementStringFormatter(ReaverageEmoBreakdown(data.top_5_top_n_surprise[this.state.videoNumber - 1]).emo_breakdown)

    this.setState({ top_n_anger_average_emo_breakdown })
    this.setState({ top_n_disgust_average_emo_breakdown })
    this.setState({ top_n_fear_average_emo_breakdown })
    this.setState({ top_n_joy_average_emo_breakdown })
    this.setState({ top_n_neutral_average_emo_breakdown })
    this.setState({ top_n_sadness_average_emo_breakdown })
    this.setState({ top_n_surprise_average_emo_breakdown })

    this.setState({ topNAnger: data.top_5_top_n_anger[this.state.videoNumber - 1] })
    this.setState({ topNDisgust: data.top_5_top_n_disgust[this.state.videoNumber - 1] })
    this.setState({ topNFear: data.top_5_top_n_fear[this.state.videoNumber - 1] })
    this.setState({ topNJoy: data.top_5_top_n_joy[this.state.videoNumber - 1] })
    this.setState({ topNNeutral: data.top_5_top_n_neutral[this.state.videoNumber - 1] })
    this.setState({ topNSadness: data.top_5_top_n_sadness[this.state.videoNumber - 1] })
    this.setState({ topNSurprise: data.top_5_top_n_surprise[this.state.videoNumber - 1] })

    this.setState({ videoEmbeddedUrl: data.top_5_videos[this.state.videoNumber - 1].url })
    this.setState({ channelYTCommentsResultTableData })
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
                value={this.state.youtubeVideoInput}
                onChangeText={text => this.setState({ youtubeVideoInput: text })}
                placeholder={'Try inputting youtube video url... (result might take a few minutes)'}
                style={{ padding: 10, borderWidth: 2, borderColor: '#BC2BEA' }}
              />
              <br></br>
              {!this.state.commentAcquisitionInitiated &&
                <TouchableOpacity style={styles.analyseBtn} onPress={this.handleCommentAcquisitionSubmit}>
                  <Text style={styles.text}>ANALYSE</Text>
                </TouchableOpacity>
              }
            </View>
          </View>

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
    accountData: state.accountData
  }
}

export default connect(mapStateToProps)(VideoAdHocAnalysisPage)
