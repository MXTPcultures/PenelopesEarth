class App {
    constructor() {
        // Grab window properties
        let width = window.innerWidth;
        let height = window.innerHeight;
        let pixelRatio = window.devicePixelRatio;
        let aspect = width / height;
        // Setup three.js
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.5, 1500);
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({antialias: false});
        this.renderer.setPixelRatio(pixelRatio);
        this.renderer.setSize(width, height);
        document.body.appendChild(this.renderer.domElement);
        // Catch resize events
        window.onresize = (evt) => {
            this.resize(window.innerWidth, window.innerHeight);
        };

        // Let there be light
        var lightness_percent = 88;
        var color_value = hslToHex(0, 0, lightness_percent);
        console.log(color_value);
        var light_color = parseInt(color_value, 16);
        //console.log(light_color);
        this.light = new THREE.DirectionalLight(light_color);
        this.light.position.set(1, 1, 0).normalize();

        // Let there be fog
        var fog = new THREE.FogExp2(0x008877, 0.002);
        this.scene.fog = fog;
        this.renderer.setClearColor(fog.color, 1);
        console.log(this.fog);

        this.scene.add(this.light);
    }

    /* Resize viewport */
    resize(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    /* Start the main loop */
    start() {
        this.loop();
    }

    loop() {
        requestAnimationFrame(() => this.loop());
        let time = new Date().getTime() / 1000;
        let delta = 0.0;
        if (typeof this.lastUpdate !== 'undefined') {
            delta = time - this.lastUpdate;
        }
        var light_hue = knob.one.value*360;
        var light_saturation = knob.two.value*100;
        var light_lightness = knob.thr.value*100;
        //console.log(hue_percent, saturation_percent, lightness_percent);
        var color_value = hslToHex(light_hue, light_saturation, light_lightness);
        var light_color = parseInt(color_value, 16);
        this.light.color.set(light_color);
        //console.log(this.light.color);

        var fog_hue = slider.one.value*360;
        var fog_saturation = slider.two.value*100;
        var fog_lightness = slider.thr.value*100;
        var fog_density = slider.fur.value*(.05-.001);
        var fog_color = hslToHex(fog_hue, fog_saturation, fog_lightness);
        fog_color = parseInt(fog_color, 16);
        //console.log(fog_color)
        var new_fog = new THREE.FogExp2(fog_color, fog_density);
        this.scene.fog = new_fog;
        this.renderer.setClearColor(new_fog.color, 1);
        //this.fog.color.set(0x008877);

        this.update(delta);
        this.lastUpdate = time;
        this.render();
    }

    update(delta) {
        // Dispatch update event for listeners
        window.dispatchEvent(new CustomEvent('app-update', {
            detail: {
                delta: delta
            }
        }));
    }

    render() {
        let scene = this.scene;
        let camera = this.camera;
        let renderer = this.renderer;
        renderer.render(scene, camera);
    }
}

function hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = x => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `0x${toHex(r)}${toHex(g)}${toHex(b)}`;
}


window.onload = function() {
    let app = new App();



    let controls = new FirstPersonControls(app);

    //Change/modify terrian image? create and array of different hues
    Terrain.fromImage('images/terrain4.png').then(function(terrain) {

        app.terrain = terrain;

        var loader = new THREE.TextureLoader();

        var texture = loader.load('images/texture.png');

        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(terrain.width / 100, terrain.height / 100);

        app.scene.add(terrain.build(texture));

        // Scale terrain peaks
        terrain.mesh.scale.y = 50.0;

        // Start in middle of terrain
        controls.position.x = terrain.width / 2;
        controls.position.z = terrain.height / 2;

        window.addEventListener('app-update', function(evt) {
            controls.update(evt.detail.delta);
        });

        app.start();
    }).catch(function(e) {
        throw e;
    });
};
