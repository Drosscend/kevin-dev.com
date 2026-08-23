import ErrorPage, { type ErrorPageProps } from '~/components/error_page'

export default function Gone(props: ErrorPageProps) {
  return <ErrorPage code="410" reason="gone" {...props} />
}
