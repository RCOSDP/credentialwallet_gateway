import React from "react";
import { Flex, Link } from "@chakra-ui/react";
export const Footer: React.VFC = () => {
  return (
    <Flex
      minH={"64px"}
      alignItems={"center"}
      justifyContent={"center"}
      p={{ base: 4 }}
      gap={"16px"}
    >
      <Link
        href="https://github.com/block-base/openbadge-vc-converter"
        fontSize={"sm"}
        fontWeight={"medium"}
      >
        DID Maniax Japan @ 2022
      </Link>
    </Flex>
  );
};
