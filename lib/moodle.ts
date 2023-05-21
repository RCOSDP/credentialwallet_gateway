import axios, { AxiosRequestConfig, AxiosError } from "axios";
import https from "https";
import { BadgeInfo, IfBadgeInfo } from "../types/BadgeInfo";

const MOODLE_BASE = process.env.MOODLE_BASE;
const TOKEN_URL_BASE = `${MOODLE_BASE}/login/token.php`;
const BADGES_URL_BASE = `${MOODLE_BASE}/webservice/rest/server.php?wsfunction=core_badges_get_user_badges&moodlewsrestformat=json`;
const OPENBADGE_URL_BASE = `${MOODLE_BASE}/badges/assertion.php?obversion=2`;

const getMyToken = async (
  username: string,
  password: string
): Promise<string> => {
  console.log(`start getMyToken username:[${username}] pw:[${password}]`);
  //const tokenURL = `${process.env.MOODLE_BASE}/login/token.php?username=${username}&password=${password}&service=${process.env.MOODLE_TOKEN_CLIENT}`;
  const tokenURL = `${TOKEN_URL_BASE}?username=${username}&password=${password}&service=${process.env.MOODLE_TOKEN_CLIENT}`;
  //   const tokenURL =
  //     "https://fujie.moodlecloud.com/login/token.php?username=test&password=P@ssw0rd&service=testClient";
  console.log(tokenURL);
  const options: AxiosRequestConfig = {
    method: "GET",
    url: tokenURL,
    //httpsAgent: new https.Agent({ rejectUnauthorized: false }), // SSL Error: Unable to verify the first certificateの回避　正式な証明書なら出ないはず
  };

  try {
    //const tokenResp = await axios.get(tokenURL).then((res) => res.data);
    const { data } = await axios(options);
    //    const { data } = await axios.get(tokenURL);
    console.log("response.data=", data.token);
    return data.token;
    // return tokenResp;
  } catch (err) {
    console.log("Error getMyTokens 01:", err);
    if (axios.isAxiosError(err)) {
      console.log("Error getMyTokens:(axios)", err.message);
    }
    throw err;
  }
};

const getMyBadges = async (token: string): Promise<IfBadgeInfo[]> => {
  console.log("start getMyBadges");
  // URL 組み立て
  const myBadgesURL = `${BADGES_URL_BASE}&wstoken=${token}`;
  console.log("myBadgesURL =", myBadgesURL);

  const options: AxiosRequestConfig = {
    method: "GET",
    url: myBadgesURL,
    //httpsAgent: new https.Agent({ rejectUnauthorized: false }), // SSL Error: Unable to verify the first certificateの回避　正式な証明書なら出ないはず
  };
  try {
    //const tokenResp = await axios.get(tokenURL).then((res) => res.data);
    const { data } = await axios(options);
    //    const { data } = await axios.get(tokenURL);
    console.log("response=", data.badges);
    //const IfBadgeInfo[] = data.badges;
    return data.badges;
    // return tokenResp;
  } catch (err) {
    console.error("Error getMyBadges 01:", err);
    if (axios.isAxiosError(err)) {
      console.log("Error getMyBadges:(axios)", err.message);
    }
    throw err;
  }
};

//export const myOpenBadgesList = async (
export const myBadgesList = async (
  username: string,
  password: string
): Promise<IfBadgeInfo[]> => {
  console.log(`start myBadgesList`);
  try {
    const token = await getMyToken(username, password);
    console.log("end myOpenBadgesList:", token);
    //const badges: BadgeInfo[] = await getMyBadges(token);
    const badgesInfoJson: IfBadgeInfo[] = await getMyBadges(token);

    return badgesInfoJson;
  } catch (err) {
    console.log(`error end myBadgedsList`);
    throw err;
  }
};

export const myOpenBadge = async (uniquehash: string): Promise<any> => {
  console.log(`start myOpenBadge selected uniquehash=[${uniquehash}]`);
  const myOpenBadgeURL = `${OPENBADGE_URL_BASE}&b=${uniquehash}`;
  try {
    const openBadgeMeta = await axios
      .get(myOpenBadgeURL)
      .then((res) => res.data);
    // console.log("openBadgeMetadata=", openBadgeMeta);
    return openBadgeMeta;
  } catch (err) {
    console.error(`error end myOpenBadge`);
    throw err;
  }
};
