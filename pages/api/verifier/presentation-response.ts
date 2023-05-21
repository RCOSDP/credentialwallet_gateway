import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../../lib/redis";
import { Session, withSession } from "../../../lib/session";
import { PresentationStatus } from "../../../types/status";
import {
  validateOpenBadge,
  extractOpenBadgeMetadataFromImage,
} from "../../../lib/openbadge";

type Data = {
  status: PresentationStatus;
  output: any;
};
export default async function handler(
  req: NextApiRequest & Session,
  res: NextApiResponse<Data>
) {
  //  await withSession(req, res);
  const state = req.query.state as string;
  console.log(`start presentation-response state=${state}`);
  const response = await redis.get(state);
  const { status, output } = response
    ? JSON.parse(response as string)
    : { status: undefined, output: undefined };
  console.log(`end issuance-response response=${status}`);

  if (status === "presentation_verified") {
    const ret = await redis.del(state);
    console.log("end presentation-response response del ret:", ret);
    const vc = output;
    const email = vc.credentialSubject.email;
    const photo = vc.credentialSubject.photo;
    const openBadgeMetadata = await extractOpenBadgeMetadataFromImage(photo);

    const result = await validateOpenBadge(email, openBadgeMetadata);
    if (!result) {
      throw new Error("OpenBadge invalid");
    }

    console.log("presentation_verified email=", email);
    res.status(200).json({
      status: "presentation_verified",
      output,
    });
  } else {
    res.status(200).json({
      status: status as PresentationStatus,
      output,
    });
  }
}
