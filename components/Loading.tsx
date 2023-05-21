import React from "react";
import { Box, Spinner, Text } from "@chakra-ui/react";
export const Loading: React.VFC = () => {
  return (
    <Box>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="green.400"
        size="xl"
      />
      <Text mt="4">Loading...</Text>
    </Box>
  );
};
