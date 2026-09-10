(() => {
 const key='whateveriwant-theme',root=document.documentElement;
 const system=window.matchMedia('(prefers-color-scheme: dark)');
 let preference=null;
 const valid=value=>value==='light'||value==='dark'?value:null;
 try{preference=valid(localStorage.getItem(key));}catch{}
 window.updateThemeControl=()=>{
  const button=document.querySelector('#theme-toggle');
  if(!button)return;
  const dark=root.dataset.theme==='dark',english=root.lang==='en';
  const label=english?(dark?'Switch to light mode':'Switch to dark mode'):(dark?'라이트 모드로 전환':'다크 모드로 전환');
  button.setAttribute('aria-label',label);button.title=label;
  button.querySelector('[data-theme-icon]').textContent=dark?'☾':'☀';
  button.querySelector('[data-theme-label]').textContent=english?(dark?'Dark':'Light'):(dark?'다크':'라이트');
 };
 function apply(){
  const theme=preference||(system.matches?'dark':'light');
  root.dataset.theme=theme;
  root.style.colorScheme=theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',theme==='dark'?'#151b21':'#f8f9fb');
  window.updateThemeControl();
 }
 apply();
 system.addEventListener('change',()=>{if(!preference)apply();});
 window.addEventListener('storage',event=>{if(event.key===key||event.key===null){preference=valid(event.newValue);apply();}});
 document.addEventListener('DOMContentLoaded',()=>{
  window.updateThemeControl();
  document.querySelector('#theme-toggle').addEventListener('click',()=>{
   preference=root.dataset.theme==='dark'?'light':'dark';
   try{localStorage.setItem(key,preference);}catch{}
   apply();
  });
 });
})();
