import { useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createProject from "app/projects/mutations/createProject"
import { ProjectForm, FORM_ERROR } from "app/projects/components/ProjectForm"
import { Suspense } from "react"
import { Spinner, Flex, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react"
import Card from "../../core/layouts/Card"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

const BreadCrumb = () => (
  <Breadcrumb m="2" color="#666">
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>

    <BreadcrumbItem>
      <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
    </BreadcrumbItem>

    <BreadcrumbItem>
      <BreadcrumbLink href="/projects/new">New</BreadcrumbLink>
    </BreadcrumbItem>
  </Breadcrumb>
)

const NewProjectPage: BlitzPage = () => {
  const router = useRouter()
  const [createProjectMutation] = useMutation(createProject)
  const currentUser = useCurrentUser()

  return (
    <>
      <BreadCrumb />
      <Flex align="center" justify="center" m="6">
        <Card heading="New Project">
          <ProjectForm
            initialValues={{ createdBy: currentUser?.name, updatedBy: currentUser?.name }}
            submitText="ADD"
            // TODO use a zod schema for form validation
            //  - Tip: extract mutation's schema into a shared `validations.ts` file and
            //         then import and use it here
            // schema={CreateProject}
            // initialValues={{}}
            onSubmit={async (values) => {
              try {
                const project = await createProjectMutation(values)
                router.push(Routes.ShowProjectPage({ projectId: project.id }))
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

NewProjectPage.authenticate = true
NewProjectPage.getLayout = (page) => (
  <Suspense
    fallback={
      <Flex align="center" justify="center">
        <Spinner />
      </Flex>
    }
  >
    <Layout title={"Create New Project"}>{page}</Layout>
  </Suspense>
)

export default NewProjectPage
