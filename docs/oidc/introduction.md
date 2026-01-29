# Introduction

This document provides Relying Parties (RPs) with technical guidance and best practices for integrating Mobile ID OpenID Provider (MobileID OP) into their applications.

The MobileID OP can be used for both authorization and authentication. It fully complies with the OpenID Connect specification.

::: info OpenID Connect
OpenID Connect is a simple identity layer on top of the OAuth 2.0 protocol. It allows clients to verify the identity of the End-User based on the authentication performed by an Authorization Server, as well as to obtain basic profile information about the End-User in an interoperable and REST-like manner.

OpenID Connect allows clients of all types, including Web-based, mobile, and JavaScript clients, to request and receive information about authenticated sessions and end-users. The specification suite is extensible, allowing participants to use optional features such as encryption of identity data, discovery of OpenID Providers, and session management, when it makes sense for them.

See https://openid.net/connect/faq/ for a set of answers to Frequently Asked Questions.
:::

The Mobile ID solution protects access to your company data and applications with a comprehensive end-to-end solution for a strong multi-factor authentication (MFA). Please visit https://mobileid.ch for further information. Do not hesitate to contact us in case of any questions.


## Basic Key Concepts – Terminology

The most basic key concepts are as follows.

- **End-User** is the entity that wants to assert a particular identity, the Mobile ID User (a human being).
- **User-Agent** is the program (such as a browser) used by the End-User to communicate with the Relying Party and OpenID Connect Provider.
- **Relying Party (RP)** is our customer’s web site or client application that wants to verify the End-User's identifier. It outsources its user authentication function to an OpenID Connect Provider. It can request claims (e.g., user information) about that End-User.
- **OpenID Connect Provider (OP)** is an authorization server that offers authentication as a service and providing claims to a Relying Party about the authentication event and the End-User.
- **Scopes** are identifiers used to specify what access privileges are being requested.
- **Claims** are simply key & value pairs that contain information about an End-User, as well meta-information about the authentication event. Non-standard claims can be specified as custom claims.
- **Access Token** are credentials used to access protected resources directly. Access tokens usually have an expiration date and are short-lived. They must be kept secret, though security considerations are less strict due to their shorter life.
- **ID Token** is an identity token provided by the OpenID Provider to the Relying Party. The identity token contains a number of claims about that End-User and also attributes about the End-User authentication event, in a standard JWT1 format and signed by the OpenID Provider (so it can be verified by the intended recipients). It may optionally be encrypted for confidentiality.
- **Refresh Token** carries the information necessary to get a new access token. Refresh tokens can also expire but are rather long-lived.

## Authorization Code Grant Flow

Mobile ID utilizes the Authorization Code Grant Type to obtain an access token to grant application to retrieve user data after authenticating. The Authorization Code Flow, in abstract, follows the following steps:

![auth-code-grant-flow](/img/auth-code-grant-flow.png)


1. An End-User requests access to a protected resource of the Relying Party. For example, the End-User clicks on a sign-in button or launches an app. The Relying Party redirects the User-Agent to the Mobile ID Authorization Endpoint at `https://m.mobileid.ch`.
2. The Mobile ID Authorization Server authenticates the End-User (using an appropriate Mobile ID authentication method) and establishes whether the End-User grants or denies the Relying Party Client’s access request. Including access to extra user information that might have been requested in the scope of the authentication request sent by the Relying Party.
3. The Mobile ID Authorization Server redirects the User-Agent back to the Relying Party's web site or application using the redirection URI provided earlier in step 1. The redirection URI includes an Authorization code that is valid for a few minutes.
4. Relying Party requests an Access Token from the Mobile ID Token Endpoint by including the Authorization code received in the previous step. When making the request, the Relying Party authenticates with the Mobile ID server. The client includes the redirection URI used to obtain the authorization code for verification.
5. The Mobile ID server authenticates the client, validates the authorization code, and ensures that the redirection URI received matches the URI used to redirect the client in step 3. On success, the Mobile ID server will return a JSON object with the ID Token and an Access Token, and an optional Refresh Token.
6. Optional: Relying Party requests additional, consented user information (claims). The user info endpoint returns previously consented user profile information to the client. A valid access token is required for that.
7. Relying Party grants or denies access to the requested service and the user is logged in.

## Refresh Token

Because Access Tokens are always short-lived (see [Section Tokens](/oidc/getting-started#tokens)), a Relying Party may want to refresh the Access Token using their long-lived Refresh Token. To refresh an Access Token, the Client must always authenticate at the Token Endpoint. The Relying Party should always validate the Refresh Response.

![refresh-token](/img/refresh-token.png)

Note that a Relying Party must be authorized to use a Refresh Token.
