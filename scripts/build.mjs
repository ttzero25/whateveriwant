import fs from 'node:fs/promises';
import path from 'node:path';
import MarkdownIt from 'markdown-it';
import katex from 'katex';
import {buildExcerpts} from './excerpt-build.mjs';
const root=path.resolve(import.meta.dirname,'..'),output=path.join(root,'dist');
await fs.mkdir(output,{recursive:true});
for(const file of ['index.html','style.css','app.js','diagrams.js','theme.js','research.js','home-updates.js']) await fs.copyFile(path.join(root,'web',file),path.join(output,file));
await fs.mkdir(path.join(output,'assets'),{recursive:true});
await fs.cp(path.join(root,'node_modules/katex/dist'),path.join(output,'assets/katex'),{recursive:true});
const originals=JSON.parse(await fs.readFile(path.join(root,'content/en/originals.json'),'utf8'));
const catalog=JSON.parse(await fs.readFile(path.join(root,'content/catalog.json'),'utf8'));
const order=catalog.map(d=>d.slug),levels=catalog.map(d=>d.level),englishTitles=catalog.map(d=>d.englishTitle);
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const md=new MarkdownIt({html:false,linkify:true});
const defaultLink=md.renderer.rules.link_open||((tokens,idx,opts,env,self)=>self.renderToken(tokens,idx,opts));
md.renderer.rules.link_open=(tokens,idx,opts,env,self)=>{
 const token=tokens[idx],href=token.attrGet('href');
 if(href==='../../README.md')token.attrSet('href','#/');
 else if(href?.endsWith('.md')&&!href.startsWith('http'))token.attrSet('href','#/'+path.posix.normalize((env.topic||'ai')+'/'+href).replace(/\.md$/,''));
 else if(href?.startsWith('https://')){token.attrSet('target','_blank');token.attrSet('rel','noopener noreferrer');}
 return defaultLink(tokens,idx,opts,env,self);
};
function mathText(text){
 const re=/\$\$([\s\S]*?)\$\$|\\\(([\s\S]*?)\\\)/g;
 let html='',last=0;
 for(const match of text.matchAll(re)){html+=escape(text.slice(last,match.index));html+=katex.renderToString((match[1]??match[2]).replace(/(?<!\\)%/g, "\\%"),{displayMode:match[1]!==undefined,throwOnError:true,trust:false});last=match.index+match[0].length;}
 return html+escape(text.slice(last));
}
function finalize(html){
 html=html.replace(/<table>/g,'<div class="table-scroll"><table>').replace(/<\/table>/g,'</table></div>');
 const headings=[];
 html=html.replace(/<h2>(.*?)<\/h2>/g,(_,heading)=>{const id='section-'+headings.length;headings.push({id,title:heading.replace(/<[^>]*>/g,'')});return `<h2 id="${id}">${heading}</h2>`;});
 return {html,headings};
}
function sectionHTML(section){return `<h2>${escape(section.heading)}</h2><div class="original-text" lang="en">`+section.blocks.map(block=>{
 if(block.type==='ul'||block.type==='ol')return `<${block.type}>${block.items.map(item=>`<li>${mathText(item)}</li>`).join('')}</${block.type}>`;
 if(block.type==='pre')return `<pre><code>${escape(block.text)}</code></pre>`;
 if(block.type==='quote')return `<blockquote class="source-quote">${mathText(block.text)}</blockquote>`;
 return `<div class="source-paragraph">${mathText(block.text)}</div>`;
}).join('')+`</div><p class="original-reference"><a href="${escape(section.url)}" target="_blank" rel="noopener noreferrer">Google · ${escape(section.heading)} ↗</a></p>`;}
const attribution=`<aside class="attribution"><strong>Source &amp; license</strong><p>Text excerpts from <a href="${originals.source_url}" target="_blank" rel="noopener noreferrer">Google’s Machine Learning Glossary</a>, used under <a href="${originals.license_url}" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>. Wording is unchanged; whitespace and layout are normalized. Selected introductory paragraphs are reproduced; later text and source figures are omitted. Any code samples remain under <a href="https://www.apache.org/licenses/LICENSE-2.0" target="_blank" rel="noopener noreferrer">Apache 2.0</a>. <a href="${originals.policy_url}" target="_blank" rel="noopener noreferrer">Google site policies</a>.</p><p>Source checked ${originals.checked_on}. Site titles, navigation, and explanatory diagrams are created for whateveriwant and are not part of the quoted source.</p></aside>`;
const docs=[];
for(const [i,slug] of order.entries()){
 const source=await fs.readFile(path.join(root,'content/ai',slug+'.md'),'utf8');
 const title=source.match(/^# (.+)/m)[1];
 const summary=source.split('\n').filter(l=>l.startsWith('> ')&&!l.includes('TL;DR')).map(l=>l.slice(2)).join(' ');
 const maths=[];
 let body=source.replace(/^# .+\n/,'').replace(/^AI 작성 해설.*\n/m,'');
 body=body.replace(/\$\$([\s\S]*?)\$\$/g,(_,tex)=>{const i=maths.push(katex.renderToString(tex,{displayMode:true,throwOnError:true,trust:false}))-1;return `\n\nMATHPLACEHOLDER${i}END\n\n`;});
 const ko=finalize(md.render(body).replace(/<p>MATHPLACEHOLDER(\d+)END<\/p>/g,(_,i)=>maths[Number(i)]));
 const sections=originals.concepts[slug];
 let enHTML,enSummary,enType='original';
 if(sections){
  enSummary=sections[0].blocks.find(b=>b.type==='p').text;
  enHTML=`<blockquote class="tldr-original"><p><strong>TL;DR · ORIGINAL EXCERPT</strong></p><p>${mathText(enSummary)}</p></blockquote>`+sections.map(sectionHTML).join('')+attribution;
 }else if(slug==='glossary'){
  enType='original';enSummary='Selected original definitions from Google’s Machine Learning Glossary.';
  const unique=[...new Map(Object.values(originals.concepts).flat().map(s=>[s.url,s])).values()].sort((a,b)=>a.heading.localeCompare(b.heading));
  enHTML=`<p>${escape(enSummary)}</p>`+unique.map(sectionHTML).join('')+attribution;
 }else if(slug!=='index'){
  enType='korean';enSummary=summary;enHTML=ko.html;
 }else{
  enType='navigation';enSummary='Explore machine learning, deep learning, and LLM applications.';
  enHTML='<h2>Learning path</h2><p>Site navigation created for whateveriwant. Existing concepts include selected English source excerpts; expanded articles display a Korean-article notice.</p><ol>'+order.filter(s=>!['index','glossary'].includes(s)).map((s,j)=>`<li><a href="#/ai/${s}">${englishTitles[j]}</a></li>`).join('')+'</ol><h2>Suggested routes</h2><p>Foundations: 1 → 2 → 3 → 4 → 5<br>Language models: 4 → 6 → 7 → 8<br>Document-based applications: 6 → 8 → 9 → 10<br>ML models: 2 → 11 → 12 → 13 → 14 → 5<br>Deep learning: 4 → 15 → 3 → 18 → 16 → 17</p>';
 }
 const en={title:englishTitles[i],summary:enSummary,...(enType==='korean'?ko:finalize(enHTML)),source:enType==='korean'?source:sections?sections.map(s=>s.blocks.map(b=>b.text||b.items.join(' ')).join(' ')).join(' '):enSummary,type:enType,date:originals.checked_on};
 docs.push({topic:'ai',slug,title,summary:summary||(slug==='glossary'?'한영 용어를 빠르게 찾아보고 관련 개념으로 이동하세요.':'AI 기초부터 LLM 활용까지, 나에게 맞는 학습 순서를 찾아보세요.'),level:levels[i],track:catalog[i].track,...ko,source,minutes:Math.max(2,Math.ceil(source.length/650)),date:'2026-09-10',en});
}
const collections=JSON.parse(await fs.readFile(path.join(root,'content/collections.json'),'utf8'));
for(const {topic,entries} of collections){
 for(const {slug,englishTitle,level} of entries){
  const source=await fs.readFile(path.join(root,'content',topic,slug+'.md'),'utf8');
  const title=source.match(/^# (.+)/m)[1];
  const summary=source.split('\n').filter(l=>l.startsWith('> ')&&!l.includes('TL;DR')).map(l=>l.slice(2)).join(' ');
  const body=source.replace(/^# .+\n/,'').replace(/^AI 작성 해설.*\n/m,'');
  const ko=finalize(md.render(body,{topic}));
  docs.push({topic,slug,title,summary,level,...ko,source,minutes:Math.max(2,Math.ceil(source.length/650)),date:'2026-09-10',en:{title:englishTitle,summary,...ko,source,type:'korean',date:'2026-09-10'}});
 }
}
for(const topic of ['cs','os'])docs.push(...await buildExcerpts({root,md,finalize,escape,topic}));
await fs.writeFile(path.join(output,'documents.json'),JSON.stringify(docs));
console.log(`Built ${docs.length} documents across ${new Set(docs.map(d=>d.topic)).size} topics.`);

await fs.copyFile(path.join(root,'data/research.json'),path.join(output,'research.json'));
