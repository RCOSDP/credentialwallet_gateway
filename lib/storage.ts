import { BlobServiceClient } from "@azure/storage-blob";
import ruleTemplate from "../templates/rules.json";
import displayTemplate from "../templates/display.json";

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING as string
);

const containerName = "vcstg";
const containerClient = blobServiceClient.getContainerClient(containerName);

export const uploadRule = async () => {
  const file_id = "";
  const rulesFileName = "rules_" + file_id + ".json";
  ruleTemplate.vc.type = [
    "https://www.credly.com/org/idpro/badge/cidpro-certified-foundation-level”,“https://w3id.org/openbadges/v2",
  ];
  const rulesBlockBlobClient =
    containerClient.getBlockBlobClient(rulesFileName);
  const rulesData = JSON.stringify(ruleTemplate);
  return await rulesBlockBlobClient.upload(rulesData, rulesData.length);
};

export const uploadDisplay = async () => {
  const file_id = "";
  const displayFileName = "display_" + file_id + ".json";
  displayTemplate.default.card.title = "CIDPRO™ Certified - Foundation Level";
  displayTemplate.default.card.issuedBy = "IDPro";
  const displayBlockBlobClient =
    containerClient.getBlockBlobClient(displayFileName);
  const displayData = JSON.stringify(displayTemplate);
  return await displayBlockBlobClient.upload(displayData, displayData.length);
};
