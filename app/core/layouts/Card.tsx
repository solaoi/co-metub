import React from "react"
import { Box, Heading } from "@chakra-ui/react"

const Card = ({
  heading,
  children,
  bgColor = "#FFF",
}: {
  heading: string
  children: any
  bgColor?: string
}) => {
  return (
    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" bgColor={bgColor}>
      <Box m="5">
        <Heading mb="5" as="h4" size="md">
          {heading}
        </Heading>
        {/* <Text m="5" mt="0">My cool blog post</Text> */}
        {children}
      </Box>
    </Box>
  )
}

export default Card
