'use server';

/**
 * @fileOverview AI-powered charging schedule suggestions based on user charging history.
 *
 * - suggestChargingSchedule - A function that analyzes charging history and suggests an optimized charging schedule.
 * - ChargingScheduleInput - The input type for the suggestChargingSchedule function.
 * - ChargingScheduleOutput - The return type for the suggestChargingSchedule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChargingScheduleInputSchema = z.object({
  chargingHistory: z
    .string()
    .describe(
      'A string containing the user charging history data, including date, time, energy used, and duration of each session.'
    ),
  currentBatteryPercentage: z
    .number()
    .describe('The current battery percentage of the vehicle.'),
  preferredChargeLevel: z
    .number()
    .describe(
      'The user preferred battery percentage to charge to. For example 80.'
    ),
  energyCost: z
    .string()
    .describe(
      'The cost of energy in cents per KWh.'
    ),
  startLocation: z
    .string()
    .describe('The starting location for a potential trip.'),
  endLocation: z
    .string()
    .describe('The ending location for a potential trip.'),
});
export type ChargingScheduleInput = z.infer<typeof ChargingScheduleInputSchema>;

const ChargingScheduleOutputSchema = z.object({
  suggestedSchedule: z
    .string()
    .describe(
      'A suggested charging schedule, including start time and duration, to optimize cost savings and battery life.'
    ),
  estimatedCostSavings: z
    .string()
    .describe(
      'An estimate of the cost savings that the user can expect by following the suggested charging schedule.'
    ),
  batteryLifeBenefits: z
    .string()
    .describe(
      'An explanation of the benefits to battery life of following the suggested charging schedule.'
    ),
  estimatedChargeForTrip: z
    .string()
    .describe(
      'The estimated battery percentage needed to travel between the start and end locations. Should be returned only if both locations are provided.'
    ),
});
export type ChargingScheduleOutput = z.infer<typeof ChargingScheduleOutputSchema>;

export async function suggestChargingSchedule(
  input: ChargingScheduleInput
): Promise<ChargingScheduleOutput> {
  return suggestChargingScheduleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestChargingSchedulePrompt',
  input: {schema: ChargingScheduleInputSchema},
  output: {schema: ChargingScheduleOutputSchema},
  prompt: `You are an AI assistant specializing in optimizing electric vehicle charging schedules.
Your goal is to analyze the user's charging history, their current vehicle state, preferences, and travel plans to provide a comprehensive charging recommendation.

Analyze the following data:
- Charging History: {{{chargingHistory}}}
- Current Battery Percentage: {{{currentBatteryPercentage}}}%
- User's Preferred Charge Level: {{{preferredChargeLevel}}}%
- Local Energy Cost: {{{energyCost}}}
- Trip Start Location: {{{startLocation}}}
- Trip End Location: {{{endLocation}}}

Based on this information, provide the following:
1.  A suggested charging schedule in a clear, concise format (e.g., "Start charging at 11:00 PM for 3 hours and 30 minutes.").
2.  An estimate of the potential cost savings compared to their typical charging habits.
3.  A brief explanation of how this schedule benefits the vehicle's battery longevity.
4.  If both a start and end location are provided, calculate and return the estimated battery percentage required for the trip. If not, leave this field blank. Assume an average EV efficiency of 4 miles/kWh.
`,
});

const suggestChargingScheduleFlow = ai.defineFlow(
  {
    name: 'suggestChargingScheduleFlow',
    inputSchema: ChargingScheduleInputSchema,
    outputSchema: ChargingScheduleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
