import { currentUser } from "@clerk/nextjs/server";
import CommandClient from "./command-client";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth } from "@/lib/require-auth";
import { getUserAccess } from "@/lib/get-user-access";

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

export default async function CommandPage() {
  const { userId } = await requireAuth({
    signInRedirect: "/sign-in?redirect_url=/tools/command",
  });

  const clerkUser = await currentUser();
  const supabase = await createAdminClient();

  const [{ subscription }, profileRes, eventsRes, settingsRes] =
    await Promise.all([
      getUserAccess(userId),
      supabase
        .from("profiles")
        .select(
          "display_name, full_name, email, year_level, state, category, pathway, atar, ucat, interview_score, target_unis, avatar_url"
        )
        .eq("clerk_user_id", userId)
        .maybeSingle(),
      supabase
        .from("command_events")
        .select("id, title, date, type, notes, source")
        .eq("clerk_user_id", userId)
        .order("date", { ascending: true }),
      supabase
        .from("site_settings")
        .select("value")
        .eq("key", "command_status")
        .maybeSingle(),
    ]);

  const profile = profileRes.data;
  const events = eventsRes.data ?? [];
  const commandStatus = (settingsRes.data?.value ?? {}) as Partial<CommandStatusValue>;

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
    atar: Number(profile?.atar ?? DEFAULT_PROFILE.atar),
    ucat: Number(profile?.ucat ?? DEFAULT_PROFILE.ucat),
    interviewScore: Number(
      profile?.interview_score ?? DEFAULT_PROFILE.interviewScore
    ),
    targetUnis: profile?.target_unis ?? DEFAULT_PROFILE.targetUnis,
    avatar: profile?.avatar_url || DEFAULT_PROFILE.avatar,
  };

  const initialCustomDates: DashboardEvent[] = events.map((event) => ({
    id: String(event.id),
    title: event.title,
    date: event.date,
    type: event.type as EventType,
    notes: event.notes ?? "",
    source: (event.source as "system" | "custom") ?? "custom",
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

  return (
    <CommandClient
      userId={userId}
      userEmail={initialProfile.email}
      subscription={subscriptionInfo}
      initialProfile={initialProfile}
      initialCustomDates={initialCustomDates}
      siteSettings={siteSettings}
    />
  );
}