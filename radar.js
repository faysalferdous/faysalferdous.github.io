"use strict";
(() => {
  const canvas = document.querySelector("#scope");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const targets = [[.42,-.8], [.72,2.6], [.64,.92], [.7,-2.3], [.3,1.98]];
  const tau = 2 * Math.PI;
  let visible = true, frame = 0, last = -100;
  function paint(time) {
    const angle = motion.matches ? -.65 : time / 1210 - .65;
    ctx.setTransform(1,0,0,1,320,320);
    ctx.clearRect(-320,-320,640,640);
    ctx.lineWidth = 1.3;
    for (const radius of [58,116,174,232,285,297]) {
      ctx.beginPath(); ctx.arc(0,0,radius,0,tau);
      ctx.strokeStyle = radius >= 285 ? "#9ee82c" : "#6d9b38"; ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(-296,0); ctx.lineTo(296,0); ctx.moveTo(0,-296); ctx.lineTo(0,296);
    ctx.strokeStyle="#5a842d"; ctx.stroke();
    for (let i=0;i<120;i++) {
      const a=i*tau/120, inner=i%10===0 ? 270 : i%5===0 ? 278 : 283;
      ctx.beginPath(); ctx.moveTo(inner*Math.cos(a),inner*Math.sin(a));
      ctx.lineTo(289*Math.cos(a),289*Math.sin(a)); ctx.strokeStyle="#b8f342";ctx.stroke();
    }
    const sweep=ctx.createConicGradient(angle,0,0);
    sweep.addColorStop(0,"transparent"); sweep.addColorStop(.84,"transparent");
    sweep.addColorStop(.999,"rgba(166,255,12,.53)"); sweep.addColorStop(1,"transparent");
    ctx.fillStyle=sweep;ctx.beginPath();ctx.arc(0,0,282,0,tau);ctx.fill();
    ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(284*Math.cos(angle),284*Math.sin(angle));ctx.strokeStyle="#c9ff4c";ctx.lineWidth=2.5;ctx.stroke();
    for(const [d,a] of targets) {
      const age=((angle-a)%tau+tau)%tau;
      ctx.globalAlpha=.35+.65*Math.exp(-age);
      ctx.shadowColor="#aaff15";ctx.shadowBlur=16;ctx.fillStyle="#d9ff7c";
      ctx.beginPath();ctx.arc(282*d*Math.cos(a),282*d*Math.sin(a),4.5,0,tau);ctx.fill();
    }
    ctx.globalAlpha=1;ctx.shadowBlur=0;
  }
  function tick(time) {
    if(time-last>=32) { paint(time);last=time; }
    frame=requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame);
    if (visible && !document.hidden && !motion.matches) frame=requestAnimationFrame(tick);
    else if (motion.matches) paint(0);
  }
  paint(0);
  new IntersectionObserver(([entry])=>{ visible=entry.isIntersecting;sync(); }).observe(canvas);
  document.addEventListener("visibilitychange",sync);motion.addEventListener("change",sync);
})();
