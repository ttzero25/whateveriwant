// Missing historical collection dates stay unknown; a refresh is not a new addition.
export function stampCollected(item,previous,at){
 const changed=previous&&(previous.title!==item.title||(previous.excerpt||'')!==(item.excerpt||''));
 return {...item,first_seen:previous?.first_seen||(!previous?at:null),...(changed?{updated_at:at}:previous?.updated_at?{updated_at:previous.updated_at}:{})};
}
