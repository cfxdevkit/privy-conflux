import type { NextApiRequest, NextApiResponse } from "next";

import {
  verifyPrivyAccessToken,
  type PrivyAccessTokenClaims,
} from "../../lib/privy";

export type AuthenticateSuccessResponse = {
  claims: PrivyAccessTokenClaims;
};

export type AuthenticationErrorResponse = {
  error: string;
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    AuthenticateSuccessResponse | AuthenticationErrorResponse
  >,
) {
  const headerAuthToken = req.headers.authorization?.replace(/^Bearer /, "");
  const cookieAuthToken = req.cookies["privy-token"];

  const accessToken = cookieAuthToken || headerAuthToken;
  if (!accessToken)
    return res.status(401).json({ error: "Missing auth token" });

  try {
    const claims = await verifyPrivyAccessToken(accessToken);
    return res.status(200).json({ claims });
  } catch (e: unknown) {
    return res
      .status(401)
      .json({ error: e instanceof Error ? e.message : "Unknown error" });
  }
}

export default handler;
