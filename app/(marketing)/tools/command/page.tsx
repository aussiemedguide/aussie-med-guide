import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";
import { hasPremiumAccess } from "@/lib/access";
import CommandClient from "./command-client";

const DEFAULT_PROFILE = {
  name: "",
  yearLevel: "Year 11",
  state: "QLD",
  category: "Metropolitan",
  pathway: "Undergraduate",
  atar: 99,
  ucat: 2000,
  interviewScore: 1,
  targetUnis: [] as string[],
};

export default async function CommandPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in?redirect_url=/tools/command");
  }

  const clerkUser = await currentUser();
  const supabase = await createClient();

  const { data: subscription } = await supabase
    .from("user_subscriptions")
    .select("plan, subscription_status")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  const planValue = String(subscription?.plan ?? "free").toLowerCase();
  const isPremium =
    subscription?.subscription_status === "active" &&
    (hasPremiumAccess(subscription?.plan) ||
      planValue === "pro" ||
      planValue === "monthly" ||
      planValue === "annual" ||
      planValue === "premium");

  const { data: commandProfile } = await supabase
    .from("command_profiles")
    .select(
      "display_name, year_level, state, category, pathway, atar, ucat, interview_score, target_unis"
    )
    .eq("clerk_user_id", userId)
    .maybeSingle();

  const { data: customEvents } = await supabase
    .from("command_events")
    .select("id, title, date, type, notes, source")
    .eq("clerk_user_id", userId)
    .order("date", { ascending: true });

  const email =
    clerkUser?.primaryEmailAddress?.emailAddress ??
    clerkUser?.emailAddresses?.[0]?.emailAddress ??
    "";

  const fullName =
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") || "";

  const initialProfile = {
    name:
      commandProfile?.display_name ||
      fullName ||
      email.split("@")[0] ||
      DEFAULT_PROFILE.name,
    yearLevel: commandProfile?.year_level || DEFAULT_PROFILE.yearLevel,
    state: commandProfile?.state || DEFAULT_PROFILE.state,
    category: commandProfile?.category || DEFAULT_PROFILE.category,
    pathway: commandProfile?.pathway || DEFAULT_PROFILE.pathway,
    atar: Number(commandProfile?.atar ?? DEFAULT_PROFILE.atar),
    ucat: Number(commandProfile?.ucat ?? DEFAULT_PROFILE.ucat),
    interviewScore: Number(
      commandProfile?.interview_score ?? DEFAULT_PROFILE.interviewScore
    ),
    targetUnis: Array.isArray(commandProfile?.target_unis)
      ? (commandProfile.target_unis as string[])
      : DEFAULT_PROFILE.targetUnis,
  };

  const initialCustomDates: {
    id: string;
    title: string;
    date: string;
    type: "ucat" | "applications" | "rural" | "interviews" | "offers" | "personal";
    notes?: string;
    source: "system" | "custom";
  }[] = (customEvents ?? []).map((event) => ({
    id: String(event.id),
    title: event.title,
    date: String(event.date),
    type: event.type as
      | "ucat"
      | "applications"
      | "rural"
      | "interviews"
      | "offers"
      | "personal",
    notes: event.notes ?? "",
    source: "custom",
  }));

  return (
    <CommandClient
      userId={userId}
      isPremium={isPremium}
      initialProfile={initialProfile}
      initialCustomDates={initialCustomDates}
    />
  );
}