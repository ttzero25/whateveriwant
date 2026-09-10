import fs from 'node:fs/promises';
import path from 'node:path';
export async function buildExcerpts({root,md,finalize,escape,topic}){
 const catalog=JSON.parse(await fs.readFile(path.join(root,'content',topic,'catalog.json'),'utf8'));
 const sources=JSON.parse(await fs.readFile(path.join(root,'sources',topic+'.json'),'utf8')).sources;
 const result=[];
 for(const entry of catalog){
  const {slug,englishTitle,level}=entry;
  const source=await fs.readFile(path.join(root,'content',topic,slug+'.md'),'utf8');
  const title=source.match(/^# (.+)/m)[1];
  const summary=source.split('\n').filter(l=>l.startsWith('> ')&&!l.includes('TL;DR')).map(l=>l.slice(2)).join(' ');
  const body=source.replace(/^# .+\n/,'').replace(/^AI 작성 해설.*\n/m,'');
  const ko=finalize(md.render(body,{topic}));
  const original=sources.find(s=>s.slug===slug);
  let html,enSummary,type;
  if(original){
   type='excerpt';enSummary=`Read a short original excerpt from ${original.title}.`;
   html=`<blockquote><p><strong>TL;DR · ORIGINAL EXCERPT</strong></p><p class="${topic}-original">${escape(original.quote)}</p></blockquote><h2>Read the full source</h2><p><a href="${escape(original.url)}" target="_blank" rel="noopener noreferrer">${escape(original.title)} ↗</a></p><p>This is a short, unchanged source excerpt about a related concept, not a translation of the Korean article. The Korean explanation covers additional topics. Site titles and diagrams are authored for whateveriwant.</p><aside class="attribution">Source checked ${original.checked_on}. Wording is unchanged; whitespace is normalized. Full-text redistribution is not implied.</aside>`;
  }else{
   type='navigation';enSummary=slug==='index'?`A learning path through ${sources.length} core ${topic.toUpperCase()} topics.`:`Browse ${topic.toUpperCase()} topics and their original references.`;
   html=`<blockquote><p><strong>TL;DR</strong></p><p>${enSummary}</p></blockquote><h2>${slug==='index'?'Learning path':'Topic directory'}</h2><p>Site navigation authored for whateveriwant.</p><ol>${catalog.filter(d=>sources.some(s=>s.slug===d.slug)).map(d=>`<li><a href="#/${topic}/${d.slug}">${escape(d.englishTitle)}</a></li>`).join('')}</ol>`;
  }
  result.push({topic,slug,title,summary,level,...ko,source,date:'2026-09-10',minutes:Math.max(2,Math.ceil(source.length/650)),en:{title:englishTitle,summary:enSummary,...finalize(html),source:original?.quote||enSummary,provider:original?.title,type,date:'2026-09-10'}});
 }
 return result;
}
