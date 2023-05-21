import type { NextApiRequest, NextApiResponse } from "next";
import { Session, withSession } from "../../../lib/session";
import { myOpenBadge } from "../../../lib/moodle";
import {
  validateOpenBadge,
  getBadgeClassById,
  setOpenBadgeMetadataToImage,
} from "../../../lib/openbadge";
import { getManifestURL, issueRequest } from "../../../lib/vc";

type Data = {
  pin: number;
  url: string;
  sessionId: string;
};

export default async function handler(
  req: NextApiRequest & Session,
  res: NextApiResponse<Data>
) {
  const uniquehash = req.query.uniquehash as string;
  const email = req.query.email as string;

  console.log(
    `### start getMyOpenBadge uniquehash=${uniquehash} email=${email} ####`
  );
  // moddle apiからOpenBadgeデータを取得
  const openBadgeData = await myOpenBadge(uniquehash);
  //console.log("openBadgeData=", openBadgeData);

  const result = await validateOpenBadge(email, openBadgeData);
  if (!result) {
    throw new Error("OpenBadge invalid");
  }
  console.log("BadgeClass=", openBadgeData.badge);

  // BadgeClassから取得
  const { issuer, image, criteria } = openBadgeData.badge;
  // image : "data:image/png;base64,iVBORw0KGg..."; // base64エンコードされた画像データ
  const base64ImageWithoutPrefix = image.split(",")[1];

  const openBadgeImage = await setOpenBadgeMetadataToImage(
    base64ImageWithoutPrefix,
    openBadgeData
  );

  const newDataUrl = "data:image/png;base64," + openBadgeImage;
  //  console.log(newDataUrl);
  // console.log("criteria = ", criteria);

  const manifestURL = getManifestURL(criteria.id);
  console.log("manifestURL = ", manifestURL);
  await withSession(req, res);
  console.log("BadgeClass ID=", openBadgeData.badge.id);
  const badgeClass = await getBadgeClassById(openBadgeData.badge.id);
  const verificationURL = openBadgeData.verify.url;
  console.log("verifyUrl=", verificationURL);

  console.log(`Moodle issuance-request:sesionId = ${req.session.id}`);
  const { pin, url, sessionId } = await issueRequest(
    manifestURL,
    badgeClass, //openBadgeData.badge,
    verificationURL,
    email,
    req.session.id,
    openBadgeImage, //base64ImageWithoutPrefix
    openBadgeData.issuedOn,
    openBadgeData.expires
  );

  res.status(200).json({
    pin,
    url,
    sessionId,
  });
}
