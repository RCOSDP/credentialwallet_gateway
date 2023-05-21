import axios from "axios";
import manifestTemlate from "../templates/manifest.json";
import issuanceConfig from "../templates/issuance_request_config.json";

import presentationConfig from "../templates/presentation_request_config.json";

// const did_authority = "did:web:www.zkip.site";
// const clientName = "OpenBadge to Verifiable Credentials Gateway";
const did_authority = process.env.did_authority as string;
const clientName = process.env.clientName as string;

// const host = "https://openbadge-vc-converter.vercel.app/";

const msal = require("@azure/msal-node");

// MSAL config
const msalConfig = {
  auth: {
    clientId: process.env.vcApp_client_id as string,
    authority:
      "https://login.microsoftonline.com/" + process.env.vcApp_azTenantId,
    clientSecret: process.env.vcApp_client_secret as string,
    // clientId: "9fd98d3f-ef1a-478a-b360-5630c369bd45",
    // authority:
    //   "https://login.microsoftonline.com/516c4fed-1f7f-4b23-b9f3-d80b44a2e5bf",
    // clientSecret: "g1E8Q~eOkSJe2nxuvZj7Vnvrjl~FjcnZ1RwqocdU",
  },
  // system: {
  //   loggerOptions: {S
  //     loggerCallback(loglevel, message, containsPii) {
  //       console.log(message);
  //     },
  //     piiLoggingEnabled: false,
  //     logLevel: msal.LogLevel.Verbose,
  //   },
  // },
};
const msalCca = new msal.ConfidentialClientApplication(msalConfig);
const msalClientCredentialRequest = {
  //  scopes: ["3db474b9-6a0c-4840-96ac-1fceb342124f/.default"],
  scopes: [process.env.vcApp_scope],
  skipCache: false,
};

//TODO: めも　未実装 動的にmanifest作成ができないため
// OpenBadgeから取得したIssuer、CredentialType、イメージ画像の情報を元にrulesおよびdisplayファイルを動的に生成、Azure Storage APIを使ってストレージへアップロード
export const createManifest = async () => {
  const { data } = await axios.post(
    "https://beta.did.msidentity.com/f88bec5c-c13f-4f27-972f-72540d188693/api/portable/v1.0/admin/contracts",
    manifestTemlate
  );
};

/**
 * criteria.idからEntra VCのManifestURLを取得
 * @param id criteria.id
 * @returns
 */
export const getManifestURL = (id: string): string => {
  console.log("start getManifestURL badgeClass criteria.id=", id);
  switch (id) {
    case "https://www.credly.com/org/project-management-institute/badge/project-management-professional-pmp":
      return "https://verifiedid.did.msidentity.com/v1.0/tenants/516c4fed-1f7f-4b23-b9f3-d80b44a2e5bf/verifiableCredentials/contracts/61ba9848-ccab-a0d5-8242-17348cab3952/manifest";
    case "https://moodle.selmid.me/badges/badgeclass.php?id=1":
      return "https://verifiedid.did.msidentity.com/v1.0/tenants/516c4fed-1f7f-4b23-b9f3-d80b44a2e5bf/verifiableCredentials/contracts/98ae2e87-98d8-30fd-78ad-590ec61e5a6d/manifest";
    case "https://moodle.selmid.me/badges/badgeclass.php?id=2":
      return "https://verifiedid.did.msidentity.com/v1.0/tenants/516c4fed-1f7f-4b23-b9f3-d80b44a2e5bf/verifiableCredentials/contracts/61ba9848-ccab-a0d5-8242-17348cab3952/manifest";
    case "https://moodle.selmid.me/badges/badgeclass.php?id=3":
      return "https://verifiedid.did.msidentity.com/v1.0/tenants/516c4fed-1f7f-4b23-b9f3-d80b44a2e5bf/verifiableCredentials/contracts/61ba9848-ccab-a0d5-8242-17348cab3952/manifest";
    case "https://www.credly.com/org/idpro/badge/idpro-member":
      return "https://beta.did.msidentity.com/v1.0/f88bec5c-c13f-4f27-972f-72540d188693/verifiableCredential/contracts/IDProMember";
    case "https://www.credly.com/org/idpro/badge/cidpro-exam-writer":
      return "https://beta.did.msidentity.com/v1.0/f88bec5c-c13f-4f27-972f-72540d188693/verifiableCredential/contracts/CIDProItemWriter";
    case "https://www.credly.com/org/idpro/badge/cidpro-certified-foundation-level":
    default:
      return "https://verifiedid.did.msidentity.com/v1.0/tenants/516c4fed-1f7f-4b23-b9f3-d80b44a2e5bf/verifiableCredentials/contracts/98ae2e87-98d8-30fd-78ad-590ec61e5a6d/manifest";
  }
};

