import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const card = await prisma.card.findUnique({ where: { id: params.id } })
  if (!card?.sourceUrl) return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_BASE_URL), 302)
  await prisma.clickEvent.create({ data: { cardId: card.id } })
  return NextResponse.redirect(card.sourceUrl, 302)
}



