import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getStub from "app/stubs/queries/getStub"
import deleteStub from "app/stubs/mutations/deleteStub"

export const Stub = () => {
  const router = useRouter()
  const stubId = useParam("stubId", "number")
  const [deleteStubMutation] = useMutation(deleteStub)
  const [stub] = useQuery(getStub, { id: stubId })

  return (
    <>
      <Head>
        <title>Stub {stub.id}</title>
      </Head>

      <div>
        <h1>Stub {stub.id}</h1>
        <pre>{JSON.stringify(stub, null, 2)}</pre>

        <Link href={Routes.EditStubPage({ stubId: stub.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteStubMutation({ id: stub.id })
              router.push(Routes.StubsPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowStubPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.StubsPage()}>
          <a>Stubs</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Stub />
      </Suspense>
    </div>
  )
}

ShowStubPage.authenticate = true
ShowStubPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowStubPage
