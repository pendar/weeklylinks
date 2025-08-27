import * as Popover from '@radix-ui/react-popover'

interface CardProps {
  title: string
  description: string
  justification: string
  category: string
  sourceName: string
  sourceUrl: string
}

export function CardContent({ title, description, justification, category, sourceName, sourceUrl }: CardProps) {
  return (
    <div className="absolute inset-0 flex flex-col justify-between p-6">
      <div className="flex items-center justify-between">
        <span className="rounded-full border px-3 py-1 text-xs opacity-70">{category}</span>
        <Popover.Root>
          <Popover.Trigger asChild>
            <button className="rounded-full border px-3 py-1 text-xs opacity-70">Link</button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content className="rounded-xl border bg-white p-3 shadow-lg" sideOffset={8}>
              <div className="max-w-[60vw] break-all text-xs">
                <a href={sourceUrl} target="_blank" className="underline">{sourceUrl}</a>
              </div>
              <Popover.Arrow className="fill-white" />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
      <div className="space-y-2">
        <div className="text-xs opacity-70">{sourceName}</div>
        <h2 className="text-4xl font-semibold leading-tight">{title}</h2>
        <p className="text-sm opacity-70">{description}</p>
        <p className="text-sm opacity-80">{justification}</p>
      </div>
    </div>
  )
}



