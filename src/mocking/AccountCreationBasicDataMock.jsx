
function AccountCreationBasicDataMock (instance) {
  instance.state.firstName = 'Potato'
  instance.state.lastName = 'Salad'
  instance.state.emailAddress = 'potato@salad.com'
  instance.state.password = 'Pass123@&'
  instance.state.confirmedPassword = 'Pass123@&'
}

export default AccountCreationBasicDataMock
