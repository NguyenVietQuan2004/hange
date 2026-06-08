const STATS = [
  { value: "4,800+", label: "Repairs Completed" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "12 mo", label: "Warranty on All Work" },
  { value: "3", label: "Service Locations" },
];
export default function StatsSection() {
  return (
    <section className="bg-background py-24 px-6 border-y border-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-border">
          {STATS.map((s, i) => (
            <div key={s.label} className={`text-center md:px-8 animate-on-scroll stagger-${i + 1}`}>
              <div
                className="text-5xl font-black text-foreground mb-2"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              >
                {s.value}
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
