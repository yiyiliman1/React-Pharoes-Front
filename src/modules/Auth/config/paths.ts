export enum AuthRelativePaths {
  Signin = 'signin',
  SigninCallback = 'signin/callback',
  Logout = 'logout',
}

export const AuthPaths = {
  Signin: `/auth/${AuthRelativePaths.Signin}`,
  SigninCallback: `/auth/${AuthRelativePaths.SigninCallback}`,
  Logout: `/auth/${AuthRelativePaths.Logout}`,
}