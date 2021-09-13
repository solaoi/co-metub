import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes, useQuery } from "blitz"
import Layout from "app/core/layouts/Layout"
import getProjects from "app/projects/queries/getProjects"
import {
  Heading,
  Box,
  Button,
  Spinner,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react"
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "@chakra-ui/icons"
import { HiViewGridAdd } from "react-icons/hi"
import getStubs from "app/stubs/queries/getStubs"

const ITEMS_PER_PAGE = 8

const BreadCrumb = () => (
  <Breadcrumb m="2" color="#666">
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>

    <BreadcrumbItem>
      <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
    </BreadcrumbItem>
  </Breadcrumb>
)

const UpdatedBy = ({ project }) => {
  const [latestStub] = useQuery(
    getStubs,
    {
      where: { projectId: project.id },
      orderBy: { updatedAt: "desc" },
      take: 1,
    },
    { cacheTime: 1000 }
  )
  if (!latestStub.stubs[0]) {
    return <Td>{project.updatedBy}</Td>
  }
  if (latestStub.stubs[0].updatedAt > project.updatedAt) {
    return <Td>{latestStub.stubs[0].updatedBy}</Td>
  } else {
    return <Td>{project.updatedBy}</Td>
  }
}

export const ProjectsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const name = router.query.name
  const where = ((name) => {
    if (Array.isArray(name)) {
      name = name[0]
    }
    if (name) {
      return { name: { startsWith: name } }
    }
    return null
  })(name)

  const [{ projects, hasMore }] = usePaginatedQuery(getProjects, {
    orderBy: { updatedAt: "desc" },
    ...(where && { where }),
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })
  const goToPreviousPage = () => router.push({ query: { ...(name && { name }), page: page - 1 } })
  const goToNextPage = () => router.push({ query: { ...(name && { name }), page: page + 1 } })

  return (
    <Flex align="center" justify="center" m={5}>
      <Box w="80%">
        <Heading>Projects</Heading>
        <Flex justify="flex-end">
          <Link href={Routes.NewProjectPage()}>
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
        <InputGroup w="30%">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="Name"
            size="sm"
            borderRadius="lg"
            _focus={{ borderColor: "teal.400" }}
            onKeyDown={(e) => {
              if (e.code === "Enter") {
                const name = e.currentTarget.value
                router.push({ query: { ...(name && { name }) } })
              }
            }}
          />
        </InputGroup>
        <Table variant="simple" mb={5}>
          <Thead>
            <Tr>
              <Th>name</Th>
              <Th>base-path</Th>
              <Th>created-by</Th>
              <Th>updated-by</Th>
            </Tr>
          </Thead>
          <Tbody>
            {projects.map((project) => (
              <Link href={Routes.ShowProjectPage({ projectId: project.id })} key={project.id}>
                <Tr
                  style={{ cursor: "pointer" }}
                  _hover={{ color: "#fff", bg: "teal.400", borderColor: "teal.400" }}
                >
                  <Td>{project.name}</Td>
                  <Td>{project.basePath}</Td>
                  <Td>{project.createdBy}</Td>
                  <Suspense fallback={<Td></Td>}>
                    <UpdatedBy project={project} />
                  </Suspense>
                </Tr>
              </Link>
            ))}
          </Tbody>
        </Table>

        <Flex justify="space-between">
          <Button
            disabled={page === 0}
            onClick={goToPreviousPage}
            colorScheme="teal"
            variant="solid"
            _hover={{ bg: "teal.400", borderColor: "teal.400" }}
            leftIcon={<ChevronLeftIcon />}
          >
            Previous
          </Button>
          <Button
            disabled={!hasMore}
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
  )
}

const ProjectsPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>プロジェクト一覧</title>
      </Head>

      <div>
        <BreadCrumb />
        <Suspense
          fallback={
            <Flex align="center" justify="center">
              <Spinner />
            </Flex>
          }
        >
          <ProjectsList />
        </Suspense>
      </div>
    </>
  )
}

ProjectsPage.authenticate = true
ProjectsPage.getLayout = (page) => <Layout>{page}</Layout>

export default ProjectsPage
