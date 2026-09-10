import fs from 'node:fs/promises';
import path from 'node:path';
import MarkdownIt from 'markdown-it';
import katex from 'katex';

const root=path.resolve(import.meta.dirname,'..');
const output=path.join(root,'dist');
await fs.mkdir(output,{recursive:true});
for (const file of ['index.html','style.css','app.js']) await fs.copyFile(path.join(root,'web',file),path.join(output,file));
await fs.mkdir(path.join(output,'assets'),{recursive:true});
await fs.cp(path.join(root,'node_modules/katex/dist'),path.join(output,'assets/katex'),{recursive:true});
const order=['fundamentals','data-and-generalization','training','neural-networks','evaluation','tokens-and-embeddings','transformer','llm-inference','rag','fine-tuning','glossary','index'];
const levels=['기초','기초','기초','기초','기초','핵심','핵심','핵심','응용','응용','참고','가이드'];
const md=new MarkdownIt({html:false,linkify:true,typographer:false});
const defaultLink=md.renderer.rules.link_open || ((tokens,idx,opts,env,self)=>self.renderToken(tokens,idx,opts));
md.renderer.rules.link_open=(tokens,idx,opts,env,self)=>{
  const token=tokens[idx],href=token.attrGet('href');
  if(href==='../../README.md') token.attrSet('href','#/');
  else if(href?.endsWith('.md') && !href.startsWith('http')) token.attrSet('href','#/ai/'+path.basename(href,'.md'));
  else if(href?.startsWith('https://')) {token.attrSet('target','_blank');token.attrSet('rel','noopener noreferrer');}
  return defaultLink(tokens,idx,opts,env,self);
};
const docs=[];
for(const [i,slug] of order.entries()) {
  const source=await fs.readFile(path.join(root,'content/ai',slug+'.md'),'utf8');
  const title=source.match(/^# (.+)/m)[1];
  const summary=source.split('\n').filter(line=>line.startsWith('> ')&&!line.includes('TL;DR')).map(line=>line.slice(2)).join(' ');
  const maths=[];
  let body=source.replace(/^# .+\n/,'').replace(/^AI 작성 해설.*\n/m,'');
  body=body.replace(/\$\$([\s\S]*?)\$\$/g,(_,tex)=>{const index=maths.push(katex.renderToString(tex,{displayMode:true,throwOnError:true,trust:false}))-1;return `\n\nMATHPLACEHOLDER${index}END\n\n`;});
  let html=md.render(body);
  html=html.replace(/<p>MATHPLACEHOLDER(\d+)END<\/p>/g,(_,i)=>maths[Number(i)]);
  html=html.replace(/<table>/g,'<div class="table-scroll"><table>').replace(/<\/table>/g,'</table></div>');
  const headings=[];
  html=html.replace(/<h2>(.*?)<\/h2>/g,(_,heading)=>{const id='section-'+headings.length;headings.push({id,title:heading.replace(/<[^>]*>/g,'')});return `<h2 id="${id}">${heading}</h2>`;});
  docs.push({slug,title,summary:summary|| (slug==='glossary'?'30개의 한영 용어를 빠르게 찾아보고 관련 개념으로 이동하세요.':'AI 기초부터 LLM 활용까지, 나에게 맞는 학습 순서를 찾아보세요.'),level:levels[i],html,headings,source,minutes:Math.max(2,Math.ceil(source.length/650)),date:'2026-09-10'});
}
await fs.writeFile(path.join(output,'documents.json'),JSON.stringify(docs));
console.log(`Built ${docs.length} documents; all math expressions rendered.`);
