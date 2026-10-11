/** Up to two initials from a name, e.g. "Maria Marnerou" -> "MM". */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
