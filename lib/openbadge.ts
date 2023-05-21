import crypto from "crypto";
import axios from "axios";
const pngitxt = require("png-itxt");
const Through = require("stream").PassThrough;
import { Readable, Writable } from "stream";

const openBadgeVerifierURL =
  "https://openbadgesvalidator.imsglobal.org/results";

export const getBadgeClassById = async (badgeClassId: string): Promise<any> => {
  console.log("### start getBadgeClassById ###", badgeClassId);
  try {
    const badgeClass = await axios.get(badgeClassId).then((res) => res.data);

    console.log("### end getBadgeClassById ### badge class=", badgeClass);
    return badgeClass;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getBadgeClass = async (openBadgeMetadata: any): Promise<any> => {
  // const { data } = await axios.get(openBadgeMetadata.badge);
  console.log("### start getBadgeClass ###");
  try {
    //  badge: 'https://www.credly.com/api/v1/obi/v2/issuers/f5f28d70-c006-4a88-8e63-3b312ee79c57/badge_classes/1d431f6e-
    const badgeClass = await axios
      .get(openBadgeMetadata.badge)
      .then((res) => res.data);

    //console.log("badge class=", data);
    return badgeClass;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const setOpenBadgeMetadataToImage = async (
  imageString: string,
  assertion: any
) => {
  console.log(" start setOpenBadgeMetadataToImage");
  // iTXtチャンクに書き込むメタデータを作成する
  const iTXtData = {
    type: "iTXt",
    keyword: "openbadges",
    value: JSON.stringify(assertion),
    language: "",
    translated: "",
    compressed: false,
    compression_type: 0,
  };
  //  return new Promise(function (resolve, reject) {
  return new Promise<any>(function (resolve, reject) {
    // let binaryImage = Uint8Array.from(Buffer.from(imageString, "base64"));

    let binaryImage = Buffer.from(imageString, "base64");
    const stream = Readable.from(binaryImage);
    //console.log("stream:", stream);
    // console.log("binaryImage:", binaryImage);
    //let start = new Through();
    //const writStream = fs.createWriteStream("hoge.png");
    const writStream = new Writable();

    const chunks: Uint8Array[] = [];

    stream
      .pipe(
        pngitxt.set(
          //{ keyword: "openbadges", value: JSON.stringify(assertion) },
          iTXtData,
          true
        )
      )
      .on("data", (chunk: Uint8Array) => {
        //       const base64String = chunk.toString("base64");
        chunks.push(chunk);
      })
      .on("end", () => {
        console.log("outputStream.end");
        const uint8ArrayData = new Uint8Array(Buffer.concat(chunks));
        //        const base64Data = uint8ArrayToBase64(uint8ArrayData);
        //console.log("pngitxt set data:", base64Data);
        const openBadgesBase64EncodedData =
          Buffer.from(uint8ArrayData).toString("base64");
        //console.log("end base64EncodedData=", openBadgesBase64EncodedData);
        //return openBadgesBase64EncodedData;
        resolve(openBadgesBase64EncodedData);
      })
      .on("error", (err: Error) => {
        console.log("pngitxt Error:", err);
        reject(err);
      });

    console.log("end pngitxt");
  });
};

const uint8ArrayToBase64 = (bytes: Uint8Array) => {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export const extractOpenBadgeMetadataFromImage = (imageString: string) => {
  const file = Buffer.from(imageString, "base64");
  // console.log("start extractOpenBadgeMetadataFromImage: file=", file);
  //  return new Promise(function (resolve, reject) {
  return new Promise<any>(function (resolve, reject) {
    const start = new Through();
    start.pipe(
      pngitxt.get("openbadges", function (err: any, data: any) {
        if (err) {
          reject(err);
        }
        resolve(JSON.parse(data.value));
      })
    );
    start.write(file);
  });
};

export const validateOpenBadge = async (
  email: string,
  openBadgeMetadata: any
) => {
  const [, expectedEmailHash] = openBadgeMetadata.recipient.identity.split("$");
  const salt = openBadgeMetadata.recipient.salt;
  let saltVal = salt === null || salt === undefined ? "" : salt;
  console.log("saltVal=", saltVal);
  const inputEmailHash = crypto
    .createHash("sha256")
    .update(email + saltVal)
    .digest("hex");

  if (inputEmailHash !== expectedEmailHash) {
    return false;
  }

  // TODO NOTE: We tested this code is working fine, but Currently this API is not stable, so for the better demo, the verification code is comment outed.

  const { data } = await axios.post(
    openBadgeVerifierURL,
    {
      data: JSON.stringify(openBadgeMetadata),
    },
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
  console.log("END openBadgeValidator ret=", data.report.valid);
  return data.report.valid;
  //return true;
};
