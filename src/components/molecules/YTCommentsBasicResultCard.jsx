import React, { Component } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Icon, Image, Dimensions } from 'react-native'
import { api, commentsChatgptQuestioning } from '../../utils/backend_configuration/BackendConfig'
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
      promptingChatGpt: false,
      chatGptReply: '',
      topNEmoBreakdown: this.props.topNEmoBreakdown
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

    this.setState({ promptingChatGpt: !this.state.promptingChatGpt })

    const shuffledTopNComments = ArrayShuffle(this.state.topNComments)

    api.post(commentsChatgptQuestioning, {
      top10ShuffledComments: shuffledTopNComments.slice(0, 10),
      emoIcon: this.state.emoIcon
    }, {
      withCredentials: true
    }
    ).then(response => {
      console.log(this.state.promptingChatGpt)
      if (this.state.promptingChatGpt) {
        this.setState({ chatGptReply: response.data.responsePayload.ChatGptReply })
        this.setState({ promptingChatGpt: !this.state.promptingChatGpt })
      }
    }
    ).catch(error => {
      if (this.state.promptingChatGpt) {
        this.setState({ promptingChatGpt: !this.state.promptingChatGpt })
      }
    })
  }

  handleClose = (e) => {
    e.preventDefault()

    if (this.state.commentsSummaryExpand) {
      this.setState({ commentsSummaryExpand: !this.state.commentsSummaryExpand })
      this.setState({ chatGptReply: '' })
      this.setState({ promptingChatGpt: false })
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
                <CardActions>
                    {!this.state.promptingChatGpt &&
                      <Button size="small" onClick={this.handleSubmit} style={{ textAlign: 'left' }}>
                        WHAT DOES MY AUDIENCE THINK?
                      </Button>
                    }
                    {this.state.commentsSummaryExpand &&
                        <Button size="small" onClick={this.handleClose} style={{ textAlign: 'left' }}>CLOSE</Button>
                    }
                </CardActions>
                <CardActions>
                  {!this.state.promptingChatGpt && this.state.chatGptReply !== '' &&
                    <Button>(Click me again for more insight)</Button>
                  }
                </CardActions>
                <Collapse in={this.state.commentsSummaryExpand} timeout="auto" unmountOnExit>
                    <CardContent>
                        {this.state.promptingChatGpt &&
                            <CardActions>
                                <Button size="small" style={{ textAlign: 'left' }}>AI Loading Answer...</Button>
                            </CardActions>
                        }
                        <Typography paragraph sx={{ fontSize: 1.2 * this.state.sizeScaler * vh }}>
                            {!this.state.promptingChatGpt && this.state.chatGptReply !== '' &&
                                <Typography sx={{ fontSize: 1.2 * this.state.sizeScaler * vh }} color="text.secondary" gutterBottom>
                                    What made viewers {this.state.emoIcon}:
                                </Typography>
                            }
                            {!this.state.promptingChatGpt && this.state.chatGptReply !== '' &&
                                <View>
                                    {this.state.chatGptReply}
                                </View>
                            }
                        </Typography>
                    </CardContent>
                </Collapse>

                <CardActions>
                    {this.state.emoIcon === '😃' &&
                      <Button size="small" onClick={this.handleSubmit} style={{ textAlign: 'left' }}>
                        HOW DO I MAKE CONTENT THAT MAKES MY AUDIENCE HAPPIER?
                      </Button>
                    }
                    {this.state.emoIcon === '😡' &&
                      <Button
                        size="small"
                        onClick={this.handleSubmit}
                        style={{ textAlign: 'left' }}
                        buttonStyle={{ paddingLeft: '0px' }}>
                          HOW CAN I HARNESS MY AUDIENCE&apos;S ANGER TO MAKE MORE RELEVANT, USEFUL CONTENT?
                      </Button>
                    }
                    {this.state.emoIcon === '🤢' &&
                      <Button size="small" onClick={this.handleSubmit} style={{ textAlign: 'left' }}>
                        HOW CAN I FURTHER PROVOKE MY AUDIENCE&apos;S MORBID CURIOSITY?
                      </Button>
                    }
                    {this.state.emoIcon === '😢' &&
                      <Button size="small" onClick={this.handleSubmit} style={{ textAlign: 'left' }}>
                        HOW DOES SADNESS INFORM WHAT MY AUDIENCE DEEPLY CARES ABOUT?
                      </Button>
                    }
                    {this.state.emoIcon === '😱' &&
                      <Button size="small" onClick={this.handleSubmit} style={{ textAlign: 'left' }}>
                        HOW CAN I JUMPSCARE AND GRIP MY AUDIENCE?
                      </Button>
                    }
                    {this.state.emoIcon === '😯' &&
                      <Button size="small" onClick={this.handleSubmit} style={{ textAlign: 'left' }}>
                        HOW CAN I FURTHER SURPRISE AND AMAZE MY AUDIENCE?
                      </Button>
                    }
                    {this.state.emoIcon === '😐' &&
                      <Button size="small" onClick={this.handleSubmit} style={{ textAlign: 'left' }}>
                        HOW CAN I WIN OVER AUDIENCE WITH LUKEWARM REACTIONS?
                      </Button>
                    }
                    {this.state.commentsSummaryExpand &&
                        <Button size="small" onClick={this.handleClose} style={{ textAlign: 'left' }}>CLOSE</Button>
                    }
                </CardActions>
                <CardActions>
                  {!this.state.promptingChatGpt && this.state.chatGptReply !== '' &&
                    <Button>(Click me again)</Button>
                  }
                </CardActions>
                <Collapse in={this.state.commentsSummaryExpand} timeout="auto" unmountOnExit>
                    <CardContent>
                        {this.state.promptingChatGpt &&
                            <CardActions>
                                <Button size="small">AI Loading Answer...</Button>
                            </CardActions>
                        }
                        <Typography paragraph sx={{ fontSize: 1.2 * this.state.sizeScaler * vh }}>
                            {!this.state.promptingChatGpt && this.state.chatGptReply !== '' &&
                                <Typography sx={{ fontSize: 1.2 * this.state.sizeScaler * vh }} color="text.secondary" gutterBottom>
                                    What made viewers {this.state.emoIcon}:
                                </Typography>
                            }
                            {!this.state.promptingChatGpt && this.state.chatGptReply !== '' &&
                                <View>
                                    {this.state.chatGptReply}
                                </View>
                            }
                        </Typography>
                    </CardContent>
                </Collapse>
                {/*
                <CardActions>
                    <Button size="small" onClick={() => this.setState({ commentsExpand: !this.state.commentsExpand })}>COMMENT SNIPPETS</Button>
                </CardActions>
                */}
                <Collapse in={this.state.commentsExpand} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography paragraph sx={{ fontSize: 1.2 * this.state.sizeScaler * vh }}>
                            <Typography sx={{ fontSize: 1.2 * this.state.sizeScaler * vh }} color="text.secondary" gutterBottom>
                                Comment snippets
                            </Typography>
                            {/*this.state.topNComments !== undefined &&
                            <ul style={styles.bulletPoints}>
                                {this.state.topNComments.map(comment => (
                                    <View>
                                        <li>{comment.text}</li>
                                        <br></br>
                                    </View>
                                ))}
                            </ul>
                            */}
                        </Typography>
                    </CardContent>
                </Collapse>
            </Card>
        </View>
    )
  }
}

export default YTCommentsBasicResultCard
