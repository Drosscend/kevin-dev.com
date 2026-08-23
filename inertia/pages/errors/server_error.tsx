import ErrorPage from '~/components/error_page'

export default function ServerError() {
  return <ErrorPage code="500" reason="server" />
}
