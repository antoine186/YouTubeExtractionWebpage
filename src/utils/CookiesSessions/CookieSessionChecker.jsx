import Cookies from 'js-cookie'
import { api, sessionAuthUrl } from '../backend_configuration/BackendConfig'
import CookieString2DictConverter from './CookieString2DictConverter'
import ManualStoreClearing from '../session_helpers/ManualStoreClearing'
import React from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Icon, Image } from 'react-native'

function CookieSessionChecker () {
  const [sessionLogout, setSessionLogout] = React.useState(false)

  let userSessionCookie = Cookies.get('user_session_cookie')

  if (userSessionCookie != null) {
    userSessionCookie = CookieString2DictConverter(userSessionCookie)
    const userId = userSessionCookie.user_id
    const secretToken1 = userSessionCookie.secret_token_1
    const secretToken2 = userSessionCookie.secret_token_2

    api.post(sessionAuthUrl, {
      userId,
      secretToken1,
      secretToken2
    }, {
      withCredentials: true
    }
    ).then(response => {
      if (response['data'] === true) {
        console.log('Checked session cookies')
        console.log('Session is true')
        return true
      } else {
        console.log('Checked session cookies')
        console.log('Session is false')

        setSessionLogout(true)

        return false
      }
    }
    )
  }

  return (
    <View>
    {sessionLogout &&
      <ManualStoreClearing />
    }
    </View>
  )
}

export default CookieSessionChecker
