// In-memory store for Circles (named groups of advocacy contacts).
// Seed data scrubbed for the executive scope demo.
import dayjs from 'dayjs';
import { listPeopleByCircle, STAGE_ORDER } from './people';

const wait = (ms = 80) => new Promise((r) => setTimeout(r, ms));

let DB = [];

const stageScore = (stage) => STAGE_ORDER.indexOf(stage);

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
