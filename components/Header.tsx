import React from "react";

import { Box, Flex, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { SERVICE_NAME } from "../configs";

export const Header: React.VFC = () => {
  return (
    <Box>
      <Flex
        minH={"64px"}
        alignItems={"center"}
        justifyContent={"space-between"}
        p={{ base: 8 }}
      >
        <NextLink href="/">
          <Link fontSize={"xl"} fontWeight={"bold"}>
            {SERVICE_NAME}
          </Link>
        </NextLink>
        <Flex gap={"16px"}>
          <NextLink href="/issue">
            <Link fontSize={"lg"} fontWeight={"bold"}>
              Issue
            </Link>
          </NextLink>
          <NextLink href="/verify">
            <Link fontSize={"lg"} fontWeight={"bold"}>
              Verify
            </Link>
          </NextLink>
        </Flex>
      </Flex>
    </Box>
  );
};
