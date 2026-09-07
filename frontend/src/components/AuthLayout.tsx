import type { ReactNode } from "react";
import { Link } from "react-router-dom";

// One row of the ledger on the left.
interface LedgerEntry {
  item: string;
  note: string;
}

interface AuthLayoutProps {
  children: ReactNode;
}

// The things students actually hand down each year. This is the
// left half of every authentication screen.
const ledger: LedgerEntry[] = [
  { item: "Engineering Mathematics, Vol. II", note: "passed on three times" },
  { item: "Casio fx-991EX", note: "on rent this semester" },
  { item: "Hero Sprint, hostel block C", note: "free to a first year" },
  { item: "Drafting board and mini-drafter", note: "wanted by two people" },
  { item: "Study lamp, clip-on", note: "given away last week" },
];

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="shell">
      <aside className="ledger-panel">
        <div className="ledger-panel__top">
          <Link to="/" className="wordmark">
            Campus Marketplace
          </Link>
          <p className="ledger-panel__intro">
            One place for your college to lend, sell, swap and give away the things
            everybody buys and then stops using.
          </p>
        </div>

        <div className="ledger">
          <h2 className="ledger__heading">Moving around campus right now</h2>
          <ul className="ledger__list">
            {ledger.map((entry: LedgerEntry) => (
              <li key={entry.item} className="ledger__row">
                <span className="ledger__item">{entry.item}</span>
                <span className="ledger__note">{entry.note}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="ledger-panel__foot">
          Open only to verified students of this college.
        </p>
      </aside>

      <main className="form-panel">
        <div className="form-panel__inner">{children}</div>
      </main>
    </div>
  );
}
