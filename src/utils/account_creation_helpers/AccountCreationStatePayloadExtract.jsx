
function AccountCreationStatePayloadExtract (instance) {
  const payload = {
    firstName: instance.state.firstName,
    lastName: instance.state.lastName,
    emailAddress: instance.state.emailAddress,
    password: instance.state.password
  }

  return payload
}

export default AccountCreationStatePayloadExtract
