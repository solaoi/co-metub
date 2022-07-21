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
import { DeleteIcon, EditIcon, DownloadIcon } from "@chakra-ui/icons"
import { HiOutlineClipboardCopy } from "react-icons/hi"
import { CopyToClipboard } from "react-copy-to-clipboard"
import formatXml from "xml-formatter"
import { saveAs } from "file-saver"

const BreadCrumb = ({ stub, project }) => {
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
const CopyUrlButton = ({ stub, project }) => {
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
  const [project] = useQuery(getProject, { id: stub.projectId })

  return (
    <Box>
      <BreadCrumb stub={stub} project={project} />
      <Flex align="center" justify="center" m={5}>
        <Box w="80%">
          <Heading size="lg" as="h1">
            Stub
          </Heading>
          <Flex justify="flex-end">
            <CopyUrlButton stub={stub} project={project} />
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
              mr="2"
              colorScheme="teal"
              variant="solid"
              _hover={{ bg: "teal.400", borderColor: "teal.400" }}
              leftIcon={<DownloadIcon />}
              onClick={async () => {
                const { path, method, contentType, statusCode, response, sleep } = stub
                const blob = new Blob(
                  [
                    JSON.stringify(
                      {
                        path: `/api${project.basePath}${path}`,
                        method,
                        contentType,
                        statusCode,
                        response,
                        sleep: sleep * 1000,
                      },
                      null,
                      2
                    ),
                  ],
                  {
                    type: "application/json; charset=utf-8",
                  }
                )
                saveAs(blob, `co-metub_s${stub.id}.json`)
              }}
            >
              EXPORT
            </Button>
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
          <Flex fontSize="md" mr="1" ml="1" mt="1" mb="5" p="1" borderWidth="1px" borderRadius="lg">
            <Box w="33%">
              <Flex direction="column" fontWeight="bold" color="#666">
                <Text mb="1" h="1.5rem">
                  path
                </Text>
                <Text mb="1" h="1.5rem">
                  createdBy
                </Text>
                <Text mb="1" h="1.5rem">
                  createdAt
                </Text>
                <Text mb="1" h="1.5rem">
                  updatedBy
                </Text>
                <Text mb="1" h="1.5rem">
                  updatedAt
                </Text>
                <Text mb="1" h="1.5rem">
                  method
                </Text>
                <Text mb="1" h="1.5rem">
                  contentType
                </Text>
                <Text mb="1" h="1.5rem">
                  statusCode
                </Text>
                {stub.sleep !== 0 && (
                  <>
                    <Text mb="1" h="1.5rem">
                      sleep
                    </Text>
                  </>
                )}
                {stub.ntimesError !== 0 && (
                  <>
                    <Text mb="1" h="1.5rem">
                      ntimesError
                    </Text>
                    <Text mb="1" h="1.5rem">
                      ntimesErrorStatusCode
                    </Text>
                  </>
                )}
                {stub.memo !== "" && (
                  <Text mb="1" h="100">
                    memo
                  </Text>
                )}
                <Text>response</Text>
              </Flex>
            </Box>
            <Box w="66%">
              <Flex direction="column">
                <Text mb="1" h="1.5rem">
                  {stub.path}
                </Text>
                <Text mb="1" h="1.5rem">
                  {stub.createdBy}
                </Text>
                <Text mb="1" h="1.5rem">
                  {stub.createdAt.toLocaleString()}
                </Text>
                <Text mb="1" h="1.5rem">
                  {stub.updatedBy}
                </Text>
                <Text mb="1" h="1.5rem">
                  {stub.updatedAt.toLocaleString()}
                </Text>
                <Text mb="1" h="1.5rem">
                  {stub.method}
                </Text>
                <Text mb="1" h="1.5rem">
                  {stub.contentType}
                </Text>
                <Text mb="1" h="1.5rem">
                  {stub.statusCode}
                </Text>
                {stub.sleep !== 0 && (
                  <>
                    <Text mb="1" h="1.5rem">
                      {stub.sleep} s
                    </Text>
                  </>
                )}
                {stub.ntimesError !== 0 && (
                  <>
                    <Text mb="1" h="1.5rem">
                      {stub.ntimesError} times
                    </Text>
                    <Text mb="1" h="1.5rem">
                      {stub.ntimesErrorStatusCode}
                    </Text>
                  </>
                )}
                {stub.memo !== "" && (
                  <Text
                    h="100"
                    overflowY="auto"
                    mb="1"
                    style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
                    borderRadius="lg"
                    borderWidth="1px"
                  >
                    {stub.memo}
                  </Text>
                )}
                <Box
                  w="100%"
                  p="2"
                  bgColor="#3c3c3c"
                  color="#fff"
                  borderRadius="lg"
                  maxH="300"
                  overflowY="auto"
                >
                  <pre style={{ whiteSpace: "pre-wrap" }}>
                    {(() => {
                      try {
                        if (
                          stub.contentType === "application/json" ||
                          stub.contentType === "text/json"
                        ) {
                          return JSON.stringify(JSON.parse(stub.response), null, 2)
                        } else if (stub.contentType === "application/xml") {
                          return formatXml(stub.response, { lineSeparator: "\n" })
                        } else {
                          return stub.response
                        }
                      } catch {
                        return stub.response
                      }
                    })()}
                  </pre>
                </Box>
              </Flex>
            </Box>
          </Flex>
          <Heading size="md" as="h3" mb="1">
            Recent Requests
          </Heading>
          <Box
            h="300"
            overflowY="auto"
            w="100%"
            p="2"
            bgColor="#3c3c3c"
            color="#fff"
            borderRadius="lg"
          >
            {stub.logs
              ? stub.logs
                  .split("\t")
                  .filter((s) => s !== "")
                  .map((l, i) => (
                    <div key={"log_" + i}>
                      <pre style={{ whiteSpace: "pre-wrap" }}>{i !== 0 ? `\n${l}` : l}</pre>
                      <hr />
                    </div>
                  ))
              : "Never been requested..."}
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
