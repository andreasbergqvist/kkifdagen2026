import {
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useParams,
} from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { AVAILABLE_YEARS, SCHEDULES } from './data/schedules';

const DEFAULT_YEAR = 2026;
const LOGO_SRC = `${import.meta.env.BASE_URL}karrakif-logo.png`;
const TEAM_PLACEHOLDER_PATTERN = /^(vinnare|finalist)\b/i;
const TEAM_FILTER_PRIORITY = ['herrar', 'damer', 'herrjunior yngre'];
const MOBILE_TEAM_NAME_MAP = {
  'Herrjunior Yngre': 'Herrjr Y',
};

function getTeamFilterPriority(teamName) {
  return TEAM_FILTER_PRIORITY.indexOf(teamName.trim().toLowerCase());
}

function isNamedTeam(teamName) {
  return Boolean(teamName) && !TEAM_PLACEHOLDER_PATTERN.test(teamName);
}

function formatMobileTeamName(teamName) {
  return MOBILE_TEAM_NAME_MAP[teamName] || teamName;
}

function sortTeamNames(teamNames) {
  return [...teamNames].sort((a, b) => {
    const aPriority = getTeamFilterPriority(a);
    const bPriority = getTeamFilterPriority(b);

    if (aPriority !== -1 && bPriority !== -1) return aPriority - bPriority;
    if (aPriority !== -1) return -1;
    if (bPriority !== -1) return 1;

    return a.localeCompare(b, 'sv');
  });
}

function formatTeamPath(year, team) {
  return `/spelschema/${year}/lag/${encodeURIComponent(team)}`;
}

function formatGroupPath(year, group) {
  return `/spelschema/${year}/grupp/${encodeURIComponent(group)}`;
}

function formatPlanPath(year, plan) {
  return `/spelschema/${year}/plan/${encodeURIComponent(plan)}`;
}

function Header() {
  return (
    <header className="border-b border-white/70 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-2 py-3 sm:gap-4 sm:px-6 sm:py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img src={LOGO_SRC} alt="KKIF" className="h-10 w-auto sm:h-12" />
          <div>
            <h1 className="font-display text-xl font-black leading-5 text-sky-950 sm:text-2xl">
              KKIF-dagen
            </h1>
          </div>
        </Link>

        <nav className="site-navigation flex items-center gap-1 rounded-full border border-sky-950/10 bg-white p-1 text-xs font-semibold sm:text-sm">
          <NavItem to="/">Start</NavItem>
          <NavItem to="/spelschema">Spelschema</NavItem>
        </nav>
      </div>
    </header>
  );
}

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `rounded-full px-3 py-2 transition sm:px-4 ${
          isActive
            ? 'bg-sky-900 text-white'
            : 'text-sky-900 hover:bg-amber-200/70 hover:text-sky-950'
        }`
      }
    >
      {children}
    </NavLink>
  );
}

function PageShell({ children }) {
  return (
    <main className="mx-auto px-2 py-4 sm:max-w-6xl sm:px-6 sm:py-8 lg:px-8">
      {children}
    </main>
  );
}

