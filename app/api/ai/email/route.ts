import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import OpenAI from 'openai'
import { getSessionFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const emailSchema = z.object({
  businessName: z.string(),
  businessType: z.string(),
  location: z.string(),
  website: z.string().optional(),
  senderName: z.string().optional(),
  senderCompany: z.string().optional(),
  purpose: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check plan — AI generator requires Pro or higher
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { plan: true },
  })

  if (!user || !['PRO', 'ENTERPRISE'].includes(user.plan)) {
    return NextResponse.json(
      { error: 'AI email generator requires Pro plan or higher' },
      { status: 403 }
    )
  }

  const body = await req.json()
  const parsed = emailSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const {
    businessName,
    businessType,
    location,
    website,
    senderName,
    senderCompany,
    purpose,
  } = parsed.data

  const prompt = `Write a professional, personalized B2B cold outreach email for the following prospect:

Business: ${businessName}
Type: ${businessType}
Location: ${location}
${website ? `Website: ${website}` : ''}
${senderName ? `Sender name: ${senderName}` : ''}
${senderCompany ? `Sender company: ${senderCompany}` : ''}
${purpose ? `Purpose: ${purpose}` : 'General business introduction'}

Requirements:
- Keep it short (150-200 words max)
- Personalize it to the business type and location
- Focus on value proposition, not features
- Include a clear, low-commitment call to action
- Natural, conversational tone — not salesy
- Subject line + email body
- Output as JSON with keys: subject, body`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    max_tokens: 500,
  })

  const content = completion.choices[0]?.message?.content

  if (!content) {
    return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
  }

  const emailData = JSON.parse(content) as { subject: string; body: string }

  return NextResponse.json({
    success: true,
    email: emailData,
  })
}
