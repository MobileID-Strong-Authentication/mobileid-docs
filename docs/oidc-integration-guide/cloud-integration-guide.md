# Public Cloud Integration

This chapter covers a few Mobile ID integration scenario examples with popular public cloud services.

## Microsoft Entra ID

[MobileID](https://www.swisscom.ch/mid) integrates with Microsoft Entra ID as an external authentication method, enabling Multi-Factor-Authentication (MFA) for Entra ID logon. MobileID provides seamless inline user enrolment, self-service device management, and supports a range of authentication methods, including highly secure crypto-SIM tokens and app-based push authentication for iOS and Android, with advanced options such as Number Matching and Geofencing.

In 2020, Microsoft announced plans to replace custom controls with a new method for integrating third-party authentication. MobileID has been working closely with Microsoft to deliver an authentication solution for their new Microsoft External Authentication Methods (EAM) framework, available from May 2024.

MobileID via EAM is fully recognized as a multifactor authentication method within Entra ID, meeting MFA policy requirements. Once MobileID is defined as an EAM provider, you can create Entra ID conditional access policies with MFA using MobileID and assign these to specific users, groups, or applications.

::: info
For more information, check out the [EAM public preview on the Microsoft blog](https://techcommunity.microsoft.com/t5/microsoft-entra-blog/public-preview-external-authentication-methods-in-microsoft/ba-p/4078808). Mobile ID for Entra ID External Authentication Methods is a [Microsoft Early Access feature](https://learn.microsoft.com/en-us/entra/fundamentals/licensing-preview-info).
:::

### Sign-in Flow

![entraid-sign-in-flow](/img/entraid-sign-in-flow.png)

### Known Limitations

- Users must specifically select the MobileID EAM option during authentication. If they have other MFA methods configured besides MobileID, they may need to click "Other options" on the Microsoft "Verify your identity" prompt in order to choose MobileID. Microsoft plans to introduce system-preferred defaults for EAM in the future, which will automatically prioritize the default method displayed during authentication.
- EAM currently does not support logins for external guest users.
- Cross-tenant user authentication with the MobileID EAM has limitations. It will only work if:
  - The external Microsoft Entra organization trusts MFA claims from the user's home tenant.
  - The user has already established a valid MFA claim by authenticating to an application within their home tenant before accessing the cross-tenant application.
- Azure Government does not yet support Entra ID external authentication methods. Be sure to review Microsoft Entra feature availability for Azure Government. The "Microsoft Entra ID: External Authentication Methods" application is not accessible under MobileID Federal plans.

### Prerequisites

To use MobileID MFA with Microsoft Entra ID, you'll need the following:

- Before you can integrate and use MobileID EAM, the client onboarding process must have been completed by Swisscom. You will need the following information from Swisscom to be able to create an EAM:
  - An **Application ID** is generally a multitenant application from your provider, which is used as part of the integration. You need to provide admin consent for this application in your tenant.
  - A **Client ID** is an identifier from your provider used as part of the authentication integration to identify Microsoft Entra ID requesting authentication.
  - A **Discovery URL** is the OpenID Connect (OIDC) discovery endpoint for the external authentication provider.

::: tip
If you did not receive this information, it means that your onboarding process is not finished yet. Please check the state with your commercial contact or via **Backoffice.Security@swisscom.com**.
:::

- An active [Entra ID P1 or P2](https://azure.microsoft.com/en-us/pricing/details/active-directory/) subscription with Conditional Access enabled, and P1/P2 licenses assigned to each user who will log in using MobileID MFA. Plans like Microsoft 365 E3, E5, and F3, as well as Enterprise Mobility + Security E3 and E5, and Microsoft Business Premium, all include Entra ID Premium.
- A designated Entra ID admin service account to authorize the MobileID application access. This account requires the Entra ID Global Administrator or Privileged Role Administrator role during the MobileID setup process, though you can reduce the service account's role privileges afterward.

### Configure Entra ID

Follow these steps to configure MobileID as an external authentication method in Microsoft Entra ID:

| Step | Description |
|------|-------------|
| 1 | **Log in to Entra ID** <br><br> Go to the [Microsoft Entra admin center](https://entra.microsoft.com) and log in to your Entra ID tenant as a global administrator. <br><br> If you're using the [Azure portal](https://portal.azure.com), the navigation will differ slightly. |
| 2 | **Navigate to Policies** <br><br> In the Entra Admin Center, go to **Protection → Authentication Methods → Policies**. <br><br> If you're logged into the Azure portal instead, first select Microsoft Entra ID, then go to **Security → Authentication Methods → Policies**. |
| 3 | **Add External Method** <br><br> Click **+ Add External Method**. <br><br> ![entraid-add-external-method](/img/entraid-add-external-method.png) |
| 4 | **Configure the External Method** <br><br> On the "Add external method" page, enter a descriptive name for the MobileID method. The default name might be "Mobile ID" but you can choose a name that will make sense to your users since they'll see this during authentication. <br><br> **Note:** You cannot change the name after creation. <br><br> Enter the information you have received from Swisscom in the corresponding field: **Client ID**, **Discovery Endpoint**, **App ID**. <br><br> ![entraid-configure-external-method](/img/entraid-configure-external-method.png) |
| 5 | **Enable the Method** <br><br> If you want to enable MobileID MFA right away, toggle Enable from "Off" to "On". |
| 6 | **Specify Users** <br><br> Before saving the new MobileID external method, decide which users should have access to it. <br><br> By default, it will apply to all users, meaning any Entra ID user with a Conditional Access Policy requiring multifactor authentication (MFA) will see MobileID as an option. <br><br> To apply it to specific users, click **+ Add Target** under the "Include" tab and choose **Select Targets**. On the "Add directory members" page, select one or more Entra ID directory groups that contain the users you want to target for MobileID authentication, then click **Select**. |
| 7 | **Save the Configuration** <br><br> After entering all the required details, click **Save** to create the new MobileID external method. |
| 8 | **Grant Admin Consent** <br><br> If the "Request admin consent" information shows a **Request permission** button instead of saying "Admin consent granted", click the Request permission button to authorize the MobileID Authentication Method application, making sure to check the box next to **Consent on behalf of your organization** before clicking **Accept**. <br><br> <img src="/img/entraid-grant-admin-consent.png" alt="entraid-grant-admin-consent" width="350"> <br><br> You can verify the permissions if you go to **Identity → Applications → Enterprise applications** and select the MobileID Application, then select **Permissions**. The list of permissions that have been granted for your organization should be shown and it should look similar to this example below: <br><br> ![entraid-admin-consent-permissions](/img/entraid-admin-consent-permissions.png) |

### Create and Apply a Conditional Access Policy

| Step | Description |
|------|-------------|
| 1 | **Log in to Entra ID** <br><br> Go to the [Microsoft Entra admin center](https://entra.microsoft.com) and log in to your Entra ID tenant as a global administrator. <br><br> If you're using the [Azure portal](https://portal.azure.com), the navigation will differ slightly. |
| 2 | **Navigate to Conditional Access** <br><br> Click on **Conditional Access** in the left-hand menu, then click **+ Create New Policy**. <br><br> If you are in the Azure portal, navigate to **Security → Conditional Access → Policies**. <br><br> ![entraid-conditional-access](/img/entraid-conditional-access.png) |
| 3 | **Name the Policy** <br><br> Enter a descriptive name for the new policy, such as "MobileID MFA for Acme Users". |
| 4 | **Assign the Policy** <br><br> You can assign this policy to specific users or groups, Entra ID cloud apps, or other conditions like client platforms or networks. <br><br> *Example for assigning to users:* Click **Users** under "Assignments", then select **Users and groups** on the "Include" tab. Choose **Users and groups** and click **0 users and groups selected** to locate the users or Entra ID security groups for whom you want to enforce MobileID MFA. Select the users or groups, then click **Select** to apply your choices. <br><br> If you targeted specific groups when creating the MobileID external method, ensure that you apply this new policy to the same groups. <br><br> *Example for assigning to resources:* Click **Target resources**. On the "Include" tab, select **Apps**, and choose the Entra ID applications where you want MobileID MFA to be applied. |
| 5 | **Configure Access Controls** <br><br> Click **Grant** under "Access controls", select **Grant access**, and check the box for **Require multifactor authentication**. Click **Select** when done. <br><br> ![entraid-access-controls](/img/entraid-access-controls.png) |
| 6 | **Enable the Policy** <br><br> The final step is to enable the new MobileID conditional access policy. Click the "On" toggle switch under "Enable policy", then click **Create**. The policy will be created and applied to your selected groups or users, enforcing MFA via MobileID. |

::: warning
Avoid assigning the MobileID policy to all users or all cloud apps at the start, especially for tenant administrators, to prevent potential admin lockouts. Always test the policy with selected users first. Additionally, ensure you create a fail-safe Entra ID administrator account that is excluded from MobileID MFA policies to maintain uninterrupted access. Secure this account with a strong password and a different access condition, such as one based on a trusted network.
:::

### Additional Configuration to Prioritize MobileID MFA

If you want users to exclusively use MobileID instead of the Microsoft Authenticator app, follow these steps:

| Step | Description |
|------|-------------|
| 1 | **Disable the Microsoft Authenticator Registration Campaign** <br><br> In the Entra ID admin center, go to **Protection → Authentication Methods → Registration Campaign**. <br><br> Click **Edit**, change the State to **Disabled**, and click **Save**. <br><br> Alternatively, you can leave the registration campaign enabled and exclude the groups of users who are covered by the MobileID conditional access policy. |
| 2 | **Disable System Preferred MFA for Microsoft Authenticator** <br><br> Go to **Protection → Authentication Methods → Settings → System Preferred Multifactor Authentication**. <br><br> Click **Edit**, change the State to **Disabled**, and click **Save**. |
| 3 | **Turn Off Microsoft Authenticator** <br><br> Navigate to **Protection → Policies**, click **Microsoft Authenticator**. <br><br> On the "Enable and Target" tab, toggle the Enable switch to **Off** and click **Save**. |

### Test Your Setup

Log in to Entra ID using a user account that has been assigned the Conditional Access policy requiring MFA and is a target for the newly created MobileID external method.

If you applied the MobileID Conditional Access policy to "All cloud apps", when you log into the Office portal (e.g., [https://office.com](https://office.com)) and submit your primary Entra ID credentials, you'll see your MobileID external authentication method as an option for identity verification. The name displayed will be the one you entered when setting up the MobileID external method in Entra ID.

<img src="/img/entraid-verify-identity.png" alt="entraid-verify-identity" width="500">

Choose the "Mobile ID" method to begin MobileID MFA authentication.

If you have multiple Entra ID authentication methods enabled, you may need to click "Other options" to view and select the MobileID method.

<img src="/img/entraid-other-options.png" alt="entraid-other-options" width="500">

You will be redirected to the MobileID prompt or user enrolment, depending on your configuration.

Once you complete the MobileID authentication, you'll return to Entra ID to finish logging in to the application.

<img src="/img/entraid-authentication-complete.png" alt="entraid-authentication-complete" width="500">

If your Conditional Access policy requiring MFA is only applied to specific applications, the initial login to the Office portal will not prompt for MobileID MFA. However, accessing the protected application within the Office portal or directly will trigger the MobileID MFA prompt.

::: warning
If you encounter the "Looks like something went wrong" error from Microsoft, the new EAM settings might need additional time to propagate. If the error persists, you may request support from Swisscom.
:::

### Troubleshooting

Need some help? Please ask your commercial contact or get in touch with **Backoffice.Security@swisscom.com** to ask for support.

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

<img src="/img/amazon-cognito-config.png" alt="amazon-cognito-config" width="450">
