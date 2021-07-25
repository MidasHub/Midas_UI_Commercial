/**
 * Credentials model.
 */
export interface Credentials {
  officeHierarchy: string;
  appSettingModule: any;
  accessToken?: string;
  authenticated: boolean;
  base64EncodedAuthenticationKey?: string;
  isTwoFactorAuthenticationRequired?: boolean;
  officeId: number;
  officeName: string;
  staffId?: number;
  staffDisplayName?: string;
  organizationalRole?: any;
  permissions: string[];
  roles: any;
  userId: number;
  username: string;
  shouldRenewPassword: boolean;
  rememberMe?: boolean;
}
