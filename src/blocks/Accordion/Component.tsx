import { RichText } from '@/components/RichText'

import type { AccordionBlock as AccordionBlockProps } from '@/payload-types'

export function AccordionBlock({ items, anchorId }: AccordionBlockProps) {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <section id={anchorId || undefined} className="scroll-mt-24 px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl space-y-3">
        {items.map((item, index) => (
          <details
            key={item.id ?? index}
            id={item.anchorId || undefined}
            className="group scroll-mt-24 rounded-lg border border-gray-200 bg-white open:shadow-sm"
          >
            <summary className="flex cursor-pointer list-none items-start gap-4 px-5 py-4 text-lg font-semibold text-brand-navy [&::-webkit-details-marker]:hidden">
              <span className="shrink-0 text-brand-red">{index + 1}.</span>
              <span className="flex-1">{item.heading}</span>
              <span className="mt-1 shrink-0 text-sm text-gray-400 transition-transform group-open:rotate-180">
                ▼
              </span>
            </summary>
            {item.content && (
              <div className="px-5 pb-5 pl-[2.75rem]">
                <RichText
                  data={item.content}
                  className="prose prose-lg max-w-none prose-headings:text-brand-navy prose-a:text-brand-red prose-a:no-underline hover:prose-a:underline"
                />
              </div>
            )}
          </details>
        ))}
      </div>

      {/* A <details> doesn't open itself just because it's the URL's scroll
          target — force it open (and into view) when a link points at it. */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            "(function(){var h=window.location.hash.slice(1);if(!h)return;var d=document.getElementById(h);if(d&&d.tagName==='DETAILS'){d.open=true;d.scrollIntoView();}})();",
        }}
      />
    </section>
  )
}
