/**
 * Exercise Video Mapping
 * Maps exercise IDs to their demonstration video paths
 */

import singleLegStandVideo from "@/assets/videos/single-leg-stand.mp4";
import sitToStandVideo from "@/assets/videos/sit-to-stand.mp4";
import frontBackLungesVideo from "@/assets/videos/front-back-lunges.mp4";
import pushUpsVideo from "@/assets/videos/push-ups.mp4";
import plankHoldVideo from "@/assets/videos/plank-hold.mp4";
import deepSquatHoldVideo from "@/assets/videos/deep-squat-hold.mp4";
import clockStepsVideo from "@/assets/videos/clock-steps.mp4";

export const EXERCISE_VIDEOS: Record<string, string> = {
  single_leg_stand: "https://youtu.be/PcQtE0NS9bg",
  sit_to_stand: "https://youtu.be/d1APqMrh1Wk",
  front_back_lunges:"https://youtu.be/73B5eAguXoI",
  push_up: "https://youtu.be/-lVdHjFzWqw",
  plank_hold: "https://youtu.be/2OMxXnZkTOQ",
  deep_squat_hold: "https://youtu.be/UtgaeYkn4Hc",
  clock_steps: "https://youtu.be/IeQOAngHVPs",
};

export const EXERCISE_DESCRIPTIONS: Record<string, string> = {
  single_leg_stand: 'Stand on one leg and hold a balanced position as long as possible. Perform for each leg separately.',
  sit_to_stand: 'Sit in a chair and stand up without using your arms. Complete as many controlled reps as possible (max 10).',
  front_back_lunges: 'Perform lunges forward and backward on each side. Complete as many successful reps as possible (max 4 per side).',
  push_up: 'Perform push-ups in proper form. Complete as many as possible (max 10).',
  plank_hold: 'Hold a plank position as long as possible. Time how long you can maintain form.',
  deep_squat_hold: 'Squat deeply while keeping heels on the ground. Hold the bottom position.',
  clock_steps: 'Imagine a clock face and step to each position (12,3,6,9,6,3). Complete for each side.',
};
