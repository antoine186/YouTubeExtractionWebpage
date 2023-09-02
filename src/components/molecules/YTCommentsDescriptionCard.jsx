import React, { Component } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Icon, Image, Dimensions } from 'react-native'
import styles from '../../utils/style_guide/MainWebpageStyle'
// import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Collapse from '@mui/material/Collapse'
const { vw, vh, vmin, vmax } = require('react-native-viewport-units')

class YTCommentsDescriptionCard extends Component {
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
      descriptionData: this.props.descriptionData,
      sizeScaler
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.descriptionData !== this.props.descriptionData) {
      this.setState({ descriptionData: this.props.descriptionData })
    }
  }

  render () {
    return (
        <View>
            <Card style={styles.commentsCard}>
                <CardContent>
                    <Typography sx={{ fontSize: 1.5 * this.state.sizeScaler * vh }} color="text.primary" gutterBottom>
                        Description
                    </Typography>
                </CardContent>
                <CardContent>
                    <Typography paragraph sx={{ fontSize: 1.2 * this.state.sizeScaler * vh }}>
                      {this.state.descriptionData}
                    </Typography>
                </CardContent>
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

export default YTCommentsDescriptionCard