/**
 * ManifestURL生成し取得　＊2023.２時点では動的にmanifestが生成できないため未使用
 * @param openBadgeMetadata アップロードさらたOpenBadgeのメタデータ
 * @returns
 */
export const prepareIssueRequest = async (
  openBadgeMetadata: any
): Promise<string> => {
  console.log("### start prepareIssueRequest ###", openBadgeMetadata.badge);
  const { data } = await axios.get(openBadgeMetadata.badge);
  console.log("data:", data);
  const { issuer, image, criteria } = data;
  // console.log("issuer:", issuer);
  // console.log("image:", image);
  // console.log("criteria:", criteria);
  // TODO:
  // contractエンドポイントへ必要な情報を投げ込んで動的にManifestを作成
  // createManifest()

  return getManifestURL(criteria.id);
  // 2023.2 別Method化
  // switch (criteria.id) {
  //   case "https://www.credly.com/org/project-management-institute/badge/project-management-professional-pmp":
  //     //return "https://beta.did.msidentity.com/v1.0/f88bec5c-c13f-4f27-972f-72540d188693/verifiableCredential/contracts/PMP";
  //     return "https://verifiedid.did.msidentity.com/v1.0/tenants/516c4fed-1f7f-4b23-b9f3-d80b44a2e5bf/verifiableCredentials/contracts/61ba9848-ccab-a0d5-8242-17348cab3952/manifest";
  //   case "https://www.credly.com/org/idpro/badge/idpro-member":
  //     return "https://beta.did.msidentity.com/v1.0/f88bec5c-c13f-4f27-972f-72540d188693/verifiableCredential/contracts/IDProMember";
  //   case "https://www.credly.com/org/idpro/badge/cidpro-exam-writer":
  //     return "https://beta.did.msidentity.com/v1.0/f88bec5c-c13f-4f27-972f-72540d188693/verifiableCredential/contracts/CIDProItemWriter";
  //   case "https://www.credly.com/org/idpro/badge/cidpro-certified-foundation-level":
  //   default:
  //     return "https://beta.did.msidentity.com/v1.0/f88bec5c-c13f-4f27-972f-72540d188693/verifiableCredential/contracts/CIDPROCertifiedFoundationLevel";
  // }
};

/**
 * issueRequestとの違いは  const { data } = await axios.get(openBadgeMetadata.badge);　がないだけ
 * @param manifestId
 * @param badgeClass
 * @param email
 * @param sessionId
 * @param base64ImageWithoutPrefix
 * @returns
 */
