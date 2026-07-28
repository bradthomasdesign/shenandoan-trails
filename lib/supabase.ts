import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Trail = {
  id: string;
  slug: string;
  name: string;
  subtitle: string | null;
  summary: string | null;
  article_url: string | null;
  region: string | null;
  park_or_forest: string | null;
  distance_miles: number | null;
  elevation_gain_ft: number | null;
  difficulty: 'easy' | 'moderate' | 'hard' | 'strenuous' | null;
  route_type: 'out_and_back' | 'loop' | 'point_to_point' | null;
  est_time_minutes: number | null;
  dog_policy: string | null;
  fee_required: boolean | null;
  fee_notes: string | null;
  parking_notes: string | null;
  trailhead_lat: number | null;
  trailhead_lng: number | null;
  best_seasons: string[] | null;
  hazards: string | null;
  water_sources: string | null;
  cell_service: string | null;
  geojson: any;
  elevation_profile: any;
  hero_image_url: string | null;
};

export type Waypoint = {
  id: string;
  sequence: number;
  label: string;
  description: string | null;
  lat: number;
  lng: number;
  mile_marker: number | null;
};
