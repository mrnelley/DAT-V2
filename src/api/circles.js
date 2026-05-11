// In-memory mock API for Circles (named groups of advocacy contacts).
import dayjs from 'dayjs';
import { listPeopleByCircle, STAGE_ORDER } from './people';

const wait = (ms = 80) => new Promise((r) => setTimeout(r, ms));

let DB = [
  {
    id: 'cir_state_housing',
    name: 'State Housing Committee',
    description: 'Legislators on the State Senate + Assembly Housing committees. The path for SB-241.',
    cadenceDays: 21,
    color: '#072c5e',
  },
  {
    id: 'cir_federal_funders',
    name: 'Federal Funders Network',
    description: 'Foundations + federal agency contacts that drive our funding pipeline.',
    cadenceDays: 30,
    color: '#5eb8a8',
  },
  {
    id: 'cir_local_press',
    name: 'Local Press',
    description: 'Bay Area housing reporters and editors. Story pipeline for our advocacy moments.',
    cadenceDays: 30,
    color: '#f1ac49',
  },
  {
    id: 'cir_ba_coalition',
    name: 'Bay Area Housing Coalition',
    description: 'Peer EDs and policy leads across affordable housing orgs. Collective voice.',
    cadenceDays: 21,
    color: '#3d9585',
  },
  {
    id: 'cir_hdc_board',
    name: 'HDC Board',
    description: 'Governance + fiduciary leadership. Highest cadence target.',
    cadenceDays: 14,
    color: '#041e42',
  },
  {
    id: 'cir_resident_leaders',
    name: 'Resident Council Leaders',
    description: 'Resident leadership across all properties. The voices we amplify in policy.',
    cadenceDays: 28,
    color: '#db534c',
  },
];

const stageScore = (stage) => STAGE_ORDER.indexOf(stage); // 0..3

export async function listCircles() {
  await wait(10);
  const enriched = await Promise.all(
    DB.map(async (c) => {
      const members = await listPeopleByCircle(c.id);
      const total = members.length;
      const withinWindow = members.filter((m) => m.daysSince <= m.cadenceDays).length;
      const cadenceHealth = total === 0 ? 0 : Math.round((withinWindow / total) * 100);
      const avgStage = total === 0 ? 0 : members.reduce((s, m) => s + stageScore(m.stage), 0) / total;
      const lastTouch = members.reduce((latest, m) => {
        const t = dayjs(m.lastTouch);
        return !latest || t.isAfter(latest) ? t : latest;
      }, null);
      return {
        ...c,
        memberCount: total,
        cadenceHealth,
        averageStageScore: avgStage,
        lastTouch: lastTouch ? lastTouch.toISOString() : null,
        daysSinceLastTouch: lastTouch ? dayjs().diff(lastTouch, 'day') : null,
      };
    }),
  );
  return enriched;
}

export async function getCircle(id) {
  await wait();
  const c = DB.find((x) => x.id === id);
  if (!c) return null;
  const members = await listPeopleByCircle(id);
  return { ...c, members };
}
