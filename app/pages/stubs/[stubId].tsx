import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getStub from "app/stubs/queries/getStub"
import deleteStub from "app/stubs/mutations/deleteStub"
import {
  Box,
  Button,
  Heading,
  Spinner,
  Flex,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Text,
} from "@chakra-ui/react"
import getProject from "app/projects/queries/getProject"
import { DeleteIcon, EditIcon } from "@chakra-ui/icons"
import { HiOutlineClipboardCopy } from "react-icons/hi"
import { CopyToClipboard } from "react-copy-to-clipboard"

const BreadCrumb = ({ stub }) => {
  const [project] = useQuery(getProject, { id: stub.projectId })

  return (
    <Suspense fallback={<></>}>
      <Breadcrumb m="2" color="#666">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink href={`/projects/${stub.projectId}`}>{project.name}</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink href={`/stubs/${stub.id}`}>Stub</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    </Suspense>
  )
}
const CopyUrlButton = ({ stub }) => {
  const [project] = useQuery(getProject, { id: stub.projectId })
  return (
    <Suspense fallback={<></>}>
      <CopyToClipboard
        text={`${location.protocol}//${location.host}/api${project.basePath}${stub.path}`}
      >
        <Button
          mr="2"
          colorScheme="gray"
          variant="solid"
          _hover={{ bg: "gray.400", borderColor: "gray.400" }}
          leftIcon={<HiOutlineClipboardCopy />}
        >
          <a>COPY URL</a>
        </Button>
      </CopyToClipboard>
    </Suspense>
  )
}

export const Stub = () => {
  const router = useRouter()
  const stubId = useParam("stubId", "number")
  const [deleteStubMutation] = useMutation(deleteStub)
  const [stub] = useQuery(getStub, { id: stubId })

  return (
    <Box>
      <BreadCrumb stub={stub} />
      <Flex align="center" justify="center" m={5}>
        <Box w="80%">
          <Heading size="lg" as="h1">
            Stub
          </Heading>
          <Flex justify="flex-end">
            <CopyUrlButton stub={stub} />
            <Link href={Routes.EditStubPage({ stubId: stub.id })}>
              <Button
                mr="2"
                colorScheme="blue"
                variant="solid"
                _hover={{ bg: "blue.400", borderColor: "blue.400" }}
                leftIcon={<EditIcon />}
              >
                <a>EDIT</a>
              </Button>
            </Link>
            <Button
              colorScheme="red"
              variant="solid"
              _hover={{ bg: "red.400", borderColor: "red.400" }}
              leftIcon={<DeleteIcon />}
              onClick={async () => {
                if (window.confirm("This will be deleted")) {
                  await deleteStubMutation({ id: stub.id })
                  router.push(Routes.ProjectsPage())
                }
              }}
            >
              DELETE
            </Button>
          </Flex>
          <Box fontSize="md" mr="1" ml="1" mt="1" mb="5" p="1" borderWidth="1px" borderRadius="lg">
            <Flex justify="space-between">
              <Box flex="1">
                <Flex direction="column" fontWeight="bold" color="#666">
                  <Text mb="1">path</Text>
                  <Text mb="1">createdBy</Text>
                  <Text mb="1">createdAt</Text>
                  <Text mb="1">updatedBy</Text>
                  <Text mb="1">updatedAt</Text>
                  <Text mb="1">method</Text>
                  <Text mb="1">contentType</Text>
                  <Text mb="1">statusCode</Text>
                  <Text>response</Text>
                </Flex>
              </Box>
              <Box flex="2">
                <Flex direction="column">
                  <Text mb="1">{stub.path}</Text>
                  <Text mb="1">{stub.createdBy}</Text>
                  <Text mb="1">{stub.createdAt.toLocaleString()}</Text>
                  <Text mb="1">{stub.updatedBy}</Text>
                  <Text mb="1">{stub.updatedAt.toLocaleString()}</Text>
                  <Text mb="1">{stub.method}</Text>
                  <Text mb="1">{stub.contentType}</Text>
                  <Text mb="1">{stub.statusCode}</Text>
                  <Box w="100%" p="2" bgColor="#3c3c3c" color="#fff" borderRadius="lg">
                    <pre style={{ whiteSpace: "pre-wrap" }}>
                      {(() => {
                        try {
                          return JSON.stringify(JSON.parse(stub.response), null, 2)
                        } catch {
                          return stub.response
                        }
                      })()}
                    </pre>
                  </Box>
                </Flex>
              </Box>
            </Flex>
          </Box>
        </Box>
      </Flex>
    </Box>
  )
}

const ShowStubPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Stub</title>
      </Head>
      <Suspense
        fallback={
          <Flex align="center" justify="center">
            <Spinner />
          </Flex>
        }
      >
        <Stub />
      </Suspense>
    </>
  )
}

ShowStubPage.authenticate = true
ShowStubPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowStubPage
