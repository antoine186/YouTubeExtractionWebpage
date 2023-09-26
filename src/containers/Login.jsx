import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { TouchableOpacity, Text, View, Image, TextInput } from 'react-native'
import styles from '../utils/style_guide/LoginPageStyle'
import { api, loginAuthUrl, retrieveSubscriptionDetails, getSubscriptionStatus, retrieveAccountData, checkIfServerUp } from '../utils/backend_configuration/BackendConfig'
import { useSelector, useDispatch } from 'react-redux'
import { validateUserSession } from '../store/Slices/UserSessionSlice'
import { useNavigate, Navigate } from 'react-router-dom'
import { userInputFieldMaxCharacter } from '../utils/user_input_config/UserInputConfig'
import { setValidSubscription } from '../store/Slices/ValidSubscriptionSlice'
import { setstripeSubscription } from '../store/Slices/StripeSubscriptionSlice'
import { setAccountData } from '../store/Slices/AccountDataSlice'
import { userInputFieldMaxCharacterEmail } from '../utils/user_input_config/UserInputConfig'
import { clearSessionLogout } from '../store/Slices/SessionLogoutSlice'
import ServerNotAvailable from './ServerNotAvailable'
import CheckIfServerUpOutsideSession from '../components/atoms/CheckIfServerUpOutsideSession'

