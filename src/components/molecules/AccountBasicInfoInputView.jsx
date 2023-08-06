import React from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, Text, View, Image, TextInput } from 'react-native'
import styles from '../../utils/style_guide/AccountDetailsInputPageStyle'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import CappedDatePicker from '../atoms/CappedDatePicker'
import DateFormatter from '../../utils/DateFormatter'
import { userInputFieldMaxCharacter } from '../../utils/user_input_config/UserInputConfig'
import { mockingConfig } from '../../utils/debug_configuration/MockingConfig'
import AccountCreationBasicDataMock from '../../mocking/AccountCreationBasicDataMock'
import { userInputFieldMaxCharacterEmail } from '../../utils/user_input_config/UserInputConfig'

class AccountBasicInfoInputView extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      emailAddress: this.props.emailAddress,
      password: this.props.password,
      confirmedPassword: this.props.confirmedPassword,
      firstNameGrabber: this.props.firstNameGrabber,
      lastNameGrabber: this.props.lastNameGrabber,
      userEmailGrabber: this.props.userEmailGrabber,
      passwordGrabber: this.props.passwordGrabber,
      confirmedPasswordGrabber: this.props.confirmedPasswordGrabber,
      firstNameEmpty: this.props.firstNameEmpty,
      lastNameEmpty: this.props.lastNameEmpty,
      emailEmpty: this.props.emailEmpty,
      emailAlreadyExists: this.props.emailAlreadyExists,
      somethingWentWrong: this.props.somethingWentWrong,
      validEmail: this.props.validEmail,
      passwordsMatch: this.props.passwordsMatch,
      passwordFormatIncorrect: this.props.passwordFormatIncorrect,
      passwordEmpty: this.props.passwordEmpty
    }

    if (mockingConfig) {
      AccountCreationBasicDataMock(this)
      this.setFirstName(this.state.firstName)
      this.setLastName(this.state.lastName)
      this.setUserEmail(this.state.emailAddress)
      this.setPassword(this.state.password)
      this.setConfirmedPassword(this.state.confirmedPassword)
    }
  }

  setFirstName (firstName) {
    this.setState({ firstName })
    this.state.firstNameGrabber(firstName)
  }

  setLastName (lastName) {
    this.setState({ lastName })
    this.state.lastNameGrabber(lastName)
  }

  setUserEmail (email) {
    this.setState({ emailAddress: email })
    this.state.userEmailGrabber(email)
  }

  setPassword (password) {
    this.setState({ password })
    this.state.passwordGrabber(password)
  }

  setConfirmedPassword (password) {
    this.setState({ password })
    this.state.confirmedPasswordGrabber(password)
  }

  render () {
    return (
      <View style={styles.subcontainer}>
        <Text style={styles.titleText}>
          Your New Account
        </Text>
        <br></br>

        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="First Name"
            placeholderTextColor="#003f5c"
            value={this.state.firstName}
            onChangeText={firstName => this.setFirstName(firstName)}
            maxLength={userInputFieldMaxCharacter}
          />
        </View>

        {this.props.firstNameEmpty &&
          <View>
            <Text style={styles.errorText}>
              Please fill in your firstname *
            </Text>
            <br></br>
          </View>
        }

        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="Last Name"
            placeholderTextColor="#003f5c"
            value={this.state.lastName}
            onChangeText={lastName => this.setLastName(lastName)}
            maxLength={userInputFieldMaxCharacter}
          />
        </View>

        {this.props.lastNameEmpty &&
          <View>
            <Text style={styles.errorText}>
              Please fill in your lastname *
            </Text>
            <br></br>
          </View>
        }

        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="Email Address"
            placeholderTextColor="#003f5c"
            value={this.state.emailAddress}
            onChangeText={emailAddress => this.setUserEmail(emailAddress)}
            maxLength={userInputFieldMaxCharacterEmail}
          />
        </View>
        {this.props.emailEmpty &&
          <View>
            <Text style={styles.errorText}>
              Please fill in your email address *
            </Text>
            <br></br>
          </View>
        }
        {!this.props.validEmail &&
          <View>
            <Text style={styles.errorText}>
              Please enter a valid email address *
            </Text>
            <br></br>
          </View>
        }
        {this.props.emailAlreadyExists &&
          <View>
            <Text style={styles.errorText}>
              The account associated with your email already exists *
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
            onChangeText={password => this.setPassword(password)}
            maxLength={userInputFieldMaxCharacter}
            autoCorrect={false}
          />
        </View>
        {this.props.passwordEmpty &&
          <View>
            <Text style={styles.errorText}>
              Please fill in your password *
            </Text>
            <br></br>
          </View>
        }
        {this.props.passwordFormatIncorrect &&
          <View>
            <Text style={styles.errorText}>
              Passwords should be at least 8 characters long and have at least 1 uppercase, 1 lowercase character, and finally 1 number *
            </Text>
            <br></br>
          </View>
        }
        {!this.props.passwordsMatch &&
          <View>
            <Text style={styles.errorText}>
              Passwords don't match *
            </Text>
            <br></br>
          </View>
        }
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="Confirm Password"
            placeholderTextColor="#003f5c"
            value={this.state.confirmedPassword}
            secureTextEntry={true}
            onChangeText={confirmedPassword => this.setConfirmedPassword(confirmedPassword)}
            maxLength={userInputFieldMaxCharacter}
            autoCorrect={false}
          />
        </View>
      </View>
    )
  }
}

AccountBasicInfoInputView.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  emailAddress: PropTypes.string,
  password: PropTypes.string
}

AccountBasicInfoInputView.defaultProps = {
  telephoneNumber: ''
}

export default AccountBasicInfoInputView
