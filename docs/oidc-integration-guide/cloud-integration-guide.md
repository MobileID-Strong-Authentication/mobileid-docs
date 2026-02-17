# Public Cloud Integration Guide

This chapter covers a few Mobile ID integration scenario examples with popular public cloud services.

## Microsoft Azure AD B2C

Azure Active Directory B2C is a Single-Sign-On (SSO) solution for any API, web, or mobile application. It enables any organization to provide their users with access using identities they already have, such as Mobile ID.

::: info
Mobile ID is officially supported by Microsoft Azure and the setup is described on their [official article](https://learn.microsoft.com/en-us/azure/active-directory-b2c/identity-provider-generic-openid-connect).
:::

Microsoft will act as the secure front door to any of these applications and they will worry about the safety and scalability of the authentication platform. Azure will handle things like denial of service or brute force attacks, so that organizations can focus on their core business and stay out of the identity business.

## Amazon Cognito

Amazon Cognito lets you add user sign-up, sign-in, and access control to your web and mobile apps quickly and easily. Amazon Cognito scales to millions of users and supports sign-in with social identity providers, such as Apple, Facebook, Google, and Amazon, and enterprise identity providers via SAML 2.0 and OpenID Connect.

::: tip
This [article](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-oidc-idp.html) explains how to integrate user sign-in with an OpenID Connect IdP such as Mobile ID.
:::

![amazon-cognito-config](/img/amazon-cognito-config.png)
