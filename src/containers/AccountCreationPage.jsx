import React from 'react'
import AccountBasicInfoInputView from '../components/molecules/AccountBasicInfoInputView'
import UserBillingAddressInputView from '../components/atoms/UserBillingAddressInputView'
import { TouchableOpacity, Text, View, Image, TextInput } from 'react-native'
import styles from '../utils/style_guide/AccountDetailsInputPageStyle'
import validator from 'validator'
import { isValidPhoneNumber } from 'react-phone-number-input'
import PasswordValidate from '../utils/PasswordValidate'
import { setAccountData } from '../store/Slices/AccountDataSlice'
import { connect } from 'react-redux'
import TelephoneNumberSplitter from '../utils/TelephoneNumberSplitter'
import AccountCreationStatePayloadExtract from '../utils/account_creation_helpers/AccountCreationStatePayloadExtract'
import { api, basicAccountCreateUrl } from '../utils/backend_configuration/BackendConfig'
import { Navigate } from 'react-router-dom'
import TopBar from '../components/molecules/TopBar'
import StripeCustomerCreate from '../utils/account_creation_helpers/StripeCustomerCreate'
import { setStripeCustomerId } from '../store/Slices/StripeCustomerIdSlice'
import ServerNotAvailable from './ServerNotAvailable'

class AccountCreationPage extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      emailAddress: this.props.emailAddress,
      password: this.props.password,
      confirmedPassword: this.props.confirmedPassword,
      firstNameEmpty: false,
      lastNameEmpty: false,
      emailEmpty: false,
      emailAlreadyExists: false,
      somethingWentWrong: false,
      validEmail: true,
      passwordEmpty: false,
      passwordsMatch: true,
      passwordFormatIncorrect: false,
      goToPayment: false,
      errorCreateStripeCustomer: false,
      serverUnavailable: false
    }

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  firstNameGrabber (firstName) {
    this.setState({ firstName })
  }

  lastNameGrabber (lastName) {
    this.setState({ lastName })
  }

  userEmailGrabber (email) {
    this.setState({ emailAddress: email })
  }

  passwordGrabber (password) {
    this.setState({ password })
  }

  confirmedPasswordGrabber (password) {
    this.setState({ confirmedPassword: password })
  }

  errorCreateStripeCustomerGrabber (error) {
    this.setState({ errorCreateStripeCustomer: error })
  }

  goToPaymentGrabber (goToPayment) {
    this.setState({ goToPayment })
  }

  handleSubmit () {
    let handleSubmitProceed = true

    if (this.state.firstName === undefined) {
      handleSubmitProceed = false
      this.setState({ firstNameEmpty: true })
    } else {
      this.setState({ firstNameEmpty: false })
    }

    if (this.state.lastName === undefined) {
      handleSubmitProceed = false
      this.setState({ lastNameEmpty: true })
    } else {
      this.setState({ lastNameEmpty: false })
    }

    if (this.state.emailAddress === undefined) {
      handleSubmitProceed = false
      this.setState({ emailEmpty: true })
    } else {
      if (!validator.isEmail(this.state.emailAddress)) {
        handleSubmitProceed = false
        this.setState({ validEmail: false })
      } else {
        this.setState({ validEmail: true })
      }

      this.setState({ emailEmpty: false })
    }

    if (this.state.password === undefined) {
      handleSubmitProceed = false
      this.setState({ passwordEmpty: true })
    } else {
      if (!PasswordValidate(this.state.password, this.state.confirmedPassword)) {
        handleSubmitProceed = false
        this.setState({ passwordsMatch: false })
      } else {
        this.setState({ passwordsMatch: true })
      }

      if (!validator.isStrongPassword(this.state.password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      })) {
        handleSubmitProceed = false
        this.setState({ passwordFormatIncorrect: true })
      } else {
        this.setState({ passwordFormatIncorrect: false })
      }

      this.setState({ passwordEmpty: false })
    }

    if (handleSubmitProceed) {
      const accountCreationData = AccountCreationStatePayloadExtract(this)

      api.post(basicAccountCreateUrl, {
        accountCreationData
      }, {
        withCredentials: true
      }
      ).then(response => {
        if (response.data.operation_success) {
          this.props.setAccountData(accountCreationData)

          StripeCustomerCreate(accountCreationData, this.props.setStripeCustomerId,
            this.goToPaymentGrabber.bind(this), this.errorCreateStripeCustomerGrabber.bind(this))
        } else {
          console.log(response.data.error_message)
          if (response.data.error_message === 'The account associated with your email already exists') {
            this.setState({ emailAlreadyExists: true })
          } else if (response.data.error_message === 'Something went wrong, please try again later') {
            this.setState({ somethingWentWrong: true })
            this.setState({ emailAlreadyExists: false })
          }
        }
      }
      ).catch(error => {
        switch (error.response.status) {
          case 503:
            this.setState({ serverUnavailable: true })
            break
          case 502:
            this.setState({ serverUnavailable: true })
            break
          default:
            break
        }
      })
    }
  }

  render () {
    if (this.state.serverUnavailable) {
      return (
        <View style={styles.container}>
          <ServerNotAvailable />
        </View>
      )
    } else {
      if (!this.state.goToPayment) {
        return (
        <View style={styles.container}>
        <TopBar settingsEnabled={false} />
          <View style={styles.container}>
            <meta charset="utf-8" name="viewport" content="width=device-width, initial-scale=1.0" />
            <AccountBasicInfoInputView
              firstNameGrabber={this.firstNameGrabber.bind(this)}
              lastNameGrabber={this.lastNameGrabber.bind(this)}
              userEmailGrabber={this.userEmailGrabber.bind(this)}
              passwordGrabber={this.passwordGrabber.bind(this)}
              confirmedPasswordGrabber={this.confirmedPasswordGrabber.bind(this)}
              firstNameEmpty={this.state.firstNameEmpty}
              lastNameEmpty={this.state.lastNameEmpty}
              emailEmpty={this.state.emailEmpty}
              emailAlreadyExists={this.state.emailAlreadyExists}
              somethingWentWrong={this.state.somethingWentWrong}
              validEmail={this.state.validEmail}
              passwordsMatch={this.state.passwordsMatch}
              passwordFormatIncorrect={this.state.passwordFormatIncorrect}
              passwordEmpty={this.state.passwordEmpty}
            />
            <br></br>
            <TouchableOpacity style={styles.submitBtn} onPress={this.handleSubmit}>
              <Text>Next</Text>
            </TouchableOpacity>
            {this.state.errorCreateStripeCustomer &&
              <Text style={styles.errorText}>
                There was a processing error whilst creating your account.
                Please try again in a few moments.
              </Text>
            }
          </View>
        </View>
        )
      } else {
        return (
          <View>
            <meta charset="utf-8" name="viewport" content="width=device-width, initial-scale=1.0" />
            <Navigate to='/payment' />
          </View>
        )
      }
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setAccountData: (value) => dispatch(setAccountData(value)),
    setStripeCustomerId: (value) => dispatch(setStripeCustomerId(value))
  }
}
export default connect(null, mapDispatchToProps)(AccountCreationPage)
