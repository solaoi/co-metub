import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getStubs from "app/stubs/queries/getStubs"

const ITEMS_PER_PAGE = 100

export const StubsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ stubs, hasMore }] = usePaginatedQuery(getStubs, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {stubs.map((stub) => (
          <li key={stub.id}>
            <Link href={Routes.ShowStubPage({ stubId: stub.id })}>
              <a>{stub.name}</a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const StubsPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Stubs</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewStubPage()}>
            <a>Create Stub</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <StubsList />
        </Suspense>
      </div>
    </>
  )
}

StubsPage.authenticate = true
StubsPage.getLayout = (page) => <Layout>{page}</Layout>

export default StubsPage
