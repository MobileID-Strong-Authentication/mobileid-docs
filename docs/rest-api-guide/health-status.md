# Health Status Service

The Mobile ID Health Status Service is a microservice where you can retrieve health state details about the MobileID authentication service. The health state is based on real end-to-end authentication tests that are checked every few minutes. It's free of charge!

For more information, please visit https://digital.swisscom.com/products/mobile-id

## Active Probing

Retrieve a detailed health state about the Mobile ID authentication service. The scope of the health status service includes different telecommunications providers, IP+ and LAN-i endpoints and the geofencing service.

The health status service is free of charge!

## Real End-To-End Testing

Our health status is based on real end-to-end Mobile ID tests that are responded by special robotic equipment at different physical locations.

## MobileID Telecommunications Providers

Checks include Mobile ID SIM cards from Swisscom, Sunrise, Salt.

## MobileID App

Checks include the Mobile ID mobile application.

## Health Status Levels

Each test objective will have one of three possible status levels:

- **SUCCESS**
  All tests of that objective (e.g. Operator "Swisscom) are currently successful.

- **WARNING**
  Some (but not all) tests of that objective failed for 1 or more times in a row. However, some tests of that objective are still working fine.

- **ERROR**
  All tests of that objective failed. Mobile ID operation team has been alerted to check the system.