function Login () {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [serverUnavailable, setServerUnavailable] = useState(false)
  const [passIncorrect, setPassIncorrect] = useState(false)
  const [accountNonExistent, setAccountNonExistent] = useState(false)
  const [tooManySessionsActive, setTooManySessionsActive] = useState(false)
  const [usernameEmpty, setUsernameEmpty] = useState(false)
  const [passwordEmpty, setPasswordEmpty] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const userSessionValidated = useSelector(state => state.userSession.validated)
  const isServerDown = useSelector(state => state.isServerDown.validated)

  const loginButtonRef = React.useRef()

  window.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault()

      if (loginButtonRef.current !== undefined && loginButtonRef.current !== null) {
        loginButtonRef.current.click()
      }
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    if (username === '') {
      setUsernameEmpty(true)
      return
    }

    if (password === '') {
      setPasswordEmpty(true)
      return
    }

    api.post(loginAuthUrl, {
      username,
      password
    }, {
      withCredentials: true
    }
    ).then(response => {
      if (response.data.operation_success) {
        dispatch(validateUserSession())
        dispatch(clearSessionLogout())

        api.post(retrieveAccountData, {
          username
        }, {
          withCredentials: true
        }
        ).then(response => {
          if (response.data.operation_success) {
            dispatch(setAccountData(response.data.responsePayload))
          }
        }
        ).catch(error => {
          switch (error.response.status) {
            case 503:
              setServerUnavailable(true)
              break
            case 502:
              setServerUnavailable(true)
              break
            default:
              break
          }
        })

        api.post(retrieveSubscriptionDetails, {
          username
        }, {
          withCredentials: true
        }
        ).then(response => {
          if (response.data.operation_success) {
            dispatch(setstripeSubscription(response.data.responsePayload))

            api.post(getSubscriptionStatus, {
              stripeSubscriptionId: response.data.responsePayload.stripe_subscription_id
            }, {
              withCredentials: true
            }
            ).then(response2 => {
              if (response2.data.operation_success) {
                if (response2.data.responsePayload.stripe_subscription_status === 'active' ||
                response2.data.responsePayload.stripe_subscription_status === 'trialing') {
                  console.log('Found valid subscription')
                  dispatch(setValidSubscription(true))

                  navigate('/')
                } else {
                  console.log('No valid subscriptions found')
                  dispatch(setValidSubscription(false))

                  navigate('/')
                }
              } else {
                navigate('/')
              }
            }
            ).catch(error => {
              switch (error.response.status) {
                case 503:
                  setServerUnavailable(true)
                  break
                case 502:
                  setServerUnavailable(true)
                  break
                default:
                  break
              }
            })
          } else {
            console.log('No valid subscriptions found')
            dispatch(setValidSubscription(false))

            navigate('/')
          }
        }
        ).catch(error => {
          switch (error.response.status) {
            case 503:
              setServerUnavailable(true)
              break
            case 502:
              setServerUnavailable(true)
              break
            default:
              break
          }
        })

        // navigate('/home')
      } else {
        console.log('Authentication is false')
        if (response.data.error_message === 'one_session_already_active') {
          console.log('Too many sessions active')
          setTooManySessionsActive(true)
        } else if (response.data.error_message === 'wrong_credentials') {
          console.log('Credentials incorrect')
          setPassIncorrect(true)
        } else if (response.data.error_message === 'account_not_found') {
          setAccountNonExistent(true)
        }
      }
    }
    ).catch(error => {
      switch (error.response.status) {
        case 503:
          setServerUnavailable(true)
          break
        case 502:
          setServerUnavailable(true)
          break
        default:
          break
      }
    })
  }

  function accountCreate () {
    api.post(checkIfServerUp, {
    }, {
      withCredentials: true
    }
    ).then(response => {
      if (response.data.operation_success) {
        dispatch(setValidSubscription(false))
        navigate('/account-create')
      }
    }
    ).catch(error => {
      switch (error.response.status) {
        case 503:
          setServerUnavailable(true)
          break
        case 502:
          setServerUnavailable(true)
          break
        default:
          break
      }
    })
  }

  function passwordForget () {
    api.post(checkIfServerUp, {
    }, {
      withCredentials: true
    }
    ).then(response => {
      if (response.data.operation_success) {
        dispatch(setValidSubscription(false))
        navigate('/forgot-password')
      }
    }
    ).catch(error => {
      switch (error.response.status) {
        case 503:
          setServerUnavailable(true)
          break
        case 502:
          setServerUnavailable(true)
          break
        default:
          break
      }
    })
  }

  function userNameChanged (email) {
    setTooManySessionsActive(false)
    setAccountNonExistent(false)
    setPassIncorrect(false)
    setUsernameEmpty(false)
    setPasswordEmpty(false)
    setUsername(email)
  }

  function passwordChanged (password) {
    setTooManySessionsActive(false)
    setAccountNonExistent(false)
    setPassIncorrect(false)
    setUsernameEmpty(false)
    setPasswordEmpty(false)
    setPassword(password)
  }

  if (isServerDown) {
    return (
      <View style={styles.container}>
        <ServerNotAvailable />
      </View>
    )
  } else if (serverUnavailable) {
    return (
      <View style={styles.container}>
        <ServerNotAvailable />
      </View>
    )
  } else {
    if (userSessionValidated) {
      return <Navigate to='/' />
    } else {
      return (
        <View style={styles.container}>
          <CheckIfServerUpOutsideSession
            setServerUnavailable={setServerUnavailable}
          />
          <Image style={styles.image} source={require('../assets/images/EMOfficialLogo.png')} />
          <Text style={styles.companyName}>Emotional Machines</Text>
          <StatusBar style="auto" />
          <View style={styles.inputView}>
            <TextInput
              style={styles.textInput}
              placeholder="Email"
              placeholderTextColor="#003f5c"
              onChangeText={(email) => userNameChanged(email)}
              maxLength={userInputFieldMaxCharacterEmail}
            />
          </View>
          {usernameEmpty &&
            <View>
              <Text style={styles.text}>
                Username cannot be empty
              </Text>
              <br></br>
            </View>
          }
          <View style={styles.inputView}>
            <TextInput
              style={styles.textInput}
              placeholder="Password"
              placeholderTextColor="#003f5c"
              secureTextEntry={true}
              onChangeText={(password) => passwordChanged(password)}
              maxLength={userInputFieldMaxCharacter}
            />
          </View>
          {passwordEmpty &&
            <View>
              <Text style={styles.text}>
                Password cannot be empty
              </Text>
              <br></br>
            </View>
          }
          {passIncorrect &&
            <View>
              <Text style={styles.text}>
                Incorrect credentials
              </Text>
              <br></br>
            </View>
          }
          {accountNonExistent &&
            <View>
              <Text style={styles.text}>
                Account could not be found
              </Text>
              <br></br>
            </View>
          }
          {tooManySessionsActive &&
            <View>
              <Text style={styles.text}>
                Too many sessions logged in. Please logout your other sessions.
              </Text>
              <br></br>
            </View>
          }
          <TouchableOpacity>
            <Text style={styles.textButton} onPress={passwordForget}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.textButton} onPress={accountCreate}>
              {"Don't have an account? Create an account here"}
            </Text>
          </TouchableOpacity>
          <br></br>
          <TouchableOpacity style={styles.loginBtn} onPress={handleSubmit} ref={loginButtonRef}>
            <Text style={styles.loginText}>LOGIN</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }
}

export default Login
