import { Image, Link, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import logo from "public/logo.png"
import { Flex, Button } from "@chakra-ui/react"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { HiOutlineLogin, HiUserAdd, HiOutlineEmojiHappy } from "react-icons/hi"
import { Suspense } from "react"

const UserInfo = () => {
  const currentUser = useCurrentUser()
  if (currentUser) {
    return (
      <Link href="/projects">
        <Button
          mr="2"
          colorScheme="teal"
          variant="solid"
          _hover={{ bg: "teal.400", borderColor: "teal.400" }}
          leftIcon={<HiOutlineEmojiHappy />}
        >
          <a>Let&apos;s Start</a>
        </Button>
      </Link>
    )
  } else {
    return (
      <Flex>
        <Link href={Routes.SignupPage()}>
          <Button
            mr="2"
            colorScheme="teal"
            variant="solid"
            _hover={{ bg: "teal.400", borderColor: "teal.400" }}
            leftIcon={<HiUserAdd />}
          >
            <a>Sign Up</a>
          </Button>
        </Link>
        <Link href={Routes.LoginPage()}>
          <Button
            mr="2"
            colorScheme="teal"
            variant="solid"
            _hover={{ bg: "teal.400", borderColor: "teal.400" }}
            leftIcon={<HiOutlineLogin />}
          >
            <a>Login</a>
          </Button>
        </Link>
      </Flex>
    )
  }
}

const Home: BlitzPage = () => {
  return (
    <div className="container">
      <main>
        <Flex align="center" justify="center" direction="column">
          <Image src={logo} alt="co-metub" />

          <Suspense fallback="">
            <UserInfo />
          </Suspense>
        </Flex>
      </main>
    </div>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
