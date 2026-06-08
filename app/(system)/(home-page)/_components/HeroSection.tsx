"use client";

import CountUp from "react-countup";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      <ThreeHeroCanvas />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background pointer-events-none z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40 pointer-events-none z-10" />

      {/* Content */}
      <div className="relative select-none z-20 text-center px-6 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border text-muted-foreground text-xs font-medium tracking-widest uppercase mb-8 backdrop-blur-sm animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          ASE Certified Auto Repair
        </div>

        {/* Headline */}
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground leading-[0.95] tracking-tighter mb-6 animate-fade-up delay-100"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
        >
          Your Car,
          <br />
          <span
            className="text-transparent"
            style={{ WebkitTextStroke: "1.5px color-mix(in srgb, var(--foreground) 50%, transparent)" }}
          >
            Fixed Right.
          </span>
          <br />
          <span className="italic font-normal text-muted-foreground">Guaranteed.</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed mb-10 animate-fade-up delay-200">
          Book online in 2 minutes. Real-time tracking. Full report on pickup. No surprises — ever.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up delay-300">
          <Link
            href="/appoinment"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-foreground text-background font-bold text-base hover:opacity-90 hover:scale-105 active:scale-95 transition-all duration-200 group"
          >
            Schedule a Repair
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          <a
            href="#services"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-border text-foreground font-medium text-base hover:bg-accent hover:scale-105 active:scale-95 transition-all duration-200 backdrop-blur-sm"
          >
            View Services
          </a>
        </div>

        {/* Quick stats row */}
        <div className="flex flex-wrap justify-center gap-8 mt-16 pt-10 border-t border-border animate-fade-up delay-500">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              <CountUp end={4800} duration={1.3} separator="," />+
            </div>
            <div className="text-xs text-muted-foreground mt-0.5 tracking-wide uppercase">Repairs</div>
          </div>

          {[
            // { val: "4,800+", label: "Repairs" },
            { val: "98%", label: "Satisfied" },
            { val: "12 mo", label: "Warranty" },
            { val: "3", label: "Locations" },
          ].map((s, i) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold text-foreground">{s.val}</div>
              <div className="text-xs text-muted-foreground mt-0.5 tracking-wide uppercase">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ThreeHeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isDark = useIsDark();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let THREE: any;
    let renderer: any, scene: any, camera: any;
    let particlesMesh: any;
    let wireCar: any;
    let mounted = true;

    // Resolve theme colors
    const lineColor = isDark ? 0xffffff : 0x111111;
    const accentColor = isDark ? 0xe0e8ff : 0x334466;
    const gridColor = isDark ? 0x8899ff : 0x334499;
    const ringColor = isDark ? 0xaabbff : 0x3355aa;
    const particleClr = isDark ? 0xffffff : 0x222222;
    const lineOpacity = isDark ? 0.18 : 0.22;
    const accentOpacity = isDark ? 0.32 : 0.4;
    const particleOp = isDark ? 0.55 : 0.35;
    const ringOp0 = isDark ? 0.06 : 0.08;

    const init = async () => {
      try {
        // @ts-ignore
        THREE = await import("three");
      } catch {
        return;
      }
      if (!mounted || !canvas) return;

      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
      camera.position.set(0, 0, 28);

      scene.add(new THREE.AmbientLight(0xffffff, 0.4));
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
      dirLight.position.set(5, 10, 5);
      scene.add(dirLight);

      // PARTICLE FIELD
      const pCount = 1800;
      const pGeo = new THREE.BufferGeometry();
      const pPos = new Float32Array(pCount * 3);
      const pSpeeds = new Float32Array(pCount);
      for (let i = 0; i < pCount; i++) {
        pPos[i * 3] = (Math.random() - 0.5) * 80;
        pPos[i * 3 + 1] = (Math.random() - 0.5) * 60;
        pPos[i * 3 + 2] = (Math.random() - 0.5) * 60;
        pSpeeds[i] = 0.002 + Math.random() * 0.008;
      }
      pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
      const pMat = new THREE.PointsMaterial({
        color: particleClr,
        size: 0.15,
        transparent: true,
        opacity: particleOp,
        sizeAttenuation: true,
      });
      particlesMesh = new THREE.Points(pGeo, pMat);
      (particlesMesh as any)._speeds = pSpeeds;
      scene.add(particlesMesh);

      // WIREFRAME CAR
      const carGroup = new THREE.Group();
      const edgeMat = new THREE.LineBasicMaterial({ color: lineColor, transparent: true, opacity: lineOpacity });
      const accentMat = new THREE.LineBasicMaterial({ color: accentColor, transparent: true, opacity: accentOpacity });

      const bodyGeo = new THREE.BoxGeometry(8, 2.2, 3.8);
      carGroup.add(new THREE.LineSegments(new THREE.EdgesGeometry(bodyGeo), edgeMat));

      const cabinGeo = new THREE.BoxGeometry(4.2, 1.6, 3.4);
      const cabin = new THREE.LineSegments(new THREE.EdgesGeometry(cabinGeo), accentMat);
      cabin.position.set(-0.3, 1.9, 0);
      carGroup.add(cabin);

      const hoodGeo = new THREE.BoxGeometry(2.6, 0.5, 3.6);
      const hood = new THREE.LineSegments(new THREE.EdgesGeometry(hoodGeo), edgeMat);
      hood.position.set(2.3, 1.35, 0);
      hood.rotation.z = -0.25;
      carGroup.add(hood);

      const wheelPositions = [
        [-2.6, -1.5, 2.1],
        [2.6, -1.5, 2.1],
        [-2.6, -1.5, -2.1],
        [2.6, -1.5, -2.1],
      ];
      wheelPositions.forEach(([x, y, z]) => {
        const wGeo = new THREE.TorusGeometry(0.92, 0.28, 10, 24);
        const wheel = new THREE.LineSegments(new THREE.EdgesGeometry(wGeo), accentMat);
        wheel.position.set(x, y, z);
        wheel.rotation.y = Math.PI / 2;
        carGroup.add(wheel);

        const spokeGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, -0.7, 0),
          new THREE.Vector3(0, 0.7, 0),
          new THREE.Vector3(-0.7, 0, 0),
          new THREE.Vector3(0.7, 0, 0),
        ]);
        const spoke = new THREE.LineSegments(spokeGeo, edgeMat);
        spoke.position.set(x, y, z);
        spoke.rotation.y = Math.PI / 2;
        carGroup.add(spoke);
      });

      for (let i = -3; i <= 3; i++) {
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-4, -1.1, i * 0.6),
          new THREE.Vector3(4, -1.1, i * 0.6),
        ]);
        carGroup.add(
          new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: gridColor, transparent: true, opacity: 0.08 })),
        );
      }

      carGroup.position.set(0, 0, 0);
      carGroup.rotation.y = 0.35;
      wireCar = carGroup;
      scene.add(carGroup);

      // FLOATING RINGS
      for (let r = 0; r < 3; r++) {
        const ringGeo = new THREE.TorusGeometry(6 + r * 4, 0.03, 4, 80);
        const ringMat = new THREE.MeshBasicMaterial({
          color: ringColor,
          transparent: true,
          opacity: ringOp0 - r * 0.015,
          wireframe: false,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2 + r * 0.3;
        ring.rotation.z = r * 0.5;
        scene.add(ring);
        scene.children[scene.children.length - 1].userData.isRing = true;
        scene.children[scene.children.length - 1].userData.ringIdx = r;
      }

      // ANIMATE
      let t = 0;
      const animate = () => {
        if (!mounted) return;
        animRef.current = requestAnimationFrame(animate);
        t += 0.008;

        if (wireCar) {
          wireCar.rotation.y = 0.35 + Math.sin(t * 0.4) * 0.15 + mouseRef.current.x * 0.18;
          wireCar.rotation.x = Math.sin(t * 0.3) * 0.06 + mouseRef.current.y * 0.1;
          wireCar.position.y = Math.sin(t * 0.5) * 0.4;
        }

        if (particlesMesh) {
          const pos = particlesMesh.geometry.attributes.position;
          const speeds = (particlesMesh as any)._speeds;
          for (let i = 0; i < pCount; i++) {
            pos.array[i * 3 + 1] -= speeds[i];
            if (pos.array[i * 3 + 1] < -30) pos.array[i * 3 + 1] = 30;
          }
          pos.needsUpdate = true;
          particlesMesh.rotation.y = t * 0.02;
        }

        scene.children.forEach((child: any) => {
          if (child.userData?.isRing) {
            child.rotation.y += 0.0015 * (1 + child.userData.ringIdx * 0.5);
            child.rotation.z += 0.001;
          }
        });

        renderer.render(scene, camera);
      };
      animate();

      const onResize = () => {
        if (!canvas || !renderer || !camera) return;
        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
        camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    };

    const cleanup = init();

    const onMouse = (e: MouseEvent) => {
      const rect = canvas?.getBoundingClientRect();
      if (!rect) return;
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    return () => {
      mounted = false;
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("mousemove", onMouse);
      cleanup?.then((fn) => fn?.());
      renderer?.dispose();
    };
  }, [isDark]); // re-init when theme changes

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ display: "block" }} />;
}

function useIsDark() {
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", check);
    return () => {
      observer.disconnect();
      mq.removeEventListener("change", check);
    };
  }, []);
  return isDark;
}
