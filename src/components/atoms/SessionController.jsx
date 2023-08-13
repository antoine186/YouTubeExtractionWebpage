import React, { useEffect } from 'react'
import ManualStoreClearing from '../../utils/session_helpers/ManualStoreClearing'
import { timeTowardsAutoLogout } from '../../utils/session_configuration/SessionConfig'
import { TouchableOpacity, Text, View, Image, TextInput } from 'react-native'

function SessionController () {
  const [autoLogout, setAutoLogout] = React.useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Auto logging out!')
      setAutoLogout(true)
    }, timeTowardsAutoLogout)

    return () => clearInterval(interval)
  }, [])

  return (
    <View>
    {autoLogout &&
      <View>
          <ManualStoreClearing />
      </View>
    }
    </View>
  )
}

export default SessionController
