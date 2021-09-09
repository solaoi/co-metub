import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getStub from "app/stubs/queries/getStub"
import updateStub from "app/stubs/mutations/updateStub"
import { StubForm, FORM_ERROR } from "app/stubs/components/StubForm"

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

  return (
    <>
      <Head>
        <title>Edit Stub {stub.id}</title>
      </Head>

      <div>
        <h1>Edit Stub {stub.id}</h1>
        <pre>{JSON.stringify(stub, null, 2)}</pre>

        <StubForm
          submitText="Update Stub"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateStub}
          initialValues={stub}
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
      </div>
    </>
  )
}

const EditStubPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditStub />
      </Suspense>

      <p>
        <Link href={Routes.StubsPage()}>
          <a>Stubs</a>
        </Link>
      </p>
    </div>
  )
}

EditStubPage.authenticate = true
EditStubPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditStubPage
