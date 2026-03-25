export const VITALS_REWARDS = {
  interview_session: 40,
  feedback_review: 10,
  custom_date: 5,
  profile_update: 10,
  target_university: 10,
  roadmap_checkpoint: 25,
  scholarship_tracker: 10,
  experience_entry: 20,
  boss_battle_tier_1: 75,
  boss_battle_tier_2: 100,
  boss_battle_tier_3: 125,
  boss_battle_tier_4: 140,
  boss_battle_tier_5: 150,
} as const;

export type MomentumState =
  | "cold"
  | "warming_up"
  | "active"
  | "locked_in"
  | "elite";

export function getMomentumState(activeDays: number): MomentumState {
  if (activeDays >= 6) return "elite";
  if (activeDays >= 5) return "locked_in";
  if (activeDays >= 4) return "active";
  if (activeDays >= 2) return "warming_up";
  return "cold";
}

export function getLevelFromVitals(vitals: number) {
  if (vitals >= 1500) return 7;
  if (vitals >= 1100) return 6;
  if (vitals >= 800) return 5;
  if (vitals >= 550) return 4;
  if (vitals >= 325) return 3;
  if (vitals >= 150) return 2;
  return 1;
}

export function getLevelLabel(level: number) {
  switch (level) {
    case 1:
      return "Starter";
    case 2:
      return "Builder";
    case 3:
      return "Contender";
    case 4:
      return "Interview Ready";
    case 5:
      return "Offer Hunter";
    case 6:
      return "Final Round";
    default:
      return "White Coat Track";
  }
}