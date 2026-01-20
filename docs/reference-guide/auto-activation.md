# Auto Activation
## Introduction
Auto Activation is an optional feature for APs, which can greatly improve the user experience for Mobile ID SIM authentications. It is applicable for SIM authentication only and this Auto Activation feature is not relevant for Mobile ID App authentications.

Usually, a brand new Mobile ID SIM card must be activated just once on the MyMobileID Portal. With this Mobile ID activation process, the user can set his personal Mobile ID PIN (Set & Confirm PIN) and it will create the required signing key on the SIM card. After that, the SIM card is ready to be used for Mobile ID authentications.

Auto Activation is an optional feature that is disabled by default but can be enabled per Application Provider. If enabled, a Signature Request to a user with an inactive Mobile ID SIM (which means the user did not yet set his personal Mobile ID PIN) will invoke an implicit activation process during the on-going signature transaction.

So, the Auto Activation will achieve both a successful Mobile ID activation and a successful authentication (Signature Response) at the same time! From now on, that user will be Mobile ID active.

From AP perspective, the user will just have a successful authentication and there is no difference whether the user was auto-activated (during the authentication transaction) or not.

Auto Activation feature can successfully prevent a fault sub-code 404 (this fault code means that the user did not yet activate his Mobile ID SIM card) which can happen when an AP attempts to do a Mobile ID authentication with a user that has an inactive Mobile ID SIM card.

## How to implement this feature
To enable the Auto Activation feature for an Application Provider (AP), the AP must ensure that the user has accepted the Mobile ID specific terms & conditions prior to proceed with the auto activation steps.

An AP may use the Profile Query Extensions (see [Section MSS Profile Query](/reference-guide/mobile-id-api.html#mss-profile-query)) to know if a signature request to a user will invoke auto activation or not. However, an AP does not necessarily need to know that.

Please speak to your Swisscom contact if you wish to get this feature enabled for your AP account. Op-tionally we can also setup specific test SIM cards, which allows an AP to test this feature (because those test SIM cards will be configured to always trigger the auto activation).


## User Perspective
From a user perspective, the steps displayed on the mobile device look very similar, if you compare the signature process of an active Mobile ID SIM vs. the process of an inactive Mobile ID SIM.

Note that in case of a successful auto activation, the Mobile ID server sends a Text SMS to the user, to remind the user to create a Mobile ID recovery code [<sup id="a24">24</sup>](#24).

**References**

**Footnotes**

24. <span id="24"></span> Each time a user completes the Mobile ID activation process, she or he will receive a code that enables her or him to recover Mobile ID and maintain her or his existing pairings to service providers, if you lose your phone, change SIM cards or switch to an e-SIM card. See https://mobileid.ch/recovery [↩](#a17)




