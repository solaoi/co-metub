import { Suspense } from "react"
import { Head, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getProject from "app/projects/queries/getProject"
import updateProject from "app/projects/mutations/updateProject"
import { ProjectForm, FORM_ERROR } from "app/projects/components/ProjectForm"
import { Spinner, Flex, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react"
import Card from "../../../core/layouts/Card"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

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

      <BreadcrumbItem>
        <BreadcrumbLink href={`/projects/${project.id}/edit`}>Edit</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  )
}

export const EditProject = () => {
  const router = useRouter()
  const projectId = useParam("projectId", "number")
  const [project, { setQueryData }] = useQuery(
    getProject,
    { id: projectId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateProjectMutation] = useMutation(updateProject)
  const currentUser = useCurrentUser()

  return (
    <>
      <Head>
        <title>プロジェクト：{project.name}</title>
      </Head>
      <div>
        <BreadCrumb project={project} />
        <Flex align="center" justify="center" m="6">
          <Card heading="Edit Project">
            <ProjectForm
              submitText="UPDATE"
              // TODO use a zod schema for form validation
              //  - Tip: extract mutation's schema into a shared `validations.ts` file and
              //         then import and use it here
              // schema={UpdateProject}
              initialValues={{ ...project, updatedBy: currentUser?.name }}
              onSubmit={async (values) => {
                try {
                  const updated = await updateProjectMutation({
                    id: project.id,
                    ...values,
                  })
                  await setQueryData(updated)
                  router.push(Routes.ShowProjectPage({ projectId: updated.id }))
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
      </div>
    </>
  )
}

const EditProjectPage: BlitzPage = () => {
  return (
    <div>
      <Suspense
        fallback={
          <Flex align="center" justify="center">
            <Spinner />
          </Flex>
        }
      >
        <EditProject />
      </Suspense>
    </div>
  )
}

EditProjectPage.authenticate = true
EditProjectPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditProjectPage
