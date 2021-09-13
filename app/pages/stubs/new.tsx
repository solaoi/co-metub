import { useRouter, useMutation, BlitzPage, Routes, useRouterQuery, useQuery } from "blitz"
import Layout from "app/core/layouts/Layout"
import createStub from "app/stubs/mutations/createStub"
import { StubForm, FORM_ERROR } from "app/stubs/components/StubForm"
import { Spinner, Flex, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react"
import getProject from "app/projects/queries/getProject"
import { Suspense } from "react"
import Card from "../../core/layouts/Card"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

const BreadCrumb = ({ projectId }) => {
  const [project] = useQuery(getProject, { id: projectId })
  return (
    <Suspense
      fallback={
        <Flex align="center" justify="center">
          <Spinner />
        </Flex>
      }
    >
      <Breadcrumb m="2" color="#666">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink href={`/projects/${projectId}`}>{project.name}</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink href={`/stubs/new?projectId=${projectId}`}>NewStub</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    </Suspense>
  )
}

const NewStubPage: BlitzPage = () => {
  const router = useRouter()
  const [createStubMutation] = useMutation(createStub)
  const query = useRouterQuery()
  const projectId = Number(query.projectId)
  const currentUser = useCurrentUser()

  return (
    <>
      <BreadCrumb projectId={projectId} />
      <Flex align="center" justify="center" m="6">
        <Card heading="New Stub">
          <StubForm
            initialValues={{ createdBy: currentUser?.name, updatedBy: currentUser?.name }}
            submitText="ADD"
            // TODO use a zod schema for form validation
            //  - Tip: extract mutation's schema into a shared `validations.ts` file and
            //         then import and use it here
            // schema={CreateStub}
            // initialValues={{}}
            onSubmit={async (values) => {
              try {
                const stub = await createStubMutation(values)
                router.push(Routes.ShowProjectPage({ projectId }))
              } catch (error) {
                console.error(error)
                return {
                  [FORM_ERROR]: error.toString(),
                }
              }
            }}
          />
        </Card>
      </Flex>
    </>
  )
}

NewStubPage.authenticate = true
NewStubPage.getLayout = (page) => (
  <Suspense
    fallback={
      <Flex align="center" justify="center">
        <Spinner />
      </Flex>
    }
  >
    <Layout title={"Create New Stub"}>{page}</Layout>
  </Suspense>
)

export default NewStubPage
