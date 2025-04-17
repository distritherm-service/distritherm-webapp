import{o as g,t as h,j as e,B as u,q as o,L as r,J as n,R as j,F as b,m as y}from"./index-CLCNF0y8.js";const v=()=>{const{favorites:i,removeFromFavorites:l}=g(),{addToCart:d,isInCart:t}=h(),c={hidden:{opacity:0},show:{opacity:1,transition:{staggerChildren:.1}}},x={hidden:{opacity:0,y:20},show:{opacity:1,y:0}},a=s=>"name"in s&&typeof s.name=="string"?s.name:s.title,m=s=>"price"in s?`${s.price.toFixed(2)} €`:`${s.discountPrice.toFixed(2)} €`,p=s=>{d({id:s.id,name:a(s),price:"price"in s?s.price:s.discountPrice,image:s.image,quantity:1})};return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"min-h-screen bg-gray-50",children:[e.jsx(u,{}),e.jsxs("div",{className:"container mx-auto px-4 py-8",children:[e.jsxs("div",{className:"flex items-center justify-center space-x-4 mb-12",children:[e.jsxs("h1",{className:"text-4xl md:text-5xl font-bold text-gray-800 relative inline-block text-center",children:[e.jsx("span",{className:"bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent",children:"Mes Favoris"}),e.jsx("div",{className:"absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full"})]}),e.jsx(o,{className:"text-teal-600 w-8 h-8"})]}),i.length===0?e.jsxs("div",{className:"text-center py-16",children:[e.jsx(o,{className:"w-16 h-16 text-gray-300 mx-auto mb-4"}),e.jsx("h2",{className:"text-xl font-medium text-gray-600 mb-2",children:"Vous n'avez pas encore de favoris"}),e.jsx("p",{className:"text-gray-500 mb-6",children:"Explorez nos produits et promotions pour en ajouter !"}),e.jsxs("div",{className:"flex justify-center space-x-4",children:[e.jsx(r,{to:"/nos-produits",className:"bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200",children:"Voir les produits"}),e.jsx(r,{to:"/promotions",className:"bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200",children:"Voir les promotions"})]})]}):e.jsx(n.div,{variants:c,initial:"hidden",animate:"show",className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",children:i.map(s=>e.jsxs(n.div,{variants:x,className:"bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200",children:[e.jsxs("div",{className:"relative",children:[e.jsx("img",{src:s.item.image,alt:a(s.item),className:"w-full h-48 object-cover rounded-t-xl"}),e.jsx("button",{onClick:()=>l(s.id),className:"absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors duration-200 group",children:e.jsx(j,{className:"w-4 h-4 text-red-500 group-hover:scale-110 transition-transform duration-200"})})]}),e.jsxs("div",{className:"p-4",children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsx("span",{className:`px-2 py-1 text-xs rounded-full ${s.type==="product"?"bg-teal-100 text-teal-800":"bg-indigo-100 text-indigo-800"}`,children:s.type==="product"?"Produit":"Promotion"}),e.jsx("span",{className:"font-medium text-gray-900",children:m(s.item)})]}),e.jsx("h3",{className:"font-medium text-gray-900 mb-1",children:a(s.item)}),e.jsxs("p",{className:"text-sm text-gray-500 mb-4",children:[s.item.description.slice(0,100),"..."]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(r,{to:s.type==="product"?`/nos-produits/${s.id}`:`/promotions/${s.id}`,className:"flex-1 text-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200",children:"Voir les détails"}),e.jsxs("button",{onClick:()=>p(s.item),disabled:t(s.id),className:`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${t(s.id)?"bg-green-100 text-green-700 cursor-not-allowed":"bg-teal-600 text-white hover:bg-teal-700"}`,children:[e.jsx(b,{className:"w-4 h-4"}),t(s.id)?"Dans le panier":"Ajouter"]})]})]})]},s.id))})]})]}),e.jsx(y,{})]})};export{v as default};
