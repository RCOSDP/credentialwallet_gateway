import type { NextApiRequest, NextApiResponse } from "next";
import { Session, withSession } from "../../../lib/session";
import { myBadgesList } from "../../../lib/moodle";
import { BadgeInfo, IfBadgeInfo } from "../../../types/BadgeInfo";

type Data = {
  badgeList: IfBadgeInfo[];
};

export default async function handler(
  req: NextApiRequest & Session,
  res: NextApiResponse<Data>
) {
  const { username, password } = req.body;

  console.log(
    `### start my-openbadges username=${username} pw=${password} ####`
  );
  await withSession(req, res);
  const sessionId = req.session.id;

  //try {
  const badgeList: IfBadgeInfo[] = await myBadgesList(username, password);
  console.log("End myOpenbadges my badges count:", badgeList.length);
  for (let i = 0; i < badgeList.length; i++) {
    console.log(`badges[${i}] ${badgeList[i].name}`);
  }
  res.status(200).json({ badgeList });
}
