import type { NextApiRequest, NextApiResponse } from "next";
import { Session, withSession } from "../../../lib/session";
import { presentationRequest } from "../../../lib/vc";

type Data = {
  url: string;
  sessionId: string;
};

export default async function handler(
  req: NextApiRequest & Session,
  res: NextApiResponse<Data>
) {
  await withSession(req, res);
  console.log("start presentaion-request sessionid=", req.session.id);
  const { url, sessionId } = await presentationRequest(req.session.id);
  console.log("end presentaion-request:", url);
  if (url === null || url === undefined) {
    console.log("ERROR");
    const error: Data = {
      url: "ERROR : Internal Server Error",
      sessionId: sessionId,
    };
    res.status(500).json(url);
  }
  res.status(200).json({
    url,
    sessionId,
  });
}
