import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Sarah M.",
    car: "Toyota Camry",
    rating: 5,
    text: "Booked at 10pm, dropped my car next morning. Got live updates through every step. Invoice matched the quote exactly — zero surprises. Best shop experience I've ever had.",
    avatar: "SM",
  },
  {
    name: "James T.",
    car: "Ford Ranger",
    rating: 5,
    text: "They photographed the old brake pads and sent me the report before I even picked up the car. This is what transparency looks like. Won't go anywhere else now.",
    avatar: "JT",
  },
  {
    name: "Linh N.",
    car: "Honda Civic",
    rating: 5,
    text: "The online booking is so smooth. Picked my time, got a confirmation in seconds. Car was ready exactly when they said. Absolutely flawless from start to finish.",
    avatar: "LN",
  },
];
export default function TestimonialsSection() {
  return (
    <section className="bg-muted py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mb-16 animate-on-scroll">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">Reviews</p>
          <h2
            className="text-4xl md:text-5xl font-black text-foreground leading-tight"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            Drivers who
            <br />
            <em className="font-normal text-muted-foreground">trust us.</em>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className={`border border-border rounded-2xl p-7 bg-card hover:bg-accent transition-all duration-300 card-hover animate-on-scroll stagger-${i + 1}`}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 fill-amber-400 text-amber-400 hover:scale-125 transition-transform duration-150"
                    style={{ transitionDelay: `${i * 40}ms` }}
                  />
                ))}
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic">"{t.text}"</p>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0 hover:scale-110 transition-transform duration-200">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.car}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
