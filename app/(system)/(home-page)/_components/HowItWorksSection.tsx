// "use client";
// import CreateBookingPage from "@/app/appoinment/create-booking";
// import { Clock, Shield, Calendar } from "lucide-react";

// const STEPS = [
//   {
//     num: "01",
//     title: "Book in Minutes",
//     desc: "Select your service, preferred location, date and time slot. Real-time availability, no phone calls.",
//     icon: Calendar,
//   },
//   {
//     num: "02",
//     title: "Drop & Track Live",
//     desc: "Hand over your keys. Monitor every repair stage live — know exactly what's happening to your car.",
//     icon: Clock,
//   },
//   {
//     num: "03",
//     title: "Drive Away Confident",
//     desc: "Full post-service report with photos, 12-month warranty, and zero hidden charges.",
//     icon: Shield,
//   },
// ];
// export default function HowItWorksSection() {
//   return (
//     // <section id="how-it-works" className="bg-muted py-28 px-6">
//     <section
//       id="how-it-works"
//       className="py-28 px-6 bg-cover bg-center bg-no-repeat"
//       style={{
//         backgroundImage: "url('/image/flo/floral7.webp')",
//       }}
//     >
//       <div className="max-w-6xl mx-auto">
//         <div className="max-w-xl mb-16 animate-on-scroll">
//           <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">Process</p>
//           <h2
//             className="text-4xl md:text-5xl font-black text-foreground leading-tight mb-4"
//             style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
//           >
//             Three steps,
//             <br />
//             <em className="font-normal text-muted-foreground">perfectly fixed.</em>
//           </h2>
//           <p className="text-base text-muted-foreground leading-relaxed">
//             No phone calls, no waiting on hold. Real-time visibility from booking to pickup.
//           </p>
//         </div>

//         <div className="grid md:grid-cols-3 gap-6">
//           {STEPS.map((step, i) => {
//             const Icon = step.icon;
//             return (
//               <div key={step.num} className={`relative animate-on-scroll stagger-${i + 1}`}>
//                 {i < STEPS.length - 1 && (
//                   <div className="hidden md:block absolute top-8 left-[calc(100%+12px)] w-[calc(100%-24px)] h-px bg-border z-10" />
//                 )}

//                 <div className="border border-border rounded-2xl p-7 bg-card hover:bg-accent transition-all duration-300 h-full card-hover">
//                   <div className="flex items-center gap-3 mb-5">
//                     <span className="text-xs font-bold text-muted-foreground/50 tracking-widest">{step.num}</span>
//                     <div className="flex-1 h-px bg-border" />
//                     <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center transition-transform duration-300 hover:scale-110">
//                       <Icon className="w-4 h-4 text-muted-foreground" />
//                     </div>
//                   </div>
//                   <h3 className="text-lg font-bold text-foreground mb-3">{step.title}</h3>
//                   <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Booking mini-preview */}
//         <div className="mt-16  rounded-2xl overflow-hidden animate-on-scroll">
//           <CreateBookingPage />
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";
import CreateBookingPage from "@/app/appoinment/create-booking";
import { Clock, Shield, Calendar } from "lucide-react";

const STEPS = [
  {
    num: "01",
    title: "Book in Minutes",
    desc: "Select your service, preferred location, date and time slot. Real-time availability, no phone calls.",
    icon: Calendar,
  },
  {
    num: "02",
    title: "Drop & Track Live",
    desc: "Hand over your keys. Monitor every repair stage live — know exactly what's happening to your car.",
    icon: Clock,
  },
  {
    num: "03",
    title: "Drive Away Confident",
    desc: "Full post-service report with photos, 12-month warranty, and zero hidden charges.",
    icon: Shield,
  },
];
export default function HowItWorksSection() {
  return (
    // <section id="how-it-works" className="bg-muted py-28 px-6">
    <section
      id="how-it-works"
      className="py-28 px-6 text-primary bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/image/flo/floral7.webp')",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mb-16 animate-on-scroll">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-4">Process</p>
          <h2
            className="text-4xl md:text-5xl font-black text-foreground leading-tight mb-4"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            Three steps,
            <br />
            <em className="font-normal ">perfectly fixed.</em>
          </h2>
          <p className="text-base  leading-relaxed">
            No phone calls, no waiting on hold. Real-time visibility from booking to pickup.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className={`relative animate-on-scroll stagger-${i + 1}`}>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(100%+12px)] w-[calc(100%-24px)] h-px bg-border z-10" />
                )}

                <div className="border border-border rounded-2xl p-7 bg-card hover:bg-accent transition-all duration-300 h-full card-hover">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-xs font-bold  tracking-widest">{step.num}</span>
                    <div className="flex-1 h-px bg-border" />
                    <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center transition-transform duration-300 hover:scale-110">
                      <Icon className="w-4 h-4 " />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-3">{step.title}</h3>
                  <p className="text-sm  leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Booking mini-preview */}
        <div className="mt-16  rounded-2xl overflow-hidden animate-on-scroll">
          <CreateBookingPage />
        </div>
      </div>
    </section>
  );
}
