 // === 0. INITIALIZATION ===
        lucide.createIcons();

        // === 1. PRELOADER & HEADER ANIMATION ===
        const loaderBar = document.getElementById('loader-bar');
        const loaderPercent = document.getElementById('loader-percent');
        const preloader = document.querySelector('.preloader');
        let load = 0;

        const interval = setInterval(() => {
            load += Math.random() * 10;
            if (load > 100) load = 100;
            loaderBar.style.width = `${load}%`;
            loaderPercent.innerText = `${Math.floor(load)}%`;
            
            if (load === 100) {
                clearInterval(interval);
                gsap.to(preloader, {
                    opacity: 0,
                    duration: 1,
                    delay: 0.2,
                    onComplete: () => {
                        preloader.style.display = 'none';
                        // Révéler le header suprême
                        gsap.to("#main-nav", { y: 0, duration: 1, ease: "power3.out" });
                        // Révéler le texte
                        gsap.from('.reveal-hero', { y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: 'power3.out' });
                    }
                });
            }
        }, 50);

        // Mobile Menu Toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
        });
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
            });
        });

        // Smooth Scroll pour liens internes
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // === 2. THREE.JS "FIRE EMBERS" BACKGROUND ===
        const container = document.getElementById('canvas-container');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);
        camera.position.z = 30;
        
        // Embers particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 1500;
        const posArray = new Float32Array(particlesCount * 3);
        const colorArray = new Float32Array(particlesCount * 3);
        
        for(let i = 0; i < particlesCount * 3; i += 3) {
            posArray[i] = (Math.random() - 0.5) * 100;
            posArray[i + 1] = (Math.random() - 0.5) * 100;
            posArray[i + 2] = (Math.random() - 0.5) * 100;
            
            // Palette : Orange Feu, Or, Rouge profond
            const colorType = Math.random();
            if (colorType < 0.5) {
                colorArray[i] = 1; colorArray[i + 1] = 0.33; colorArray[i + 2] = 0; // #FF5500
            } else if (colorType < 0.8) {
                colorArray[i] = 1; colorArray[i + 1] = 0.7; colorArray[i + 2] = 0; // #FFB300
            } else {
                colorArray[i] = 0.8; colorArray[i + 1] = 0; colorArray[i + 2] = 0; // #cc0000
            }
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.2, vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending
        });
        
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);
        
        let mouseXThree = 0, mouseYThree = 0;
        document.addEventListener('mousemove', (event) => {
            mouseXThree = (event.clientX - window.innerWidth / 2) / 100;
            mouseYThree = (event.clientY - window.innerHeight / 2) / 100;
        });
        
        let scrollY = 0;
        window.addEventListener('scroll', () => { scrollY = window.scrollY; });
        
        const clockThree = new THREE.Clock();
        function animateThree() {
            requestAnimationFrame(animateThree);
            const elapsedTime = clockThree.getElapsedTime();
            
            // Embers floating upward naturally
            const positions = particlesGeometry.attributes.position.array;
            for(let i = 1; i < particlesCount * 3; i+=3) {
                positions[i] += 0.05; // Move Y up
                if(positions[i] > 50) positions[i] = -50; // Reset at bottom
            }
            particlesGeometry.attributes.position.needsUpdate = true;

            // Camera follow mouse slightly
            camera.position.x += (mouseXThree * 0.5 - camera.position.x) * 0.05;
            camera.position.y += (-mouseYThree * 0.5 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);
            
            // Overall gentle rotation
            particlesMesh.rotation.y = elapsedTime * 0.02;
            
            renderer.render(scene, camera);
        }
        animateThree();
        
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // === 3. CUSTOM CURSOR ===
        const cursor = document.getElementById('cursor');
        const cursorDot = document.getElementById('cursor-dot');
        const interactiveItems = document.querySelectorAll('.interactive, a, button');
        
        let mX = 0, mY = 0, cX = 0, cY = 0;

        document.addEventListener('mousemove', (e) => {
            mX = e.clientX; mY = e.clientY;
            cursorDot.style.left = `${mX}px`; cursorDot.style.top = `${mY}px`;
        });

        function renderCursor() {
            cX += (mX - cX) * 0.2; cY += (mY - cY) * 0.2;
            cursor.style.left = `${cX}px`; cursor.style.top = `${cY}px`;
            requestAnimationFrame(renderCursor);
        }
        renderCursor();

        interactiveItems.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hovered'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hovered'));
        });

        // === 4. SOUND & KONAMI ===
        const hoverSfx = document.getElementById('sfx-hover');
        const clickSfx = document.getElementById('sfx-click');
        hoverSfx.volume = 0.15; clickSfx.volume = 0.3;

        interactiveItems.forEach(el => {
            el.addEventListener('mouseenter', () => { hoverSfx.currentTime = 0; hoverSfx.play().catch(()=>{}); });
            el.addEventListener('click', () => { clickSfx.currentTime = 0; clickSfx.play().catch(()=>{}); });
        });

        // Konami Code
        const secretCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        let sequence = [];
        document.addEventListener('keydown', (e) => {
            sequence.push(e.key);
            sequence.splice(-secretCode.length - 1, sequence.length - secretCode.length);
            if (sequence.join('').includes(secretCode.join(''))) {
                activateGodMode(); sequence = [];
            }
        });

        function activateGodMode() {
            clickSfx.play();
            // Invert colors to Ice Blue for secret mode
            document.documentElement.style.setProperty('--fire-main', '#00FFFF');
            document.documentElement.style.setProperty('--fire-dark', '#0088ff');
            document.documentElement.style.setProperty('--fire-light', '#ccffff');
            document.querySelector('.neon-glow').innerText = "GOD MODE";
            gsap.to("body", { x: -10, duration: 0.1, yoyo: true, repeat: 5 });
            alert("⚠️ SYSTEM OVERRIDE: GOD MODE UNLOCKED ⚠️");
        }

        // === 5. GSAP SCROLL ANIMATIONS ===
        gsap.registerPlugin(ScrollTrigger);

        // Stats cards
        gsap.from('#stats .card-3d', {
            scrollTrigger: { trigger: '#stats', start: 'top 80%' },
            y: 50, opacity: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out'
        });
        
        // Parallax
        document.querySelectorAll('.parallax-layer').forEach(layer => {
            const speed = layer.dataset.speed || 0.5;
            window.addEventListener('scroll', () => {
                const yPos = -(window.scrollY * speed);
                layer.style.transform = `translateY(${yPos}px)`;
            });
        });

        // 3D Tilt on stats cards
        document.querySelectorAll('.card-3d').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; const y = e.clientY - rect.top;
                const rotateX = ((y - rect.height / 2) / 20);
                const rotateY = ((rect.width / 2 - x) / 20);
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        });
