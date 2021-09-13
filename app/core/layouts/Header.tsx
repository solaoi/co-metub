import React, { Suspense } from "react"
import { Box, Heading, Flex, Link as ChakraLink, Button } from "@chakra-ui/react"
import { Link, useMutation, Routes } from "blitz"
import logout from "app/auth/mutations/logout"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { HiViewList, HiOutlineLogin, HiOutlineLogout, HiUserAdd } from "react-icons/hi"

const UserInfo = () => {
  const [logoutMutation] = useMutation(logout)
  const currentUser = useCurrentUser()
  if (currentUser) {
    return (
      <>
        <Box mr={2}>user: {currentUser.name}</Box>
        <Button
          leftIcon={<HiOutlineLogout />}
          variant="outline"
          _hover={{ bg: "teal.700", borderColor: "teal.700" }}
          onClick={async () => {
            await logoutMutation()
          }}
        >
          Logout
        </Button>
      </>
    )
  } else {
    return (
      <>
        <Link href={Routes.SignupPage()}>
          <Button
            leftIcon={<HiUserAdd />}
            mr={2}
            variant="outline"
            _hover={{ bg: "teal.700", borderColor: "teal.700" }}
          >
            Sign Up
          </Button>
        </Link>
        <Link href={Routes.LoginPage()}>
          <Button
            leftIcon={<HiOutlineLogin />}
            variant="outline"
            _hover={{ bg: "teal.700", borderColor: "teal.700" }}
          >
            Login
          </Button>
        </Link>
      </>
    )
  }
}

const Header = (props) => {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding={5}
      bg="teal.500"
      color="white"
      {...props}
    >
      <Flex align="center" mr={5}>
        <Heading as="h1" size="lg" letterSpacing={"tighter"}>
          <ChakraLink href="/">co-metub</ChakraLink>
        </Heading>
      </Flex>

      <Flex flexGrow={1} align="center">
        <HiViewList />
        <ChakraLink href="/projects">Projects</ChakraLink>
      </Flex>

      <Suspense fallback="">
        <UserInfo />
      </Suspense>
    </Flex>
  )
}

export default Header
