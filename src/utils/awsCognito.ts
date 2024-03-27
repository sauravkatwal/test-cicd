import {
  AdminConfirmSignUpCommandInput,
  AdminConfirmSignUpCommandOutput,
  AdminCreateUserCommandInput,
  AdminCreateUserCommandOutput,
  AdminGetUserCommandInput,
  AdminGetUserCommandOutput,
  AttributeType,
  CognitoIdentityProvider,
  CognitoIdentityProviderClient,
  ConfirmSignUpCommandInput,
  ConfirmSignUpCommandOutput,
  ForgotPasswordCommandInput,
  ForgotPasswordCommandOutput,
  GetUserCommand,
  GetUserCommandOutput,
  ResendConfirmationCodeCommandInput,
  ResendConfirmationCodeCommandOutput,
  SignUpCommandInput,
  SignUpCommandOutput,
  ChangePasswordCommandInput,
  ChangePasswordCommandOutput,
  AdminDeleteUserCommandOutput,
  GlobalSignOutCommandOutput,
  InitiateAuthCommandOutput,
  GlobalSignOutCommandInput,
  UpdateUserPoolCommandOutput,
  AdminUpdateUserAttributesCommandInput,
  AdminSetUserMFAPreferenceCommandOutput,
  AdminSetUserMFAPreferenceCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';
import { AuthenticationDetails, CognitoUser, CognitoUserPool, CognitoUserSession } from 'amazon-cognito-identity-js';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { SimpleJwksCache } from "aws-jwt-verify/jwk";
import { SimpleJsonFetcher } from "aws-jwt-verify/https";
import { CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';
import QRCode from 'qrcode'
import { cognito } from '../config';
import {
  InputAuthLoginInterface,
  InputConfirmForgotPasswordInterface,
  InputConfirmSignUpInterface,
  InputResendConfirmationCodeInterface,
  InputUserInterface,
  InputChangePasswordInterface,
  InputAuthTokenInterface,
} from '../interfaces';

import { AwsSES } from './awsSES';
import { CognitoJwtVerifierSingleUserPool } from 'aws-jwt-verify/cognito-verifier';

export type SpecificVerifyProperties = {
  userPoolId: string;
  tokenUse: "access";
  clientId: string;
}
class AwsCognito {
  private static instance: AwsCognito;
  private cognitoIdentityProviderClient: CognitoIdentityProviderClient;
  private cognitoIdentityProvider: CognitoIdentityProvider;
  private cognitoJwtVerifier: CognitoJwtVerifierSingleUserPool<SpecificVerifyProperties>;

  private constructor() {
    this.cognitoIdentityProviderClient = new CognitoIdentityProviderClient({
      credentials: {
        accessKeyId: cognito.accessKeyId,
        secretAccessKey: cognito.secretAccessKey,
      },
      region: cognito.region,
    });
    this.cognitoIdentityProvider = new CognitoIdentityProvider({
      credentials: {
        accessKeyId: cognito.accessKeyId,
        secretAccessKey: cognito.secretAccessKey,
      },
      region: cognito.region,
      apiVersion: '2016-04-18',
    });

    this.cognitoJwtVerifier = CognitoJwtVerifier.create(
      {
        userPoolId: cognito.userPoolId,
        tokenUse: "access",
        clientId: cognito.clientId,
      },
      {
        jwksCache: new SimpleJwksCache({
          fetcher: new SimpleJsonFetcher({
            defaultRequestOptions: {
              responseTimeout: cognito.responseTimeout,
            },
          }),
        }),
      }
    ) 
  }

  static get(): AwsCognito {
    if (!AwsCognito.instance) {
      AwsCognito.instance = new AwsCognito();
    }
    return AwsCognito.instance;
  }

  verifyToken = (token: string): Promise<CognitoAccessTokenPayload> => {
    return this.cognitoJwtVerifier.verify(token)
  };

  getCognitoUser = (token: string): Promise<GetUserCommandOutput> => {
    const command = new GetUserCommand({
      AccessToken: token,
    });
    return this.cognitoIdentityProviderClient.send(command);
  };

  signUp = (input: InputUserInterface): Promise<SignUpCommandOutput> => {
    const params = {
      ClientId: cognito.clientId,
      Username: input.email,
      Password: input.password,
      UserAttributes: [
        {
          Name: 'email',
          Value: input.email,
        },
        {
          Name: 'name',
          Value: input.name,
        },
        {
          Name: 'phone_number',
          Value: input.phone_number || '',
        },
      ],
    } as SignUpCommandInput;
    return this.cognitoIdentityProvider.signUp(params);
  };
  removeUser =async (input: InputUserInterface): Promise<AdminDeleteUserCommandOutput> => {
    const params = {
      UserPoolId: cognito.userPoolId,
      Username: input.email,
      UserAttributes: [
        {
          Name: 'email',
          Value: input.email,
        },
        {
          Name: 'name',
          Value: input.name,
        },
        {
          Name: 'phone_number',
          Value: input.phone_number || '',
        },
      ],
    }
    return await this.cognitoIdentityProvider.adminDeleteUser(params);
  };
  
  confirmSignUp = (input: InputConfirmSignUpInterface): Promise<ConfirmSignUpCommandOutput> => {
    const params = {
      ClientId: cognito.clientId,
      Username: input.email,
      ConfirmationCode: input.confirmation_code,
    } as ConfirmSignUpCommandInput;
    return this.cognitoIdentityProvider.confirmSignUp(params);
  };

  resendConfirmationCode = (
    input: InputResendConfirmationCodeInterface,
  ): Promise<ResendConfirmationCodeCommandOutput> => {
    const params = {
      ClientId: cognito.clientId,
      Username: input.email,
    } as ResendConfirmationCodeCommandInput;
    return this.cognitoIdentityProvider.resendConfirmationCode(params);
  };
  
  adminUpdateUser = async (input: InputUserInterface): Promise<UpdateUserPoolCommandOutput> => {
    let inputWhere = {};

    if (input.email_verified) {
      inputWhere = {
        ...inputWhere,
        Name: 'email_verified',
        Value: 'true',
      };
    }
    const params = {
      UserAttributes: [inputWhere],
      UserPoolId: cognito.userPoolId,
      Username: input.sub,
    } as AdminUpdateUserAttributesCommandInput;

    return this.cognitoIdentityProvider.adminUpdateUserAttributes(params);
  };
  
  changePassword = (input: InputChangePasswordInterface): Promise<ChangePasswordCommandOutput> => {
    const params = {
      AccessToken: input.accessToken,
      PreviousPassword: input.previousPassword,
      ProposedPassword: input.proposedPassword,
    } as ChangePasswordCommandInput;

    return this.cognitoIdentityProvider.changePassword(params);
  };

  adminCreateUser = (input: InputUserInterface): Promise<AdminCreateUserCommandOutput> => {
    const userAttributes: AttributeType[] = [
      {
        Name: 'email',
        Value: input.email,
      },
      {
        Name: 'name',
        Value: input.name,
      },
      {
        Name: 'phone_number',
        Value: input.phone_number || '',
      },
    ];
    const params = {
      UserPoolId: cognito.userPoolId,
      Username: input.username,
      TemporaryPassword: input.password,
      UserAttributes: userAttributes,
    } as AdminCreateUserCommandInput;
    return this.cognitoIdentityProvider.adminCreateUser(params);
  };

  authenticateUser = async (input: InputAuthLoginInterface): Promise<CognitoUserSession> => {
    const authenticationData = {
      Username: input.email,
      Password: input.password,
    };

    const authenticationDetails = new AuthenticationDetails(authenticationData);
    const poolData = {
      UserPoolId: cognito.userPoolId,
      ClientId: cognito.clientId,
    };
    const userPool: CognitoUserPool = new CognitoUserPool(poolData);
    const cognitoUser = new CognitoUser({
      Username: input.email,
      Pool: userPool,
    });

    const setupMFA = (): Promise<CognitoUserSession> => {
      return new Promise<CognitoUserSession>(async (resolve, reject) => {
        try {
          cognitoUser.associateSoftwareToken({
            associateSecretCode: async (secretCode) => {
              const url = `otpauth://totp/${input.email}?secret=${secretCode}&issuer=Cognito-TOTP-MFA`;
              const qrcode = await QRCode.toString(url, { type: 'svg' });
              await new AwsSES().sendEmailRaw({
                destination: [input.email],
                subject: "GUMP QR code for MFA authentication!",
                content: `Scan this QR code with google authenticator or authy application.
                          Please keep this safe and secret..`,
                attachments: [
                  { content: qrcode, filename: 'qrcode.svg' }
                ],
                from: 'no-reply-gump@genesesolution.com'
              });
              console.info(`MAIL WITH QR IS SENT TO ${input.email}!! `, url, secretCode)
              resolve(cognitoUser as unknown as CognitoUserSession);
            },
            onFailure: (err) => {
              console.error(err.message || JSON.stringify(err));
              reject(err.message);
            },
          });
        } catch (error) {
          reject(error);
        }
      });
    };
  
    try {
      const user = await new Promise<CognitoUserSession>((resolve, reject) => {
        cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: async (user: CognitoUserSession) => {
            const userData = await new Promise<{ PreferredMfaSetting?: string }>((resolve, reject) => {
              cognitoUser.getUserData((err, data) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(data!);
                }
              });
            });

            const { PreferredMfaSetting } = userData!;
            if (PreferredMfaSetting === "SOFTWARE_TOKEN_MFA") {
              resolve(user);
            } else {
              try {
                await setupMFA();
                console.info('MFA SETUP DONE');
                resolve(user);
              } catch (error) {
                reject(error);
              }
            }
          },
          onFailure: (error: any) => {
            reject(error);
          },
          totpRequired: function(secretCode) {
            resolve(cognitoUser as unknown as  CognitoUserSession)
          },
        });
      });
      return user;
    } catch (error) {
      throw error;
    }
  };

  authenticateUserMfa = (input: InputAuthLoginInterface): Promise<CognitoUserSession> => {
    const authenticationData = {
      Username: input.email,
      Password: input.password,
    };
  
    const authenticationDetails = new AuthenticationDetails(authenticationData);
    const poolData = {
      UserPoolId: cognito.userPoolId,
      ClientId: cognito.clientId,
    };
    const userPool: CognitoUserPool = new CognitoUserPool(poolData);
    const cognitoUser = new CognitoUser({
      Username: input.email,
      Pool: userPool,
    });
  
    return new Promise<CognitoUserSession>((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: async (user: CognitoUserSession) => {
          const userData = await new Promise<{ PreferredMfaSetting?: string }>((resolve, reject) => {
            cognitoUser.getUserData((err, data) => {
              if (err) {
                reject(err);
              } else {
                resolve(data!);
              }
            });
          });

          const { PreferredMfaSetting } = userData!;
          if (PreferredMfaSetting === "SOFTWARE_TOKEN_MFA") {
            resolve(user);
          } else {
            cognitoUser.verifySoftwareToken(input.mfaOtp!, 'My TOTP device', {
              onFailure: function (err) {
                console.error(err.message || JSON.stringify(err));
                reject(err.message);
              },
              onSuccess: function (userSession: CognitoUserSession) {
                cognitoUser.setUserMfaPreference(
                  null,
                  { PreferredMfa: true, Enabled: true },
                  (err, result) => {
                    if (err) {
                      reject(err);
                    }
                    console.info("MFA Preference Enabled: " + result);
                    resolve(user);
                  }
                );
              }
            });
          }
        },
        onFailure: (error: any) => {
          reject(error);
        },
        totpRequired: () => {
          console.info('INSIDE TOTP REQUIRED (VERIFY MFA)');
          cognitoUser.sendMFACode(
            input.mfaOtp!,
            {
              onSuccess: async (user: CognitoUserSession) => {
                resolve(user);
              },
              onFailure: (error: any) => {
                reject(error);
              },
            },
            'SOFTWARE_TOKEN_MFA',
          );
        },
      });
    });
  };

  resetUserMfaPreference = (input: InputAuthLoginInterface): Promise<AdminSetUserMFAPreferenceCommandOutput> => {
    const params : AdminSetUserMFAPreferenceCommandInput = {
      UserPoolId: cognito.userPoolId,
      Username: input.email,
      SoftwareTokenMfaSettings: {
        Enabled: false,
        PreferredMfa: false
      } 
    } 

    return this.cognitoIdentityProvider.adminSetUserMFAPreference(params);
  };

  authenticateAdmin = (input: InputAuthLoginInterface): Promise<CognitoUserSession> => {
    const authenticationData = {
      Username: input.email,
      Password: input.password,
    };

    const authenticationDetails = new AuthenticationDetails(authenticationData);
    const poolData = {
      UserPoolId: cognito.userPoolId,
      ClientId: cognito.clientId,
    };
    const userPool: CognitoUserPool = new CognitoUserPool(poolData);
    const cognitoUser = new CognitoUser({
      Username: input.email,
      Pool: userPool,
    });

    return new Promise(function (resolve, reject): CognitoUserSession | void {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (user: CognitoUserSession) {
          resolve(user);
        },
        onFailure: function (error: any) {
          reject(error);
        },
      });
    });
  };

  forgotPassword = (input: InputUserInterface): Promise<ForgotPasswordCommandOutput> => {
    const params = {
      ClientId: cognito.clientId,
      Username: input.email,
    } as ForgotPasswordCommandInput;

    return this.cognitoIdentityProvider.forgotPassword(params);
  };

  confirmForgotPassword = (input: InputConfirmForgotPasswordInterface): Promise<string> => {
    const poolData = {
      UserPoolId: cognito.userPoolId,
      ClientId: cognito.clientId,
    };
    const userPool: CognitoUserPool = new CognitoUserPool(poolData);

    const cognitoUser = new CognitoUser({
      Username: input.email,
      Pool: userPool,
    });

    return new Promise(function (resolve, reject): string | void {
      cognitoUser.confirmPassword(input.verification_code, input.new_password, {
        onSuccess: function (message) {
          resolve(message);
        },
        onFailure: function (error) {
          reject(error);
        },
      });
    });
  };

  adminGetUser = ({ email }: InputResendConfirmationCodeInterface): Promise<AdminGetUserCommandOutput> => {
    const params = {
      UserPoolId: cognito.userPoolId,
      Username: email,
    } as AdminGetUserCommandInput;
    return this.cognitoIdentityProvider.adminGetUser(params);
  };

  adminConfirmSignUp = ({ username }: { username: string }): Promise<AdminConfirmSignUpCommandOutput> => {
    const params = {
      UserPoolId: cognito.userPoolId,
      Username: username,
    } as AdminConfirmSignUpCommandInput;
    return this.cognitoIdentityProvider.adminConfirmSignUp(params);
  };
  signOut = (input: InputAuthTokenInterface): Promise<GlobalSignOutCommandOutput> => {
    var params = {
      AccessToken: input.accessToken,
    } as GlobalSignOutCommandInput;
    return this.cognitoIdentityProvider.globalSignOut(params);
  };
  
  accessToken = async (refreshToken: string): Promise<InitiateAuthCommandOutput> => {
    const params = {
      AuthFlow: 'REFRESH_TOKEN',
      ClientId: cognito.clientId,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    };
    return this.cognitoIdentityProvider.initiateAuth(params);
  };
}

const awsCognito = AwsCognito.get();

export { awsCognito as AwsCognito };
