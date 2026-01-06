function idToKey(id) {
    const b1 = "q";
    const b2 = "w";
    const b3 = "e";
    // Q W E
    const b4 = "a";
    const b5 = "s";
    const b6 = "d";
    // A S D
    const b7 = "z";
    const b8 = "x";
    const b9 = "c";
    // Z X C

    if (id == "1-b-1") {
        return b1;
    }
    else if (id == "2-b-1") {
        return b2;
    }
    else if (id == "3-b-1") {
        return b3;
    }
    else if (id == "1-b-2") {
        return b4;
    }
    else if (id == "2-b-2") {
        return b5;
    }
    else if (id == "3-b-2") {
        return b6;
    }
    else if (id == "1-b-3") {
        return b7;
    }
    else if (id == "2-b-3") {
        return b8;
    }
    else if (id == "3-b-3") {
        return b9;
    }
    else {
        console.log("Error!")
    }

}

function groove(id) {
    
        document.querySelectorAll(".button").forEach(btn => {
        btn.addEventListener("click", () => {
            let btnKey = idToKey(btn.id);
            keyPad(btnKey);
        });
    });

    document.addEventListener(`keydown`, function(event) {
        keyPad(event.key)
    })
    

}

function revert(button, trans, bgnd, shdw) {
    
    button.style.transition = trans;

    button.style.backgroundColor = bgnd;
    button.style.boxShadow = shdw;
};

function color(button) {
    button.style.transition = "none";

    let randomColor = ("#"+(Math.floor((Math.random())*16777215)).toString(16));

    button.style.backgroundColor = randomColor;
    button.style.boxShadow = `0 0 10px ${randomColor}`;
    setTimeout(() => {revert(button, "ease-out 5s", "var(--1)", "0 0 5px var(--shadow)")}, 2000);
    

}

function keyPad(key) {
    // row 1 sounds (percussion);
    const kick = new audioPad("dj-box-sounds/k1.wav");
    const snare = new audioPad("dj-box-sounds/c1.wav");
    const hiHat = new audioPad("dj-box-sounds/h2.wav");

    // row 2 sounds (vocals);
    const vocal1 = new audioPad("dj-box-sounds/v6.wav");
    const vocal2 = new audioPad("dj-box-sounds/v21.wav");
    const vocal3 = new audioPad("dj-box-sounds/v22.wav");

    // row 3 sounds (effects);
    const effect1 = new audioPad("dj-box-sounds/e1.wav");
    const effect2 = new audioPad("dj-box-sounds/e5.mp3");
    const effect3 = new audioPad("dj-box-sounds/e4.mp3");
    let button = 0;
    switch(key) {

        case "q" :
            button = document.getElementById("1-b-1");
            color(button);
            kick.play();
            break;

        case "w":
            button = document.getElementById("2-b-1");
            color(button);
            snare.play();
            break;

        case "e":
            button = document.getElementById("3-b-1");
            color(button);
            hiHat.play();
            break;

        case "a":
            button = document.getElementById("1-b-2");
            color(button);
            vocal1.play();
            break;

        case "s":
            button = document.getElementById("2-b-2");
            color(button);
            vocal2.play();
            break;

        case "d":
            button = document.getElementById("3-b-2");
            color(button);
            console.log("d was pressed");
            vocal3.play()
            break;
        case "z":
            button = document.getElementById("1-b-3");
            color(button);
            effect1.play();
            break;

        case "x":
            button = document.getElementById("2-b-3");
            color(button);
            effect2.play();
            break;

        case "c":
            button = document.getElementById("3-b-3");
            color(button);
            effect3.play();
            break;
    }
}

class AudioEngine {
    static ctx = null;
    static analyser = null;
    static data = null;
    static master = null;

    static init() {
        if (this.ctx) return;
        
        this.ctx = new AudioContext();

        this.master = this.ctx.createGain();
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 512;
        this.data = new Uint8Array(this.analyser.fftSize);

        this.master.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
    }
}

function startLights() {
    AudioEngine.init();
    
    const loop = () => {
        AudioEngine.analyser.getByteTimeDomainData(AudioEngine.data);

        let sum = 0;
        for (let i = 0; i < AudioEngine.data.length; i++) {
            const v = (AudioEngine.data[i] - 128) / 128;
            sum += v * v;
        }
        const rms = Math.sqrt(sum/AudioEngine.data.length);
        console.log("rms", rms);

        // soundGlow(rms);
        


        requestAnimationFrame(loop);
    };

    loop();
}

// function soundGlow(rms) {
//     let ab1 = document.getElementById("ab-1");
//     let ab2 = null;
//     let ab3 = null;
//     let ab4 = null;
//     // while (true) {
//     //     if (rms = 0) {
//     //         continue;
//     //     }
//     //     if (rms <= 0.03) {
//     //     ab1.style.backgroundColor = 'green';
//     // }
//     // }
    


// }


document.addEventListener("click", async () => {
    AudioEngine.init();
    if (AudioEngine.ctx.state === "suspended") {
        await AudioEngine.ctx.resume();
    }
    startLights();
    
}, {once: true});



class audioPad {
    constructor(src) {
        this.audio = new Audio(src);
        AudioEngine.init();
        this.source = AudioEngine.ctx.createMediaElementSource(this.audio);
        this.source.connect(AudioEngine.master);
    }

    play() {
        this.audio.currentTime = 0;
        this.audio.play();
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    setVolume(value) {
        this.audio.volume = value; // 0.0-1.0
    }

    setLoop(shouldLoop) {
        this.audio.loop = shouldLoop;
    }
}

groove();