function StartPage() {
  return (
    <PageShell>
      <section className="overflow-hidden rounded-3xl border border-sky-950/10 bg-gradient-to-br from-white via-sky-50 to-amber-50 p-5 shadow-[0_20px_45px_rgba(11,63,119,0.12)] sm:p-8">
        <h2 className="font-display text-4xl font-black leading-tight text-sky-950 sm:text-5xl">
          KKIF-dagen 2026
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-sky-950/75">
          Ta med hela familjen och kom ner till Klarebergsvallen och fira
          KKIF-dagen tillsammans. Det blir en fin dag där vi får se alla våra
          lag möta varandra.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <InfoCard title="Datum">Lördag 2026-06-06</InfoCard>
          <InfoCard title="Plats">Klarebergsvallen</InfoCard>
          <InfoCard title="Starttid">09:30</InfoCard>
        </div>

        <div className="mt-6 rounded-2xl border border-sky-900/10 bg-white/90 p-5 print:break-after-page">
          <h3 className="text-xs font-extrabold uppercase tracking-[0.18em] text-sky-900/70">
            Dagens innehåll
          </h3>
          <ul className="mt-3 space-y-2 text-sky-950/85">
            <li>09:30 Uppvisningsmatch med våra yngsta spelare</li>
            <li>10:00 Turneringen startar</li>
            <li>Café och grillförsäljning</li>
            <li>Merchbord</li>
            <li>Bytesbord med klubbkläder och fotbollsskor</li>
            <li>Skjuta-hårt-tävling</li>
            <li>Tipspromenad</li>
          </ul>
        </div>

        <div className="mt-6 rounded-2xl border border-sky-900/10 bg-white/90 p-5">
          <h3 className="text-xs font-extrabold uppercase tracking-[0.18em] text-sky-900/70">
            Planer
          </h3>
          <ul className="mt-3 space-y-2 text-sky-950/85">
            <li>Plan 1 - Naturgräs (7 mot 7 mål)</li>
            <li>Plan 2 - Naturgräs (7 mot 7 mål)</li>
            <li>Plan 3 - Konstgräs (7 mot 7 mål)</li>
            <li>Plan 4 - Konstgräs (7 mot 7 mål)</li>
            <li>Plan 5 - Konstgräs (9 mot 9 mål)</li>
            <li>Plan 6 - Konstgräs 7 mot 7 planen (7 mot 7 mål)</li>
          </ul>
        </div>

        <div className="mt-6 rounded-2xl border border-sky-900/10 bg-white/90 p-5">
          <h2 className="font-display text-2xl font-black text-sky-950">
            Regler
          </h2>

          <ol className="mt-4 space-y-3 text-sky-950/85">
            <li>
              Matchtid 10 min + straffar. Alla matcher startar på utsatt tid.
            </li>
            <li>
              Gruppspel avgörs enligt poäng: vinst 3, oavgjort 1, förlust 0.
            </li>
            <li>
              Vid lika poäng gäller målskillnad, därefter flest gjorda mål,
              sedan lottning.
            </li>
            <li>
              Efter spelet får man lika många straffar som man ligger under med.
              Därefter får man lika många straffar som det skiljer i ålder. Herr-
              och damlag räknas som 18 år.
            </li>
            <li>
              Schysst spel, respekt för domare och motståndare gäller hela dagen.
            </li>
          </ol>

          <div className="mt-4 rounded-xl border border-sky-900/10 bg-sky-50/60 p-4 text-sky-950/85">
            <h3 className="text-xs font-extrabold uppercase tracking-[0.18em] text-sky-900/70">
              Exempel
            </h3>
            <p className="mt-2 text-sm leading-relaxed">
              Exempel: P12 möter P18. P12 vinner med 3-1. Då får P18 2 straffar
              för att de låg under, och 6 straffar för åldersskillnad.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function InfoCard({ title, children }) {
  return (
    <article className="rounded-2xl border border-sky-900/10 bg-white/90 p-4">
      <h3 className="text-xs font-extrabold uppercase tracking-[0.18em] text-sky-900/70">
        {title}
      </h3>
      <p className="mt-2 text-lg font-bold text-sky-950">{children}</p>
    </article>
  );
}

function SchedulePage() {
  const params = useParams();
  const year = Number(params.year || DEFAULT_YEAR);
  const matches = SCHEDULES[year] || null;

  const [groupFilter, setGroupFilter] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('');

  useEffect(() => {
    if (params.groupId) {
      setGroupFilter(decodeURIComponent(params.groupId));
      return;
    }

    setGroupFilter('');
  }, [params.groupId]);

  useEffect(() => {
    if (params.teamId) {
      const routeTeam = decodeURIComponent(params.teamId);
      setTeamFilter(isNamedTeam(routeTeam) ? routeTeam : '');
      return;
    }

    setTeamFilter('');
  }, [params.teamId]);

  useEffect(() => {
    if (params.planId) {
      setPlanFilter(decodeURIComponent(params.planId));
      return;
    }

    setPlanFilter('');
  }, [params.planId]);

  const groups = useMemo(() => {
    if (!matches) return [];
    return [...new Set(matches.map((match) => match.group))].sort((a, b) =>
      a.localeCompare(b, 'sv'),
    );
  }, [matches]);

  const plans = useMemo(() => {
    if (!matches) return [];
    return [...new Set(matches.map((match) => String(match.planNr)))].sort(
      (a, b) => Number(a) - Number(b),
    );
  }, [matches]);

  const teams = useMemo(() => {
    if (!matches) return [];
    return sortTeamNames(
      [
        ...new Set(matches.flatMap((match) => [match.team1, match.team2])),
      ].filter(isNamedTeam),
    );
  }, [matches]);

  const groupTeams = useMemo(() => {
    if (!matches || !groupFilter) return [];

    return sortTeamNames(
      [
        ...new Set(
          matches
            .filter((match) => match.group === groupFilter)
            .flatMap((match) => [match.team1, match.team2]),
        ),
      ].filter(isNamedTeam),
    );
  }, [groupFilter, matches]);

  const groupsWithTeams = useMemo(() => {
    if (!matches) return [];

    return groups
      .filter((group) => group !== 'Slutspel')
      .map((group) => ({
        group,
        teams: sortTeamNames(
          [
            ...new Set(
              matches
                .filter((match) => match.group === group)
                .flatMap((match) => [match.team1, match.team2]),
            ),
          ].filter(isNamedTeam),
        ),
      }));
  }, [groups, matches]);

  const filteredMatches = useMemo(() => {
    if (!matches) return [];

    return matches.filter((match) => {
      const groupOk = !groupFilter || match.group === groupFilter;
      const teamOk =
        !teamFilter || match.team1 === teamFilter || match.team2 === teamFilter;
      const planOk = !planFilter || String(match.planNr) === planFilter;
      return groupOk && teamOk && planOk;
    });
  }, [groupFilter, matches, planFilter, teamFilter]);

  const activeFilters = [
    groupFilter ? `Grupp ${groupFilter}` : null,
    planFilter ? `Plan ${planFilter}` : null,
    teamFilter ? `Lag ${teamFilter}` : null,
  ].filter(Boolean);

  if (!matches) {
    return (
      <PageShell>
        <section className="rounded-3xl border border-sky-950/10 bg-white p-8 text-center">
          <h2 className="font-display text-3xl font-black text-sky-950">
            Spelschema {year}
          </h2>
          <p className="mt-3 text-sky-900/75">Spelschemat kommer snart.</p>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="schedule-page space-y-4 rounded-3xl border border-sky-950/10 bg-white p-4 shadow-[0_20px_45px_rgba(11,63,119,0.08)] sm:p-6">
        <div className="schedule-header flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="schedule-title font-display text-3xl font-black text-sky-950">
              <span className="hidden print:inline">KKIF-dagen </span>Spelschema{' '}
              {year}
            </h2>
            <p className="schedule-print-meta hidden text-sm text-sky-950">
              {activeFilters.length > 0
                ? `Filter: ${activeFilters.join(' • ')}`
                : 'Alla matcher'}
            </p>
          </div>
          <div className="schedule-summary rounded-full border border-sky-900/15 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-900 flex items-center gap-3">
            <span>
              {filteredMatches.length} / {matches.length} matcher
            </span>
            <span className="hidden sm:inline text-sky-900/20">|</span>
            <Link
              to={`/spelschema/${year}`}
              className="text-xs font-semibold text-sky-900/60 hover:text-sky-900 underline-offset-2 hover:underline"
            >
              Rensa filter
            </Link>
          </div>
        </div>

        <div className="schedule-filters space-y-3 rounded-2xl border border-sky-900/10 bg-sky-50/60 p-3 sm:p-4">
          <FilterRow
            title="Plan"
            items={plans}
            selected={planFilter}
            formatPath={(item) => formatPlanPath(year, item)}
            prefix="Plan "
            year={year}
          />
        </div>

        {groupFilter && groupTeams.length > 0 ? (
          <section className="schedule-group-summary rounded-2xl border border-sky-900/10 bg-white p-4 shadow-[0_10px_30px_rgba(11,63,119,0.06)]">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-[0.18em] text-sky-900/70">
                  Lag i grupp {groupFilter}
                </h3>
                <p className="schedule-group-count mt-1 text-sm text-sky-950/70">
                  {groupTeams.length} lag i vald grupp
                </p>
              </div>
            </div>
            <div className="schedule-group-teams mt-3 flex flex-wrap gap-2">
              {groupTeams.map((team) => (
                <Link
                  key={team}
                  to={formatTeamPath(year, team)}
                  className="schedule-group-team rounded-full border border-sky-900/15 bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-900 transition hover:border-sky-900/30 hover:bg-amber-100"
                >
                  {team}
                </Link>
              ))}
            </div>
          </section>
        ) : !groupFilter &&
          !teamFilter &&
          !planFilter &&
          groupsWithTeams.length > 0 ? (
          <section className="schedule-all-groups space-y-4">
            {groupsWithTeams.map(({ group, teams }) => (
              <div
                key={group}
                className="rounded-2xl border border-sky-900/10 bg-white p-4 shadow-[0_10px_30px_rgba(11,63,119,0.06)] md:flex md:items-center md:gap-4"
              >
                <h3 className="text-xs font-extrabold uppercase tracking-[0.18em] text-sky-900/70 md:shrink-0 md:self-center">
                  <Link
                    to={formatGroupPath(year, group)}
                    className="hover:text-sky-700 underline-offset-2 hover:underline"
                  >
                    {group === 'Slutspel' ? '🏆 Slutspel' : `Grupp ${group}`}
                  </Link>
                </h3>
                <div className="mt-3 flex flex-wrap gap-2 md:mt-0">
                  {teams.map((team) => (
                    <Link
                      key={team}
                      to={formatTeamPath(year, team)}
                      className="rounded-full border border-sky-900/15 bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-900 transition hover:border-sky-900/30 hover:bg-amber-100"
                    >
                      {team}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </section>
        ) : null}

        <div className="schedule-table-wrap overflow-auto rounded-2xl border border-sky-900/10">
          <table className="schedule-table min-w-full text-left text-xs sm:text-sm">
            <thead className="bg-sky-900 text-xs uppercase tracking-[0.08em] text-sky-50">
              <tr>
                <th className="px-2 py-3 sm:px-4">Tid</th>
                <th className="px-2 py-3 sm:px-4">Lag</th>
                <th className="px-2 py-3 sm:px-4">Plan</th>
                <th className="px-2 py-3 sm:px-4">Grupp</th>
                <th className="px-2 py-3 sm:px-4">Typ</th>
              </tr>
            </thead>
            <tbody>
              {filteredMatches.map((match) => (
                <tr
                  key={match.nr}
                  className="border-b border-sky-900/10 bg-white odd:bg-sky-50/40"
                >
                  <td className="px-2 py-2 font-bold text-sky-950 sm:px-4 sm:py-3">
                    {match.time}
                  </td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3">
                    <div className="space-y-1">
                      {isNamedTeam(match.team1) ? (
                        <Link
                          to={formatTeamPath(year, match.team1)}
                          aria-label={`Lag 1: ${match.team1}`}
                          className="block sm:inline font-semibold text-sky-900 hover:text-sky-700 truncate"
                        >
                          <span className="sm:hidden">
                            {formatMobileTeamName(match.team1)}
                          </span>
                          <span className="hidden sm:inline">
                            {match.team1}
                          </span>{' '}
                          <span className="font-normal">vs </span>
                        </Link>
                      ) : (
                        <span className="block text-sky-900/45">-</span>
                      )}
                      {isNamedTeam(match.team2) ? (
                        <Link
                          to={formatTeamPath(year, match.team2)}
                          aria-label={`Lag 2: ${match.team2}`}
                          className="block sm:inline font-semibold text-sky-900 hover:text-sky-700"
                        >
                          <span className="sm:hidden">
                            {formatMobileTeamName(match.team2)}
                          </span>
                          <span className="hidden sm:inline">
                            {match.team2}
                          </span>
                        </Link>
                      ) : (
                        <span className="block text-sky-900/45">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3">
                    <Link
                      to={formatPlanPath(year, String(match.planNr))}
                      className="inline-block rounded-full border border-sky-900/15 bg-sky-100 px-2 py-1 font-semibold text-sky-900 hover:bg-amber-100 sm:px-3"
                    >
                      {match.planNr}
                    </Link>
                  </td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3">
                    <Link
                      to={formatGroupPath(year, match.group)}
                      className="rounded-full border border-sky-900/20 bg-white px-2 py-1 font-bold text-sky-900 hover:bg-amber-100 sm:px-3"
                    >
                      {match.group === 'Slutspel' ? '🏆' : match.group}
                    </Link>
                  </td>
                  <td className="px-2 py-2 text-sky-900/80 sm:px-4 sm:py-3">
                    {match.type}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageShell>
  );
}

function FilterRow({ title, items, selected, formatPath, prefix = '' }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-sky-900/70">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const active = item === selected;

          return (
            <Link
              key={item}
              to={formatPath(item)}
              className={`rounded-full border px-3 py-1 text-sm font-semibold transition ${
                active
                  ? 'border-sky-900 bg-sky-900 text-white'
                  : 'border-sky-900/15 bg-white text-sky-900 hover:bg-amber-100'
              }`}
            >
              {prefix}
              {item}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  const defaultYear = AVAILABLE_YEARS[0] || DEFAULT_YEAR;

  return (
    <div className="min-h-screen bg-kkif">
      <Header />
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route
          path="/spelschema"
          element={<Navigate to={`/spelschema/${defaultYear}`} replace />}
        />
        <Route path="/spelschema/:year" element={<SchedulePage />} />
        <Route
          path="/spelschema/:year/grupp/:groupId"
          element={<SchedulePage />}
        />
        <Route
          path="/spelschema/:year/lag/:teamId"
          element={<SchedulePage />}
        />
        <Route
          path="/spelschema/:year/plan/:planId"
          element={<SchedulePage />}
        />
      </Routes>
    </div>
  );
}
