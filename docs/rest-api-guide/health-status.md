# Health Status Service

The Mobile ID Health Status Service is a microservice for retrieving health state details about the MobileID authentication service.

- **Based on**: Real end-to-end authentication tests, checked every few minutes
- **Scope**: Different telecommunications providers, IP+ and LAN-i endpoints, and the geofencing service
- **Cost**: Free of charge

For more information, please visit https://digital.swisscom.com/products/mobile-id

## What is Monitored

- **Telecommunications Providers**: Mobile ID SIM cards from Swisscom, Sunrise, Salt
- **Mobile ID App**: The Mobile ID mobile application
- **End-to-end tests**: Real Mobile ID tests responded by special robotic equipment at different physical locations

## Health Status Levels

Each test objective will have one of three possible status levels:

- **SUCCESS**
  All tests of that objective (e.g. Operator "Swisscom) are currently successful.

- **WARNING**
  Some (but not all) tests of that objective failed for 1 or more times in a row. However, some tests of that objective are still working fine.

- **ERROR**
  All tests of that objective failed. Mobile ID operation team has been alerted to check the system.
