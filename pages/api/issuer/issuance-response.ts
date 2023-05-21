import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../../lib/redis";
import { Session, withSession } from "../../../lib/session";
import { IssuanceStatus } from "../../../types/status";

type Data = {
  status: IssuanceStatus;
};

export default async function handler(
  req: NextApiRequest & Session,
  res: NextApiResponse<Data>
) {
  //await withSession(req, res);
  const state = req.query.state as string;
  console.log(`start issuance-response state=${state}`);
  //  const response = await redis.get(req.session.id as string);
  const response = await redis.get(state);

  console.log(`end issuance-response response=${response}`);
  if (response === "issuance_successful") {
    const ret = await redis.del(state);
    console.log("end issuance-response response del ret:", ret);
    res.status(200).json({
      status: "issuance_successful",
    });
  } else {
    res.status(200).json({
      status: response as IssuanceStatus,
    });
  }
}
