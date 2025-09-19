// components/nav/SectionTree.tsx
import Link from "next/link";

export type NavItem = { key: string; label: string };
export type NavGroup = { key: string; label: string; items: NavItem[] };
export type AppNav   = { groups: NavGroup[] };

function Group({ group, current }: { group: NavGroup; current: string }) {
  return (
    <details className="tree-group" open>
      <summary className="sidebar-link hover-grey">
        <span style={{width:"1rem"}} aria-hidden>▸</span>
        <span>{group.label}</span>
      </summary>
      <div className="pl-4 mt-1 space-y-1">
        {group.items.map(it => {
          const active = current === it.key;
          return (
            <Link
              key={it.key}
              href={`/application/${it.key}`}
              className={["sidebar-link hover-grey", active ? "active" : ""].join(" ")}
              aria-current={active ? "page" : undefined}
            >
              <span className="dot" aria-hidden>•</span>
              <span>{it.label}</span>
            </Link>
          );
        })}
      </div>
    </details>
  );
}

export default function SectionTree({ nav, current }: { nav: AppNav; current: string }) {
  return (
    <nav className="space-y-2 tree">
      {nav.groups.map(g => <Group key={g.key} group={g} current={current} />)}
    </nav>
  );
}
