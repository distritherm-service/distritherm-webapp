import{u as w,j as e,r as g,O as k,F as E,L as C,V as A,W as V,H as q,p as P,X as U,S as H,I as M,Y as z,b as F,M as $,Z as B,C as I,$ as G,a0 as O,a1 as J,a2 as W,a3 as K,J as Q}from"./index-lICg0_8z.js";import{B as S,F as T}from"./Breadcrumb-xcL7W6ju.js";import{S as R}from"./Slider-BphwLHNT.js";import{B as L}from"./BrandsSection-C0EDbLBq.js";import _ from"./Connexion-X3UnOBxS.js";import"./Layout-CEXniyLP.js";const X=({number:l,title:r,isActive:d,isCompleted:a,isDisabled:u,onClick:t})=>{let n="relative flex-1 py-3 sm:py-4 px-2 sm:px-4 text-center transition-all duration-200 text-xs sm:text-sm md:text-base",c="absolute bottom-0 left-0 w-full h-0.5 transition-all duration-200";d?(n+=" bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 font-medium shadow-sm",c+=" bg-blue-600"):a?(n+=" bg-gradient-to-br from-green-50 to-green-100 text-gray-800 font-medium cursor-pointer hover:from-green-100 hover:to-green-200",c+=" bg-green-500"):u?(n+=" bg-gray-50 text-gray-400 cursor-not-allowed",c+=" bg-gray-200"):(n+=" bg-white text-gray-700 cursor-pointer hover:bg-blue-50 hover:text-blue-600",c+=" bg-gray-200");const h=r==="Récapitulatif"?"Panier":r==="Connexion"?"Connexion":r==="Livraison"?"Livraison":r==="Confirmation"?"Paiement":r;return e.jsxs("button",{className:n,onClick:t,disabled:u,children:[e.jsxs("div",{className:"relative z-10",children:[e.jsxs("span",{className:"hidden md:inline font-medium text-inherit",children:[l,". "]}),e.jsx("span",{className:"hidden sm:inline",children:r}),e.jsx("span",{className:"sm:hidden",children:h})]}),e.jsx("div",{className:c})]})},Y=({activeTab:l,onChangeTab:r})=>{const{cart:d}=w(),a=d.length===0,u=[{number:"01",title:"Récapitulatif",path:"recap"},{number:"02",title:"Connexion",path:"login"},{number:"03",title:"Livraison",path:"delivery"},{number:"04",title:"Confirmation",path:"confirmation"}],t=n=>a&&n>0?!0:n>l+1,m=n=>n<l;return e.jsx("div",{className:"bg-white rounded-xl shadow-md mb-6 overflow-hidden",children:e.jsx("div",{className:"flex divide-x divide-gray-100",children:u.map((n,c)=>e.jsx(X,{number:n.number,title:n.title,isActive:l===c,isCompleted:m(c),isDisabled:t(c),onClick:()=>{t(c)||r(c)}},n.number))})})},Z=({productId:l,isOpen:r,onClose:d})=>{if(!r)return null;const a=P.find(t=>t.id===l);if(!a)return null;const u=t=>{t.target===t.currentTarget&&d()};return U.useEffect(()=>{const t=m=>{m.key==="Escape"&&d()};return document.addEventListener("keydown",t),()=>{document.removeEventListener("keydown",t)}},[d]),e.jsx(H,{children:r&&e.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm overflow-y-auto",onClick:u,children:e.jsxs(M.div,{initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.9},transition:{type:"spring",damping:20,stiffness:300},className:"bg-white rounded-2xl overflow-hidden w-full max-w-4xl my-2 sm:my-4 max-h-[95vh] sm:max-h-[90vh] flex flex-col shadow-2xl",onClick:t=>t.stopPropagation(),children:[e.jsxs("div",{className:"p-3 sm:p-5 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-teal-50",children:[e.jsx("h3",{className:"text-lg sm:text-2xl font-bold text-gray-800 line-clamp-2",children:a.title}),e.jsx("button",{onClick:d,className:"w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none flex-shrink-0 ml-2",children:e.jsx(z,{className:"w-4 h-4"})})]}),e.jsx("div",{className:"overflow-y-auto p-3 sm:p-6 flex-grow",children:e.jsxs("div",{className:"flex flex-col md:flex-row gap-4 sm:gap-8",children:[e.jsxs("div",{className:"md:w-1/2",children:[e.jsx("div",{className:"bg-gray-50 p-3 sm:p-6 rounded-xl flex items-center justify-center",children:e.jsx("img",{src:a.image,alt:a.title,className:"w-full h-auto object-contain rounded-lg shadow-md transform transition-transform hover:scale-105 duration-300"})}),e.jsxs("div",{className:"mt-4 sm:mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4",children:[e.jsxs("span",{className:`inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${a.inStock?"bg-green-100 text-green-800":"bg-red-100 text-red-800"}`,children:[e.jsx("span",{className:`w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full mr-1.5 sm:mr-2 ${a.inStock?"bg-green-500":"bg-red-500"}`}),a.inStock?"En stock":"Rupture de stock"]}),e.jsxs("div",{className:"text-xs sm:text-sm text-gray-500",children:["Réf: ",a.id]})]})]}),e.jsxs("div",{className:"md:w-1/2 space-y-4 sm:space-y-6",children:[e.jsxs("div",{className:"bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-100",children:[e.jsx("h4",{className:"text-xs sm:text-sm font-medium text-gray-500 uppercase mb-2",children:"Prix"}),e.jsxs("div",{className:"flex items-end gap-2",children:[e.jsx("p",{className:"text-2xl sm:text-3xl font-bold text-gray-900",children:a.price.toLocaleString("fr-FR",{style:"currency",currency:"EUR"})}),e.jsx("p",{className:"text-xs sm:text-sm text-gray-500 mb-1",children:"TTC"})]}),e.jsxs("p",{className:"text-xs sm:text-sm text-gray-500 mt-1",children:["Prix HT: ",(a.price/1.2).toLocaleString("fr-FR",{style:"currency",currency:"EUR"})]})]}),e.jsxs("div",{className:"space-y-3 sm:space-y-4",children:[e.jsxs("div",{children:[e.jsxs("h4",{className:"text-xs sm:text-sm font-semibold text-gray-700 uppercase mb-2 flex items-center",children:[e.jsx("span",{className:"w-1 h-4 sm:h-5 bg-blue-500 rounded-full mr-2"}),"Catégorie"]}),e.jsxs("p",{className:"text-sm sm:text-base text-gray-800 pl-3 border-l-2 border-gray-200",children:[a.category," > ",a.subcategory]})]}),e.jsxs("div",{children:[e.jsxs("h4",{className:"text-xs sm:text-sm font-semibold text-gray-700 uppercase mb-2 flex items-center",children:[e.jsx("span",{className:"w-1 h-4 sm:h-5 bg-blue-500 rounded-full mr-2"}),"Marque"]}),e.jsx("p",{className:"text-sm sm:text-base text-gray-800 pl-3 border-l-2 border-gray-200",children:a.brand})]}),e.jsxs("div",{children:[e.jsxs("h4",{className:"text-xs sm:text-sm font-semibold text-gray-700 uppercase mb-2 flex items-center",children:[e.jsx("span",{className:"w-1 h-4 sm:h-5 bg-blue-500 rounded-full mr-2"}),"Description"]}),e.jsx("div",{className:"bg-white p-3 sm:p-4 rounded-lg border border-gray-100 shadow-sm",children:e.jsx("p",{className:"text-sm sm:text-base text-gray-700 leading-relaxed",children:a.description})})]})]})]})]})}),e.jsxs("div",{className:"p-3 sm:p-5 border-t border-gray-100 flex flex-col sm:flex-row gap-2 sm:gap-0 justify-end bg-gradient-to-r from-teal-50 to-blue-50",children:[e.jsx(C,{to:`/nos-produits/${a.id}`,className:"w-full sm:w-auto px-4 py-2 mr-0 sm:mr-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium text-center",children:"Voir page complète"}),e.jsx("button",{onClick:d,className:"w-full sm:w-auto px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-md hover:shadow-lg",children:"Fermer"})]})]})})})},D=()=>{const{cart:l,removeFromCart:r,updateQuantity:d,clearCart:a}=w(),[u,t]=g.useState(!1),[m,n]=g.useState(null),c=l.reduce((i,f)=>i+f.priceTTC*f.quantity,0),h=l.reduce((i,f)=>i+f.priceHT*f.quantity,0),x=c.toLocaleString("fr-FR",{style:"currency",currency:"EUR",minimumFractionDigits:2}),b=h.toLocaleString("fr-FR",{style:"currency",currency:"EUR",minimumFractionDigits:2}),p=(c-h).toLocaleString("fr-FR",{style:"currency",currency:"EUR",minimumFractionDigits:2}),s=(i,f)=>{f>=1&&d(i,f)},v=i=>{r(i)},N=()=>{a(),t(!1)},o=i=>{n(i)},y=()=>{n(null)};return e.jsxs("div",{className:"bg-white rounded-lg shadow-sm p-4 sm:p-6",children:[e.jsxs("div",{className:"flex justify-between items-center mb-4 sm:mb-6",children:[e.jsx("h3",{className:"text-lg sm:text-xl font-medium text-gray-900",children:"Articles dans votre panier"}),l.length>0&&e.jsxs("button",{onClick:()=>t(!0),className:"text-red-600 hover:text-red-800 text-sm sm:text-base flex items-center",children:[e.jsx(k,{className:"mr-1"}),e.jsx("span",{className:"hidden sm:inline",children:"Vider le panier"}),e.jsx("span",{className:"sm:hidden",children:"Vider"})]})]}),u&&e.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm",children:e.jsxs("div",{className:"bg-white rounded-xl p-5 max-w-md w-full shadow-xl",children:[e.jsx("h4",{className:"text-xl font-medium text-gray-900 mb-3",children:"Confirmer la suppression"}),e.jsx("p",{className:"text-gray-600 mb-5",children:"Êtes-vous sûr de vouloir vider votre panier ?"}),e.jsxs("div",{className:"flex space-x-3 justify-end",children:[e.jsx("button",{onClick:()=>t(!1),className:"px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium",children:"Annuler"}),e.jsx("button",{onClick:N,className:"px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium shadow-md",children:"Confirmer"})]})]})}),e.jsx(Z,{productId:m||"",isOpen:!!m,onClose:y}),l.length===0?e.jsxs("div",{className:"text-center py-6",children:[e.jsx(E,{className:"w-12 h-12 text-gray-300 mx-auto mb-4"}),e.jsx("p",{className:"text-gray-500 mb-4",children:"Votre panier est vide"}),e.jsx(C,{to:"/nos-produits",className:"inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base shadow-md",children:"Voir nos produits"})]}):e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"mb-4 sm:mb-6",children:l.map(i=>e.jsx("div",{className:"border-b border-gray-200 py-3 sm:py-4",children:e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center",children:[e.jsx("div",{className:"flex-shrink-0 w-full sm:w-20 h-20 mb-2 sm:mb-0",children:e.jsx("img",{src:i.image,alt:i.name,className:"w-full h-full object-cover object-center rounded-md"})}),e.jsxs("div",{className:"flex-1 sm:ml-4",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row sm:justify-between sm:items-start",children:[e.jsx("div",{children:e.jsx("h4",{className:"text-sm sm:text-base font-medium text-gray-900 mb-1",children:i.name})}),e.jsxs("div",{className:"flex flex-col items-end",children:[e.jsx("div",{className:"text-sm sm:text-base font-medium text-gray-900 mb-1",children:i.priceTTC.toLocaleString("fr-FR",{style:"currency",currency:"EUR"})}),e.jsxs("div",{className:"text-xs text-gray-600",children:["Prix HT: ",i.priceHT.toLocaleString("fr-FR",{style:"currency",currency:"EUR"})]})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 gap-3",children:[e.jsxs("div",{className:"flex items-center",children:[e.jsxs("div",{className:"flex items-center border border-gray-300 rounded-md",children:[e.jsx("button",{onClick:()=>s(i.id,i.quantity-1),className:"px-2 py-1 text-gray-500 hover:text-gray-700",disabled:i.quantity<=1,children:e.jsx(A,{className:"h-3 w-3"})}),e.jsx("span",{className:"px-2 sm:px-3 text-gray-700 text-sm sm:text-base",children:i.quantity}),e.jsx("button",{onClick:()=>s(i.id,i.quantity+1),className:"px-2 py-1 text-gray-500 hover:text-gray-700",children:e.jsx(V,{className:"h-3 w-3"})})]}),e.jsxs("button",{onClick:()=>o(i.id),className:"ml-3 text-blue-600 hover:text-blue-800 text-xs bg-blue-50 hover:bg-blue-100 transition-colors rounded-md px-2 py-1 flex items-center",children:[e.jsx(q,{className:"mr-1",size:12}),"Détails"]})]}),e.jsxs("button",{onClick:()=>v(i.id),className:"text-red-600 hover:text-red-800 text-sm flex items-center hover:bg-red-50 px-2 py-1 rounded transition-colors",children:[e.jsx(k,{className:"mr-1",size:12}),e.jsx("span",{className:"hidden sm:inline",children:"Supprimer"}),e.jsx("span",{className:"sm:hidden",children:"Retirer"})]})]})]})]})},i.id))}),e.jsxs("div",{className:"border-t border-gray-200 pt-4",children:[e.jsxs("div",{className:"space-y-2 text-sm sm:text-base",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-gray-600",children:"Sous-total HT:"}),e.jsx("span",{children:b})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-gray-600",children:"TVA (20%):"}),e.jsx("span",{children:p})]}),e.jsxs("div",{className:"flex justify-between font-medium text-base sm:text-lg pt-2 border-t border-gray-200",children:[e.jsx("span",{children:"Total TTC:"}),e.jsx("span",{children:x})]})]}),e.jsx("div",{className:"mt-4 text-xs sm:text-sm text-gray-500",children:"Frais de livraison calculés à l'étape suivante"})]})]})]})},ee=()=>{const l=[{id:"standard",name:"Livraison standard",description:"Livraison à domicile par transporteur",price:6.9,estimatedDelivery:"3 à 5 jours ouvrés",icon:e.jsx($,{className:"text-blue-600 h-5 w-5"})},{id:"express",name:"Livraison express",description:"Livraison le lendemain avant 13h",price:12.9,estimatedDelivery:"1 jour ouvré",icon:e.jsx(B,{className:"text-blue-600 h-5 w-5"})},{id:"pickup",name:"Retrait en magasin",description:"Gratuit, retirez votre commande en magasin",price:0,estimatedDelivery:"Dès que disponible",icon:e.jsx(I,{className:"text-blue-600 h-5 w-5"})}],[r,d]=g.useState("standard"),[a,u]=g.useState(""),[t,m]=g.useState({firstName:"",lastName:"",address:"",city:"",postalCode:"",country:"France",phone:""}),[n,c]=g.useState(!1),h=s=>{d(s)},x=s=>{u(s)},b=s=>{const{name:v,value:N}=s.target;m(o=>({...o,[v]:N}))},j=s=>s.toLocaleString("fr-FR",{style:"currency",currency:"EUR",minimumFractionDigits:2}),p=r==="standard"||r==="express";return e.jsx("div",{className:"bg-white rounded-lg shadow-sm p-6",children:e.jsxs("div",{className:"mb-6",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-4",children:"Choisissez votre mode de livraison"}),e.jsx("div",{className:"space-y-4",children:l.map(s=>e.jsx("div",{className:`border rounded-lg p-4 cursor-pointer transition-colors ${r===s.id?"border-blue-600 bg-blue-50":"border-gray-200 hover:border-blue-300"}`,onClick:()=>h(s.id),children:e.jsxs("div",{className:"flex items-center",children:[e.jsx("input",{type:"radio",id:`delivery-${s.id}`,name:"delivery-option",value:s.id,checked:r===s.id,onChange:()=>h(s.id),className:"h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"}),e.jsxs("div",{className:"ml-3 flex-1",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsxs("label",{htmlFor:`delivery-${s.id}`,className:"font-medium text-gray-900 flex items-center",children:[e.jsx("span",{className:"mr-2",children:s.icon}),s.name]}),e.jsx("span",{className:"font-medium text-gray-900",children:s.price===0?"Gratuit":j(s.price)})]}),e.jsx("p",{className:"text-gray-500 text-sm",children:s.description}),e.jsxs("p",{className:"text-gray-700 text-sm mt-1",children:[e.jsx("span",{className:"font-medium",children:"Délai estimé :"})," ",s.estimatedDelivery]})]})]})},s.id))}),e.jsx("div",{className:"mt-8",children:p?e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-4",children:"Adresse de livraison"}),e.jsxs("form",{className:"space-y-4",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"firstName",className:"block text-sm font-medium text-gray-700 mb-1",children:"Prénom"}),e.jsx("input",{type:"text",id:"firstName",name:"firstName",value:t.firstName,onChange:b,required:!0,className:"block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"lastName",className:"block text-sm font-medium text-gray-700 mb-1",children:"Nom"}),e.jsx("input",{type:"text",id:"lastName",name:"lastName",value:t.lastName,onChange:b,required:!0,className:"block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"})]})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"address",className:"block text-sm font-medium text-gray-700 mb-1",children:"Adresse"}),e.jsx("input",{type:"text",id:"address",name:"address",value:t.address,onChange:b,required:!0,className:"block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4",children:[e.jsxs("div",{className:"md:col-span-1",children:[e.jsx("label",{htmlFor:"postalCode",className:"block text-sm font-medium text-gray-700 mb-1",children:"Code postal"}),e.jsx("input",{type:"text",id:"postalCode",name:"postalCode",value:t.postalCode,onChange:b,required:!0,className:"block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"})]}),e.jsxs("div",{className:"md:col-span-2",children:[e.jsx("label",{htmlFor:"city",className:"block text-sm font-medium text-gray-700 mb-1",children:"Ville"}),e.jsx("input",{type:"text",id:"city",name:"city",value:t.city,onChange:b,required:!0,className:"block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"})]})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"country",className:"block text-sm font-medium text-gray-700 mb-1",children:"Pays"}),e.jsxs("select",{id:"country",name:"country",value:t.country,onChange:b,className:"block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500",children:[e.jsx("option",{value:"France",children:"France"}),e.jsx("option",{value:"Belgique",children:"Belgique"}),e.jsx("option",{value:"Suisse",children:"Suisse"}),e.jsx("option",{value:"Luxembourg",children:"Luxembourg"})]})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"phone",className:"block text-sm font-medium text-gray-700 mb-1",children:"Téléphone"}),e.jsx("input",{type:"tel",id:"phone",name:"phone",value:t.phone,onChange:b,required:!0,className:"block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"})]}),e.jsxs("div",{className:"flex items-center",children:[e.jsx("input",{id:"save-address",type:"checkbox",checked:n,onChange:()=>c(!n),className:"h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"}),e.jsx("label",{htmlFor:"save-address",className:"ml-2 block text-sm text-gray-700",children:"Sauvegarder cette adresse pour mes prochaines commandes"})]})]})]}):e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-4",children:"Choisissez votre magasin"}),e.jsxs("div",{className:"space-y-4",children:[e.jsx("div",{className:`border rounded-lg p-4 cursor-pointer transition-all ${a==="taverny"?"border-blue-600 bg-blue-50":"border-gray-200 hover:border-blue-300"}`,onClick:()=>x("taverny"),children:e.jsxs("div",{className:"flex items-start",children:[e.jsx("input",{type:"radio",id:"store-taverny",name:"store-option",value:"taverny",checked:a==="taverny",onChange:()=>x("taverny"),className:"h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300"}),e.jsxs("div",{className:"ml-3",children:[e.jsxs("label",{htmlFor:"store-taverny",className:"font-medium text-gray-900 flex items-center cursor-pointer",children:[e.jsx(F,{className:"text-blue-600 h-4 w-4 mr-2"}),"Distritherm Taverny"]}),e.jsx("p",{className:"text-sm text-gray-600 mt-1",children:"145 Rue d'Herblay, 95150 Taverny"}),e.jsx("div",{className:"mt-2 text-sm text-gray-800",children:e.jsxs("p",{children:[e.jsx("span",{className:"font-medium",children:"Horaires :"})," Lun-Ven 8h-19h, Sam 9h-18h"]})}),e.jsx("div",{className:"mt-2",children:e.jsx("a",{href:"https://maps.google.com/?q=145+Rue+d'Herblay,+95150+Taverny",target:"_blank",rel:"noopener noreferrer",className:"text-sm text-blue-600 hover:text-blue-500",children:"Voir l'itinéraire"})})]})]})}),e.jsx("div",{className:`border rounded-lg p-4 cursor-pointer transition-all ${a==="drancy"?"border-blue-600 bg-blue-50":"border-gray-200 hover:border-blue-300"}`,onClick:()=>x("drancy"),children:e.jsxs("div",{className:"flex items-start",children:[e.jsx("input",{type:"radio",id:"store-drancy",name:"store-option",value:"drancy",checked:a==="drancy",onChange:()=>x("drancy"),className:"h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300"}),e.jsxs("div",{className:"ml-3",children:[e.jsxs("label",{htmlFor:"store-drancy",className:"font-medium text-gray-900 flex items-center cursor-pointer",children:[e.jsx(F,{className:"text-blue-600 h-4 w-4 mr-2"}),"Distritherm Drancy"]}),e.jsx("p",{className:"text-sm text-gray-600 mt-1",children:"12 Rue Charles Gide, 93700 Drancy"}),e.jsx("div",{className:"mt-2 text-sm text-gray-800",children:e.jsxs("p",{children:[e.jsx("span",{className:"font-medium",children:"Horaires :"})," Lun-Ven 8h-19h, Sam 9h-18h"]})}),e.jsx("div",{className:"mt-2",children:e.jsx("a",{href:"https://maps.google.com/?q=12+Rue+Charles+Gide,+93700+Drancy",target:"_blank",rel:"noopener noreferrer",className:"text-sm text-blue-600 hover:text-blue-500",children:"Voir l'itinéraire"})})]})]})})]})]})}),e.jsxs("div",{className:"mt-8 border-t border-gray-200 pt-4",children:[e.jsx("h4",{className:"font-medium text-gray-900 mb-2",children:"Informations importantes"}),e.jsx("ul",{className:"text-sm text-gray-700 space-y-1 list-disc pl-5",children:p?e.jsxs(e.Fragment,{children:[e.jsx("li",{children:"Les délais de livraison sont donnés à titre indicatif."}),e.jsx("li",{children:"La livraison s'effectue du lundi au vendredi, hors jours fériés."}),e.jsx("li",{children:"Un email de confirmation vous sera envoyé lorsque votre commande sera expédiée."}),e.jsx("li",{children:"Pour la livraison express, nous vous contacterons par téléphone pour confirmer."})]}):e.jsxs(e.Fragment,{children:[e.jsx("li",{children:"Votre commande sera disponible en magasin sous 24 à 48h."}),e.jsx("li",{children:"Un email vous sera envoyé dès que votre commande sera prête."}),e.jsx("li",{children:"Merci de vous munir d'une pièce d'identité pour le retrait."}),e.jsx("li",{children:"Votre commande sera gardée pendant 10 jours en magasin."})]})})]})]})})},se=()=>{const{cart:l}=w(),[r,d]=g.useState("card"),[a,u]=g.useState(!1),[t,m]=g.useState({number:"",name:"",expiry:"",cvc:""}),[n,c]=g.useState(!1),h=o=>{d(o)},x=o=>{const{name:y,value:i}=o.target;m({...t,[y]:i})},b=o=>{o.preventDefault(),alert("Paiement traité avec succès !")},j=l.reduce((o,y)=>o+(y.price||y.priceTTC)*y.quantity,0),p=6.9,s=j+p,v=j/1.2,N=j-v;return e.jsxs("div",{className:"bg-white rounded-lg shadow-sm p-4 sm:p-6",children:[e.jsxs("div",{className:"mb-5 sm:mb-6",children:[e.jsx("h3",{className:"text-lg sm:text-xl font-medium text-gray-900 mb-2 sm:mb-4",children:"Récapitulatif de la commande"}),e.jsx("div",{className:"border-t border-b border-gray-200 py-3 sm:py-4 mb-4",children:l.map((o,y)=>e.jsxs("div",{className:"flex justify-between items-center mb-3 sm:mb-4 text-sm sm:text-base",children:[e.jsxs("div",{className:"flex-1",children:[e.jsxs("span",{className:"font-medium",children:[o.quantity,"x"]})," ",o.name]}),e.jsx("div",{className:"text-right font-medium",children:(o.price||o.priceTTC).toLocaleString("fr-FR",{style:"currency",currency:"EUR"})})]},y))}),e.jsxs("div",{className:"space-y-2 sm:space-y-3 text-sm sm:text-base",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-gray-600",children:"Sous-total HT:"}),e.jsx("span",{children:v.toLocaleString("fr-FR",{style:"currency",currency:"EUR"})})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-gray-600",children:"TVA (20%):"}),e.jsx("span",{children:N.toLocaleString("fr-FR",{style:"currency",currency:"EUR"})})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-gray-600",children:"Livraison:"}),e.jsx("span",{children:p.toLocaleString("fr-FR",{style:"currency",currency:"EUR"})})]}),e.jsxs("div",{className:"flex justify-between font-bold text-base sm:text-lg pt-2 sm:pt-3 border-t border-gray-200",children:[e.jsx("span",{children:"Total:"}),e.jsx("span",{children:s.toLocaleString("fr-FR",{style:"currency",currency:"EUR"})})]})]})]}),e.jsxs("div",{className:"mb-5 sm:mb-6",children:[e.jsx("h3",{className:"text-lg sm:text-xl font-medium text-gray-900 mb-2 sm:mb-4",children:"Méthode de paiement"}),e.jsxs("div",{className:"grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4",children:[e.jsxs("button",{type:"button",className:`flex items-center justify-center py-2 sm:py-3 px-2 sm:px-4 border rounded-md ${r==="card"?"border-blue-600 bg-blue-50 text-blue-600":"border-gray-300 text-gray-700 hover:border-blue-300"}`,onClick:()=>h("card"),children:[e.jsx(G,{className:"mr-1 sm:mr-2"}),e.jsx("span",{className:"text-xs sm:text-sm",children:"Carte bancaire"})]}),e.jsxs("button",{type:"button",className:`flex items-center justify-center py-2 sm:py-3 px-2 sm:px-4 border rounded-md ${r==="virement"?"border-blue-600 bg-blue-50 text-blue-600":"border-gray-300 text-gray-700 hover:border-blue-300"}`,onClick:()=>h("virement"),children:[e.jsx(O,{className:"mr-1 sm:mr-2"}),e.jsx("span",{className:"text-xs sm:text-sm",children:"Virement"})]}),e.jsxs("button",{type:"button",className:`flex items-center justify-center py-2 sm:py-3 px-2 sm:px-4 border rounded-md ${r==="acompte"?"border-blue-600 bg-blue-50 text-blue-600":"border-gray-300 text-gray-700 hover:border-blue-300"}`,onClick:()=>h("acompte"),children:[e.jsx(J,{className:"mr-1 sm:mr-2"}),e.jsx("span",{className:"text-xs sm:text-sm",children:"Acompte"})]}),e.jsxs("button",{type:"button",className:`flex items-center justify-center py-2 sm:py-3 px-2 sm:px-4 border rounded-md ${r==="applepay"?"border-blue-600 bg-blue-50 text-blue-600":"border-gray-300 text-gray-700 hover:border-blue-300"}`,onClick:()=>h("applepay"),children:[e.jsx(W,{className:"mr-1 sm:mr-2"}),e.jsx("span",{className:"text-xs sm:text-sm",children:"Apple Pay"})]})]}),r==="card"&&e.jsxs("form",{className:"space-y-3 sm:space-y-4",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"cardNumber",className:"block text-sm font-medium text-gray-700 mb-1",children:"Numéro de carte"}),e.jsx("input",{type:"text",id:"cardNumber",name:"number",placeholder:"1234 5678 9012 3456",value:t.number,onChange:x,className:"block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"cardName",className:"block text-sm font-medium text-gray-700 mb-1",children:"Nom sur la carte"}),e.jsx("input",{type:"text",id:"cardName",name:"name",placeholder:"John Doe",value:t.name,onChange:x,className:"block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"cardExpiry",className:"block text-sm font-medium text-gray-700 mb-1",children:"Date d'expiration"}),e.jsx("input",{type:"text",id:"cardExpiry",name:"expiry",placeholder:"MM/AA",value:t.expiry,onChange:x,className:"block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"cardCVC",className:"block text-sm font-medium text-gray-700 mb-1",children:"CVC"}),e.jsx("input",{type:"text",id:"cardCVC",name:"cvc",placeholder:"123",value:t.cvc,onChange:x,className:"block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"})]})]}),e.jsxs("div",{className:"flex items-center",children:[e.jsx("input",{id:"saveCard",type:"checkbox",checked:a,onChange:()=>u(!a),className:"h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"}),e.jsx("label",{htmlFor:"saveCard",className:"ml-2 block text-sm text-gray-700",children:"Enregistrer cette carte pour mes prochains achats"})]})]}),r==="virement"&&e.jsxs("div",{className:"mt-3 p-4 bg-blue-50 rounded-md border border-blue-100",children:[e.jsx("h4",{className:"font-medium text-blue-800 mb-2",children:"Informations pour le virement bancaire"}),e.jsx("p",{className:"text-sm text-blue-700 mb-3",children:"Veuillez effectuer votre virement aux coordonnées suivantes:"}),e.jsxs("div",{className:"space-y-2 text-sm",children:[e.jsxs("div",{className:"grid grid-cols-3 gap-1",children:[e.jsx("span",{className:"text-blue-800 font-medium",children:"IBAN:"}),e.jsx("span",{className:"col-span-2",children:"FR76 1234 5678 9012 3456 7890 123"})]}),e.jsxs("div",{className:"grid grid-cols-3 gap-1",children:[e.jsx("span",{className:"text-blue-800 font-medium",children:"BIC:"}),e.jsx("span",{className:"col-span-2",children:"ABCDEFGHIJK"})]}),e.jsxs("div",{className:"grid grid-cols-3 gap-1",children:[e.jsx("span",{className:"text-blue-800 font-medium",children:"Titulaire:"}),e.jsx("span",{className:"col-span-2",children:"DISTRITHERM SAS"})]}),e.jsxs("div",{className:"grid grid-cols-3 gap-1",children:[e.jsx("span",{className:"text-blue-800 font-medium",children:"Banque:"}),e.jsx("span",{className:"col-span-2",children:"Crédit Mutuel"})]}),e.jsx("p",{className:"mt-2 font-medium",children:"Référence à indiquer: Votre nom + numéro de commande"})]})]}),r==="acompte"&&e.jsxs("div",{className:"mt-3 p-4 bg-blue-50 rounded-md border border-blue-100",children:[e.jsx("h4",{className:"font-medium text-blue-800 mb-2",children:"Paiement par acompte"}),e.jsx("p",{className:"text-sm text-blue-700 mb-3",children:"Versez 30% maintenant et le reste à la livraison:"}),e.jsxs("div",{className:"space-y-2 text-sm",children:[e.jsxs("div",{className:"grid grid-cols-3 gap-1",children:[e.jsx("span",{className:"text-blue-800 font-medium",children:"Acompte (30%):"}),e.jsx("span",{className:"col-span-2 font-medium",children:(s*.3).toLocaleString("fr-FR",{style:"currency",currency:"EUR"})})]}),e.jsxs("div",{className:"grid grid-cols-3 gap-1",children:[e.jsx("span",{className:"text-blue-800 font-medium",children:"Solde à régler:"}),e.jsx("span",{className:"col-span-2",children:(s*.7).toLocaleString("fr-FR",{style:"currency",currency:"EUR"})})]}),e.jsx("p",{className:"mt-2",children:"Vous serez contacté par notre service client pour finaliser les modalités de paiement du solde."})]})]})]}),e.jsxs("div",{className:"mb-5 sm:mb-6",children:[e.jsxs("div",{className:"flex items-center mb-4",children:[e.jsx("input",{id:"termsAccepted",type:"checkbox",checked:n,onChange:()=>c(!n),className:"h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"}),e.jsxs("label",{htmlFor:"termsAccepted",className:"ml-2 block text-sm text-gray-700",children:["J'accepte les ",e.jsx("a",{href:"#",className:"text-blue-600 hover:underline",children:"conditions générales de vente"})]})]}),e.jsxs("button",{type:"button",onClick:b,disabled:!n,className:`w-full flex items-center justify-center py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base font-medium rounded-md ${n?"bg-blue-600 text-white hover:bg-blue-700":"bg-gray-300 text-gray-500 cursor-not-allowed"}`,children:[e.jsx(K,{className:"mr-2"}),"Confirmer et payer"]}),e.jsx("p",{className:"mt-3 text-xs sm:text-sm text-gray-500 text-center",children:"Vos informations de paiement sont sécurisées. Nous n'enregistrons pas les détails de votre carte."})]})]})},ce=()=>{const[l,r]=g.useState(0),{cart:d,removeFromCart:a,updateQuantity:u,clearCart:t}=w(),m=d.length===0,n=d.reduce((p,s)=>p+s.priceTTC*s.quantity,0),c=d.reduce((p,s)=>p+s.priceHT*s.quantity,0);n.toLocaleString("fr-FR",{style:"currency",currency:"EUR",minimumFractionDigits:2}),c.toLocaleString("fr-FR",{style:"currency",currency:"EUR",minimumFractionDigits:2}),(n-c).toLocaleString("fr-FR",{style:"currency",currency:"EUR",minimumFractionDigits:2});const x=()=>{l<3&&r(l+1)},b=()=>{l>0&&r(l-1)},j=()=>{switch(l){case 0:return e.jsx(D,{});case 1:return e.jsx(_,{inCart:!0});case 2:return e.jsx(ee,{});case 3:return e.jsx(se,{});default:return e.jsx(D,{})}};return m?e.jsxs("div",{className:"min-h-screen bg-gray-50",children:[e.jsx(R,{showOnPages:["/panier"]}),e.jsx(S,{}),e.jsxs("div",{className:"container mx-auto px-4 py-8 sm:py-12",children:[e.jsx("div",{className:"text-center mb-16",children:e.jsxs("h1",{className:"text-4xl md:text-5xl font-bold text-gray-800 mb-4 relative inline-block",children:[e.jsx("span",{className:"bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent",children:"Votre panier"}),e.jsx("div",{className:"absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full"})]})}),e.jsxs("div",{className:"bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-10 text-center",children:[e.jsx("div",{className:"mb-4 sm:mb-6",children:e.jsx("svg",{className:"w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-300",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.5,d:"M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"})})}),e.jsx("h2",{className:"text-lg sm:text-xl font-medium text-gray-700 mb-3 sm:mb-4",children:"Votre panier est vide"}),e.jsx("p",{className:"text-gray-500 mb-6 sm:mb-8",children:"Découvrez nos produits et commencez votre shopping"}),e.jsxs(C,{to:"/nos-produits",className:"inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors duration-200",children:[e.jsx(Q,{className:"mr-2"}),"Voir nos produits"]})]})]}),e.jsx(L,{}),e.jsx(T,{})]}):e.jsxs("div",{className:"min-h-screen",children:[e.jsx(R,{showOnPages:["/panier"]}),e.jsx("div",{className:"bg-gray-50 pb-8 sm:pb-16",children:e.jsxs("div",{className:"container mx-auto px-3 sm:px-4",children:[e.jsx(S,{}),e.jsxs("div",{className:"text-center mb-8 sm:mb-16",children:[e.jsxs("h1",{className:"text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 relative inline-block",children:[e.jsx("span",{className:"bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent",children:"Votre panier"}),e.jsx("div",{className:"absolute -bottom-2 sm:-bottom-4 left-1/2 transform -translate-x-1/2 w-24 sm:w-32 h-1 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full"})]}),e.jsx("p",{className:"text-sm sm:text-base text-gray-600 max-w-2xl mx-auto mt-4 sm:mt-8",children:"Récapitulatif de la commande"})]}),e.jsx(Y,{activeTab:l,onChangeTab:r}),e.jsx("div",{className:"mb-6 sm:mb-8",children:j()}),l>0&&l<3&&!m&&e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-3 sm:gap-4",children:[e.jsx("button",{onClick:b,className:"px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base",children:"Étape précédente"}),e.jsx("button",{onClick:x,className:"px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base",children:"Continuer"})]}),l===0&&!m&&e.jsx("div",{className:"flex justify-end",children:e.jsx("button",{onClick:x,className:"px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base",children:"Continuer"})})]})}),e.jsx(L,{}),e.jsx(T,{})]})};export{ce as default};
