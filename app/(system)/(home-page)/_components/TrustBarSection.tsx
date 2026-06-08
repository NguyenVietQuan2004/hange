import { BMWIcon, FordIcon, HondaIcon, HyundaiIcon, MazdaIcon, ToyotaIcon } from "@/public/icons";

const BRANDS = [
  { name: "Toyota", icon: ToyotaIcon },
  { name: "Honda", icon: HondaIcon },
  { name: "Ford", icon: FordIcon },
  { name: "BMW", icon: BMWIcon },
  { name: "Hyundai", icon: HyundaiIcon },
  { name: "Mazda", icon: MazdaIcon },
];
import Marquee from "react-fast-marquee";

export default function TrustBarSection() {
  return (
    <div className="bg-muted border-y border-border py-5">
      <Marquee speed={100} gradient={false} autoFill>
        {BRANDS.map((brand) => {
          const Icon = brand.icon;

          return (
            <div
              key={brand.name}
              className="flex items-center gap-2 mx-8 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon className="w-6 h-6" />
              <span className="text-sm italic font-medium">{brand.name}</span>
            </div>
          );
        })}
      </Marquee>
    </div>
  );
}
