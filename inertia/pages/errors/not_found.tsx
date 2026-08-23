import ErrorPage, { type ErrorPageProps } from '~/components/error_page'

export default function NotFound(props: ErrorPageProps) {
  return <ErrorPage code="404" reason="notFound" {...props} />
}
