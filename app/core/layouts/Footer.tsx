import React from "react"
import { Flex, Text } from "@chakra-ui/react"

const Footer = (props) => {
  return (
    <Flex align="center" justify="center" h={50} bg="teal.500" color="white" {...props}>
      <Text>&copy; solaoi</Text>
    </Flex>
  )
}

export default Footer
