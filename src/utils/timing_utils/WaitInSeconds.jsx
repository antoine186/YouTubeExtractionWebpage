
function WaitInSeconds (durationInSeconds) {
  const startTime = new Date().getTime()
  let endTime = new Date().getTime()

  let timeDifferencInSeconds = 0

  while (timeDifferencInSeconds < durationInSeconds) {
    endTime = new Date().getTime()
    timeDifferencInSeconds = (endTime - startTime) / 1000
  }

  return true
}

export default WaitInSeconds
