import { currentUser } from "@clerk/nextjs/server";
import CommandClient from "./command-client";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth } from "@/lib/require-auth";
import { getUserAccess } from "@/lib/get-user-access";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type EventType =
  | "ucat"
  | "applications"
  | "rural"
  | "interviews"
  | "offers"
  | "personal";

type Profile = {
  name: string;
  email: string;
  yearLevel: string;
  state: string;
  category: string;
  pathway: string;
  atar: number;
  ucat: number;
  interviewScore: number;
  targetUnis: string[];
  avatar: string;
};

type DashboardEvent = {
  id: string;
  title: string;
  date: string;
  type: EventType;
  notes?: string;
  source: "system" | "custom";
};

type SiteSettings = {
  commandLastUpdatedAt: string | null;
  scheduledDowntimeStartAt: string | null;
  scheduledDowntimeEndAt: string | null;
  maintenanceMode: boolean;
  maintenanceMessage: string;
};

type SubscriptionInfo = {
  planKey: "free" | "pro_monthly" | "pro_annual";
  status:
    | "free"
    | "trialing"
    | "active"
    | "past_due"
    | "canceled"
    | "unpaid"
    | "incomplete"
    | "incomplete_expired";
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
};

type CommandStatusValue = {
  command_last_updated_at: string | null;
  scheduled_downtime_start_at: string | null;
  scheduled_downtime_end_at: string | null;
  maintenance_mode: boolean;
  maintenance_message: string;
};

type MomentumState = "cold" | "warming_up" | "active" | "locked_in" | "elite";

