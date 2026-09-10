import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import {
  inject,
  Injectable,
} from '@angular/core';
import {
  APP_CONFIG,
  AppConfig,
} from '@dspace/config/app-config.interface';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

/**
 * Response returned when initiating MFA setup.
 * Contains the TOTP secret and a provisioning URI for QR code generation.
 */
export interface MfaSetupResponse {
  /** The base32-encoded TOTP secret key for manual entry. */
  secret: string;
  /** The `otpauth://` URI used to generate a QR code for authenticator apps. */
  provisioningUri: string;
}

/**
 * Response returned after successfully verifying TOTP setup.
 * Contains one-time recovery codes the user must store securely.
 */
export interface MfaVerifySetupResponse {
  /** List of one-time recovery codes for account access if the authenticator is unavailable. */
  recoveryCodes: string[];
}

/**
 * Response describing the current MFA status for the authenticated user.
 */
export interface MfaStatusResponse {
  /** Whether MFA is currently enabled for the user's account. */
  enabled: boolean;
  /** Number of unused recovery codes remaining. */
  remainingRecoveryCodes: number;
}

/**
 * Response returned from the MFA verify endpoint during login.
 */
export interface MfaVerifyResponse {
  /** Status string indicating the result of verification (e.g., "success"). */
  status: string;
}

/**
 * Service for Multi-Factor Authentication HTTP operations.
 *
 * Provides methods for the full MFA lifecycle:
 * - Checking MFA status
 * - Setting up TOTP (generating secret + QR code)
 * - Verifying TOTP codes (both during setup and login)
 * - Disabling MFA
 * - Regenerating recovery codes
 *
 * All endpoints communicate with the DSpace REST API at `/api/authn/mfa/*`.
 */
@Injectable({ providedIn: 'root' })
export class MfaService {
  /** Application configuration injected via DI token. */
  private readonly appConfig: AppConfig = inject(APP_CONFIG);

  /**
   * @param http - Angular HTTP client for making requests
   * @param authService - Authentication service used to retrieve the current token
   */
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  /**
   * Base URL for all MFA API endpoints.
   * @returns The fully-qualified URL to the MFA REST resource
   */
  private get baseUrl(): string {
    return `${this.appConfig.rest.baseUrl}/api/authn/mfa`;
  }

  /**
   * Constructs authorization headers using the current user's access token.
   * @returns An object containing HttpHeaders with the Bearer token set
   */
  private get authHeaders(): { headers: HttpHeaders } {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token.accessToken}`);
    }
    return { headers };
  }

  /**
   * Retrieves the current MFA status for the authenticated user.
   * @returns Observable emitting the MFA status (enabled state and remaining recovery codes)
   */
  getStatus(): Observable<MfaStatusResponse> {
    return this.http.get<MfaStatusResponse>(`${this.baseUrl}/status`, this.authHeaders);
  }

  /**
   * Initiates MFA setup by requesting a new TOTP secret from the server.
   * @returns Observable emitting the setup response with secret and provisioning URI
   */
  setup(): Observable<MfaSetupResponse> {
    return this.http.post<MfaSetupResponse>(`${this.baseUrl}/setup`, {}, this.authHeaders);
  }

  /**
   * Confirms MFA setup by verifying the user can generate a valid TOTP code.
   * On success, MFA becomes active and recovery codes are returned.
   *
   * @param code - The 6-digit TOTP code from the user's authenticator app
   * @returns Observable emitting recovery codes that the user should save
   */
  verifySetup(code: string): Observable<MfaVerifySetupResponse> {
    return this.http.post<MfaVerifySetupResponse>(`${this.baseUrl}/verify-setup`, { code }, this.authHeaders);
  }

  /**
   * Verifies an MFA code during the login flow.
   * Uses the MFA-pending token (not the normal auth token) for authorization.
   *
   * The full HTTP response is returned so callers can extract the new
   * fully-verified JWT from the `Authorization` header.
   *
   * @param code - The 6-digit TOTP code (mutually exclusive with recoveryCode)
   * @param recoveryCode - A one-time recovery code (mutually exclusive with code)
   * @param pendingToken - The MFA-pending JWT issued after password authentication
   * @returns Observable emitting the full HTTP response including headers
   */
  verify(code?: string, recoveryCode?: string, pendingToken?: string): Observable<HttpResponse<MfaVerifyResponse>> {
    const body: any = {};
    if (code) {
      body.code = code;
    }
    if (recoveryCode) {
      body.recoveryCode = recoveryCode;
    }
    let headers = new HttpHeaders();
    if (pendingToken) {
      headers = headers.set('Authorization', `Bearer ${pendingToken}`);
    }
    return this.http.post<MfaVerifyResponse>(`${this.baseUrl}/verify`, body, { headers, observe: 'response' });
  }

  /**
   * Disables MFA for the authenticated user.
   * Requires a valid TOTP code to confirm the user has access to their authenticator.
   *
   * @param code - The 6-digit TOTP code confirming the user's identity
   * @returns Observable that completes when MFA is successfully disabled
   */
  disable(code: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/disable`, { code }, this.authHeaders);
  }

  /**
   * Regenerates recovery codes for the authenticated user.
   * Invalidates all previously issued recovery codes.
   * Requires a valid TOTP code to confirm the user's identity.
   *
   * @param code - The 6-digit TOTP code confirming the user's identity
   * @returns Observable emitting the new set of recovery codes
   */
  regenerateRecoveryCodes(code: string): Observable<MfaVerifySetupResponse> {
    return this.http.post<MfaVerifySetupResponse>(`${this.baseUrl}/recovery-codes`, { code }, this.authHeaders);
  }
}
