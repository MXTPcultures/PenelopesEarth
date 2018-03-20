if (navigator.requestMIDIAccess) {
  // Try to connect to the MIDI interface.
  navigator.requestMIDIAccess().then(onSuccess, onFailure);

} else {
  console.log("Web MIDI API not supported!");
}

var akai_down = 144, // midi code for up/down event type
    akai_up = 128,
    korg_down = 176; // midi code for up/down event type

var midi_controller = "korg"; // "akai"
var octave1, octave2, octave3, octave4, pad, knob, slider;

// build objects smart, loop and increment
if(midi_controller == "akai"){
    octave1 = { 
            C: { id: 48, pressed: false, velocity: 0, time: 0 },
            Csh: { id: 49, pressed: false, velocity: 0, time: 0 },
            D: { id: 50, pressed: false, velocity: 0, time: 0 },
            Dsh: { id: 51, pressed: false, velocity: 0, time: 0 },
            E: { id: 52, pressed: false, velocity: 0, time: Date.now() },
            F: { id: 53, pressed: false, velocity: 0, time: Date.now() },
            Fsh: { id: 54, pressed: false, velocity: 0, time: 0 },
            G: { id: 55, pressed: false, velocity: 0, time: 0 },
            Gsh: { id: 56, pressed: false, velocity: 0, time: 0 },
            A: { id: 57, pressed: false, velocity: 0, time: 0 },
            Ash: { id: 58, pressed: false, velocity: 0, time: 0 },
            B: { id: 59, pressed: false, velocity: 0, time: 0 }
    };

    octave2 = { 
            C: { id: 60, pressed: false, velocity: 0, time: 0 },
            Csh: { id: 61, pressed: false, velocity: 0, time: 0 },
            D: { id: 62, pressed: false, velocity: 0, time: 0 },
            Dsh: { id: 63, pressed: false, velocity: 0, time: 0 },
            E: { id: 64, pressed: false, velocity: 0, time: 0 },
            F: { id: 65, pressed: false, velocity: 0, time: 0 },
            Fsh: { id: 66, pressed: false, velocity: 0, time: 0 },
            G: { id: 67, pressed: false, velocity: 0, time: 0 },
            Gsh: { id: 68, pressed: false, velocity: 0, time: 0 },
            A: { id: 69, pressed: false, velocity: 0, time: 0 },
            Ash: { id: 70, pressed: false, velocity: 0, time: 0 },
            B: { id: 71, pressed: false, velocity: 0, time: 0 }
    };

    octave3 = { 
            C: { id: 72, pressed: false, velocity: 0, time: 0 },
            Csh: { id: 73, pressed: false, velocity: 0, time: 0 },
            D: { id: 74, pressed: false, velocity: 0, time: 0 },
            Dsh: { id: 75, pressed: false, velocity: 0, time: 0 },
            E: { id: 76, pressed: false, velocity: 0, time: 0 },
            F: { id: 77, pressed: false, velocity: 0, time: 0 },
            Fsh: { id: 78, pressed: false, velocity: 0, time: 0 },
            G: { id: 79, pressed: false, velocity: 0, time: 0 },
            Gsh: { id: 80, pressed: false, velocity: 0, time: 0 },
            A: { id: 81, pressed: false, velocity: 0, time: 0 },
            Ash: { id: 82, pressed: false, velocity: 0, time: 0 },
            B: { id: 83, pressed: false, velocity: 0, time: 0 }
    };

    octave4 = { 
            C: { id: 84, pressed: false, velocity: 0, time: 0 },
            Csh: { id: 85, pressed: false, velocity: 0, time: 0 },
            D: { id: 86, pressed: false, velocity: 0, time: 0 },
            Dsh: { id: 87, pressed: false, velocity: 0, time: 0 },
            E: { id: 88, pressed: false, velocity: 0, time: 0 },
            F: { id: 89, pressed: false, velocity: 0, time: 0 },
            Fsh: { id: 90, pressed: false, velocity: 0, time: 0 },
            G: { id: 91, pressed: false, velocity: 0, time: 0 },
            Gsh: { id: 92, pressed: false, velocity: 0, time: 0 },
            A: { id: 93, pressed: false, velocity: 0, time: 0 },
            Ash: { id: 94, pressed: false, velocity: 0, time: 0 },
            B: { id: 95, pressed: false, velocity: 0, time: 0 }
    };

    // keys and pads overloaded? same ids/notes? hmmm
                
    pad = {
            one: { id: 44, pressed: false, velocity: 0, time: 0 },
            two: { id: 45, pressed: false, velocity: 0, time: 0 },
            thr: { id: 46, pressed: false, velocity: 0, time: 0 },
            fur: { id: 47, pressed: false, velocity: 0, time: 0 },
            fve: { id: 48, pressed: false, velocity: 0, time: 0 },
            six: { id: 49, pressed: false, velocity: 0, time: 0 },
            svn: { id: 50, pressed: false, velocity: 0, time: 0 }, 
            eht: { id: 51, pressed: false, velocity: 0, time: 0 }
    };

    knob = {
            one: { id: 5, turned: false, value: 0 },
            two: { id: 6, turned: false, value: 0 },
            thr: { id: 7, turned: false, value: 0 },
            fur: { id: 8, turned: false, value: 0 },
            fve: { id: 1, turned: false, value: 0 },
            six: { id: 2, turned: false, value: 0 },
            svn: { id: 3, turned: false, value: 0 },
            eht: { id: 4, turned: false, value: 0}
    };
}else if(midi_controller == "korg"){
    knob = {
            one: { id: 14, turned: false, value: 0 },
            two: { id: 15, turned: false, value: 0 },
            thr: { id: 16, turned: false, value: 0 },
            fur: { id: 17, turned: false, value: 0 },
            fve: { id: 18, turned: false, value: 0 },
            six: { id: 19, turned: false, value: 0 },
            svn: { id: 20, turned: false, value: 0 },
            eht: { id: 21, turned: false, value: 0}
    };
    slider = {
            one: { id: 2, turned: false, value: 0 },
            two: { id: 3, turned: false, value: 0 },
            thr: { id: 4, turned: false, value: 0 },
            fur: { id: 5, turned: false, value: 0 },
            fve: { id: 6, turned: false, value: 0 },
            six: { id: 7, turned: false, value: 0 },
            svn: { id: 8, turned: false, value: 0 },
            eht: { id: 9, turned: false, value: 0}
    };
}

