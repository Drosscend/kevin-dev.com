import app from '@adonisjs/core/services/app'
import { Resvg } from '@resvg/resvg-js'
import { xmlEscape } from '#app/shared/xml_escape'
import { coverArt, OG_FRAME, type ArtRole, type CoverArt } from '#types/cover_art'

/** The light tokens of inertia/css/app.css, resolved to sRGB: a social card has no theme. */
const FILL = {
  paper: '#fafaf8',
  muted: '#f0f0ee',
  ink: '#1f1f1d',
  accent: '#9a2733',
  subtle: '#696964',
} satisfies Record<ArtRole, string>

/** Families as the TTF files of resources/fonts declare them: resvg matches on that name. */
const FAMILY = {
  display: 'Archivo SemiBold',
  mono: 'IBM Plex Mono',
} satisfies Record<'display' | 'mono', string>

const FONT_FILES = ['archivo-semibold.ttf', 'ibm-plex-mono-regular.ttf']

function round(value: number) {
  return Math.round(value * 100) / 100
}

function toSvg(art: CoverArt) {
  const body = art.figures
    .map((figure, index) => {
      if (figure.kind === 'rect') {
        return `<rect x="${round(figure.x)}" y="${round(figure.y)}" width="${round(figure.width)}" height="${round(figure.height)}" fill="${FILL[figure.role]}"/>`
      }

      if (figure.kind === 'hatch') {
        const id = `hatch${index}`
        const step = round(figure.step)

        return (
          `<defs><pattern id="${id}" width="${step}" height="${step}" patternUnits="userSpaceOnUse" patternTransform="rotate(${figure.angle})">` +
          `<line x1="0" y1="0" x2="0" y2="${step}" stroke="${FILL[figure.role]}" stroke-width="1.2" opacity="${figure.opacity}"/>` +
          `</pattern></defs><rect width="${art.width}" height="${art.height}" fill="url(#${id})"/>`
        )
      }

      const tracking = figure.tracking ? ` letter-spacing="${round(figure.tracking)}"` : ''
      const opacity = figure.opacity ? ` opacity="${figure.opacity}"` : ''

      return `<text x="${round(figure.x)}" y="${round(figure.y)}" font-family="${FAMILY[figure.family]}" font-size="${round(figure.size)}" text-anchor="${figure.anchor}" fill="${FILL[figure.role]}"${tracking}${opacity}>${xmlEscape(figure.value)}</text>`
    })
    .join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${art.width}" height="${art.height}" viewBox="0 0 ${art.width} ${art.height}">${body}</svg>`
}

/**
 * Social card of an entry without cover: the same drawing the site
 * shows in place of its thumbnail, at the size platforms crop from.
 */
export function ogCardPng(input: { title: string; kicker: string; seed: string }) {
  const art = coverArt({
    layout: 'cover',
    ...OG_FRAME,
    title: input.title,
    kicker: input.kicker,
    seed: input.seed,
    footer: 'kevin-dev.com',
  })

  const image = new Resvg(toSvg(art), {
    font: {
      fontFiles: FONT_FILES.map((file) => app.makePath('resources/fonts', file)),
      defaultFontFamily: FAMILY.display,
      loadSystemFonts: false,
    },
  })

  return Buffer.from(image.render().asPng())
}
