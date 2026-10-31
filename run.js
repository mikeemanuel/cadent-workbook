(async (idx) => {
const W=ms=>new Promise(r=>setTimeout(r,ms)); const log=[];
const B='https://raw.githubusercontent.com/mikeemanuel/cadent-workbook/etsy-transfer/';
const L=await (await fetch(B+'listings.json?'+Date.now())).json(); const o=L[idx];
const kb=new Uint8Array(window.__KEY.match(/../g).map(h=>parseInt(h,16)));
const key=await crypto.subtle.importKey('raw',kb,'AES-GCM',false,['decrypt']);
const getF=async(name,type,out)=>{const b=new Uint8Array(await (await fetch(B+name+'.bin')).arrayBuffer());const pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:b.slice(0,12)},key,b.slice(12));return new File([pt],out||name,{type});};
const put=(input,files)=>{const dt=new DataTransfer();files.forEach(f=>dt.items.add(f));input.files=dt.files;input.dispatchEvent(new Event('change',{bubbles:true}));};
const fin=sec=>document.querySelector('#'+sec+' input[type=file]');
const set=(el,v)=>{const p=el.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(p,'value').set.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));el.dispatchEvent(new Event('blur',{bubbles:true}));};
const dlg=re=>[...document.querySelectorAll('[role=dialog],[role=alertdialog]')].find(d=>d.offsetParent!==null&&re.test(d.innerText));
for(let i=0;i<40&&!document.querySelector('#field-digitalFiles');i++) await W(500);
await W(1500);
// photos
const pd=[...document.querySelector('#field-listingImages').querySelectorAll('button')].find(b=>b.innerText.trim()==='Delete all');
if(pd){pd.click();await W(800);const d=dlg(/Delete all photos/);if(d){[...d.querySelectorAll('button')].find(b=>/^Delete/.test(b.innerText.trim())).click();await W(1500);}}
const ph=[];for(const n of ['1-cover','2-colored','3-whats-included']) ph.push(await getF(`${o.id}-${n}.jpg`,'image/jpeg',`${o.slug}-coloring-page-${n}.jpg`));
put(fin('field-listingImages'),ph); await W(9000);
log.push((document.body.innerText.match(/Add photos\s*\n?\s*\d+ remaining/)||['?'])[0].replace(/\s+/g,' '));
// files
const s=()=>document.querySelector('#field-digitalFiles');
for(let k=0;k<6;k++){const b=[...s().querySelectorAll('button')].find(b=>(b.innerText.trim()||b.getAttribute('aria-label'))==='Remove');if(!b)break;b.click();await W(800);const d=dlg(/remove|delete/i);if(d){const c=[...d.querySelectorAll('button')].find(x=>/^(Remove|Delete)/i.test(x.innerText.trim()));c&&c.click();await W(800);}}
const nice=o.name.replace(/\s+/g,'-');
put(fin('field-digitalFiles'),[await getF(`${o.id}-${o.slug}-coloring-page.pdf`,'application/pdf',`${nice}-Coloring-Page-Letter-and-A4.pdf`),await getF(`${o.id}-${o.slug}-coloring-page-letter.png`,'image/png',`${nice}-Coloring-Page-300dpi.png`)]);
await W(7000); log.push('files:'+(s().innerText.replace(/\s+/g,' ').match(/made to order(.*?)Add file/)||[])[1]);
// text
set(document.querySelector('#listing-title-input'),o.title);
set(document.querySelector('#listing-description-textarea'),o.description);
set(document.querySelector('#listing-price-input'),'2.50');
const pg=[...document.querySelectorAll('[id^=field-attributes-attribute] input[type=text]')].find(i=>/Number of pages/.test(i.closest('[id^=field-attributes-attribute]').innerText)); if(pg) set(pg,'1');
// tags
const tagIn=document.querySelector('#listing-tags-input'); const sec=document.querySelector('#field-tags');
const td=[...sec.querySelectorAll('button')].find(b=>b.innerText.trim()==='Delete all'); if(td){td.click();await W(800);const d=dlg(/tag/i);if(d){[...d.querySelectorAll('button')].find(x=>/Delete/.test(x.innerText)).click();await W(800);}}
for(const t of o.tags){set(tagIn,t);await W(150);[...sec.querySelectorAll('button')].find(b=>b.innerText.trim()==='Add').click();await W(300);}
log.push('tags:'+(sec.innerText.match(/All 13 used/)?'13':'?'));
log.push('title:'+document.querySelector('#listing-title-input').value.slice(0,40)+' price:'+document.querySelector('#listing-price-input').value+' pages:'+(pg?pg.value:'-'));
await W(1000);
[...document.querySelectorAll('button')].find(b=>b.innerText.trim()==='Save as draft').click();
await W(6000); log.push('after save: '+location.pathname);
return log.join(' | ');
})
