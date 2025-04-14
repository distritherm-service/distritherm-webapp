import{a4 as j,u as b,r as a,j as e,ad as p,ae as f,f as v,af as h,ag as w,z as A}from"./index-OWumJMsc.js";import{L as C}from"./Layout-C3JggkVx.js";import"./Slider-BjuFbwYr.js";import"./Breadcrumb-CQ4P_ytE.js";const S=()=>{const{isAuthenticated:d}=j(),c=b(),[i,n]=a.useState([]),[g,o]=a.useState(!0),[m,y]=a.useState(""),[t,x]=a.useState(null);a.useEffect(()=>{d||c("/connexion")},[d,c]),a.useEffect(()=>{d&&(async()=>{try{const r=await A.get("/orders");n(r.data)}catch(r){console.error("Erreur lors du chargement des commandes:",r),y("Impossible de charger vos commandes. Veuillez réessayer plus tard.")}finally{o(!1)}})()},[d]),a.useEffect(()=>{n([{id:"1",orderNumber:"CMD-2023-001",date:"2023-03-15T10:30:00Z",status:"delivered",totalAmount:1250.99,items:[{id:"item1",productId:"prod1",productName:"Pompe à chaleur AIRWELL",quantity:1,unitPrice:999.99,imageUrl:"https://via.placeholder.com/50"},{id:"item2",productId:"prod2",productName:"Kit installation standard",quantity:1,unitPrice:250,imageUrl:"https://via.placeholder.com/50"}],shippingAddress:{fullName:"Jean Dupont",streetAddress:"15 Rue de la Paix",city:"Paris",postalCode:"75001",country:"France"},billingAddress:{fullName:"Jean Dupont",streetAddress:"15 Rue de la Paix",city:"Paris",postalCode:"75001",country:"France"}},{id:"2",orderNumber:"CMD-2023-042",date:"2023-04-20T14:15:00Z",status:"processing",totalAmount:549.5,items:[{id:"item3",productId:"prod3",productName:"Radiateur connecté ACOVA",quantity:2,unitPrice:249.75,imageUrl:"https://via.placeholder.com/50"},{id:"item4",productId:"prod4",productName:"Thermostat intelligent",quantity:1,unitPrice:50,imageUrl:"https://via.placeholder.com/50"}],shippingAddress:{fullName:"Jean Dupont",streetAddress:"15 Rue de la Paix",city:"Paris",postalCode:"75001",country:"France"},billingAddress:{fullName:"Jean Dupont",streetAddress:"15 Rue de la Paix",city:"Paris",postalCode:"75001",country:"France"}}]),o(!1)},[]);const u=s=>{const r=new Date(s);return new Intl.DateTimeFormat("fr-FR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}).format(r)},l=s=>{switch(s){case"pending":return{label:"En attente",color:"text-yellow-500"};case"processing":return{label:"En cours de traitement",color:"text-blue-500"};case"shipped":return{label:"Expédiée",color:"text-indigo-500"};case"delivered":return{label:"Livrée",color:"text-green-500"};case"cancelled":return{label:"Annulée",color:"text-red-500"};default:return{label:"Inconnu",color:"text-gray-500"}}},N=s=>{x(s)};return e.jsx(C,{children:e.jsx("div",{className:"container mx-auto px-4 py-12",children:e.jsxs("div",{className:"max-w-5xl mx-auto",children:[e.jsxs("h1",{className:"text-3xl font-bold text-gray-800 mb-6 flex items-center",children:[e.jsx(p,{className:"mr-3 text-teal-600"}),"Mes Commandes"]}),g?e.jsx("div",{className:"flex justify-center py-10",children:e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"})}):m?e.jsx("div",{className:"bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6",children:e.jsxs("p",{className:"flex items-center",children:[e.jsx(f,{className:"mr-2"}),m]})}):i.length===0?e.jsxs("div",{className:"bg-gray-100 rounded-lg p-8 text-center shadow-sm",children:[e.jsx(p,{className:"mx-auto h-12 w-12 text-gray-400 mb-4"}),e.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-2",children:"Aucune commande"}),e.jsx("p",{className:"text-gray-600 mb-6",children:"Vous n'avez pas encore passé de commande."}),e.jsx("button",{onClick:()=>c("/nos-produits"),className:"px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors",children:"Parcourir nos produits"})]}):e.jsx("div",{className:"bg-white shadow-md rounded-lg overflow-hidden",children:t?e.jsxs("div",{className:"p-6",children:[e.jsxs("div",{className:"flex justify-between items-center border-b pb-4 mb-4",children:[e.jsxs("h2",{className:"text-xl font-bold text-gray-800",children:["Commande #",t.orderNumber]}),e.jsx("button",{onClick:()=>x(null),className:"text-gray-600 hover:text-teal-600",children:"Retour aux commandes"})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6 mb-6",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-sm font-medium text-gray-500 mb-2",children:"Date de commande"}),e.jsxs("p",{className:"flex items-center text-gray-800",children:[e.jsx(v,{className:"mr-2 text-gray-400"}),u(t.date)]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-sm font-medium text-gray-500 mb-2",children:"Statut"}),e.jsxs("p",{className:`flex items-center ${l(t.status).color}`,children:[e.jsx(h,{className:"mr-2 h-2 w-2"}),l(t.status).label]})]})]}),e.jsx("h3",{className:"text-lg font-medium text-gray-800 mb-3",children:"Articles"}),e.jsxs("div",{className:"bg-gray-50 rounded-md overflow-hidden mb-6",children:[e.jsxs("div",{className:"border-b border-gray-200 bg-gray-100 py-3 px-4 grid grid-cols-12 gap-2 text-sm text-gray-500",children:[e.jsx("div",{className:"col-span-6",children:"Produit"}),e.jsx("div",{className:"col-span-2 text-center",children:"Prix unitaire"}),e.jsx("div",{className:"col-span-2 text-center",children:"Quantité"}),e.jsx("div",{className:"col-span-2 text-right",children:"Total"})]}),t.items.map(s=>e.jsxs("div",{className:"py-4 px-4 border-b border-gray-100 grid grid-cols-12 gap-2 items-center",children:[e.jsxs("div",{className:"col-span-6 flex items-center",children:[s.imageUrl&&e.jsx("img",{src:s.imageUrl,alt:s.productName,className:"h-10 w-10 mr-3 object-cover rounded"}),e.jsx("span",{className:"font-medium text-gray-800",children:s.productName})]}),e.jsx("div",{className:"col-span-2 text-center",children:s.unitPrice.toLocaleString("fr-FR",{style:"currency",currency:"EUR"})}),e.jsx("div",{className:"col-span-2 text-center",children:s.quantity}),e.jsx("div",{className:"col-span-2 text-right font-medium",children:(s.unitPrice*s.quantity).toLocaleString("fr-FR",{style:"currency",currency:"EUR"})})]},s.id)),e.jsxs("div",{className:"py-4 px-4 grid grid-cols-12 gap-2 items-center bg-gray-50",children:[e.jsx("div",{className:"col-span-10 text-right font-bold text-gray-800",children:"Total"}),e.jsx("div",{className:"col-span-2 text-right font-bold text-gray-800",children:t.totalAmount.toLocaleString("fr-FR",{style:"currency",currency:"EUR"})})]})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6 mb-6",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-medium text-gray-800 mb-3",children:"Adresse de livraison"}),e.jsxs("div",{className:"bg-gray-50 p-4 rounded-md",children:[e.jsx("p",{className:"font-medium text-gray-800",children:t.shippingAddress.fullName}),e.jsx("p",{className:"text-gray-600",children:t.shippingAddress.streetAddress}),e.jsxs("p",{className:"text-gray-600",children:[t.shippingAddress.postalCode," ",t.shippingAddress.city]}),e.jsx("p",{className:"text-gray-600",children:t.shippingAddress.country})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-medium text-gray-800 mb-3",children:"Adresse de facturation"}),e.jsxs("div",{className:"bg-gray-50 p-4 rounded-md",children:[e.jsx("p",{className:"font-medium text-gray-800",children:t.billingAddress.fullName}),e.jsx("p",{className:"text-gray-600",children:t.billingAddress.streetAddress}),e.jsxs("p",{className:"text-gray-600",children:[t.billingAddress.postalCode," ",t.billingAddress.city]}),e.jsx("p",{className:"text-gray-600",children:t.billingAddress.country})]})]})]}),e.jsx("div",{className:"flex justify-end",children:e.jsxs("button",{className:"px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors flex items-center",children:[e.jsx(w,{className:"mr-2"}),"Télécharger la facture"]})})]}):e.jsx("div",{children:e.jsxs("table",{className:"w-full",children:[e.jsx("thead",{className:"bg-gray-50 border-b border-gray-200",children:e.jsxs("tr",{children:[e.jsx("th",{className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Commande"}),e.jsx("th",{className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Date"}),e.jsx("th",{className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Statut"}),e.jsx("th",{className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Total"}),e.jsx("th",{className:"px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Actions"})]})}),e.jsx("tbody",{className:"bg-white divide-y divide-gray-200",children:i.map(s=>e.jsxs("tr",{className:"hover:bg-gray-50",children:[e.jsxs("td",{className:"px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900",children:["#",s.orderNumber]}),e.jsx("td",{className:"px-6 py-4 whitespace-nowrap text-sm text-gray-500",children:u(s.date)}),e.jsx("td",{className:"px-6 py-4 whitespace-nowrap text-sm",children:e.jsxs("span",{className:`inline-flex items-center ${l(s.status).color}`,children:[e.jsx(h,{className:"mr-1.5 h-2 w-2"}),l(s.status).label]})}),e.jsx("td",{className:"px-6 py-4 whitespace-nowrap text-sm text-gray-500",children:s.totalAmount.toLocaleString("fr-FR",{style:"currency",currency:"EUR"})}),e.jsx("td",{className:"px-6 py-4 whitespace-nowrap text-center text-sm font-medium",children:e.jsx("button",{onClick:()=>N(s),className:"text-teal-600 hover:text-teal-900",children:"Voir détails"})})]},s.id))})]})})})]})})})};export{S as default};
