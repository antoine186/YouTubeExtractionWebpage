import React, { Component } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Icon, Image, Dimensions } from 'react-native'
import { api, commentsLlmQuestioning, commentsLlmEmoElaboration } from '../../utils/backend_configuration/BackendConfig'
import styles from '../../utils/style_guide/MainWebpageStyle'
// import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Collapse from '@mui/material/Collapse'
import ArrayShuffle from '../../utils/ArrayShuffle'
import { SpinnerRoundFilled } from 'spinners-react'
import { llmModel } from '../../utils/llm_configuration/LlmConfiguration'
const { vw, vh, vmin, vmax } = require('react-native-viewport-units')

class YTCommentsBasicResultCard extends Component {
  constructor (props) {
    super(props)

    const windowWidth = Dimensions.get('window').width
    const windowHeight = Dimensions.get('window').height

    const aspectRatio = windowWidth / windowHeight

    const windowWidthCm = (windowWidth / 160) * 2.54

    let largeWebBrowser = true
    let mobileBrowser = false
    let sizeScaler = 1

    if (aspectRatio < 1.3 && windowWidthCm < 25) {
      largeWebBrowser = false
      sizeScaler = 1
      if (aspectRatio < 0.6 && windowWidthCm < 15) {
        mobileBrowser = true
        sizeScaler = 0.8
      }
    }

    this.state = {
      commentsExpand: false,
      commentsData: this.props.commentsData,
      emoIcon: this.props.emoIcon,
      sizeScaler,
      topNComments: this.props.topNComments,
      commentsSummaryExpand: false,
      promptingLlm: false,
      llmGptReply: '',
      topNEmoBreakdown: this.props.topNEmoBreakdown,
      emoElaborationPromptingLlm: false,
      emoElaborationCommentsSummaryExpand: false,
      emoElaborationllmGptReply: '',
      hideCard: this.props.hideCard
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.commentsData !== this.props.commentsData) {
      this.setState({ commentsData: this.props.commentsData })
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()

    if (!this.state.commentsSummaryExpand) {
      this.setState({ commentsSummaryExpand: !this.state.commentsSummaryExpand })
    }

    this.setState({ promptingLlm: !this.state.promptingLlm })

    const shuffledTopNComments = ArrayShuffle(this.state.topNComments)

    api.post(commentsLlmQuestioning, {
      top10ShuffledComments: shuffledTopNComments.slice(0, 10),
      emoIcon: this.state.emoIcon,
      llmModel
    }, {
      withCredentials: true
    }
    ).then(response => {
      console.log(this.state.promptingLlm)
      if (this.state.promptingLlm) {
        this.setState({ llmGptReply: response.data.responsePayload.llmGptReply })
        this.setState({ promptingLlm: !this.state.promptingLlm })
      }
    }
    ).catch(error => {
      if (this.state.promptingLlm) {
        this.setState({ promptingLlm: !this.state.promptingLlm })
      }
    })
  }

  handleClose = (e) => {
    e.preventDefault()

    if (this.state.commentsSummaryExpand) {
      this.setState({ commentsSummaryExpand: !this.state.commentsSummaryExpand })
      this.setState({ llmGptReply: '' })
      this.setState({ promptingLlm: false })
    }
  }

  handleSubmitEmoElaboration = (e) => {
    e.preventDefault()

    if (!this.state.emoElaborationCommentsSummaryExpand) {
      this.setState({ emoElaborationCommentsSummaryExpand: !this.state.emoElaborationCommentsSummaryExpand })
    }

    this.setState({ emoElaborationPromptingLlm: !this.state.emoElaborationPromptingLlm })

    const shuffledTopNComments = ArrayShuffle(this.state.topNComments)

    api.post(commentsLlmEmoElaboration, {
      top10ShuffledComments: shuffledTopNComments.slice(0, 10),
      emoIcon: this.state.emoIcon,
      llmModel
    }, {
      withCredentials: true
    }
    ).then(response => {
      console.log(this.state.emoElaborationPromptingLlm)
      if (this.state.emoElaborationPromptingLlm) {
        this.setState({ emoElaborationllmGptReply: response.data.responsePayload.emoElaborationllmGptReply })
        this.setState({ emoElaborationPromptingLlm: !this.state.emoElaborationPromptingLlm })
      }
    }
    ).catch(error => {
      if (this.state.emoElaborationPromptingLlm) {
        this.setState({ emoElaborationPromptingLlm: !this.state.emoElaborationpromptingL })
      }
    })
  }

  handleCloseEmoElaboration = (e) => {
    e.preventDefault()

    if (this.state.emoElaborationCommentsSummaryExpand) {
      this.setState({ emoElaborationCommentsSummaryExpand: !this.state.emoElaborationCommentsSummaryExpand })
      this.setState({ emoElaborationllmGptReply: '' })
      this.setState({ emoElaborationpromptingL: false })
    }
  }

  render () {
    return (
        <View>
            <Card style={styles.commentsCard}>
                <CardContent>
                    <Typography sx={{ fontSize: 1.5 * this.state.sizeScaler * vh }} color="text.primary" gutterBottom>
                        Most {this.state.emoIcon} opinions
                    </Typography>
                    {this.state.hideCard &&
                      <Typography sx={{ fontSize: 1.5 * this.state.sizeScaler * vh }} color="text.primary" gutterBottom>
                        {'('}Unavailable: not enough comments{')'}
                      </Typography>
                    }
                    <Typography variant="h5" sx={{ fontSize: 1.6 * this.state.sizeScaler * vh }}>
                        {this.state.commentsData !== undefined &&
                            <a href={this.state.commentsData.url} style={{ color: '#808B96' }}>{this.state.commentsData.title}</a>
                        }
                    </Typography>
                    <Typography sx={{ fontSize: 1.2 * this.state.sizeScaler * vh }} color="text.primary">
                        {this.state.commentsData !== undefined &&
                            this.state.commentsData.publisher
                        }
                    </Typography>
                </CardContent>
                {!this.state.hideCard &&
                <CardActions>
                    {!this.state.promptingL &&
                      <Button size="small" onClick={this.handleSubmit} style={{ textAlign: 'left' }}>
                        WHAT MAKES MY AUDIENCE {this.state.emoIcon}?
                      </Button>
                    }
                    {this.state.commentsSummaryExpand &&
                        <Button size="small" onClick={this.handleClose} style={{ textAlign: 'left' }}>CLOSE</Button>
                    }
                </CardActions>
                }
                {!this.state.hideCard &&
                <CardActions>
                  {!this.state.promptingL && this.state.llmGptReply !== '' &&
                    <Button>(Click me again for more insight)</Button>
                  }
                </CardActions>
                }
                {!this.state.hideCard &&
                <Collapse in={this.state.commentsSummaryExpand} timeout="auto" unmountOnExit>
                    <CardContent>
                        {this.state.promptingL &&
                            <CardActions>
                                <Button size="small" style={{ textAlign: 'left' }}>AI Loading Answer...</Button>
                            </CardActions>
                        }
                        <Typography paragraph sx={{ fontSize: 1.2 * this.state.sizeScaler * vh }}>
                            {!this.state.promptingL && this.state.llmGptReply !== '' &&
                                <Typography sx={{ fontSize: 1.2 * this.state.sizeScaler * vh }} color="text.secondary" gutterBottom>
                                    What made viewers {this.state.emoIcon}:
                                </Typography>
                            }
                            {!this.state.promptingL && this.state.llmGptReply !== '' &&
                                <View>
                                    {this.state.llmGptReply}
                                </View>
                            }
                        </Typography>
                    </CardContent>
                </Collapse>
                }
                {!this.state.hideCard &&
                <CardActions>
                    {this.state.emoIcon === '😃' && !this.state.emoElaborationpromptingL &&
                      <Button size="small" onClick={this.handleSubmitEmoElaboration} style={{ textAlign: 'left' }}>
                        HOW DO I MAKE CONTENT THAT MAKES MY AUDIENCE HAPPIER?
                      </Button>
                    }
                    {this.state.emoIcon === '😡' && !this.state.emoElaborationpromptingL &&
                      <Button
                        size="small"
                        onClick={this.handleSubmitEmoElaboration}
                        style={{ textAlign: 'left' }}
                        buttonStyle={{ paddingLeft: '0px' }}>
                          HOW CAN I HARNESS MY AUDIENCE&apos;S ANGER TO MAKE MORE RELEVANT, USEFUL CONTENT?
                      </Button>
                    }
                    {this.state.emoIcon === '🤢' && !this.state.emoElaborationpromptingL &&
                      <Button size="small" onClick={this.handleSubmitEmoElaboration} style={{ textAlign: 'left' }}>
                        HOW CAN I FURTHER PROVOKE MY AUDIENCE&apos;S MORBID CURIOSITY?
                      </Button>
                    }
                    {this.state.emoIcon === '😢' && !this.state.emoElaborationpromptingL &&
                      <Button size="small" onClick={this.handleSubmitEmoElaboration} style={{ textAlign: 'left' }}>
                        HOW DOES SADNESS INFORM WHAT MY AUDIENCE DEEPLY CARES ABOUT?
                      </Button>
                    }
                    {this.state.emoIcon === '😱' && !this.state.emoElaborationpromptingL &&
                      <Button size="small" onClick={this.handleSubmitEmoElaboration} style={{ textAlign: 'left' }}>
                        HOW CAN I JUMPSCARE AND GRIP MY AUDIENCE?
                      </Button>
                    }
                    {this.state.emoIcon === '😯' && !this.state.emoElaborationpromptingL &&
                      <Button size="small" onClick={this.handleSubmitEmoElaboration} style={{ textAlign: 'left' }}>
                        HOW CAN I FURTHER SURPRISE AND AMAZE MY AUDIENCE?
                      </Button>
                    }
                    {this.state.emoIcon === '😐' && !this.state.emoElaborationpromptingL &&
                      <Button size="small" onClick={this.handleSubmitEmoElaboration} style={{ textAlign: 'left' }}>
                        HOW CAN I WIN OVER AUDIENCE WITH LUKEWARM REACTIONS?
                      </Button>
                    }
                    {this.state.emoElaborationCommentsSummaryExpand &&
                        <Button size="small" onClick={this.handleCloseEmoElaboration} style={{ textAlign: 'left' }}>CLOSE</Button>
                    }
                </CardActions>
                }
                {!this.state.hideCard &&
                <CardActions>
                  {!this.state.emoElaborationpromptingL && this.state.emoElaborationllmGptReply !== '' &&
                    <Button>(Click me again)</Button>
                  }
                </CardActions>
                }
                {!this.state.hideCard &&
                <Collapse in={this.state.emoElaborationCommentsSummaryExpand} timeout="auto" unmountOnExit>
                    <CardContent>
                        {this.state.emoElaborationpromptingL &&
                            <CardActions>
                                <Button size="small">AI Loading Answer...</Button>
                            </CardActions>
                        }
                        <Typography paragraph sx={{ fontSize: 1.2 * this.state.sizeScaler * vh }}>
                            {!this.state.emoElaborationpromptingL && this.state.emoElaborationllmGptReply !== '' &&
                                <Typography sx={{ fontSize: 1.2 * this.state.sizeScaler * vh }} color="text.secondary" gutterBottom>
                                    New content suggestion {this.state.emoIcon}:
                                </Typography>
                            }
                            {!this.state.emoElaborationpromptingL && this.state.emoElaborationllmGptReply !== '' &&
                                <View>
                                    {this.state.emoElaborationllmGptReply}
                                </View>
                            }
                        </Typography>
                    </CardContent>
                </Collapse>
                }
                {/*
                <CardActions>
                    <Button size="small" onClick={() => this.setState({ commentsExpand: !this.state.commentsExpand })}>COMMENT SNIPPETS</Button>
                </CardActions>
                */}
            </Card>
        </View>
    )
  }
}

export default YTCommentsBasicResultCard
