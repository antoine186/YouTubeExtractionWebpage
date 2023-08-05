import React from 'react'
import styles from '../../utils/style_guide/MainWebpageStyle'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Icon, Image } from 'react-native'
import EmoSearchOverallResultCard from '../molecules/YTCommentsOverallResultCard'
import YTCommentsBasicResultCard from '../molecules/YTCommentsBasicResultCard'
import { connect } from 'react-redux'
import ReplaceAll from '../../utils/ReplaceAll'

class TagSearchResult extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      searchOverallEmoResultTableData: this.props.searchOverallEmoResultTableData,
      searchArticlesResultTableData: this.props.searchArticlesResultTableData,
      startDateString: this.props.startDateString,
      endDateString: this.props.endDateString,
      noResultsToReturn: this.props.noResultsToReturn,
      searchInput: this.props.searchInput,
      existingTaggingInput: this.props.existingTaggingInput,
      stillTagging: this.props.stillTagging
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.searchOverallEmoResultTableData !== this.props.searchOverallEmoResultTableData) {
      this.setState({ searchOverallEmoResultTableData: this.props.searchOverallEmoResultTableData })
    }
    if (prevProps.searchArticlesResultTableData !== this.props.searchArticlesResultTableData) {
      this.setState({ searchArticlesResultTableData: this.props.searchArticlesResultTableData })
    }
  }

  render () {
    return (
        <View style={styles.innerContainer}>
          <View>
            {!this.state.noResultsToReturn &&
              <Text style={styles.text}>
                From {new Date(this.state.startDateString).toLocaleDateString('en-US')} To {new Date(this.state.endDateString).toLocaleDateString('en-US')}
              </Text>
            }
            <br></br>
            {this.state.noResultsToReturn &&
              <Text style={styles.text}>
                Not enough results found! Maybe the date is too recent...
              </Text>
            }
            {this.state.stillTagging &&
              <Text style={styles.text}>
                Still tagging... Please come back in half an hour and !REFRESH! the page.
              </Text>
            }
          </View>
          {!this.state.noResultsToReturn && !this.state.stillTagging &&
          <View>
            <EmoSearchOverallResultCard resultData={this.state.searchOverallEmoResultTableData} />
            <YTCommentsBasicResultCard
              emoIcon={'😃'}
              articleData={this.state.searchArticlesResultTableData[0]}
            />
            <YTCommentsBasicResultCard
              emoIcon={'😡'}
              articleData={this.state.searchArticlesResultTableData[1]}
            />
            <YTCommentsBasicResultCard
              emoIcon={'🤢'}
              articleData={this.state.searchArticlesResultTableData[2]}
            />
            <YTCommentsBasicResultCard
              emoIcon={'😱'}
              articleData={this.state.searchArticlesResultTableData[3]}
            />
            <YTCommentsBasicResultCard
              emoIcon={'😐'}
              articleData={this.state.searchArticlesResultTableData[4]}
            />
            <YTCommentsBasicResultCard
              emoIcon={'😢'}
              articleData={this.state.searchArticlesResultTableData[5]}
            />
            <YTCommentsBasicResultCard
              emoIcon={'😯'}
              articleData={this.state.searchArticlesResultTableData[6]}
            />
          </View>
          }
        </View>
    )
  }
}

export default TagSearchResult
