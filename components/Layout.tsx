import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

import { Flex, Box, Container, Stack } from "@chakra-ui/react";

export interface LayoutProps {
  children: React.ReactNode;
  maxW?: string;
  textAlign?: "center";
  align?: string;
}

export const Layout: React.VFC<LayoutProps> = ({
  children,
  maxW,
  textAlign,
  align,
}) => {
  return (
    <Flex minHeight={"100vh"} direction={"column"}>
      <Header />
      <Box flex={1}>
        <Container maxW={maxW}>
          <Stack
            textAlign={textAlign}
            align={align}
            spacing={{ base: 8, md: 10 }}
            py={{ base: 20, md: 28 }}
          >
            {children}
          </Stack>
        </Container>
      </Box>
      <Footer />
    </Flex>
  );
};
