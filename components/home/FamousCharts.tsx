'use client';

import Link from 'next/link';
import { FAMOUS_PERSONS } from '@/lib/ziwei/famous';

export default function FamousCharts() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {FAMOUS_PERSONS.slice(0, 3).map((person) => (
        <Link
          key={`${person.name}-${person.year}`}
          href={`/chart?name=${encodeURIComponent(person.name)}&year=${person.year}&month=${person.month}&day=${person.day}&gender=${person.gender}`}
          className="card-flat p-4"
          style={{ textDecoration: 'none', color: 'var(--tx-1)' }}
        >
          <div style={{ color: 'var(--ac)', fontSize: 12, letterSpacing: '0.08em' }}>{person.name}</div>
          <div style={{ color: 'var(--tx-3)', fontSize: 11, marginTop: 4 }}>
            {person.year}.{person.month}.{person.day}
          </div>
        </Link>
      ))}
    </div>
  );
}
