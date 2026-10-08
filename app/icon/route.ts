import { readFile } from 'node:fs/promises'
import path from 'node:path'

// Serves the tab icon from assets/ so it can live outside app/.
export const GET = async () => {
  const svg = await readFile(path.join(process.cwd(), 'assets', 'icon.svg'), 'utf8')

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
