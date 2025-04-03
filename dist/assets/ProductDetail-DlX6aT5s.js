const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/ProductSpecifications-CHVvUEty.js","assets/index-2311aXp4.js","assets/index-BGnIRpcv.css","assets/ProductDocuments--eLrbZSW.js"])))=>i.map(i=>d[i]);
import{G as v,N as T,B as z,u as H,o as B,r as n,p as C,j as e,E as c,O,K as M,F as Q,P as W,Q as Z,R as F,H as P,S as G,_ as R}from"./index-2311aXp4.js";import{_ as V}from"./promotions-CHOaNVAi.js";import{S as K,B as U,F as J}from"./Breadcrumb-tP_Dv3le.js";import{P as X}from"./ProductCard-BAfZ7-_9.js";import"./FavoriteButton-sdGEgmhH.js";function Y(a){return v({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"polyline",attr:{points:"15 18 9 12 15 6"},child:[]}]})(a)}function ee(a){return v({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"polyline",attr:{points:"9 18 15 12 9 6"},child:[]}]})(a)}function te(a){return v({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"circle",attr:{cx:"11",cy:"11",r:"8"},child:[]},{tag:"line",attr:{x1:"21",y1:"21",x2:"16.65",y2:"16.65"},child:[]},{tag:"line",attr:{x1:"11",y1:"8",x2:"11",y2:"14"},child:[]},{tag:"line",attr:{x1:"8",y1:"11",x2:"14",y2:"11"},child:[]}]})(a)}function ae(a){return v({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"circle",attr:{cx:"11",cy:"11",r:"8"},child:[]},{tag:"line",attr:{x1:"21",y1:"21",x2:"16.65",y2:"16.65"},child:[]},{tag:"line",attr:{x1:"8",y1:"11",x2:"14",y2:"11"},child:[]}]})(a)}const se=n.lazy(()=>R(()=>import("./ProductSpecifications-CHVvUEty.js"),__vite__mapDeps([0,1,2]))),re=n.lazy(()=>R(()=>import("./ProductDocuments--eLrbZSW.js"),__vite__mapDeps([3,1,2]))),S=()=>e.jsx("div",{className:"flex justify-center items-center p-8",children:e.jsx("div",{className:"animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"})}),ie=({images:a})=>{const[l,g]=n.useState(0),[o,f]=n.useState(!1),b=()=>{g(x=>(x+1)%a.length)},u=()=>{g(x=>(x-1+a.length)%a.length)},m=()=>{f(!o)};return e.jsxs("div",{className:"relative w-full aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden",children:[e.jsx(F,{mode:"wait",children:e.jsx(c.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.3},className:`relative w-full h-full ${o?"cursor-zoom-out":"cursor-zoom-in"}`,onClick:m,children:e.jsx("img",{src:a[l],alt:`Product view ${l+1}`,className:`w-full h-full object-contain transition-transform duration-300 ${o?"scale-150":"scale-100"}`})},l)}),e.jsx("button",{onClick:u,className:"absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all","aria-label":"Image précédente",children:e.jsx(Y,{className:"w-6 h-6 text-gray-800"})}),e.jsx("button",{onClick:b,className:"absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all","aria-label":"Image suivante",children:e.jsx(ee,{className:"w-6 h-6 text-gray-800"})}),e.jsx("button",{onClick:m,className:"absolute bottom-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all","aria-label":o?"Dézoomer":"Zoomer",children:o?e.jsx(ae,{className:"w-6 h-6 text-gray-800"}):e.jsx(te,{className:"w-6 h-6 text-gray-800"})}),e.jsx("div",{className:"absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 bg-white/80 rounded-full",children:a.map((x,r)=>e.jsx("button",{onClick:()=>g(r),className:`w-2 h-2 rounded-full transition-all ${l===r?"bg-teal-600 scale-125":"bg-gray-400"}`,"aria-label":`Aller à l'image ${r+1}`},r))})]})},ne=({relatedProductIds:a})=>{const l=n.useRef(null),[g,o]=n.useState(!1),[f,b]=n.useState(!0),u=C.filter(r=>a.includes(r.id)),m=()=>{if(!l.current)return;const{scrollLeft:r,scrollWidth:h,clientWidth:t}=l.current;o(r>0),b(r<h-t-5)};n.useEffect(()=>(m(),window.addEventListener("resize",m),()=>window.removeEventListener("resize",m)),[]);const x=r=>{if(!l.current)return;const h=320,t=l.current.scrollLeft;l.current.scrollTo({left:r==="left"?t-h:t+h,behavior:"smooth"}),setTimeout(m,350)};return u.length===0?null:e.jsxs("div",{className:"relative bg-white rounded-2xl p-6 shadow-lg mb-8",children:[e.jsx("h2",{className:"text-xl font-bold text-gray-900 mb-6",children:"Produits similaires"}),g&&e.jsx("button",{onClick:()=>x("left"),className:"absolute left-2 top-1/2 z-10 bg-white rounded-full shadow-lg p-3 transform -translate-y-1/2","aria-label":"Voir produits précédents",children:e.jsx(P,{className:"text-gray-800 w-4 h-4"})}),f&&e.jsx("button",{onClick:()=>x("right"),className:"absolute right-2 top-1/2 z-10 bg-white rounded-full shadow-lg p-3 transform -translate-y-1/2","aria-label":"Voir produits suivants",children:e.jsx(G,{className:"text-gray-800 w-4 h-4"})}),e.jsx("div",{ref:l,className:"flex overflow-x-auto gap-4 pb-4 scrollbar-hide scroll-smooth",onScroll:m,children:u.map(r=>e.jsx("div",{className:"flex-shrink-0 w-[280px]",children:e.jsx(X,{product:r})},r.id))})]})},ue=()=>{const{id:a}=T(),l=z(),{addToCart:g,isInCart:o}=H(),{addToFavorites:f,removeFromFavorites:b,isFavorite:u}=B(),[m,x]=n.useState(null),[r,h]=n.useState(1),[t,k]=n.useState(null),[y,j]=n.useState("description"),[I,_]=n.useState(!0),d=C.find(i=>i.id===a);n.useEffect(()=>{const i=setTimeout(()=>{_(!1)},500);return()=>clearTimeout(i)},[a]),n.useEffect(()=>{if(!d){const p=Object.assign({"../data/promotions.ts":V}),{promotions:w}=p["../data/promotions.ts"],s=w==null?void 0:w.find(N=>N.id===a);if(s){const N={id:s.id,name:s.title,description:s.description,longDescription:s.description,image:s.image,category:s.category,subcategory:s.subcategory,brand:s.brand,price:s.discountPrice,inStock:s.inStock,model:`MOD-${s.id}`,reference:`REF-${s.id}`,specifications:[{key:"Catégorie",value:s.category},{key:"Sous-catégorie",value:s.subcategory},{key:"Marque",value:s.brand},{key:"Code promo",value:s.code},{key:"Disponibilité",value:s.inStock?"En stock":"Rupture de stock"},{key:"Remise",value:`${s.discountPercentage}%`}],documents:[{id:"doc1",name:`Fiche technique ${s.title}`,type:"fiche_technique",url:"/documents/fiche-technique.pdf"},{id:"doc2",name:"Manuel d'installation",type:"manuel",url:"/documents/manuel-installation.pdf"}],features:["Haute performance","Installation professionnelle","Garantie fabricant","Service après-vente"],relatedProducts:["1","2","3"],warranty:"2 ans pièces et main d'œuvre",dimensions:{height:100,width:60,depth:30,weight:50},energyClass:"A+",installationRequirements:"Installation par un professionnel certifié recommandée"};k(N);return}l("/nos-produits");return}const i={...d,name:d.title,longDescription:d.description,model:`MOD-${d.id}`,reference:`REF-${d.id}`,specifications:[{key:"Catégorie",value:d.category},{key:"Sous-catégorie",value:d.subcategory},{key:"Marque",value:d.brand},{key:"Disponibilité",value:d.inStock?"En stock":"Rupture de stock"}],documents:[{id:"doc1",name:`Fiche technique ${d.title}`,type:"fiche_technique",url:"/documents/fiche-technique.pdf"},{id:"doc2",name:"Manuel d'installation",type:"manuel",url:"/documents/manuel-installation.pdf"}],features:["Haute performance","Installation professionnelle","Garantie fabricant","Service après-vente"],relatedProducts:["1","2","3"],warranty:"2 ans pièces et main d'œuvre",dimensions:{height:100,width:60,depth:30,weight:50},energyClass:"A+",installationRequirements:"Installation par un professionnel certifié recommandée"};k(i)},[a,l]);const $=i=>{const p=parseInt(i.target.value);p>0&&h(p)},D=()=>{h(i=>i+1)},L=()=>{r>1&&h(i=>i-1)},q=()=>{t&&g({id:t.id,name:t.name,price:t.price,image:t.image,quantity:r})},E=()=>{if(t)if(u(t.id))b(t.id);else{const i={id:t.id,title:t.name,description:t.description,image:t.image,category:t.category,subcategory:t.subcategory,brand:t.brand,price:t.price,inStock:t.inStock};f(i,"product")}},A=()=>{if(!t)return null;switch(y){case"description":return e.jsx(c.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},className:"prose max-w-none text-gray-600",children:t.longDescription.split(`
`).map((i,p)=>e.jsx("p",{className:"mb-4 leading-relaxed",children:i},p))});case"features":return e.jsx(c.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:t.features.map((i,p)=>e.jsxs(c.div,{whileHover:{scale:1.02},className:"flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200",children:[e.jsx("div",{className:"w-2 h-2 bg-teal-500 rounded-full mr-3"}),e.jsx("span",{className:"text-gray-700",children:i})]},p))});case"specs":return e.jsx(n.Suspense,{fallback:e.jsx(S,{}),children:e.jsx(se,{specifications:t.specifications})});case"documents":return e.jsx(n.Suspense,{fallback:e.jsx(S,{}),children:e.jsx(re,{documents:t.documents})});default:return null}};return I||!t?e.jsx("div",{className:"min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center",children:e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-600 mx-auto"}),e.jsx("p",{className:"mt-4 text-gray-600",children:"Chargement du produit..."})]})}):e.jsxs("div",{className:"min-h-screen bg-gradient-to-br from-gray-50 to-white",children:[e.jsx(K,{showOnPages:[`/nos-produits/${a}`,`/produit/${a}`]}),e.jsx(U,{}),e.jsx(c.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"container mx-auto px-4 py-8 md:py-12",children:e.jsxs("div",{className:"max-w-7xl mx-auto",children:[e.jsxs(c.div,{initial:{opacity:0},animate:{opacity:1},className:"mb-6 md:mb-8",children:[e.jsxs("div",{className:"flex flex-wrap items-center text-sm text-gray-500 mb-3 md:mb-4",children:[e.jsx("span",{children:t.category}),e.jsx(O,{className:"mx-2 w-3 h-3"}),e.jsx("span",{children:t.subcategory})]}),e.jsx("h1",{className:"text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2",children:t.name}),e.jsxs("div",{className:"flex flex-wrap items-center gap-3 md:gap-6 text-sm",children:[e.jsxs("div",{className:"flex items-center text-gray-600",children:[e.jsx("span",{className:"font-medium",children:"RÉF:"}),e.jsx("span",{className:"ml-2",children:t.reference})]}),e.jsxs("div",{className:"flex items-center text-gray-600",children:[e.jsx("span",{className:"font-medium",children:"MARQUE:"}),e.jsx("span",{className:"ml-2 text-teal-600",children:t.brand})]})]})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16",children:[e.jsx(c.div,{initial:{opacity:0,x:-20},animate:{opacity:1,x:0},className:"space-y-4 md:space-y-8",children:e.jsx("div",{className:"w-full max-w-2xl mx-auto",children:e.jsx(ie,{images:[t.image,t.image,t.image,t.image]})})}),e.jsxs(c.div,{initial:{opacity:0,x:20},animate:{opacity:1,x:0},className:"space-y-6 md:space-y-8",children:[e.jsx("div",{className:"bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg",children:e.jsx("p",{className:"text-base md:text-lg text-gray-600 leading-relaxed",children:t.description})}),e.jsx("div",{className:"bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg",children:e.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-4",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"text-2xl md:text-4xl font-bold text-gray-900",children:[t.price.toFixed(2)," €"]}),e.jsx("div",{className:"text-xs md:text-sm text-gray-500 mt-1",children:"Prix HT"})]}),e.jsx(c.div,{whileHover:{scale:1.05},children:e.jsxs("span",{className:`inline-flex items-center px-4 md:px-6 py-1 md:py-2 rounded-full text-xs md:text-sm font-medium ${t.inStock?"bg-green-100 text-green-800":"bg-red-100 text-red-800"}`,children:[e.jsx("span",{className:`w-2 h-2 rounded-full mr-2 ${t.inStock?"bg-green-500":"bg-red-500"}`}),t.inStock?"En stock":"Rupture de stock"]})})]})}),e.jsxs("div",{className:"bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg space-y-6",children:[e.jsxs("div",{className:"flex items-center space-x-4",children:[e.jsxs("div",{className:"flex-1",children:[e.jsx("label",{htmlFor:"quantity",className:"block text-sm font-medium text-gray-700 mb-2",children:"Quantité"}),e.jsxs("div",{className:"flex border border-gray-300 rounded-xl overflow-hidden",children:[e.jsx("button",{onClick:L,className:"px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors","aria-label":"Diminuer la quantité",children:"-"}),e.jsx("input",{type:"number",id:"quantity",min:"1",value:r,onChange:$,className:"block w-full border-0 focus:ring-0 text-center text-lg py-2"}),e.jsx("button",{onClick:D,className:"px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors","aria-label":"Augmenter la quantité",children:"+"})]})]}),e.jsx(c.button,{whileHover:{scale:1.05},whileTap:{scale:.95},onClick:E,className:`p-3 md:p-4 rounded-xl md:rounded-2xl transition-colors duration-200 ${u(t.id)?"bg-red-50 text-red-600 hover:bg-red-100":"bg-gray-50 text-gray-400 hover:bg-gray-100"}`,"aria-label":u(t.id)?"Retirer des favoris":"Ajouter aux favoris",children:e.jsx(M,{className:"w-5 h-5 md:w-6 md:h-6"})})]}),e.jsxs(c.button,{whileHover:{scale:1.02},whileTap:{scale:.98},onClick:q,disabled:!t.inStock||o(t.id),className:`w-full flex items-center justify-center space-x-3 px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl text-white font-medium transition-all duration-200 ${t.inStock?o(t.id)?"bg-green-600 hover:bg-green-700":"bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg hover:shadow-xl":"bg-gray-300 cursor-not-allowed"}`,"aria-label":t.inStock?o(t.id)?"Déjà dans le panier":"Ajouter au panier":"Produit indisponible",children:[e.jsx(Q,{className:"w-5 h-5 md:w-6 md:h-6"}),e.jsx("span",{className:"text-base md:text-lg",children:t.inStock?o(t.id)?"Dans le panier":"Ajouter au panier":"Produit indisponible"})]})]}),e.jsxs("div",{className:"bg-white rounded-2xl md:rounded-3xl p-6 md:p-7 shadow-lg",children:[e.jsx("h3",{className:"text-sm font-medium text-gray-500 mb-4",children:"Caractéristiques techniques"}),e.jsxs("div",{className:"flex flex-wrap gap-6",children:[e.jsxs("div",{className:"flex items-center",children:[e.jsx("div",{className:"w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-500 rounded-lg flex items-center justify-center mr-3 shadow-sm",children:e.jsx(W,{className:"w-4 h-4 text-white"})}),e.jsxs("div",{children:[e.jsx("div",{className:"text-[10px] uppercase tracking-wider text-gray-400",children:"Dimensions"}),e.jsxs("div",{className:"text-sm font-medium",children:[t.dimensions.height,"×",t.dimensions.width,"×",t.dimensions.depth," cm"]})]})]}),e.jsxs("div",{className:"flex items-center",children:[e.jsx("div",{className:"w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-500 rounded-lg flex items-center justify-center mr-3 shadow-sm",children:e.jsx(Z,{className:"w-4 h-4 text-white"})}),e.jsxs("div",{children:[e.jsx("div",{className:"text-[10px] uppercase tracking-wider text-gray-400",children:"Poids"}),e.jsxs("div",{className:"text-sm font-medium",children:[t.dimensions.weight," kg"]})]})]})]})]})]})]}),e.jsx("div",{className:"mt-12 md:mt-16",children:e.jsxs("div",{className:"bg-white rounded-t-2xl shadow-md",children:[e.jsxs("div",{className:"flex overflow-x-auto scrollbar-hide border-b border-gray-100",children:[e.jsx("button",{onClick:()=>j("description"),className:`px-6 py-4 text-sm md:text-base font-medium whitespace-nowrap transition-colors duration-200 ${y==="description"?"text-teal-600 border-b-2 border-teal-600":"text-gray-500 hover:text-gray-700"}`,children:"Description détaillée"}),e.jsx("button",{onClick:()=>j("features"),className:`px-6 py-4 text-sm md:text-base font-medium whitespace-nowrap transition-colors duration-200 ${y==="features"?"text-teal-600 border-b-2 border-teal-600":"text-gray-500 hover:text-gray-700"}`,children:"Caractéristiques"}),e.jsx("button",{onClick:()=>j("specs"),className:`px-6 py-4 text-sm md:text-base font-medium whitespace-nowrap transition-colors duration-200 ${y==="specs"?"text-teal-600 border-b-2 border-teal-600":"text-gray-500 hover:text-gray-700"}`,children:"Spécifications"}),e.jsx("button",{onClick:()=>j("documents"),className:`px-6 py-4 text-sm md:text-base font-medium whitespace-nowrap transition-colors duration-200 ${y==="documents"?"text-teal-600 border-b-2 border-teal-600":"text-gray-500 hover:text-gray-700"}`,children:"Documents"})]}),e.jsx("div",{className:"p-6 md:p-8",children:e.jsx(F,{mode:"wait",children:A()})})]})}),e.jsx("div",{className:"mt-12 md:mt-16",children:t.relatedProducts.length>0&&e.jsx(ne,{relatedProductIds:t.relatedProducts})}),e.jsx("div",{className:"fixed bottom-8 left-8 z-50",children:e.jsx(c.button,{whileHover:{scale:1.1},whileTap:{scale:.9},onClick:()=>l(-1),className:"bg-teal-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center","aria-label":"Retour à la page précédente",children:e.jsx(P,{})})})]})}),e.jsx(J,{})]})};export{ue as default};
