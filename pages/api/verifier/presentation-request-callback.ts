import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../../lib/redis";

import jwt from "jsonwebtoken";

type Data = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log("******** presentation callback *********");
  //console.log(req.body);
  console.log(
    `state:[${req.body.state}] requestStatus:[${req.body.requestStatus}]`
  );

  let output = {};
  if (req.body.requestStatus === "presentation_verified") {
    const vpToken = jwt.decode(req.body.receipt.vp_token) as jwt.JwtPayload;
    const { vc } = jwt.decode(
      vpToken.vp.verifiableCredential[0]
    ) as jwt.JwtPayload;
    output = vc;
    // console.log("vc:", vc);
  }
  const value = { status: req.body.requestStatus, output };
  await redis.set(req.body.state, JSON.stringify(value));
  console.log("** end presentation callback **");

  //  redis.set(req.body.state, req.body.code);
  res.send(200);
}
