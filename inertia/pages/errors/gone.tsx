import ErrorPage from '~/components/error_page'

export default function Gone() {
  return <ErrorPage code="410" reason="gone" />
}
