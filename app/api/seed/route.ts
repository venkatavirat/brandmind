import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const seedExperiments = [
  {
    objective: 'Reduce Q3 paid social acquisition cost without sacrificing qualified reach.',
    hypothesis: 'A 20% flash sale promoted through Instagram Reels will create urgency and lower CAC versus brand storytelling content.',
    audience: 'Existing Instagram followers and lookalike prospects aged 22-38.',
    strategy_used: 'Published direct-promo Reels with a 20% discount code and retargeted video viewers for seven days.',
    variables: ['20% discount code', 'Reels creative', '7-day retargeting window'],
    result_metrics: 'CAC increased 42%; reach was high but checkout completion fell across the flight.',
    audience_reaction: 'People skipped repeated promotional creative and commented on the discount before leaving without purchasing.',
    outcome_status: 'FAILURE',
    interpretation: 'Banner blindness and ad fatigue overwhelmed the short-term urgency created by the discount.',
    learning: 'Direct promo posts should not be reused as the default acquisition strategy; lead with a differentiated story and rotate creative before fatigue sets in.',
  },
  {
    objective: 'Generate more qualified B2B pipeline from LinkedIn without inflating lead costs.',
    hypothesis: 'A practical thought-leadership report paired with a lead magnet will convert senior demand-generation buyers into sales-qualified leads.',
    audience: 'US and UK SaaS marketing leaders at companies with 50-500 employees.',
    strategy_used: 'Distributed an original benchmark report through founder posts, employee advocacy, and targeted LinkedIn distribution.',
    variables: ['Benchmark report', 'Founder-led posts', 'Employee advocacy'],
    result_metrics: 'SQL volume increased 35%; cost per lead was $48; sales acceptance remained above the team baseline.',
    audience_reaction: 'Prospects shared the benchmark internally and asked follow-up questions about implementation.',
    outcome_status: 'SUCCESS',
    interpretation: 'Specific evidence and an expert point of view built enough trust to move high-intent readers beyond form completion.',
    learning: 'B2B acquisition improves when useful original research gives the audience a reason to discuss the brand before a sales conversation.',
  },
  {
    objective: 'Protect branded search demand from competitor conquesting while improving efficient conversion.',
    hypothesis: 'A tightly structured branded keyword campaign with clear comparison messaging will defend high-intent demand profitably.',
    audience: 'Existing and returning prospects searching for the brand or branded product terms.',
    strategy_used: 'Separated exact-match branded terms, refreshed ad extensions, and aligned landing pages to the searched product intent.',
    variables: ['Exact-match terms', 'Comparison copy', 'Intent-matched landing page'],
    result_metrics: 'ROAS reached 4.2x; conversion rate increased 18%; impression share improved against competitor ads.',
    audience_reaction: 'Searchers found the comparison details immediately and completed demos with fewer support questions.',
    outcome_status: 'SUCCESS',
    interpretation: 'Message continuity from query to landing page reduced friction in an already high-intent moment.',
    learning: 'Branded search defense deserves its own budget and message architecture rather than being blended into generic search campaigns.',
  },
  {
    objective: 'Acquire Gen-Z customers through TikTok creators while maintaining ecommerce conversion quality.',
    hypothesis: 'A burst of micro-influencer affiliate videos will turn authentic creator reach into efficient first purchases.',
    audience: 'Gen-Z mobile shoppers discovering the category on TikTok.',
    strategy_used: 'Activated 30 micro-influencers with affiliate links, product seeding, and a two-week posting window.',
    variables: ['30 creators', 'Affiliate links', 'Product seeding'],
    result_metrics: 'Traffic increased sharply, but conversion rate was only 0.4% and affiliate revenue missed target.',
    audience_reaction: 'Viewers engaged with creator content but treated it as entertainment and did not move through checkout.',
    outcome_status: 'FAILURE',
    interpretation: 'Reach and social proof did not compensate for weak product education and a poorly matched purchase path.',
    learning: 'Creator volume is not a proxy for purchase intent; future tests need stronger product demonstration and landing-page continuity.',
  },
  {
    objective: 'Recover revenue from subscribers who have stopped engaging with lifecycle email.',
    hypothesis: 'A winback series that increases the discount only when needed will reactivate more dormant subscribers while protecting margin.',
    audience: 'Subscribers with no purchase or email engagement in the last 90-180 days.',
    strategy_used: 'Sent a three-step reminder, benefit-led message, and dynamic discount ladder based on opens and clicks.',
    variables: ['90-180 day dormancy', 'Behavioral branching', 'Dynamic discount ladder'],
    result_metrics: '12% of dormant subscribers reactivated; the final discount tier was used by fewer than one in five purchasers.',
    audience_reaction: 'Subscribers responded best to the reminder of product value before receiving a stronger incentive.',
    outcome_status: 'SUCCESS',
    interpretation: 'Progressive incentives recovered demand without giving every dormant subscriber the maximum discount.',
    learning: 'Winback programs should escalate incentives from relevance to price and measure margin alongside reactivation.',
  },
];

export async function POST(request: Request) {
  try {
    const body = await request.json() as { workspace_id?: unknown };
    if (typeof body.workspace_id !== 'string' || !body.workspace_id) {
      return NextResponse.json({ error: 'Workspace is required.' }, { status: 400 });
    }

    const authorization = request.headers.get('authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const authClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
      { global: { headers: { Authorization: authorization } } },
    );
    const { data: userData, error: userError } = await authClient.auth.getUser();
    if (userError || !userData.user) {
      return NextResponse.json({ error: 'Your session is invalid or expired.' }, { status: 401 });
    }

    const { data: membership } = await authClient
      .from('workspace_members')
      .select('workspace_id')
      .eq('workspace_id', body.workspace_id)
      .eq('user_id', userData.user.id)
      .maybeSingle();
    if (!membership) {
      return NextResponse.json({ error: 'You do not have access to this workspace.' }, { status: 403 });
    }

    const { count, error: countError } = await authClient
      .from('experiments')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', body.workspace_id);
    if (countError) throw countError;
    if (count && count > 0) return NextResponse.json({ seeded: false, count });

    const rows = seedExperiments.map((experiment) => ({
      ...experiment,
      user_id: userData.user.id,
      workspace_id: body.workspace_id,
    }));
    const { data, error } = await authClient.from('experiments').insert(rows).select('*');
    if (error) throw error;

    return NextResponse.json({ seeded: true, count: data?.length || 0, experiments: data || [] });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to seed workspace' },
      { status: 500 },
    );
  }
}