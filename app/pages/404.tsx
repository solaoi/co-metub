import { ErrorComponent } from "blitz"
import Layout from "app/core/layouts/Layout"

// ------------------------------------------------------
// This page is rendered if a route match is not found
// ------------------------------------------------------
const title = "This page could not be found"
const statusCode = 404
export const Page404 = () => <ErrorComponent statusCode={statusCode} title={title} />

Page404.getLayout = (page) => <Layout title={`${statusCode}: ${title}`}>{page}</Layout>

export default Page404
