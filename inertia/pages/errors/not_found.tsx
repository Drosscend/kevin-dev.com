import ErrorPage from '~/components/error_page'

export default function NotFound() {
  return <ErrorPage code="404" reason="notFound" />
}
