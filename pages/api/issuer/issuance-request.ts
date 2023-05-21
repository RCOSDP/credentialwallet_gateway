import type { NextApiRequest, NextApiResponse } from "next";
import { Session, withSession } from "../../../lib/session";

import {
  extractOpenBadgeMetadataFromImage,
  validateOpenBadge,
  getBadgeClass,
} from "../../../lib/openbadge";

import {
  prepareIssueRequest,
  issueRequest,
  getManifestURL,
} from "../../../lib/vc";

type Data = {
  pin: number;
  url: string;
  sessionId: string;
};

export default async function handler(
  req: NextApiRequest & Session,
  res: NextApiResponse<Data>
) {
  const { email, file } = req.body;
  const base64ImageWithoutPrefix = file.split(",")[1];
  //console.log("base64ImageWithoutPrefix = ", base64ImageWithoutPrefix);
  const openBadgeMetadata = await extractOpenBadgeMetadataFromImage(
    base64ImageWithoutPrefix
  );

  console.log("openBadgeMetadata:", openBadgeMetadata);
  const result = await validateOpenBadge(email, openBadgeMetadata);
  if (!result) {
    throw new Error("OpenBadge invalid");
  }
  await withSession(req, res);
  console.log(`issuance-request:sesionId = ${req.session.id}`);
  const verificationURL = openBadgeMetadata.id;
  console.log("verificationURL=", verificationURL);

  const badgeClass = await getBadgeClass(openBadgeMetadata);
  console.log("#### badgeClass=", badgeClass);
  const { criteria } = badgeClass;
  const manifestURL = getManifestURL(criteria.id);

  // const manifestURL = await prepareIssueRequest(openBadgeMetadata);
  console.log("manifestURL:", manifestURL);
  console.log(
    `issuedOn=${openBadgeMetadata.issuedOn} expires=${openBadgeMetadata.expires}`
  );

  const { pin, url, sessionId } = await issueRequest(
    manifestURL,
    badgeClass,
    verificationURL, // verifyUrl
    email,
    req.session.id,
    base64ImageWithoutPrefix,
    openBadgeMetadata.issuedOn,
    openBadgeMetadata.expires
  );
  res.status(200).json({
    pin,
    url,
    sessionId,
  });
}