// Function executed on successful connection
function onSuccess(interface) {

    console.log('Got MIDI', interface);

    var inputs = interface.inputs.values();

    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        // each time there is a midi message call the onMIDIMessage function
        input.value.onmidimessage = onMIDIMessage;
    }
}

// debounce not necessary?
//var debounce = 20;
//var waitingMIDI = false;
function onMIDIMessage(message){
    //console.log(message.data);
    var message = {
                type: message.data[0],
                id: message.data[1],
                value: message.data[2]
    };
    matchId(message);  

    //if (!waitingMIDI){ 
        //waitingMIDI = true;
        //setTimeout(function() { waitingMIDI = false; }, debounce);  
    //}
}

// more general, just return button?
function matchId(message){

    for( var key in octave1){
        if( octave1[key].id === message.id )
            octave1[key] = buttonEvent(message);
    }
    for( var key in octave2){
        if( octave2[key].id === message.id )
            octave2[key] = buttonEvent(message);
    }
    for( var key in octave3){
        if( octave3[key].id === message.id )
            octave3[key] = buttonEvent(message);
    }
    for( var key in octave4){
        if( octave4[key].id === message.id )
            octave4[key] = buttonEvent(message);
    }
    for( var key in pad){
        if( pad[key].id === message.id )
            pad[key] = buttonEvent(message);
    }
    for( var key in knob){
        if( knob[key].id === message.id )
            knob[key] = knobEvent(message, key);
    }
    for( var key in slider){
        if( slider[key].id === message.id )
            slider[key] = knobEvent(message, key);
    }
}

function buttonEvent(message){
    var id, pressed, value;

    id = message.id;
    if(midi_controller == "akai"){
        if(message.type === akai_down){
            pressed = true;
            time = Date.now();

        }else{
            pressed = false;
        }
    }

    if(midi_controller == "korg"){
        if(message.type === korg_down){
            pressed = true;
            time = Date.now();

        }else{
            pressed = false;
        }
    }

    velocity = (message.value/128); //should this be auto-converted to percentage?

    return { id: id, pressed: pressed, velocity: velocity, time: time};
}

function knobEvent(message, key){
    var id, turned, value; 

    id = message.id;

    // detects if knob moved from initial position (ie was touched once)
    turned = true;
    //setTimeout(function(){ knob[key].turned = false }, 1000); //specify knob to be timed out?

    value = (message.value/128);
    //console.log(id, value);

    return { id: id, turned: turned, value: value};

    // maybe easing could be applied here also, but then everythin has same easing?
}

// Function executed on failed connection
function onFailure(error) {
    console.log("Could not connect to the MIDI interface");
}
