import { debugSwitchedOn, timeTowardsAutoLogoutInSecondsProd, timeTowardsAutoLogoutInSecondsDebug } from "../debug_switch/DebugSwitch"

let intermediaryTime
const oneSecondInMilliseconds = 1000

if (debugSwitchedOn) {
  intermediaryTime = timeTowardsAutoLogoutInSecondsDebug * oneSecondInMilliseconds
} else {
  intermediaryTime = timeTowardsAutoLogoutInSecondsProd * oneSecondInMilliseconds
}

export const timeTowardsAutoLogout = intermediaryTime
