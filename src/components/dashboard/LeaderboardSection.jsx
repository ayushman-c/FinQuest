import "./LeaderboardSection.css";

// Placeholder players — shown as blurred/locked entries
const PLACEHOLDER_PLAYERS = [
  { rank: 1, name: "Rahul S.",    xp: 4250, level: 12, badge: "🏆" },
  { rank: 2, name: "Priya M.",   xp: 3900, level: 11, badge: "🥈" },
  { rank: 3, name: "Arjun K.",   xp: 3400, level: 10, badge: "🥉" },
  { rank: 4, name: "Sneha R.",   xp: 2800, level: 8,  badge: null  },
  { rank: 5, name: "Dev P.",     xp: 2100, level: 6,  badge: null  },
];

export default function LeaderboardSection() {
  return (
    <div className="mainbox">
    <section className="lb-section">

      {/* Heading */}
      <div className="lb-section__heading">
        <div className="lb-section__title-row">
          <h2 className="lb-section__title">Leaderboard</h2>
          <span className="lb-section__pill">🚧 Coming Soon</span>
        </div>
        <p className="lb-section__subtitle">
          See how your XP and level stack up against other learners
        </p>
      </div>

      {/* Card */}
      <div className="lb-card">

        {/* Coming soon overlay */}
        <div className="lb-overlay">
          <div className="lb-overlay__content">
            <div className="lb-overlay__icon">🏆</div>
            <h3 className="lb-overlay__title">Leaderboard is on its way</h3>
            <p className="lb-overlay__desc">
              We're building a global ranking system. Complete lessons, earn XP,
              and claim your spot when it launches.
            </p>
            <div className="lb-overlay__badge">Under Development</div>
          </div>
        </div>

        {/* Blurred placeholder rows */}
        <div className="lb-table">
          <div className="lb-table__header">
            <span className="lb-table__col lb-table__col--rank">Rank</span>
            <span className="lb-table__col lb-table__col--player">Player</span>
            <span className="lb-table__col lb-table__col--level">Level</span>
            <span className="lb-table__col lb-table__col--xp">XP</span>
          </div>

          {PLACEHOLDER_PLAYERS.map((player) => (
            <div
              key={player.rank}
              className={`lb-row${player.rank <= 3 ? ` lb-row--top${player.rank}` : ""}`}
            >
              <span className="lb-row__rank">
                {player.badge
                  ? <span className="lb-row__badge">{player.badge}</span>
                  : <span className="lb-row__rank-num">#{player.rank}</span>
                }
              </span>
              <span className="lb-row__player">
                <span className="lb-row__avatar">
                  {player.name[0]}
                </span>
                <span className="lb-row__name">{player.name}</span>
              </span>
              <span className="lb-row__level">Lv. {player.level}</span>
              <span className="lb-row__xp">{player.xp.toLocaleString()} XP</span>
            </div>
          ))}
        </div>

      </div>
    </section>
    </div>
  );
}
