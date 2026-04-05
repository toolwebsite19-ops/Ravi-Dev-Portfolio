import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.166.1/build/three.module.js';

gsap.registerPlugin(ScrollTrigger);

const canvas = document.getElementById('hero-canvas');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x05070f, 0.035);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
renderer.setSize(window.innerWidth, window.innerHeight);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.7, 5.8);

const ambient = new THREE.AmbientLight(0x8aa4ff, 0.8);
scene.add(ambient);

const pointA = new THREE.PointLight(0x53c6ff, 2.4, 25);
pointA.position.set(2, 3, 2);
scene.add(pointA);

const pointB = new THREE.PointLight(0x8d5bff, 1.7, 20);
pointB.position.set(-3, 1.5, 4);
scene.add(pointB);

const desk = new THREE.Mesh(
  new THREE.BoxGeometry(4.4, 0.25, 2.2),
  new THREE.MeshStandardMaterial({ color: 0x13162b, metalness: 0.4, roughness: 0.35 })
);
desk.position.set(0, 0.3, 0);
scene.add(desk);

const monitor = new THREE.Mesh(
  new THREE.BoxGeometry(1.6, 0.95, 0.08),
  new THREE.MeshStandardMaterial({ color: 0x2cf2e2, emissive: 0x143d58, emissiveIntensity: 0.7 })
);
monitor.position.set(0, 1.08, -0.2);
scene.add(monitor);

const keyboard = new THREE.Mesh(
  new THREE.BoxGeometry(1.35, 0.06, 0.5),
  new THREE.MeshStandardMaterial({ color: 0x202741, metalness: 0.25, roughness: 0.4 })
);
keyboard.position.set(0, 0.45, 0.55);
scene.add(keyboard);

const charGroup = new THREE.Group();

const body = new THREE.Mesh(
  new THREE.CapsuleGeometry(0.28, 0.7, 8, 16),
  new THREE.MeshStandardMaterial({ color: 0x39447f, metalness: 0.2, roughness: 0.4 })
);
body.position.y = 1;
charGroup.add(body);

const head = new THREE.Mesh(
  new THREE.SphereGeometry(0.22, 24, 24),
  new THREE.MeshStandardMaterial({ color: 0xe0e8ff, roughness: 0.5 })
);
head.position.set(0, 1.62, 0);
charGroup.add(head);

const handMaterial = new THREE.MeshStandardMaterial({ color: 0xe0e8ff, roughness: 0.4 });
const leftArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.4, 6, 10), handMaterial);
leftArm.position.set(-0.28, 1.15, 0.1);
leftArm.rotation.z = 0.5;
charGroup.add(leftArm);

const rightArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.4, 6, 10), handMaterial);
rightArm.position.set(0.28, 1.15, 0.1);
rightArm.rotation.z = -0.4;
charGroup.add(rightArm);

charGroup.position.set(0.8, 0, 0.1);
scene.add(charGroup);

const particles = new THREE.Points(
  new THREE.BufferGeometry(),
  new THREE.PointsMaterial({ color: 0x7dcaff, size: 0.035, transparent: true, opacity: 0.8 })
);
const particleCount = 450;
const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i += 1) {
  positions[i * 3] = (Math.random() - 0.5) * 14;
  positions[i * 3 + 1] = Math.random() * 8;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 14;
}
particles.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
scene.add(particles);

const floatGroup = new THREE.Group();
for (let i = 0; i < 4; i += 1) {
  const panel = new THREE.Mesh(
    new THREE.PlaneGeometry(0.65, 0.4),
    new THREE.MeshStandardMaterial({
      color: 0x4d6ef2,
      emissive: 0x1f2a63,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
    })
  );
  panel.position.set(-1.6 + i * 1.1, 1.7 + Math.sin(i) * 0.18, -1.2 - i * 0.25);
  panel.rotation.y = 0.25 - i * 0.08;
  floatGroup.add(panel);
}
scene.add(floatGroup);

const pointer = { x: 0, y: 0 };
window.addEventListener('pointermove', (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = (event.clientY / window.innerHeight) * 2 - 1;

  const cursor = document.querySelector('.custom-cursor');
  cursor.style.left = `${event.clientX}px`;
  cursor.style.top = `${event.clientY}px`;
});

const hoverSound = document.getElementById('hover-sound');
document.querySelectorAll('a, button, .project-card').forEach((el) => {
  el.addEventListener('mouseenter', () => {
    hoverSound.currentTime = 0;
    hoverSound.volume = 0.12;
    hoverSound.play().catch(() => {});
  });
});

