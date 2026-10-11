import type { SVGProps } from 'react'

// Stands in for SVG imports in tests. Next.js turns them into components at build time,
// which Vitest doesn't do, so this renders a plain <svg> with the same props.
const SvgStub = (props: SVGProps<SVGSVGElement>) => <svg {...props} />

export default SvgStub
