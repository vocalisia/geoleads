import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getSessionFromRequest } from '@/lib/auth'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface Lead {
  id: string
  name: string
  address?: string | null
  phone?: string | null
  email?: string | null
  website?: string | null
  rating?: number | null
  reviewCount?: number | null
  category?: string | null
  googleMapsUrl?: string | null
}

interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
}

interface RequestBody {
  message: string
  action?: 'analyze' | 'email' | 'callScript' | 'decisionMaker'
  lead: Lead
  businessContext?: string
  conversationHistory?: ConversationMessage[]
}

function buildSystemPrompt(lead: Lead, businessContext: string): string {
  const leadDetails = `
LEAD PROFILE:
- Business: ${lead.name}
- Category: ${lead.category ?? 'Unknown'}
- Address: ${lead.address ?? 'Not available'}
- Phone: ${lead.phone ?? 'Not available'}
- Email: ${lead.email ?? 'Not available'}
- Website: ${lead.website ?? 'Not available'}
- Google Rating: ${lead.rating ? `${lead.rating}/5 (${lead.reviewCount} reviews)` : 'Not available'}
- Google Maps: ${lead.googleMapsUrl ?? 'Not available'}
`.trim()

  const userContext = businessContext
    ? `\nUSER'S BUSINESS CONTEXT:\n${businessContext}`
    : ''

  return `You are GeoLeads AI Agent, an expert B2B sales intelligence assistant. You help sales professionals analyze prospects, craft personalized outreach, and close deals faster.

${leadDetails}
${userContext}

INSTRUCTIONS:
- Be concise, professional, and actionable
- Personalize all content based on the specific lead data provided
- When writing emails or scripts, make them natural and human-sounding
- When analyzing: identify REAL weaknesses and opportunities based on rating, review count, category, and data
- Format responses clearly with **bold** for section headers when appropriate
- Never sound robotic or generic — every output must feel tailored to THIS specific business
- If asked to write outreach, never mention that you're an AI`
}

function buildActionPrompt(action: string, lead: Lead): string {
  switch (action) {
    case 'analyze':
      return `Perform a complete sales intelligence analysis of this business lead. Structure your response as:

**Business Overview**
What type of business is this? Who are their customers? What's their market position?

**Digital Presence Analysis**
Assess their online presence based on rating (${lead.rating}/5 with ${lead.reviewCount} reviews), website availability, and other signals.

**Weaknesses & Pain Points**
Based on their review score, review count, and category, what specific problems might they have? What are customers complaining about?

**Sales Opportunity**
How should I position my offering? What specific angle should I use?

**Recommended Outreach Hook**
One specific, compelling hook that references something unique about this business.

Be specific and evidence-based. Use the rating and review count to infer business health.`

    case 'email':
      return `Write a highly personalized cold outreach email. Requirements:
- Subject line that references their SPECIFIC business (not generic)
- Opening that shows genuine research (reference their category, rating, or location)
- Clear value proposition addressing a pain point they likely have
- Social proof or credibility element
- Specific, low-commitment CTA
- Under 150 words total
- Conversational, human tone

Format:
Subject: [compelling subject line]

[email body]

Make this feel like it was written by a human who actually researched this company.`

    case 'callScript':
      return `Create a complete, natural-sounding phone call script. Include:

**OPENING (first 15 seconds)**
Introduction + reason for calling (make it feel warm, not cold)

**QUICK VALUE HOOK**
One sentence that makes them want to keep listening

**DISCOVERY QUESTIONS (3 questions)**
Questions that open up the conversation and reveal pain points

**TAILORED PITCH (45-60 seconds)**
How to position your offering for THIS specific business type

**HANDLING COMMON OBJECTIONS**
- "We're not interested"
- "Send me an email"
- "We already have something"
(How to respond to each)

**CLOSING**
How to get the meeting/next step

Make it conversational. Include actual phrasing they should use.`

    case 'decisionMaker':
      return `Help identify the right person to contact at ${lead.name} (${lead.category ?? 'this business'}).

**Most Likely Decision Maker**
Given this business type, who typically controls purchasing decisions? (Be specific about job titles)

**LinkedIn Search Strategy**
Exact search query to find them: "[exact search string to use on LinkedIn]"

**Alternative Discovery Methods**
How to find them if LinkedIn doesn't work (company website, calling, etc.)

**What to Research Before Contacting**
5 specific things to find out about this person before first contact

**Personalization Approach**
How to reference their role specifically when reaching out

**Best Time & Channel**
When and how is this type of decision maker most responsive?`

    default:
      return action
  }
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI API not configured' }, { status: 500 })
  }

  let body: RequestBody
  try {
    body = await request.json() as RequestBody
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { message, action, lead, businessContext = '', conversationHistory = [] } = body

  if (!message || !lead) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const systemPrompt = buildSystemPrompt(lead, businessContext)
  const userMessage = action ? buildActionPrompt(action, lead) : message

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })),
    { role: 'user', content: userMessage },
  ]

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.7,
      max_tokens: 1500,
    })

    const responseMessage = completion.choices[0]?.message?.content ?? 'No response generated.'
    return NextResponse.json({ message: responseMessage })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
