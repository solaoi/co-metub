import { Suspense } from "react"
import {
  Head,
  Link,
  useRouter,
  useQuery,
  useParam,
  BlitzPage,
  useMutation,
  Routes,
  usePaginatedQuery,
} from "blitz"
import Layout from "app/core/layouts/Layout"
import getProject from "app/projects/queries/getProject"
import deleteProject from "app/projects/mutations/deleteProject"
import getStubs from "app/stubs/queries/getStubs"
import {
  Heading,
  Box,
  Spinner,
  Flex,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Text,
} from "@chakra-ui/react"
import { HiViewGridAdd, HiOutlineClipboardCopy } from "react-icons/hi"
import { ChevronLeftIcon, ChevronRightIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons"
import { CopyToClipboard } from "react-copy-to-clipboard"

const BreadCrumb = ({ project }) => {
  return (
    <Breadcrumb m="2" color="#666">
      <BreadcrumbItem>
        <BreadcrumbLink href="/">Home</BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href={`/projects/${project.id}`}>{project.name}</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  )
}

const CopyUrlButton = ({ project, stub }) => (
  <Suspense fallback={<></>}>
    <CopyToClipboard
      text={`${location.protocol}//${location.host}/api${project.basePath}${stub.path}`}
    >
      <Button
        mr="2"
        color="#000"
        colorScheme="gray"
        variant="solid"
        _hover={{ bg: "gray.400", borderColor: "gray.400" }}
        onClick={(e) => e.stopPropagation()}
      >
        <HiOutlineClipboardCopy />
      </Button>
    </CopyToClipboard>
  </Suspense>
)

const UpdatedInfo = ({ stub, project }) => {
  if (!stub.stubs[0]) {
    return (
      <>
        <Text mb="1">{project.updatedBy}</Text>
        <Text mb={project.memo !== "" ? 1 : 0}>{project.updatedAt.toLocaleString()}</Text>
      </>
    )
  }
  if (stub.stubs[0].updatedAt > project.updatedAt) {
    return (
      <>
        <Text mb="1">{stub.stubs[0].updatedBy}</Text>
        <Text mb={project.memo !== "" ? 1 : 0}>{stub.stubs[0].updatedAt.toLocaleString()}</Text>
      </>
    )
  } else {
    return (
      <>
        <Text mb="1">{project.updatedBy}</Text>
        <Text mb={project.memo !== "" ? 1 : 0}>{project.updatedAt.toLocaleString()}</Text>
      </>
    )
  }
}

export const Project = () => {
  const router = useRouter()
  const projectId = useParam("projectId", "number")
  const [deleteProjectMutation] = useMutation(deleteProject)
  const [project] = useQuery(getProject, { id: projectId })

  // stub pagination
  const ITEMS_PER_PAGE = 8
  const page = Number(router.query.page) || 0
  const [{ stubs, hasMore }] = usePaginatedQuery(getStubs, {
    where: { projectId: projectId },
    orderBy: { updatedAt: "desc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })
  const [latestStub] = useQuery(
    getStubs,
    {
      where: { projectId: projectId },
      orderBy: { updatedAt: "desc" },
      take: 1,
    },
    { cacheTime: 1000 }
  )
  const goToPreviousPage = () => router.push({ query: { projectId, page: page - 1 } })
  const goToNextPage = () => router.push({ query: { projectId, page: page + 1 } })

  return (
    <>
      <Head>
        <title>{project.name}</title>
      </Head>

      <div>
        <BreadCrumb project={project} />
        <Flex align="center" justify="center" m={5}>
          <Box w="80%">
            <Heading size="lg">{project.name}</Heading>
            <Flex justify="flex-end">
              <Link href={Routes.EditProjectPage({ projectId: project.id })}>
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
                    await deleteProjectMutation({ id: project.id })
                    router.push(Routes.ProjectsPage())
                  }
                }}
              >
                DELETE
              </Button>
            </Flex>

            <Box
              fontSize="md"
              mr="1"
              ml="1"
              mt="1"
              mb="5"
              p="1"
              borderWidth="1px"
              borderRadius="lg"
            >
              <Flex justify="space-between">
                <Box flex="1">
                  <Flex direction="column" fontWeight="bold" color="#666">
                    <Text mb="1">basePath</Text>
                    <Text mb="1">createdBy</Text>
                    <Text mb="1">createdAt</Text>
                    <Text mb="1">updatedBy</Text>
                    <Text mb={project.memo !== "" ? 1 : 0}>updatedAt</Text>
                    {project.memo !== "" && <Text>memo</Text>}
                  </Flex>
                </Box>
                <Box flex="2">
                  <Flex direction="column">
                    <Text mb="1">{project.basePath}</Text>
                    <Text mb="1">{project.createdBy}</Text>
                    <Text mb="1">{project.createdAt.toLocaleString()}</Text>
                    <UpdatedInfo stub={latestStub} project={project} />
                    {project.memo !== "" && (
                      <Text
                        maxH="150"
                        overflowY="auto"
                        style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
                        borderRadius="lg"
                        borderWidth="1px"
                      >
                        {project.memo}
                      </Text>
                    )}
                  </Flex>
                </Box>
              </Flex>
            </Box>
            <Heading size="lg" as="h3">
              Stubs
            </Heading>
            <Flex justify="flex-end">
              <Link href={Routes.NewStubPage({ projectId: project.id })}>
                <Button
                  colorScheme="blue"
                  variant="solid"
                  _hover={{ bg: "blue.400", borderColor: "blue.400" }}
                  leftIcon={<HiViewGridAdd />}
                >
                  ADD
                </Button>
              </Link>
            </Flex>
            <Box overflowX="auto">
              <Table variant="simple" mb={5}>
                <Thead>
                  <Tr>
                    <Th>path</Th>
                    <Th>method</Th>
                    <Th>content-type</Th>
                    <Th>status-code</Th>
                    <Th>copy-url</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {stubs.map((stub) => (
                    <Link
                      href={Routes.ShowStubPage({ stubId: stub.id })}
                      key={`${stub.projectId}_${stub.id}`}
                    >
                      <Tr
                        style={{ cursor: "pointer" }}
                        _hover={{ color: "#fff", bg: "teal.400", borderColor: "teal.400" }}
                      >
                        <Td>{stub.path}</Td>
                        <Td>{stub.method}</Td>
                        <Td>{stub.contentType}</Td>
                        <Td>{stub.statusCode}</Td>
                        <Td>
                          <CopyUrlButton project={project} stub={stub} />
                        </Td>
                      </Tr>
                    </Link>
                  ))}
                </Tbody>
              </Table>
            </Box>

            <Flex justify="space-between">
              <Button
                isDisabled={page === 0}
                onClick={goToPreviousPage}
                colorScheme="teal"
                variant="solid"
                _hover={{ bg: "teal.400", borderColor: "teal.400" }}
                leftIcon={<ChevronLeftIcon />}
              >
                Previous
              </Button>
              <Button
                isDisabled={!hasMore}
                onClick={goToNextPage}
                colorScheme="teal"
                variant="solid"
                _hover={{ bg: "teal.400", borderColor: "teal.400" }}
                rightIcon={<ChevronRightIcon />}
              >
                Next
              </Button>
            </Flex>
          </Box>
        </Flex>
      </div>
    </>
  )
}

const ShowProjectPage: BlitzPage = () => {
  return (
    <div>
      <Suspense
        fallback={
          <Flex align="center" justify="center">
            <Spinner />
          </Flex>
        }
      >
        <Project />
      </Suspense>
    </div>
  )
}

ShowProjectPage.authenticate = true
ShowProjectPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowProjectPage
