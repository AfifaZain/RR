import * as THREE from "three";

const canvas = document.querySelector("#hero-scene");

if (canvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.2, 8.4);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const root = new THREE.Group();
  root.position.set(1.8, 0, 0);
  scene.add(root);

  const palette = {
    ink: new THREE.Color("#1f2528"),
    teal: new THREE.Color("#15616d"),
    wine: new THREE.Color("#7d2e46"),
    gold: new THREE.Color("#b88a44"),
    blue: new THREE.Color("#bfd7ea")
  };

  const ambient = new THREE.AmbientLight(0xffffff, 1.8);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(0xffffff, 3.2);
  key.position.set(3.5, 4, 6);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0xbfd7ea, 2.2);
  rim.position.set(-5, -1, 4);
  scene.add(rim);

  const centralMaterial = new THREE.MeshStandardMaterial({
    color: "#f2eee5",
    metalness: 0.48,
    roughness: 0.3
  });

  const wireMaterial = new THREE.MeshBasicMaterial({
    color: palette.ink,
    wireframe: true,
    transparent: true,
    opacity: 0.34
  });

  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.25, 1), centralMaterial);
  root.add(core);

  const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.48, 1), wireMaterial);
  root.add(wire);

  const ringMaterial = new THREE.MeshStandardMaterial({
    color: "#15616d",
    metalness: 0.2,
    roughness: 0.42,
    transparent: true,
    opacity: 0.86
  });

  const ringA = new THREE.Mesh(new THREE.TorusGeometry(2.08, 0.018, 16, 160), ringMaterial);
  const ringB = ringA.clone();
  const ringC = ringA.clone();
  ringB.rotation.x = Math.PI / 2.8;
  ringC.rotation.y = Math.PI / 2.5;
  root.add(ringA, ringB, ringC);

  const nodeGeometry = new THREE.SphereGeometry(0.095, 24, 24);
  const lineMaterial = new THREE.LineBasicMaterial({
    color: "#65706f",
    transparent: true,
    opacity: 0.45
  });

  const nodePositions = [
    [-2.42, 0.72, 0.18],
    [-1.12, 1.86, -0.34],
    [0.68, 2.05, 0.2],
    [2.32, 0.82, -0.22],
    [2.05, -1.04, 0.18],
    [0.18, -2.05, -0.28],
    [-1.86, -1.12, 0.32]
  ];

  const nodeColors = [palette.teal, palette.wine, palette.gold, palette.blue, palette.teal, palette.wine, palette.gold];
  const nodes = nodePositions.map((position, index) => {
    const material = new THREE.MeshStandardMaterial({
      color: nodeColors[index],
      metalness: 0.1,
      roughness: 0.32
    });
    const node = new THREE.Mesh(nodeGeometry, material);
    node.position.set(...position);
    root.add(node);
    return node;
  });

  const points = [];
  nodes.forEach((node) => points.push(node.position.clone()));
  points.push(nodes[0].position.clone());
  const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), lineMaterial);
  root.add(line);

  const particleCount = window.matchMedia("(max-width: 680px)").matches ? 90 : 150;
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i += 1) {
    const radius = 2.8 + Math.random() * 2.4;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    particlePositions[i * 3 + 2] = radius * Math.cos(phi);
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      color: "#7d2e46",
      size: 0.022,
      transparent: true,
      opacity: 0.55
    })
  );
  root.add(particles);

  const pointer = new THREE.Vector2(0, 0);
  const target = new THREE.Vector2(0, 0);

  const resize = () => {
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    const isNarrow = width < 760;
    if (isNarrow) {
      root.position.set(width < 460 ? 0.08 : 0.46, -0.08, 0);
      root.scale.setScalar(width < 460 ? 0.58 : 0.64);
    } else {
      root.position.set(2.2, 0, 0);
      root.scale.setScalar(1);
    }
  };

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener(
    "pointermove",
    (event) => {
      target.x = (event.clientX / window.innerWidth - 0.5) * 0.7;
      target.y = (event.clientY / window.innerHeight - 0.5) * 0.7;
    },
    { passive: true }
  );

  resize();

  const clock = new THREE.Clock();
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const animate = () => {
    const elapsed = clock.getElapsedTime();
    pointer.lerp(target, 0.045);

    root.rotation.y = elapsed * 0.11 + pointer.x;
    root.rotation.x = Math.sin(elapsed * 0.42) * 0.08 + pointer.y * 0.35;
    wire.rotation.y = -elapsed * 0.16;
    ringA.rotation.z = elapsed * 0.13;
    ringB.rotation.z = -elapsed * 0.1;
    ringC.rotation.x = elapsed * 0.08;
    particles.rotation.y = -elapsed * 0.035;

    renderer.render(scene, camera);

    if (!reduceMotion) {
      requestAnimationFrame(animate);
    }
  };

  animate();
}
