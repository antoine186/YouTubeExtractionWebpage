import number2MonthDict from "./date_utils/Number2Month"

function DateFormatterToNaturalLanguage (dateString) {
  const stringArray = dateString.split('T')
  const pureDateString = stringArray[0]

  const pureDateArray = pureDateString.split('-')

  const yearNumber = pureDateArray[0]
  const monthNumber = pureDateArray[1].toString()
  const dayNumber = pureDateArray[2]

  const formattedDate = number2MonthDict[monthNumber] + ' ' + dayNumber + ' ' + yearNumber

  return formattedDate
}

export default DateFormatterToNaturalLanguage
