import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

function escapeXml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const { data: trail } = await supabase
    .from('trails')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single();

  if (!trail) {
    return NextResponse.json({ error: 'Trail not found' }, { status: 404 });
  }

  const coords: [number, number][] = trail.geojson?.coordinates || [];
  const name = escapeXml(trail.name);

  const trkpts = coords.map(([lng, lat]) => `      <trkpt lat="${lat}" lon="${lng}"></trkpt>`).join('\n');

  const wpt =
    trail.trailhead_lat && trail.trailhead_lng
      ? `  <wpt lat="${trail.trailhead_lat}" lon="${trail.trailhead_lng}">\n    <name>${name} Trailhead</name>\n  </wpt>\n`
      : '';

  const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Shenandoan Trails" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${name}</name>
  </metadata>
${wpt}  <trk>
    <name>${name}</name>
    <trkseg>
${trkpts}
    </trkseg>
  </trk>
</gpx>
`;

  return new NextResponse(gpx, {
    headers: {
      'Content-Type': 'application/gpx+xml',
      'Content-Disposition': `attachment; filename="${trail.slug}.gpx"`,
    },
  });
}
