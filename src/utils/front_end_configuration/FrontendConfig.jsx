import { debugSwitchedOn } from '../debug_switch/DebugSwitch'

let intermediaryBool

if (debugSwitchedOn) {
  intermediaryBool = true
} else {
  intermediaryBool = false
}

export const testingLocally = intermediaryBool
