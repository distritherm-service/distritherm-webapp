const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/ProductSpecifications-B9nMrldC.js","assets/index-CEB1cax2.js","assets/index-Bk91gqTx.css","assets/ProductDocuments-D7g8Bdus.js"])))=>i.map(i=>d[i]);
import{G as j,P as H,D as M,u as Q,o as W,r as n,p as R,j as e,I as d,F as O,Q as Z,R as G,S as _,J as D,T as V,_ as L}from"./index-CEB1cax2.js";import{_ as J}from"./promotions-CHOaNVAi.js";import{B as U,F as K}from"./Breadcrumb-BRL5_iup.js";import{P as X}from"./ProductCard-DC8qxQDp.js";import"./FavoriteButton-CvBh6js5.js";function Y(s){return j({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"polyline",attr:{points:"15 18 9 12 15 6"},child:[]}]})(s)}function ee(s){return j({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"polyline",attr:{points:"9 18 15 12 9 6"},child:[]}]})(s)}function te(s){return j({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"circle",attr:{cx:"11",cy:"11",r:"8"},child:[]},{tag:"line",attr:{x1:"21",y1:"21",x2:"16.65",y2:"16.65"},child:[]},{tag:"line",attr:{x1:"11",y1:"8",x2:"11",y2:"14"},child:[]},{tag:"line",attr:{x1:"8",y1:"11",x2:"14",y2:"11"},child:[]}]})(s)}function ae(s){return j({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"circle",attr:{cx:"11",cy:"11",r:"8"},child:[]},{tag:"line",attr:{x1:"21",y1:"21",x2:"16.65",y2:"16.65"},child:[]},{tag:"line",attr:{x1:"8",y1:"11",x2:"14",y2:"11"},child:[]}]})(s)}const se=n.lazy(()=>L(()=>import("./ProductSpecifications-B9nMrldC.js"),__vite__mapDeps([0,1,2]))),re=n.lazy(()=>L(()=>import("./ProductDocuments-D7g8Bdus.js"),__vite__mapDeps([3,1,2]))),I=()=>e.jsx("div",{className:"flex justify-center items-center p-8",children:e.jsx("div",{className:"animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"})}),ie=({images:s})=>{const[o,p]=n.useState(0),[c,b]=n.useState(!1),y=()=>{p(u=>(u+1)%s.length)},g=()=>{p(u=>(u-1+s.length)%s.length)},m=()=>{b(!c)};return e.jsxs("div",{className:"relative w-full aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden",children:[e.jsx(_,{mode:"wait",children:e.jsx(d.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.3},className:`relative w-full h-full ${c?"cursor-zoom-out":"cursor-zoom-in"}`,onClick:m,children:e.jsx("img",{src:s[o],alt:`Product view ${o+1}`,className:`w-full h-full object-contain transition-transform duration-300 ${c?"scale-150":"scale-100"}`})},o)}),e.jsx("button",{onClick:g,className:"absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all","aria-label":"Image précédente",children:e.jsx(Y,{className:"w-6 h-6 text-gray-800"})}),e.jsx("button",{onClick:y,className:"absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all","aria-label":"Image suivante",children:e.jsx(ee,{className:"w-6 h-6 text-gray-800"})}),e.jsx("button",{onClick:m,className:"absolute bottom-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all","aria-label":c?"Dézoomer":"Zoomer",children:c?e.jsx(ae,{className:"w-6 h-6 text-gray-800"}):e.jsx(te,{className:"w-6 h-6 text-gray-800"})}),e.jsx("div",{className:"absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 bg-white/80 rounded-full",children:s.map((u,r)=>e.jsx("button",{onClick:()=>p(r),className:`w-2 h-2 rounded-full transition-all ${o===r?"bg-teal-600 scale-125":"bg-gray-400"}`,"aria-label":`Aller à l'image ${r+1}`},r))})]})},ne=({relatedProductIds:s})=>{const o=n.useRef(null),[p,c]=n.useState(!1),[b,y]=n.useState(!0),g=R.filter(r=>s.includes(r.id)),m=()=>{if(!o.current)return;const{scrollLeft:r,scrollWidth:x,clientWidth:t}=o.current;c(r>0),y(r<x-t-5)};n.useEffect(()=>(m(),window.addEventListener("resize",m),()=>window.removeEventListener("resize",m)),[]);const u=r=>{if(!o.current)return;const x=320,t=o.current.scrollLeft;o.current.scrollTo({left:r==="left"?t-x:t+x,behavior:"smooth"}),setTimeout(m,350)};return g.length===0?null:e.jsxs("div",{className:"relative bg-white rounded-2xl p-6 shadow-lg mb-8",children:[e.jsx("h2",{className:"text-xl font-bold text-gray-900 mb-6",children:"Produits similaires"}),p&&e.jsx("button",{onClick:()=>u("left"),className:"absolute left-2 top-1/2 z-10 bg-white rounded-full shadow-lg p-3 transform -translate-y-1/2","aria-label":"Voir produits précédents",children:e.jsx(D,{className:"text-gray-800 w-4 h-4"})}),b&&e.jsx("button",{onClick:()=>u("right"),className:"absolute right-2 top-1/2 z-10 bg-white rounded-full shadow-lg p-3 transform -translate-y-1/2","aria-label":"Voir produits suivants",children:e.jsx(V,{className:"text-gray-800 w-4 h-4"})}),e.jsx("div",{ref:o,className:"flex overflow-x-auto gap-4 pb-4 scrollbar-hide scroll-smooth",onScroll:m,children:g.map(r=>e.jsx("div",{className:"flex-shrink-0 w-[280px]",children:e.jsx(X,{product:r})},r.id))})]})},ue=()=>{var C,F,S,P;const{id:s}=H(),o=M(),{addToCart:p,isInCart:c}=Q(),{addToFavorites:b,removeFromFavorites:y,isFavorite:g}=W(),[m,u]=n.useState(null),[r,x]=n.useState(1),[t,k]=n.useState(null),[f,v]=n.useState("description"),[$,E]=n.useState(!0),l=R.find(i=>i.id===s);n.useEffect(()=>{const i=setTimeout(()=>{E(!1)},500);return()=>clearTimeout(i)},[s]),n.useEffect(()=>{if(!l){const h=Object.assign({"../data/promotions.ts":J}),{promotions:w}=h["../data/promotions.ts"],a=w==null?void 0:w.find(N=>N.id===s);if(a){const N={id:a.id,name:a.title,description:a.description,longDescription:a.description,image:a.image,category:{id:a.category,name:a.category},brand:{id:a.brand,name:a.brand,logo:`/brands/${a.brand}.png`},price:a.discountPrice,inStock:a.inStock,model:`MOD-${a.id}`,reference:`REF-${a.id}`,specifications:[{key:"Catégorie",value:a.category},{key:"Sous-catégorie",value:a.subcategory},{key:"Marque",value:a.brand},{key:"Code promo",value:a.code},{key:"Disponibilité",value:a.inStock?"En stock":"Rupture de stock"},{key:"Remise",value:`${a.discountPercentage}%`}],documents:[{id:"doc1",name:`Fiche technique ${a.title}`,type:"fiche_technique",url:"/documents/fiche-technique.pdf"},{id:"doc2",name:"Manuel d'installation",type:"manuel",url:"/documents/manuel-installation.pdf"}],features:["Haute performance","Installation professionnelle","Garantie fabricant","Service après-vente"],relatedProducts:["1","2","3"],warranty:"2 ans pièces et main d'œuvre",dimensions:{height:100,width:60,depth:30,weight:50},energyClass:"A+",installationRequirements:"Installation par un professionnel certifié recommandée"};k(N);return}o("/nos-produits");return}const i={...l,name:l.title,longDescription:l.description,category:{id:l.category,name:l.category},brand:{id:l.brand,name:l.brand,logo:`/brands/${l.brand}.png`},model:`MOD-${l.id}`,reference:`REF-${l.id}`,specifications:[{key:"Catégorie",value:l.category},{key:"Sous-catégorie",value:l.subcategory},{key:"Marque",value:l.brand},{key:"Disponibilité",value:l.inStock?"En stock":"Rupture de stock"}],documents:[{id:"doc1",name:`Fiche technique ${l.title}`,type:"fiche_technique",url:"/documents/fiche-technique.pdf"},{id:"doc2",name:"Manuel d'installation",type:"manuel",url:"/documents/manuel-installation.pdf"}],features:["Haute performance","Installation professionnelle","Garantie fabricant","Service après-vente"],relatedProducts:["1","2","3"],warranty:"2 ans pièces et main d'œuvre",dimensions:{height:100,width:60,depth:30,weight:50},energyClass:"A+",installationRequirements:"Installation par un professionnel certifié recommandée"};k(i)},[s,o]);const q=i=>{const h=parseInt(i.target.value);h>0&&x(h)},T=()=>{x(i=>i+1)},A=()=>{r>1&&x(i=>i-1)},z=()=>{t&&p({id:t.id,name:t.name,price:t.price,image:t.image,quantity:r})},B=()=>{if(!t)return null;switch(f){case"description":return e.jsx(d.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},className:"prose max-w-none text-gray-600",children:t.longDescription.split(`
`).map((i,h)=>e.jsx("p",{className:"mb-4 leading-relaxed",children:i},h))});case"features":return e.jsx(d.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:t.features.map((i,h)=>e.jsxs(d.div,{whileHover:{scale:1.02},className:"flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200",children:[e.jsx("div",{className:"w-2 h-2 bg-teal-500 rounded-full mr-3"}),e.jsx("span",{className:"text-gray-700",children:i})]},h))});case"specs":return e.jsx(n.Suspense,{fallback:e.jsx(I,{}),children:e.jsx(se,{specifications:t.specifications})});case"documents":return e.jsx(n.Suspense,{fallback:e.jsx(I,{}),children:e.jsx(re,{documents:t.documents})});default:return null}};return $||!t?e.jsx("div",{className:"min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center",children:e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-600 mx-auto"}),e.jsx("p",{className:"mt-4 text-gray-600",children:"Chargement du produit..."})]})}):e.jsxs("div",{className:"min-h-screen bg-gradient-to-br from-gray-50 to-white",children:[e.jsx(U,{}),e.jsx(d.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"container mx-auto px-4 py-8 md:py-12",children:e.jsxs("div",{className:"max-w-7xl mx-auto",children:[e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16",children:[e.jsx(d.div,{initial:{opacity:0,x:-20},animate:{opacity:1,x:0},className:"space-y-4 md:space-y-8",children:e.jsx("div",{className:"w-full max-w-2xl mx-auto",children:e.jsx(ie,{images:[t.image,t.image,t.image,t.image]})})}),e.jsxs(d.div,{initial:{opacity:0,x:20},animate:{opacity:1,x:0},className:"bg-white rounded-2xl p-6 md:p-8 shadow-lg space-y-6",children:[e.jsxs("div",{className:"space-y-4",children:[e.jsx("h1",{className:"text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900",children:t.name}),e.jsxs("div",{className:"flex flex-wrap items-center gap-3 md:gap-6 text-sm",children:[e.jsxs("div",{className:"flex items-center text-gray-600",children:[e.jsx("span",{className:"font-medium",children:"RÉF:"}),e.jsx("span",{className:"ml-2",children:t.reference})]}),e.jsxs("div",{className:"flex items-center text-gray-600",children:[e.jsx("span",{className:"font-medium",children:"MARQUE:"}),e.jsx("span",{className:"ml-2 text-[#007FFF]",children:t.brand.name})]})]})]}),e.jsx("div",{children:e.jsx("p",{className:"text-base md:text-lg text-gray-600 leading-relaxed",children:t.description})}),e.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-4 py-4 border-t border-gray-100",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"text-2xl md:text-4xl font-bold text-gray-900",children:[t.price.toFixed(2)," €"]}),e.jsx("div",{className:"text-xs md:text-sm text-gray-500 mt-1",children:"Prix HT"})]}),e.jsx(d.div,{whileHover:{scale:1.05},children:e.jsxs("span",{className:`inline-flex items-center px-4 md:px-6 py-1 md:py-2 rounded-full text-xs md:text-sm font-medium ${t.inStock?"bg-green-100 text-green-800":"bg-red-100 text-red-800"}`,children:[e.jsx("span",{className:`w-2 h-2 rounded-full mr-2 ${t.inStock?"bg-green-500":"bg-red-500"}`}),t.inStock?"En stock":"Rupture de stock"]})})]}),e.jsxs("div",{className:"space-y-4 py-4 border-t border-gray-100",children:[e.jsx("div",{className:"flex items-center space-x-4",children:e.jsxs("div",{className:"flex-1",children:[e.jsx("label",{htmlFor:"quantity",className:"block text-sm font-medium text-gray-700 mb-2",children:"Quantité"}),e.jsxs("div",{className:"flex border border-gray-300 rounded-xl overflow-hidden",children:[e.jsx("button",{onClick:A,className:"px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors","aria-label":"Diminuer la quantité",children:"-"}),e.jsx("input",{type:"number",id:"quantity",min:"1",value:r,onChange:i=>q(i),className:"block w-full border-0 focus:ring-0 text-center text-lg py-2"}),e.jsx("button",{onClick:T,className:"px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors","aria-label":"Augmenter la quantité",children:"+"})]})]})}),e.jsxs(d.button,{whileHover:{scale:1.02},whileTap:{scale:.98},onClick:z,disabled:!t.inStock,className:`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all ${t.inStock?c(t.id)?"bg-green-500 hover:bg-green-600":"bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] hover:from-[#007FFF] hover:to-[#0056b3]":"bg-gray-300 cursor-not-allowed"}`,children:[e.jsx(O,{className:"w-5 h-5"}),e.jsx("span",{className:"text-base md:text-lg",children:t.inStock?c(t.id)?"Dans le panier":"Ajouter au panier":"Produit indisponible"})]})]}),e.jsxs("div",{className:"flex flex-wrap gap-6 py-4 border-t border-gray-100",children:[e.jsxs("div",{className:"flex items-center",children:[e.jsx("div",{className:"w-8 h-8 bg-gradient-to-br from-[#7CB9E8] to-[#007FFF] rounded-lg flex items-center justify-center mr-3 shadow-sm",children:e.jsx(Z,{className:"w-4 h-4 text-white"})}),e.jsxs("div",{children:[e.jsx("div",{className:"text-[10px] uppercase tracking-wider text-gray-400",children:"Dimensions"}),e.jsxs("div",{className:"text-sm font-medium",children:[(C=t.dimensions)==null?void 0:C.height,"×",(F=t.dimensions)==null?void 0:F.width,"×",(S=t.dimensions)==null?void 0:S.depth," cm"]})]})]}),e.jsxs("div",{className:"flex items-center",children:[e.jsx("div",{className:"w-8 h-8 bg-gradient-to-br from-[#7CB9E8] to-[#007FFF] rounded-lg flex items-center justify-center mr-3 shadow-sm",children:e.jsx(G,{className:"w-4 h-4 text-white"})}),e.jsxs("div",{children:[e.jsx("div",{className:"text-[10px] uppercase tracking-wider text-gray-400",children:"Poids"}),e.jsxs("div",{className:"text-sm font-medium",children:[(P=t.dimensions)==null?void 0:P.weight," kg"]})]})]})]})]})]}),e.jsx("div",{className:"mt-12 md:mt-16",children:e.jsxs("div",{className:"bg-white rounded-t-2xl shadow-md",children:[e.jsxs("div",{className:"flex overflow-x-auto scrollbar-hide border-b border-gray-100",children:[e.jsx("button",{onClick:()=>v("description"),className:`px-6 py-4 text-sm md:text-base font-medium whitespace-nowrap transition-colors duration-200 ${f==="description"?"text-teal-600 border-b-2 border-teal-600":"text-gray-500 hover:text-gray-700"}`,children:"Description détaillée"}),e.jsx("button",{onClick:()=>v("features"),className:`px-6 py-4 text-sm md:text-base font-medium whitespace-nowrap transition-colors duration-200 ${f==="features"?"text-teal-600 border-b-2 border-teal-600":"text-gray-500 hover:text-gray-700"}`,children:"Caractéristiques"}),e.jsx("button",{onClick:()=>v("specs"),className:`px-6 py-4 text-sm md:text-base font-medium whitespace-nowrap transition-colors duration-200 ${f==="specs"?"text-teal-600 border-b-2 border-teal-600":"text-gray-500 hover:text-gray-700"}`,children:"Spécifications"}),e.jsx("button",{onClick:()=>v("documents"),className:`px-6 py-4 text-sm md:text-base font-medium whitespace-nowrap transition-colors duration-200 ${f==="documents"?"text-teal-600 border-b-2 border-teal-600":"text-gray-500 hover:text-gray-700"}`,children:"Documents"})]}),e.jsx("div",{className:"p-6 md:p-8",children:e.jsx(_,{mode:"wait",children:B()})})]})}),e.jsx("div",{className:"mt-12 md:mt-16",children:(t.relatedProducts??[]).length>0&&e.jsx(ne,{relatedProductIds:t.relatedProducts??[]})}),e.jsx("div",{className:"fixed bottom-8 left-8 z-50",children:e.jsx(d.button,{whileHover:{scale:1.1},whileTap:{scale:.9},onClick:()=>o(-1),className:"bg-teal-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center","aria-label":"Retour à la page précédente",children:e.jsx(D,{})})})]})}),e.jsx(K,{})]})};export{ue as default};
