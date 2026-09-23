const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const html=fs.readFileSync(require('path').join(__dirname,'../index.html'),'utf8');
const js=html.match(/<script>([\s\S]*?)<\/script>/)[1];new vm.Script(js);
const events={},elements=new Map(),timers=[];
const draw=new Proxy({createLinearGradient:()=>({addColorStop(){}})}, {get:(o,k)=>o[k]||(()=>{})});
function element(id){if(!elements.has(id))elements.set(id,{hidden:false,checked:false,textContent:'',style:{},classList:{add(){},remove(){}},addEventListener(t,f){events[id+':'+t]=f},setAttribute(){},closest(){return null},focus(){},setPointerCapture(){},getBoundingClientRect(){return {left:0,top:0,width:390,height:844}},getContext:()=>draw});return elements.get(id)}
const context={console,Math,devicePixelRatio:2,performance:{now:()=>1000},matchMedia:()=>({matches:false}),document:{querySelector:element,addEventListener(t,f){events['document:'+t]=f}},navigator:{},addEventListener(t,f){events['window:'+t]=f},requestAnimationFrame(){},setTimeout(f){timers.push(f);return timers.length},clearTimeout(){}};
vm.createContext(context);vm.runInContext(js,context);
function run(code){return vm.runInContext(code,context)}
function emit(t,x,y,id=1){events['#road:'+t]({clientX:x,clientY:y,pointerId:id,preventDefault(){}})}
run('startGame();soundOn=false;const h=new Hazard();h.x=195;h.y=380;h.car.x=195;h.car.y=130;hazards=[h]');
emit('pointerdown',195,380);
run('h.update(.05)');assert.equal(run('h.fill'),0,'stationary pointer must not repair');
for(let i=0;i<70&&run('h.fill')<1;i++){
  const y=run('h.y');emit('pointermove',i%2?175:215,y);run('h.update(.025)');
}
assert.equal(run('h.fill'),1,'short rubbing strokes complete repair');assert.equal(run('fixed'),1);
run('h.car.y=h.y+35;h.car.update(0,75)');assert.equal(run('saved'),1,'safe passage credited');
emit('pointerup',195,380);
run('startGame();const stationary=new Hazard();hazards=[stationary];active=stationary;');
element('#assist').checked=true;run('stationary.update(.5)');assert(run('stationary.fill')>0,'hold alternative works');element('#assist').checked=false;
run('pauseGame();const frozen=time;loop(2000)');assert.equal(run('time'),run('frozen'),'pause freezes time');assert.equal(run('active'),null);
element('#resume').onclick();assert.equal(run('paused'),false);
run('startGame();const fatal=new Hazard();fatal.car.type="bike";fatal.collide()');assert.equal(run('bikeOutcome'),'fatal');assert.equal(run('paused'),true);timers.at(-1)();assert.equal(element('#humanCost').hidden,false);assert.match(element('#endCopy').textContent,/did not survive/);
run('startGame();const partial=new Hazard();partial.car.type="bike";partial.fill=.5;partial.collide()');assert.equal(run('bikeOutcome'),'injured');timers.at(-1)();assert.match(element('#endCopy').textContent,/care and recovery/);
run('startGame();const car=new Hazard();car.car.type="car";car.collide()');assert.equal(run('bikeOutcome'),null);assert.equal(run('running'),true);assert.equal(run('health'),72);
run('startGame()');assert.equal(element('#humanCost').hidden,true);assert.equal(run('saved'),0);assert.equal(run('pointerId'),null);
emit('pointerdown',0,0);assert.equal(run('active'),null);
run('const moving=new Hazard();moving.x=195;moving.y=380;hazards=[moving]');emit('pointerdown',195,380);emit('pointermove',210,380);emit('pointercancel',210,380);assert.equal(run('active'),null);assert.equal(run('rubBudget'),0);
run('startGame();for(let i=0;i<3000;i++)loop(i*16)');
console.log('PASS: JavaScript syntax; stationary/rubbing/hold inputs; repair and safe passage; pause/resume; fatal and injury outcomes; car damage; restart; pointer cancellation; 3,000 simulation frames without vibration support.');

run('startGame();const truck=new Hazard();truck.car.type="truck";truck.car.y=truck.y;truck.car.update(0,74);truck.collide()');
assert.equal(run('truck.car.passed'),true);assert.equal(run('truck.car.hit'),false);assert.equal(run('health'),100);assert.equal(run('saved'),0);assert.equal(run('lives'),3);assert.equal(run('truck.fill'),0);assert.equal(run('truck.dead'),false,'truck leaves broken road behind');
run('truck.car.update(.1,74)');assert.equal(run('health'),100,'truck passage is idempotent');
run('startGame();const repairedTruck=new Hazard();repairedTruck.car.type="truck";repairedTruck.fill=1;repairedTruck.dead=true;repairedTruck.car.y=repairedTruck.y+40;repairedTruck.car.update(0,74)');assert.equal(run('saved'),0,'truck is not credited as a rescue');
const nodes=[];
function param(){return {value:0,calls:[],setValueAtTime(v){this.value=v;this.calls.push(v)},linearRampToValueAtTime(v){this.value=v;this.calls.push(v)},exponentialRampToValueAtTime(v){this.value=v;this.calls.push(v)},setTargetAtTime(v){this.value=v;this.calls.push(v)}}}
function node(){const n={gain:param(),frequency:param(),Q:param(),connect(other){return other},disconnect(){},start(){this.started=true},stop(){this.stopped=true;this.onended?.()}};nodes.push(n);return n}
context.AudioContext=class {constructor(){this.state='running';this.currentTime=1;this.sampleRate=48000;this.destination={}}resume(){return Promise.resolve()}createGain(){return node()}createOscillator(){return node()}createBiquadFilter(){return node()}createBufferSource(){return node()}createBuffer(ch,length){return {getChannelData:()=>new Float32Array(length)}}};
run('soundOn=true;startGame();soundscape.tick()');assert(run('soundscape.beat')>0,'music advances');
for(const kind of ['bike','car','truck']){const before=nodes.length;run(`soundscape.horn('${kind}')`);assert(nodes.length>before,kind+' has an audible voice');assert.equal(run('soundscape.music.gain.value'),.12,'horn ducks music')}
run('soundscape.ac.currentTime+=2;soundscape.tick()');assert.equal(run('soundscape.music.gain.value'),.7,'music returns after horn');
run('soundscape.grit(.2);soundscape.grit(.5);soundscape.grit(.9);pauseGame()');assert.equal(run('soundscape.master.gain.value'),0);assert.equal(run('soundscape.voices.size'),0);
let before=nodes.length;run('soundscape.tick();soundscape.horn("truck")');assert.equal(nodes.length,before,'no sounds scheduled while paused');
element('#resume').onclick();run('soundscape.tick()');assert(nodes.length>before,'resume restores score');
element('#sound').onclick();assert.equal(run('soundscape.master.gain.value'),0);before=nodes.length;run('soundscape.tick();soundscape.horn("truck")');assert.equal(nodes.length,before,'mute blocks all voices');
element('#sound').onclick();run('soundscape.tick();endGame()');assert.equal(run('soundscape.voices.size'),0);assert.equal(run('soundscape.master.gain.value'),0,'game over silences score');
console.log('PASS: trucks cross unfinished and repaired roads without harm/rescue credit; music scheduling; three horn voices; duck/recovery; repair noise; pause, mute, resume and end-game audio.');
