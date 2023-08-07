
function ExtractVideoId (urlString) {
  const urlArray = urlString.split('/')
  const ytUrlFinalBit = urlArray[urlArray.length - 1]
  const videoIdArray = ytUrlFinalBit.split('=')

  return videoIdArray[videoIdArray.length - 1]
}

export default ExtractVideoId
