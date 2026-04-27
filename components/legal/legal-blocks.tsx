'use client'

import { Fragment } from 'react'

function renderLine(line: string) {
  const parts = line.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>
        }
        return <Fragment key={i}>{part}</Fragment>
      })}
    </>
  )
}

export function LegalBlocks({ lines }: { lines: string[] }) {
  return (
    <div className="text-white/80 space-y-3">
      {lines.map((line, i) => (
        <p key={i} className="leading-relaxed">
          {renderLine(line)}
        </p>
      ))}
    </div>
  )
}
