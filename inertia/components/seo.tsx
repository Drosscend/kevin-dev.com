import { Head } from '@inertiajs/react'
import type { SeoMeta } from '#types/seo'

export type { SeoMeta }

/**
 * Renders every SEO tag of a page into the document head (SSR
 * included): title, description, canonical, hreflang alternates,
 * Open Graph / Twitter cards and JSON-LD structured data.
 */
export default function Seo({ meta }: { meta: SeoMeta }) {
  return (
    <Head>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={meta.canonical} />

      {meta.alternates?.en && <link rel="alternate" hrefLang="fr" href={meta.alternates.fr} />}
      {meta.alternates?.en && <link rel="alternate" hrefLang="en" href={meta.alternates.en} />}
      {meta.alternates?.en && (
        <link rel="alternate" hrefLang="x-default" href={meta.alternates.fr} />
      )}

      <meta property="og:site_name" content="kevin-dev.com" />
      <meta property="og:type" content={meta.ogType} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={meta.canonical} />
      <meta property="og:locale" content={meta.locale === 'fr' ? 'fr_FR' : 'en_US'} />
      {meta.ogImage && <meta property="og:image" content={meta.ogImage} />}

      <meta name="twitter:card" content={meta.ogImage ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      {meta.ogImage && <meta name="twitter:image" content={meta.ogImage} />}

      {meta.jsonLd.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </Head>
  )
}
