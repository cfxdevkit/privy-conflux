import {
  verifyAccessToken,
  type VerifyAccessTokenResponse,
} from "@privy-io/node";

function getRequiredEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`${name} is not set`);
  }

  return value;
}

export type PrivyAccessTokenClaims = VerifyAccessTokenResponse;

export async function verifyPrivyAccessToken(
  accessToken: string,
): Promise<PrivyAccessTokenClaims> {
  return verifyAccessToken({
    access_token: accessToken,
    app_id: getRequiredEnv(
      "NEXT_PUBLIC_PRIVY_APP_ID",
      process.env.NEXT_PUBLIC_PRIVY_APP_ID,
    ),
    verification_key: getRequiredEnv(
      "PRIVY_VERIFICATION_KEY",
      process.env.PRIVY_VERIFICATION_KEY,
    ),
  });
}
