# AuthApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**authControllerCompleteRegistration**](AuthApi.md#authcontrollercompleteregistration) | **POST** /auth/complete-registration | Create the tenant and activate a plan (step 2 of 2) |
| [**authControllerConfirmLoginCode**](AuthApi.md#authcontrollerconfirmlogincode) | **POST** /auth/confirm-login-code | Confirm the code from POST /auth/verify-login-code |
| [**authControllerRegister**](AuthApi.md#authcontrollerregister) | **POST** /auth/register | Create a Supabase Auth account (step 1 of 2) |
| [**authControllerVerifyLoginCode**](AuthApi.md#authcontrollerverifylogincode) | **POST** /auth/verify-login-code | Send an email verification code to unlock a locked account |



## authControllerCompleteRegistration

> CompleteRegistrationResponseDto authControllerCompleteRegistration(completeRegistrationDto)

Create the tenant and activate a plan (step 2 of 2)

Requires the access_token from POST /auth/register (or any valid token for a user without a tenant yet). Persists the terms_accepted_at/termsVersion that were captured in step one (carried in this token\&#39;s app_metadata claim, not resent in this body — see CLAUDE.md), creates the tenant (owned by the calling user), activates planId immediately (no payment gate in this beta phase), and stamps trial_started_at. The response\&#39;s requiresNewToken always being true is the important part for the frontend: the JWT used to call this endpoint keeps tenant_id absent even after this succeeds — request a new one (refresh-token grant or re-login) before relying on that claim.

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { AuthControllerCompleteRegistrationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AuthApi(config);

  const body = {
    // CompleteRegistrationDto
    completeRegistrationDto: ...,
  } satisfies AuthControllerCompleteRegistrationRequest;

  try {
    const data = await api.authControllerCompleteRegistration(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **completeRegistrationDto** | [CompleteRegistrationDto](CompleteRegistrationDto.md) |  | |

### Return type

[**CompleteRegistrationResponseDto**](CompleteRegistrationResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |
| **400** | termsAccepted was not true, or termsVersion does not match the version the backend currently recognizes as current  The request body failed validation (missing field, wrong type, disallowed value, ...). &#x60;fields&#x60; details each violation: &#x60;field&#x60; is the property name (dot-path if nested), &#x60;code&#x60; a stable identifier of the error type — see FieldErrorCode in src/common/errors/field-error-codes.ts. |  -  |
| **401** | The JWT is missing, invalid, or expired |  -  |
| **404** | planId does not match any existing plan |  -  |
| **409** | The authenticated user already has a tenant — this endpoint is only for finishing an in-progress signup |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## authControllerConfirmLoginCode

> ConfirmLoginCodeResponseDto authControllerConfirmLoginCode(confirmLoginCodeDto)

Confirm the code from POST /auth/verify-login-code

Verifies the code against Supabase Auth (POST /auth/v1/verify, type&#x3D;email) and, if valid, clears the account\&#39;s failed-login lock (mixziapp.login_attempts.failed_count -&gt; 0) so the next password attempt is no longer rejected. A valid code IS a real Supabase Auth sign-in under the hood, so the response is a full session — the client can use it directly instead of being forced to retry the password login a second time.

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { AuthControllerConfirmLoginCodeRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthApi();

  const body = {
    // ConfirmLoginCodeDto
    confirmLoginCodeDto: ...,
  } satisfies AuthControllerConfirmLoginCodeRequest;

  try {
    const data = await api.authControllerConfirmLoginCode(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **confirmLoginCodeDto** | [ConfirmLoginCodeDto](ConfirmLoginCodeDto.md) |  | |

### Return type

[**ConfirmLoginCodeResponseDto**](ConfirmLoginCodeResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |
| **400** | The code is wrong, expired, or does not match this email  The request body failed validation (missing field, wrong type, disallowed value, ...). &#x60;fields&#x60; details each violation: &#x60;field&#x60; is the property name (dot-path if nested), &#x60;code&#x60; a stable identifier of the error type — see FieldErrorCode in src/common/errors/field-error-codes.ts. |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## authControllerRegister

> RegisterResponseDto authControllerRegister(registerDto)

Create a Supabase Auth account (step 1 of 2)

Creates the Auth user only — no tenant, no user_profiles row yet. Returns a session (access/refresh token) exactly like a normal login. The returned access_token has no tenant_id claim; call POST /auth/complete-registration next, then obtain a NEW token (see that endpoint) before the claim appears. termsAccepted/termsVersion are required here (this is where the UI shows the checkbox — personal data starts being processed at this step) but aren\&#39;t persisted until complete-registration, since user_profiles doesn\&#39;t exist yet; they travel via the JWT\&#39;s app_metadata claim in the meantime (not user_metadata — that\&#39;s user-editable and unsuitable for evidence, see CLAUDE.md).

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { AuthControllerRegisterRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthApi();

  const body = {
    // RegisterDto
    registerDto: ...,
  } satisfies AuthControllerRegisterRequest;

  try {
    const data = await api.authControllerRegister(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **registerDto** | [RegisterDto](RegisterDto.md) |  | |

### Return type

[**RegisterResponseDto**](RegisterResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |
| **400** | termsAccepted was not true, or termsVersion does not match the version the backend currently recognizes as current  The request body failed validation (missing field, wrong type, disallowed value, ...). &#x60;fields&#x60; details each violation: &#x60;field&#x60; is the property name (dot-path if nested), &#x60;code&#x60; a stable identifier of the error type — see FieldErrorCode in src/common/errors/field-error-codes.ts. |  -  |
| **409** | An account with this email already exists |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## authControllerVerifyLoginCode

> authControllerVerifyLoginCode(verifyLoginCodeDto)

Send an email verification code to unlock a locked account

Call this after a login attempt fails with GoTrue\&#39;s ACCOUNT_LOCKED_VERIFY_EMAIL message (5 consecutive failed password attempts — see CLAUDE.md\&#39;s Password Verification Attempt Hook design note). Triggers Supabase Auth\&#39;s own Email OTP send (POST /auth/v1/otp under the hood) using the mailer already configured for the project. Always responds 200 with an empty body, whether or not the email belongs to a real account — this endpoint never confirms or denies that.

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { AuthControllerVerifyLoginCodeRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthApi();

  const body = {
    // VerifyLoginCodeDto
    verifyLoginCodeDto: ...,
  } satisfies AuthControllerVerifyLoginCodeRequest;

  try {
    const data = await api.authControllerVerifyLoginCode(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **verifyLoginCodeDto** | [VerifyLoginCodeDto](VerifyLoginCodeDto.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Always returned, regardless of outcome |  -  |
| **400** | The request body failed validation (missing field, wrong type, disallowed value, ...). &#x60;fields&#x60; details each violation: &#x60;field&#x60; is the property name (dot-path if nested), &#x60;code&#x60; a stable identifier of the error type — see FieldErrorCode in src/common/errors/field-error-codes.ts. |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