export const issueRequest = async (
  manifestId: string,
  badgeClass: any,
  verificationURL: string,
  email: string,
  sessionId: string,
  base64ImageWithoutPrefix: string,
  issuedon: string,
  expires: string
) => {
  console.log(`### START issueRequest sessionId:${sessionId}###`);
  console.log(`issuedOn = ${issuedon},expores=${expires}`);

  let accessToken = "";
  try {
    const result = await msalCca.acquireTokenByClientCredential(
      msalClientCredentialRequest
    );
    if (result) {
      accessToken = result.accessToken;
      // console.log("accessToken:", accessToken);
    }
  } catch {
    console.log("failed to get access token");
  }

  const pin = Math.floor(1000 + Math.random() * 9000);

  issuanceConfig.pin.value = pin.toString();
  issuanceConfig.claims.photo = base64ImageWithoutPrefix;
  issuanceConfig.claims.email = email;
  issuanceConfig.claims.verificationURL = verificationURL;
  issuanceConfig.claims.issued = issuedon;
  issuanceConfig.claims.expire = expires;

  //console.log();
  const openbadgeInfo = JSON.stringify(badgeClass);

  issuanceConfig.claims.openbadge = openbadgeInfo;
  //issuanceConfig.claims.openbadge = "";

  issuanceConfig.registration.clientName = clientName;
  issuanceConfig.authority = did_authority;
  // callback urlの指定
  if (process.env.baseURL === "http://localhost:3000") {
    issuanceConfig.callback.url =
      "https://example.com/api/issuer/issuance-request-callback"; // localhostだとAPI実行でエラーになるため、ダミー
  } else {
    const callbakURL = `${process.env.baseURL}/api/issuer/issuance-request-callback`;
    issuanceConfig.callback.url = callbakURL;
    console.log("callbackURL =", callbakURL);
  }

  // セッションidを入れてコールバック側へ引き継ぐ
  issuanceConfig.callback.state = sessionId;
  //issuanceConfig.type = "OpenBadgeV2,PMP"; //TODO:typeは指定しなくても発行できる
  //  issuanceConfig.type = "PMP";
  issuanceConfig.manifest = manifestId;

  const payload = JSON.stringify(issuanceConfig);
  // console.log("payLoad=", payload);

  const fetchOptions = {
    method: "POST",
    body: payload,
    headers: {
      "Content-Type": "application/json",
      // TODO UND_ERR_REQ_CONTENT_LENGTH_MISMATCHになるためいったんコメントアウト
      //      "Content-Length": payload.length.toString(),
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const client_api_request_endpoint =
    "https://verifiedid.did.msidentity.com/v1.0/verifiableCredentials/createIssuanceRequest";
  let url = "";
  try {
    const response = await fetch(client_api_request_endpoint, fetchOptions);
    const resp = await response.json();
    if (resp.error) {
      console.log("failed createIssuanceRequest:", resp.error);
    }
    console.log(resp);
    url = resp.url;
    console.log("url =", url);
  } catch (e) {
    console.log("ERROR END:", e);
  }

  //const { url } = await response.json();

  //const { url } = resp.url;
  //console.log("url:", url);
  console.log("### END issueRequest ###");
  //sessionId

  return { pin, url, sessionId };
};

/**
 *
 * @param manifestId
 * @param openBadgeMetadata
 * @param email
 * @param sessionId
 * @returns
 */
export const issueRequestOld = async (
  manifestId: string,
  openBadgeMetadata: any,
  email: string,
  sessionId: string,
  base64ImageWithoutPrefix: string
) => {
  console.log(`### START issueRequest sessionId:${sessionId}###`);
  // TODO:
  // manifestとアクセストークンを元にazureにリクエストを投げる
  // access_tokenを取得する
  let accessToken = "";
  try {
    const result = await msalCca.acquireTokenByClientCredential(
      msalClientCredentialRequest
    );
    if (result) {
      accessToken = result.accessToken;
      // console.log("accessToken:", accessToken);
    }
  } catch {
    console.log("failed to get access token");
    // res.status(401).json({
    //     'error': 'Could not acquire credentials to access your Azure Key Vault'
    //     });
    //   return;
  }

  const pin = Math.floor(1000 + Math.random() * 9000);

  // issuance requestを構成する（もろもろスタティックにしている部分は後で）
  // claims
  // openbadge
  const { data } = await axios.get(openBadgeMetadata.badge);
  //console.log("badge Info:", data);

  // const clientName = process.env.clientName as string;
  // const authority = process.env.authority as string;
  // console.log(`clientName:${clientName} authority:${authority}`);

  issuanceConfig.pin.value = pin.toString();
  issuanceConfig.claims.photo = base64ImageWithoutPrefix;
  issuanceConfig.claims.email = email;

  //console.log();
  const openbadgeInfo = JSON.stringify(data);
  console.log("openbadgeInfo=", openbadgeInfo);
  issuanceConfig.claims.openbadge = openbadgeInfo;
  //issuanceConfig.claims.openbadge = JSON.parse(data);
  //issuanceConfig.claims.openbadge = "OpenBadge test";

  issuanceConfig.registration.clientName = clientName;
  issuanceConfig.authority = did_authority;
  // callback urlの指定
  if (process.env.baseURL === "http://localhost:3000") {
    issuanceConfig.callback.url =
      "https://example.com/api/issuer/issuance-request-callback"; // localhostだとAPI実行でエラーになるため、ダミー
  } else {
    const callbakURL = `${process.env.baseURL}/api/issuer/issuance-request-callback`;
    issuanceConfig.callback.url = callbakURL;
    console.log("callbackURL =", callbakURL);
  }

  // セッションidを入れてコールバック側へ引き継ぐ
  issuanceConfig.callback.state = sessionId;
  //issuanceConfig.type = "OpenBadgeV2,PMP"; //TODO:typeは指定しなくても発行できる
  //  issuanceConfig.type = "PMP";
  issuanceConfig.manifest = manifestId;

  const payload = JSON.stringify(issuanceConfig);
  console.log("payLoad=", payload);

  const fetchOptions = {
    method: "POST",
    body: payload,
    headers: {
      "Content-Type": "application/json",
      // TODO UND_ERR_REQ_CONTENT_LENGTH_MISMATCHになるためいったんコメントアウト
      //      "Content-Length": payload.length.toString(),
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const client_api_request_endpoint =
    "https://verifiedid.did.msidentity.com/v1.0/verifiableCredentials/createIssuanceRequest";
  let url = "";
  try {
    const response = await fetch(client_api_request_endpoint, fetchOptions);
    const resp = await response.json();
    if (resp.error) {
      console.log("failed createIssuanceRequest:", resp.error);
    }
    console.log(resp);
    url = resp.url;
    console.log("url =", url);
  } catch (e) {
    console.log("ERROR END:", e);
  }

  //const { url } = await response.json();

  //const { url } = resp.url;
  //console.log("url:", url);
  console.log("### END issueRequest ###");
  //sessionId

  return { pin, url, sessionId };
  //  return { pin, url };
};

export const presentationRequest = async (sessionId: string) => {
  console.log(`### START presentationRequest sessionId:${sessionId}`);
  let accessToken = "";
  try {
    const result = await msalCca.acquireTokenByClientCredential(
      msalClientCredentialRequest
    );
    if (result) {
      accessToken = result.accessToken;
    }
  } catch {
    console.log("failed to get access token");
  }

  // const clientName = process.env.clientName as string;
  // const authority = process.env.authority as string;

  presentationConfig.registration.clientName = clientName;
  presentationConfig.authority = did_authority;
  if (process.env.baseURL === "http://localhost:3000") {
    presentationConfig.callback.url =
      "https://example.com/api/verifier/presentation-request-callback"; // localhostだとAPI実行でエラーになるため、ダミー
  } else {
    presentationConfig.callback.url =
      process.env.baseURL + "/api/verifier/presentation-request-callback";
  }

  // セッションidを入れてコールバック側へ引き継ぐ
  presentationConfig.callback.state = sessionId;
  presentationConfig.requestedCredentials[0].type = "OpenBadgeV2";
  presentationConfig.requestedCredentials[0].acceptedIssuers = [did_authority];
  const payload = JSON.stringify(presentationConfig);
  console.log("presentationRequest:", payload);
  const fetchOptions = {
    method: "POST",
    body: payload,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": payload.length.toString(),
      Authorization: `Bearer ${accessToken}`,
    },
  };
  // NG old url const client_api_request_endpoint = `https://beta.did.msidentity.com/v1.0/f88bec5c-c13f-4f27-972f-72540d188693/verifiablecredentials/request`;
  const client_api_request_endpoint = `https://verifiedid.did.msidentity.com/v1.0/verifiableCredentials/createPresentationRequest`;
  let url = "";
  try {
    const response = await fetch(client_api_request_endpoint, fetchOptions);
    const resp = await response.json();
    if (resp.error) {
      console.log("failed createPresentationRequest:", resp.error);
    }
    console.log("resp :", resp);
    url = resp.url;
  } catch (e) {
    console.log("ERROR END:", e);
  }

  console.log("### END presentationRequest ###");

  return { url, sessionId };
};
