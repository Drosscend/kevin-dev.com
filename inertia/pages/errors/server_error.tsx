import ErrorPage, { type ErrorPageProps } from '~/components/error_page'

export default function ServerError(props: ErrorPageProps) {
  return <ErrorPage code="500" {...props} />
}
