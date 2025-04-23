// --- Sound Design for Brick Breaker Game ---
// This code uses the Tone.js library to create sound effects for the game.
// The sounds are triggered based on game events like hitting a brick, paddle, or wall, and for game start, win, and game over events.
// The sounds are designed to be simple and effective, using square wave oscillators with a short attack and decay time for a punchy sound.
// The game uses a muted state to prevent sound from playing when the game is muted.
const synth = new Tone.Synth().toDestination();

function playSound(type) {
    if (muted) return;
    let now = Tone.now();
    switch (type) {
        case 'paddleHit':
            const paddleHitSynth = new Tone.Synth().toDestination();
            paddleHitSynth.oscillator.type = 'square';
            paddleHitSynth.envelope.attack = 0.001;
            paddleHitSynth.envelope.decay = 0.1;
            paddleHitSynth.envelope.sustain = 0.3;
            paddleHitSynth.envelope.release = 0.5;
            paddleHitSynth.triggerAttackRelease("C6", "8n", now);
            break;
        case 'brickHit':
            const brickHitSynth = new Tone.Synth().toDestination();
            brickHitSynth.oscillator.type = 'square';
            brickHitSynth.envelope.attack = 0.001;
            brickHitSynth.envelope.decay = 0.1;
            brickHitSynth.envelope.sustain = 0.3;
            brickHitSynth.envelope.release = 0.5;
            brickHitSynth.triggerAttackRelease("G5", "8n", now);
            break;
        case 'wallHit':
            const wallHitSynth = new Tone.Synth().toDestination();
            wallHitSynth.oscillator.type = 'square';
            wallHitSynth.envelope.attack = 0.001;
            wallHitSynth.envelope.decay = 0.1;
            wallHitSynth.envelope.sustain = 0.3;
            wallHitSynth.envelope.release = 0.5;
            wallHitSynth.triggerAttackRelease("C4", "8n", now);
            break;
        case 'gameOver':
            const gameOverSynth = new Tone.PolySynth().toDestination();
            gameOverSynth.oscillator.type = 'square';
            gameOverSynth.envelope.attack = 0.001;
            gameOverSynth.envelope.decay = 0.1;
            gameOverSynth.envelope.sustain = 0.3;
            gameOverSynth.envelope.release = 0.5;
            gameOverSynth.triggerAttackRelease(["C2", "E2", "G2", "Bb2"], "2n", now);
            break;
        case 'gameWon':
            const gameWonSynth = new Tone.PolySynth().toDestination();
            gameWonSynth.oscillator.type = 'square';
            gameWonSynth.envelope.attack = 0.001;
            gameWonSynth.envelope.decay = 0.1;
            gameWonSynth.envelope.sustain = 0.3;
            gameWonSynth.envelope.release = 0.5;
            gameWonSynth.triggerAttackRelease(["C5", "E5", "G5", "C6"], "1n", now);
            break;
        case 'gameStart':
            const gameStartSynth = new Tone.Synth().toDestination();
            gameStartSynth.oscillator.type = 'square';
            gameStartSynth.envelope.attack = 0.001;
            gameStartSynth.envelope.decay = 0.1;
            gameStartSynth.envelope.sustain = 0.3;
            gameStartSynth.envelope.release = 0.5;
            gameStartSynth.triggerAttackRelease(["C4", "E4", "G4", "C5"], "1n", now);
            break;
    }
}