const typingTimeline = gsap.timeline();
typingTimeline
  .to([leftArm.rotation, rightArm.rotation], {
    z: '+=0.2',
    repeat: 9,
    yoyo: true,
    duration: 0.1,
  })
  .to(head.rotation, { y: -0.5, duration: 0.35 }, '-=0.2')
  .to(rightArm.rotation, {
    z: -1.1,
    repeat: 3,
    yoyo: true,
    duration: 0.2,
  })
  .to('.hero-copy h1', {
    textShadow: '0 0 24px rgba(83,198,255,.95)',
    duration: 0.4,
  }, '<');

const clock = new THREE.Clock();

function animate() {
  const elapsed = clock.getElapsedTime();

  camera.position.x += (pointer.x * 0.4 - camera.position.x) * 0.04;
  camera.position.y += (1.7 - pointer.y * 0.22 - camera.position.y) * 0.04;
  camera.lookAt(0, 1.1, 0);

  desk.rotation.y = pointer.x * 0.05;
  desk.rotation.x = -pointer.y * 0.03;
  floatGroup.rotation.y += 0.003 + pointer.x * 0.0016;

  particles.rotation.y = elapsed * 0.015;
  particles.position.y = Math.sin(elapsed * 0.25) * 0.15;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const cards = document.querySelectorAll('.tilt');
cards.forEach((card) => {
  card.addEventListener('mousemove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 16;
    const rotateX = (0.5 - y / rect.height) * 16;

    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(22px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateZ(0)';
  });
});

const modal = document.getElementById('project-modal');
const title = document.getElementById('modal-title');
document.querySelectorAll('.project-card').forEach((card) => {
  card.addEventListener('click', () => {
    title.textContent = card.dataset.project;
    modal.showModal();
    gsap.fromTo(modal, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out' });
  });
});

document.getElementById('close-modal').addEventListener('click', () => modal.close());

const sections = document.querySelectorAll('.panel');
sections.forEach((section, i) => {
  gsap.fromTo(
    section,
    { rotateX: 15, z: -120, opacity: 0.4 },
    {
      rotateX: 0,
      z: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 20%',
        scrub: true,
      },
    }
  );

  gsap.to(section, {
    backgroundPositionY: `${i * 25}px`,
    scrollTrigger: {
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
});

const orbitContainer = document.getElementById('skills-orbit');
const skills = ['React', 'Next.js', 'Node.js', 'MongoDB', 'TypeScript', 'AI Tools'];
const orbitData = [];
skills.forEach((skill, index) => {
  const orb = document.createElement('div');
  orb.className = 'skill-orb';
  orb.textContent = skill;
  orb.style.cssText = `
    position: absolute;
    left: 50%;
    top: 50%;
    transform-style: preserve-3d;
    padding: 0.6rem 0.9rem;
    border-radius: 999px;
    border: 1px solid rgba(122, 204, 255, 0.45);
    background: rgba(35, 62, 116, 0.45);
    box-shadow: 0 0 25px rgba(88, 180, 255, 0.4);
    white-space: nowrap;
  `;
  orbitContainer.appendChild(orb);
  orbitData.push({ el: orb, angle: index * (Math.PI / 3), speed: 0.007 + index * 0.0012, radius: 115 + index * 10 });
});

gsap.ticker.add(() => {
  orbitData.forEach((orb) => {
    orb.angle += orb.speed;
    const x = Math.cos(orb.angle) * orb.radius;
    const y = Math.sin(orb.angle * 1.4) * (42 + orb.radius * 0.1);
    const z = Math.sin(orb.angle) * 70;
    orb.el.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
  });
});

orbitContainer.addEventListener('mousemove', (event) => {
  const rect = orbitContainer.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  gsap.to(orbitContainer, {
    rotateY: x * 18,
    rotateX: -y * 12,
    transformPerspective: 900,
    duration: 0.4,
  });
});

const formButton = document.querySelector('.ripple');
formButton.addEventListener('click', (event) => {
  const rect = formButton.getBoundingClientRect();
  const rippleX = event.clientX - rect.left;
  const rippleY = event.clientY - rect.top;
  formButton.style.setProperty('--rx', `${rippleX}px`);
  formButton.style.setProperty('--ry', `${rippleY}px`);
  gsap.fromTo(
    formButton,
    { boxShadow: '0 0 0 rgba(83, 198, 255, 0)' },
    { boxShadow: '0 0 24px rgba(83, 198, 255, 0.7)', duration: 0.25, yoyo: true, repeat: 1 }
  );
});

document.querySelector('.contact-form').addEventListener('submit', (event) => {
  event.preventDefault();
  gsap.to('.contact-form', {
    y: -3,
    boxShadow: '0 0 38px rgba(45, 207, 247, 0.34)',
    duration: 0.3,
    yoyo: true,
    repeat: 1,
  });
});

window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loading-screen');
    loader.style.opacity = '0';
    loader.style.pointerEvents = 'none';
  }, 1100);
});