type CommandProgress = {
  clerk_user_id: string;
  vitals_total: number;
  vitals_today: number;
  momentum_state: MomentumState;
  active_days_this_week: number;
  boss_level_unlocked: number;
  last_activity_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type VitalsEvent = {
  id: string;
  source: string;
  delta: number;
  reason: string;
  metadata: Record<string, unknown> | null;
  occurred_at: string | null;
  created_at: string | null;
};

type ProfileRow = {
  display_name: string | null;
  full_name: string | null;
  email: string | null;
  year_level: string | null;
  state: string | null;
  category: string | null;
  pathway: string | null;
  atar: number | string | null;
  ucat: number | string | null;
  interview_score: number | string | null;
  target_unis: string[] | null;
  avatar_url: string | null;
};

type CommandEventRow = {
  id: string | number;
  title: string;
  event_date: string;
  event_type: string;
  notes: string | null;
  source: string | null;
};

type CommandProgressRow = {
  clerk_user_id: string;
  vitals_total: number | string | null;
  vitals_today: number | string | null;
  momentum_state: string | null;
  active_days_this_week: number | string | null;
  boss_level_unlocked: number | string | null;
  last_activity_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type VitalsEventRow = {
  id: string | number;
  source: string | null;
  delta: number | string | null;
  reason: string | null;
  metadata: Record<string, unknown> | null;
  occurred_at: string | null;
  created_at: string | null;
};

const DEFAULT_PROFILE: Profile = {
  name: "",
  email: "",
  yearLevel: "Year 11",
  state: "QLD",
  category: "Metropolitan",
  pathway: "Undergraduate",
  atar: 99,
  ucat: 2500,
  interviewScore: 3,
  targetUnis: [],
  avatar: "stethoscope",
};

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  commandLastUpdatedAt: null,
  scheduledDowntimeStartAt: null,
  scheduledDowntimeEndAt: null,
  maintenanceMode: false,
  maintenanceMessage:
    "Aussie Med Guide is currently undergoing scheduled improvements. You can still sign in and access your account.",
};

const DEFAULT_SUBSCRIPTION: SubscriptionInfo = {
  planKey: "free",
  status: "free",
  currentPeriodEnd: null,
  cancelAtPeriodEnd: false,
};

function toNumber(value: number | string | null | undefined, fallback: number) {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN;

  return Number.isFinite(parsed) ? parsed : fallback;
}

export default async function CommandPage() {
  const { userId } = await requireAuth({
    signInRedirect: "/sign-in?redirect_url=/tools/command",
  });

  const clerkUser = await currentUser();
  const supabase = await createAdminClient();

  const [
    { subscription },
    profileRes,
    eventsRes,
    settingsRes,
    commandProgressRes,
    vitalsEventsRes,
  ] = await Promise.all([
    getUserAccess(userId),
    supabase
      .from("profiles")
      .select(
        "display_name, full_name, email, year_level, state, category, pathway, atar, ucat, interview_score, target_unis, avatar_url"
      )
      .eq("clerk_user_id", userId)
      .maybeSingle<ProfileRow>(),
    supabase
      .from("command_events")
      .select("id, title, event_date, event_type, notes, source")
      .eq("clerk_user_id", userId)
      .order("event_date", { ascending: true }),
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "command_status")
      .maybeSingle(),
    supabase
      .from("command_progress")
      .select(
        "clerk_user_id, vitals_total, vitals_today, momentum_state, active_days_this_week, boss_level_unlocked, last_activity_at, created_at, updated_at"
      )
      .eq("clerk_user_id", userId)
      .maybeSingle<CommandProgressRow>(),
    supabase
      .from("vitals_events")
      .select(
        "id, source, delta, reason, metadata, occurred_at, created_at"
      )
      .eq("clerk_user_id", userId)
      .order("occurred_at", { ascending: false })
      .limit(20),
  ]);

  const profile = (profileRes.data ?? null) as ProfileRow | null;
  const events = (eventsRes.data ?? []) as CommandEventRow[];
  const commandStatus = (settingsRes.data?.value ??
    {}) as Partial<CommandStatusValue>;
  const commandProgressData =
    (commandProgressRes.data ?? null) as CommandProgressRow | null;
  const vitalsEventsData = (vitalsEventsRes.data ?? []) as VitalsEventRow[];

  const initialProfile: Profile = {
    ...DEFAULT_PROFILE,
    name:
      profile?.display_name ||
      profile?.full_name ||
      clerkUser?.firstName ||
      clerkUser?.fullName ||
      "",
    email:
      profile?.email ||
      clerkUser?.primaryEmailAddress?.emailAddress ||
      clerkUser?.emailAddresses?.[0]?.emailAddress ||
      "",
    yearLevel: profile?.year_level || DEFAULT_PROFILE.yearLevel,
    state: profile?.state || DEFAULT_PROFILE.state,
    category: profile?.category || DEFAULT_PROFILE.category,
    pathway: profile?.pathway || DEFAULT_PROFILE.pathway,
    atar: toNumber(profile?.atar, DEFAULT_PROFILE.atar),
    ucat: toNumber(profile?.ucat, DEFAULT_PROFILE.ucat),
    interviewScore: toNumber(
      profile?.interview_score,
      DEFAULT_PROFILE.interviewScore
    ),
    targetUnis: Array.isArray(profile?.target_unis)
      ? profile.target_unis
      : DEFAULT_PROFILE.targetUnis,
    avatar: profile?.avatar_url || DEFAULT_PROFILE.avatar,
  };

  const initialCustomDates: DashboardEvent[] = events.map((event) => ({
    id: String(event.id),
    title: event.title,
    date: event.event_date,
    type: event.event_type as EventType,
    notes: event.notes ?? "",
    source: event.source === "system" ? "system" : "custom",
  }));

  const subscriptionInfo: SubscriptionInfo = subscription
    ? {
        planKey:
          subscription.plan === "pro_monthly" ||
          subscription.plan === "pro_annual"
            ? subscription.plan
            : "free",
        status: (subscription.status as SubscriptionInfo["status"]) ?? "free",
        currentPeriodEnd: subscription.current_period_end ?? null,
        cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
      }
    : DEFAULT_SUBSCRIPTION;

  const siteSettings: SiteSettings = {
    commandLastUpdatedAt:
      commandStatus.command_last_updated_at ??
      DEFAULT_SITE_SETTINGS.commandLastUpdatedAt,
    scheduledDowntimeStartAt:
      commandStatus.scheduled_downtime_start_at ??
      DEFAULT_SITE_SETTINGS.scheduledDowntimeStartAt,
    scheduledDowntimeEndAt:
      commandStatus.scheduled_downtime_end_at ??
      DEFAULT_SITE_SETTINGS.scheduledDowntimeEndAt,
    maintenanceMode:
      commandStatus.maintenance_mode ?? DEFAULT_SITE_SETTINGS.maintenanceMode,
    maintenanceMessage:
      commandStatus.maintenance_message ??
      DEFAULT_SITE_SETTINGS.maintenanceMessage,
  };

  const rawMomentum = commandProgressData?.momentum_state;

const momentumState: MomentumState =
  rawMomentum === "cold" ||
  rawMomentum === "warming_up" ||
  rawMomentum === "active" ||
  rawMomentum === "locked_in" ||
  rawMomentum === "elite"
    ? rawMomentum
    : "cold";

const initialCommandProgress: CommandProgress | null = commandProgressData
  ? {
      clerk_user_id: commandProgressData.clerk_user_id,
      vitals_total: toNumber(commandProgressData.vitals_total, 0),
      vitals_today: toNumber(commandProgressData.vitals_today, 0),
      momentum_state: momentumState,
      active_days_this_week: toNumber(
        commandProgressData.active_days_this_week,
        0
      ),
      boss_level_unlocked: toNumber(
        commandProgressData.boss_level_unlocked,
        1
      ),
      last_activity_at: commandProgressData.last_activity_at ?? null,
      created_at: commandProgressData.created_at ?? null,
      updated_at: commandProgressData.updated_at ?? null,
    }
  : null;

  const initialVitalsEvents: VitalsEvent[] = vitalsEventsData.map((event) => ({
    id: String(event.id),
    source: String(event.source ?? ""),
    delta: toNumber(event.delta, 0),
    reason: String(event.reason ?? ""),
    metadata:
      event.metadata && typeof event.metadata === "object"
        ? event.metadata
        : null,
    occurred_at: event.occurred_at ?? null,
    created_at: event.created_at ?? null,
  }));

  return (
    <CommandClient
      userId={userId}
      userEmail={initialProfile.email}
      subscription={subscriptionInfo}
      initialProfile={initialProfile}
      initialCustomDates={initialCustomDates}
      siteSettings={siteSettings}
      initialVitalsEvents={initialVitalsEvents}
      initialCommandProgress={initialCommandProgress}
    />
  );
}