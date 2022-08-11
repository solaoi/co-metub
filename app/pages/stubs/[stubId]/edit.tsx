import { Suspense } from "react"
import { Head, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getStub from "app/stubs/queries/getStub"
import updateStub from "app/stubs/mutations/updateStub"
import { StubForm, FORM_ERROR } from "app/stubs/components/StubForm"
import { Box, Spinner, Flex, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react"
import getProject from "app/projects/queries/getProject"
import Card from "app/core/layouts/Card"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

const BreadCrumb = ({ stub }) => {
  const [project] = useQuery(getProject, { id: stub.projectId })

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
          <BreadcrumbLink href={`/projects/${stub.projectId}`}>{project.name}</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink href={`/stubs/${stub.id}`}>Stub</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink href={`/stubs/${stub.id}/edit`}>Edit</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    </Suspense>
  )
}

export const EditStub = () => {
  const router = useRouter()
  const stubId = useParam("stubId", "number")
  const [stub, { setQueryData }] = useQuery(
    getStub,
    { id: stubId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateStubMutation] = useMutation(updateStub)
  const currentUser = useCurrentUser()

  return (
    <>
      <Head>
        <title>Edit Stub {stub.id}</title>
      </Head>

      <Box>
        <BreadCrumb stub={stub} />
        <Flex align="center" justify="center" m="6">
          <Card heading="Edit Stub">
            <StubForm
              initialValues={{
                ...stub,
                updatedBy: currentUser?.name,
              }}
              submitText="UPDATE"
              // TODO use a zod schema for form validation
              //  - Tip: extract mutation's schema into a shared `validations.ts` file and
              //         then import and use it here
              // schema={UpdateStub}
              onSubmit={async (values) => {
                try {
                  const updated = await updateStubMutation({
                    id: stub.id,
                    ...values,
                  })
                  await setQueryData(updated)
                  router.push(Routes.ShowStubPage({ stubId: updated.id }))
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
      </Box>
    </>
  )
}

const EditStubPage: BlitzPage = () => {
  return (
    <div>
      <Suspense
        fallback={
          <Flex align="center" justify="center">
            <Spinner />
          </Flex>
        }
      >
        <EditStub />
      </Suspense>
    </div>
  )
}

EditStubPage.authenticate = true
EditStubPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditStubPage
