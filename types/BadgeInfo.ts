export class BadgeInfo {
  private _badgeInfo: IfBadgeInfo;

  constructor(ifbadgeInfo: IfBadgeInfo) {
    this._badgeInfo = ifbadgeInfo;
  }

  get badgeName() {
    return this._badgeInfo.name;
  }
}

export interface IfBadgeInfo {
  id: number;
  name: string;
  description: string;
  timecreated: number;
  issuername: string;
  issuerurl: string;
  expiredate?: number;
  message: string;
  uniquehash: string;
  dateissued: number;
  email: string;
  badgeurl: string;
}
// export type IfBadgeInfo = {
//   id: number;
//   name: string;
//   description: string;
//   timecreated: number;
//   issuername: string;
//   issuerurl: string;
//   expiredate?: number;
//   message: string;
//   uniquehash: string;
//   dateissued: number;
//   email: string;
//   badgeurl: string;
// }
