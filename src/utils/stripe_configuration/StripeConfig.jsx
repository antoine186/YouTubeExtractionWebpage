import { debugSwitchedOn, stripePublicKeyProd, stripePublicKeyDebug, basicSubscriptionPriceIdProd, basicSubscriptionPriceIdDebug } from "../debug_switch/DebugSwitch"

let intermediaryStripeKey
let intermediarySubscriptionPriceId

if (debugSwitchedOn) {
  intermediaryStripeKey = stripePublicKeyDebug
  intermediarySubscriptionPriceId = basicSubscriptionPriceIdDebug
} else {
  intermediaryStripeKey = stripePublicKeyProd
  intermediarySubscriptionPriceId = basicSubscriptionPriceIdProd
}

export const stripePublicKey = intermediaryStripeKey
export const basicSubscriptionPriceId = intermediarySubscriptionPriceId
