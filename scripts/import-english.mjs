// Manual import of licensed text only. Does not mirror third-party images or code.
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {load} from 'cheerio';
const url='https://developers.google.com/machine-learning/glossary?hl=en';
const source=process.argv[2] ? await fs.readFile(process.argv[2],'utf8') : await fetch(url).then(r=>{if(!r.ok)throw Error(`HTTP ${r.status}`);return r.text();});
if(!source.includes('creativecommons.org/licenses/by/4.0')) throw Error('Expected CC BY 4.0 notice missing; review license before importing.');
const $=load(source);
const normalize=text=>text.replace(/\s+/g,' ').trim();
const concepts={
  'linear-regression':['linear-regression','mean-squared-error-mse'],
  'logistic-regression':['logistic-regression','sigmoid-function','classification-threshold'],
  'decision-trees':['decision-tree','leaf','random-forest'],
  'clustering':['clustering','k-means','centroid'],
  'activation-functions':['activation-function','rectified-linear-unit-relu','sigmoid-function'],
  cnn:['convolutional-neural-network','convolutional-filter','pooling'],
  rnn:['recurrent-neural-network','long-short-term-memory-lstm'],
  regularization:['regularization','l2-regularization','dropout-regularization'],
  fundamentals:['artificial-intelligence','machine-learning','deep-model','supervised-machine-learning','unsupervised-machine-learning'],
  'data-and-generalization':['generalization','overfitting','training-set','validation-set','test-set'],
  training:['training','loss','gradient-descent','backpropagation'],
  'neural-networks':['neural-network','tensor','tensor-shape'],
  evaluation:['accuracy','precision','recall','false-positive-fp','false-negative-fn'],
  'tokens-and-embeddings':['token','tokenizer','embedding-vector'],
  transformer:['transformer','attention','self-attention-also-called-self-attention-layer'],
  'llm-inference':['large-language-model','inference','context-window','temperature'],
  rag:['retrieval-augmented-generation-rag'],
  'fine-tuning':['fine-tuning','low-rank-adaptability-lora'],
};
const result={provider:'Google',title:'Machine Learning Glossary',source_url:url,license:'CC BY 4.0',license_url:'https://creativecommons.org/licenses/by/4.0/',policy_url:'https://developers.google.com/terms/site-policies',checked_on:new Date().toISOString().slice(0,10),source_sha256:createHash('sha256').update(source).digest('hex'),scope:'Selected introductory paragraphs and immediately following lists. Text is unchanged except whitespace normalization. Media and later paragraphs are omitted.',concepts:{}};
for(const [slug,ids] of Object.entries(concepts)){
  result.concepts[slug]=ids.map(id=>{
    const heading=$(`h2[id="${id}"]`);
    if(heading.length!==1) throw Error(`Missing or ambiguous source heading: ${id}`);
    const blocks=[];
    let paragraphs=0;
    for(const node of heading.nextUntil('h2').toArray()){
      const element=$(node),tag=node.tagName;
      if(tag==='p'){
        const text=normalize(element.text());
        if(!text)continue;
        if(paragraphs>=2)break;
        // Stop before a figure-dependent paragraph; the linked original retains media.
        if(/^(Figure|The following (figure|illustration)|For example, the following)/.test(text))break;
        blocks.push({type:'p',text});paragraphs++;
      }else if((tag==='ul'||tag==='ol')&&paragraphs>0){
        blocks.push({type:tag,items:element.children('li').toArray().map(li=>normalize($(li).text()))});
      }else if(tag==='blockquote'&&paragraphs>0){
        blocks.push({type:'quote',text:normalize(element.text())});
      }else if((tag==='pre'||tag==='devsite-code')&&paragraphs>0){
        blocks.push({type:'pre',text:element.find('pre').length?element.find('pre').text():element.text()});
      }else if(tag==='div'&&paragraphs>0&&element.text().includes('$$')){
        blocks.push({type:'p',text:normalize(element.text())});
      }
    }
    if(!blocks.length) throw Error(`No text extracted: ${id}`);
    return {heading:normalize(heading.text()),url:url+'#'+id,blocks};
  });
}
await fs.mkdir('content/en',{recursive:true});
await fs.writeFile('content/en/originals.json',JSON.stringify(result,null,2)+'\n');
console.log(`Imported original English excerpts for ${Object.keys(concepts).length} concepts.`);
