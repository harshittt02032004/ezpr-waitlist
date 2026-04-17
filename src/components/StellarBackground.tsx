"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { 
  CheckCircle, Search, Calculator, UserCheck, 
  Map, Globe, FileSignature, Landmark, Zap, 
  HeartHandshake, MapPin, Users, ShieldCheck, 
  Briefcase, GraduationCap 
} from 'lucide-react';

const cardData = [
  { title: "Check my eligibility", image: "/images/check_eligibility.png", icon: CheckCircle },
  { title: "Noc code finder", image: "/images/noc_finder.png", icon: Search },
  { title: "Crs score calculator", image: "/images/crs_calculator.png", icon: Calculator },
  { title: "Express entry profile", image: "/images/ee_profile.png", icon: UserCheck },
  { title: "Cec", image: "/images/cec.png", icon: Map },
  { title: "Fsw", image: "/images/fsw.png", icon: Globe },
  { title: "Pr application", image: "/images/pr_application.png", icon: FileSignature },
  { title: "Ircc", image: "/images/ircc.png", icon: Landmark },
  { title: "Express entry", image: "/images/express_entry.png", icon: Zap },
  { title: "H&c", image: "/images/hc.png", icon: HeartHandshake },
  { title: "Pnp", image: "/images/pnp.png", icon: MapPin },
  { title: "Spousal sponsorship", image: "/images/spousal_sponsorship.png", icon: Users },
  { title: "Rcic", image: "/images/rcic.png", icon: ShieldCheck },
  { title: "Work permit", image: "/images/work_permit.png", icon: Briefcase },
  { title: "Study permit", image: "/images/study_permit.png", icon: GraduationCap },
];

const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

const StellarBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !cardsRef.current) return;

    const w = window.innerWidth;
    const h = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      antialias: true, 
      alpha: true 
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 2000);
    camera.position.z = 25;

    // Smooth Mouse Parallax
    let mouseX = 0, mouseY = 0;
    let smoothMouseX = 0, smoothMouseY = 0;
    
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    let baseAngle = 0;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    const pointLight1 = new THREE.PointLight(0xffffff, 0.6);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);
    const pointLight2 = new THREE.PointLight(0xffffff, 0.3);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);

    // Starfield
    const starsGeo = new THREE.BufferGeometry();
    const starsCount = 5000;
    const pos = new Float32Array(starsCount * 3);
    for(let i=0; i<starsCount; i++) {
      pos[i*3] = (Math.random()-0.5)*1500;
      pos[i*3+1] = (Math.random()-0.5)*1500;
      pos[i*3+2] = (Math.random()-0.5)*1500;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7, sizeAttenuation: true });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    // Create Cards
    const cards: { anchor: THREE.Object3D, el: HTMLElement, disperseVec: {x: number, y: number, z: number} }[] = [];
    const numCards = cardData.length;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    cardData.forEach((data, i) => {
      const y = 1 - (i / (numCards - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = (2 * Math.PI * i) / goldenRatio;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      const layerRadius = 12 + (i % 3) * 4;

      const cx = x * layerRadius;
      const cy = y * layerRadius;
      const cz = z * layerRadius;

      const anchor = new THREE.Object3D();
      anchor.position.set(cx, cy, cz);
      scene.add(anchor);

      const el = document.createElement('div');
      el.className = 'stellar-card';
      
      const bgColors = ['1F2121', '2D3748', '1A202C', '2C5282', '276749'];
      const bgColor = bgColors[i % bgColors.length];

      el.innerHTML = `
        <div class="stellar-card-logo" style="background-color: #${bgColor}">
          <img src="${data.image}" style="width:100%; height:75px; object-fit:cover; border-radius:6px; pointer-events:none;" alt="${data.title}" />
        </div>
        <div class="stellar-card-title">${data.title}</div>
      `;

      el.addEventListener('mouseenter', () => el.classList.add('hovered'));
      el.addEventListener('mouseleave', () => el.classList.remove('hovered'));

      cardsRef.current?.appendChild(el);
      
      cards.push({ 
        anchor, 
        el,
        disperseVec: {
          x: (Math.random() - 0.5) * 80,
          y: (Math.random() - 0.5) * 80,
          z: (Math.random() - 0.5) * 40,
        }
      });
    });

    const handleResize = () => {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', handleResize);

    let targetDisperseProgress = 0;
    let smoothDisperseProgress = 0;
    let targetCanvasY = 0;
    let smoothCanvasY = 0;

    // Scroll listener (will be connected to Lenis later)
    const onScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 400;
      targetDisperseProgress = Math.min(scrollY / maxScroll, 1);
      targetCanvasY = scrollY * 0.3;
    };
    window.addEventListener('scroll', onScroll);

    const vec3 = new THREE.Vector3();
    let animationId: number;

    const render = () => {
      animationId = requestAnimationFrame(render);

      smoothMouseX = lerp(smoothMouseX, mouseX, 0.04);
      smoothMouseY = lerp(smoothMouseY, mouseY, 0.04);

      smoothDisperseProgress = lerp(smoothDisperseProgress, targetDisperseProgress, 0.06);
      smoothCanvasY = lerp(smoothCanvasY, targetCanvasY, 0.06);
      
      if (canvasRef.current) {
        canvasRef.current.style.transform = `translate3d(0, ${smoothCanvasY}px, 0)`;
      }

      stars.rotation.y += 0.00002;
      stars.rotation.x += 0.00001;

      baseAngle += 0.0004;
      const targetAngle = baseAngle + smoothMouseX * 1.5;
      const radius = 25;

      const targetX = Math.sin(targetAngle) * radius;
      const targetZ = Math.cos(targetAngle) * radius;
      const targetY = -(smoothMouseY * 15);

      camera.position.x = lerp(camera.position.x, targetX, 0.025);
      camera.position.y = lerp(camera.position.y, targetY, 0.025);
      camera.position.z = lerp(camera.position.z, targetZ, 0.025);
      camera.lookAt(scene.position);

      const w2 = window.innerWidth / 2;
      const h2 = window.innerHeight / 2;

      cards.forEach(card => {
        vec3.copy(card.anchor.position);
        vec3.project(camera);

        if (vec3.z > 1) {
          card.el.style.display = 'none';
          return;
        }
        card.el.style.display = 'block';

        const x = (vec3.x * w2) + w2;
        const y = -(vec3.y * h2) + h2;

        const dist = camera.position.distanceTo(card.anchor.position);
        const scale = Math.max(0.3, Math.min(1.5, 18 / dist));
        const zIndex = Math.round((1 - vec3.z) * 100);

        const rotX = smoothMouseY * 10;
        const rotY = -smoothMouseX * 10;

        const dp = smoothDisperseProgress;
        const dv = card.disperseVec;
        const dispersedX = x + dv.x * dp * w2 * 0.08;
        const dispersedY = y + dv.y * dp * h2 * 0.08;
        const opacityVal = Math.max(0, 1 - dp * 1.4);
        
        card.el.style.opacity = opacityVal.toString();

        let transform = `translate3d(${dispersedX - 42.5}px, ${dispersedY - 57.5}px, 0) scale(${scale}) perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        if (card.el.classList.contains('hovered')) {
          transform += ' scale(1.15)';
        }
        card.el.style.transform = transform;
        if (!card.el.classList.contains('hovered')) {
            card.el.style.zIndex = zIndex.toString();
        }
      });

      renderer.render(scene, camera);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', onScroll);
      renderer.dispose();
      // Clear cards from DOM
      if (cardsRef.current) {
        cardsRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div id="stellar-bg" className="fixed inset-0 w-screen h-screen -z-1 pointer-events-auto bg-black overflow-hidden" ref={containerRef}>
      <canvas id="stellar-canvas" className="absolute top-0 left-0 w-full h-full outline-none" ref={canvasRef} />
      <div id="stellar-cards" className="absolute top-0 left-0 w-full h-full pointer-events-none" ref={cardsRef} />
    </div>
  );
};

export default StellarBackground;
