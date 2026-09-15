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
