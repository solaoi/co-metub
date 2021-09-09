import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createStub from "app/stubs/mutations/createStub"
import { StubForm, FORM_ERROR } from "app/stubs/components/StubForm"

const NewStubPage: BlitzPage = () => {
  const router = useRouter()
  const [createStubMutation] = useMutation(createStub)

  return (
    <div>
      <h1>Create New Stub</h1>

      <StubForm
        submitText="Create Stub"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateStub}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const stub = await createStubMutation(values)
            router.push(Routes.ShowStubPage({ stubId: stub.id }))
          } catch (error) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={Routes.StubsPage()}>
          <a>Stubs</a>
        </Link>
      </p>
    </div>
  )
}

NewStubPage.authenticate = true
NewStubPage.getLayout = (page) => <Layout title={"Create New Stub"}>{page}</Layout>

export default NewStubPage
