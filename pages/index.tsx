import React from "react";
import type { NextPage } from "next";
import { Button, Text, Container, Heading, Stack } from "@chakra-ui/react";

import { Layout } from "../components/Layout";
import { Metatag } from "../components/Metatag";
import { SERVICE_NAME, SERVICE_DESCRITION } from "../configs";
import NextLink from "next/link";

const Home: NextPage = () => {
  return (
    <Layout maxW="5xl" textAlign="center" align="center">
      <Metatag title={SERVICE_NAME} description={SERVICE_DESCRITION} />
      <Heading
        fontWeight={600}
        fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
        lineHeight={"110%"}
      >
        Verifiable Credential meets{" "}
        <Text as={"span"} color={"green.400"}>
          OpenBadge
        </Text>
      </Heading>
      <Text color={"gray.500"} maxW={"3xl"}>
        {SERVICE_DESCRITION}
      </Text>
      <Stack spacing={8} direction={"row"}>
        <NextLink href="/moodle2vc" passHref>
          <Button
            as={"a"}
            rounded={"full"}
            px={6}
            colorScheme={"green"}
            bg={"green.400"}
            _hover={{ bg: "green.500" }}
          >
            Get My Badges from Moodle
          </Button>
        </NextLink>
        {/* 
        <NextLink href="/issue" passHref>
          <Button
            as={"a"}
            rounded={"full"}
            px={6}
            colorScheme={"green"}
            bg={"green.400"}
            _hover={{ bg: "green.500" }}
          >
            Issue
          </Button>
        </NextLink>
      */}
        <NextLink href="/verify" passHref>
          <Button
            as={"a"}
            rounded={"full"}
            px={6}
            colorScheme={"green"}
            bg={"green.400"}
            _hover={{ bg: "green.500" }}
          >
            Verify
          </Button>
        </NextLink>
      </Stack>
    </Layout>
  );
};

export default Home;
