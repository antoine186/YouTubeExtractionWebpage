
function ReaverageEmoBreakdown (topNEmotions) {
  const topNEmotionsDict = {
    emo_breakdown: {
      anger_percentage: 0,
      disgust_percentage: 0,
      fear_percentage: 0,
      joy_percentage: 0,
      neutral_percentage: 0,
      sadness_percentage: 0,
      surprise_percentage: 0
    }
  }

  for (let i = 1; i < topNEmotions.length; i++) {
    topNEmotionsDict.emo_breakdown.anger_percentage += topNEmotions[i].emo_breakdown.anger_percentage
    topNEmotionsDict.emo_breakdown.disgust_percentage += topNEmotions[i].emo_breakdown.disgust_percentage
    topNEmotionsDict.emo_breakdown.fear_percentage += topNEmotions[i].emo_breakdown.fear_percentage
    topNEmotionsDict.emo_breakdown.joy_percentage += topNEmotions[i].emo_breakdown.joy_percentage
    topNEmotionsDict.emo_breakdown.neutral_percentage += topNEmotions[i].emo_breakdown.neutral_percentage
    topNEmotionsDict.emo_breakdown.sadness_percentage += topNEmotions[i].emo_breakdown.sadness_percentage
    topNEmotionsDict.emo_breakdown.surprise_percentage += topNEmotions[i].emo_breakdown.surprise_percentage
  }

  topNEmotionsDict.emo_breakdown.anger_percentage = topNEmotionsDict.emo_breakdown.anger_percentage / topNEmotions.length
  topNEmotionsDict.emo_breakdown.disgust_percentage = topNEmotionsDict.emo_breakdown.disgust_percentage / topNEmotions.length
  topNEmotionsDict.emo_breakdown.fear_percentage = topNEmotionsDict.emo_breakdown.fear_percentage / topNEmotions.length
  topNEmotionsDict.emo_breakdown.joy_percentage = topNEmotionsDict.emo_breakdown.joy_percentage / topNEmotions.length
  topNEmotionsDict.emo_breakdown.neutral_percentage = topNEmotionsDict.emo_breakdown.neutral_percentage / topNEmotions.length
  topNEmotionsDict.emo_breakdown.sadness_percentage = topNEmotionsDict.emo_breakdown.sadness_percentage / topNEmotions.length
  topNEmotionsDict.emo_breakdown.surprise_percentage = topNEmotionsDict.emo_breakdown.surprise_percentage / topNEmotions.length

  return topNEmotionsDict
}

export default ReaverageEmoBreakdown
