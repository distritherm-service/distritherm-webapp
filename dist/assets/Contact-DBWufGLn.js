import{r,j as e,x as o,y as c,z as d,A as x}from"./index-2311aXp4.js";import{L as m}from"./Layout-BbxObWX1.js";import"./Breadcrumb-tP_Dv3le.js";const p=()=>{const[n,i]=r.useState(""),[a,l]=r.useState(""),t=[{id:"taverny",name:"Taverny",address:"16 rue Condorcet, 95150 Taverny"},{id:"drancy",name:"Drancy",address:"23 rue des Bois, 93700 Drancy"}];return e.jsx(m,{children:e.jsxs("section",{className:"relative py-20 overflow-hidden",children:[e.jsxs("div",{className:"absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-teal-50/30",children:[e.jsx("div",{className:"absolute inset-0 bg-[url('/grid.svg')] opacity-[0.2]"}),e.jsx("div",{className:"absolute w-96 h-96 -top-48 -left-48 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"}),e.jsx("div",{className:"absolute w-96 h-96 -bottom-48 -right-48 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"})]}),e.jsxs("div",{className:"container relative mx-auto px-4",children:[e.jsxs("div",{className:"text-center mb-16",children:[e.jsxs("h1",{className:"text-4xl md:text-5xl font-bold text-gray-800 mb-4 relative inline-block",children:[e.jsx("span",{className:"bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent",children:"Contacter votre magasin"}),e.jsx("div",{className:"absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full"})]}),e.jsx("p",{className:"text-gray-600 max-w-2xl mx-auto mt-8",children:"Notre équipe est à votre disposition pour répondre à toutes vos questions"})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto",children:[e.jsx("div",{className:"lg:col-span-1",children:e.jsxs("div",{className:"bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 sticky top-8",children:[e.jsx("h3",{className:"text-2xl font-bold text-gray-800 mb-6",children:"Nos coordonnées"}),t.map(s=>e.jsx("div",{className:"mb-8 last:mb-0",children:e.jsxs("div",{className:"flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-md",children:[e.jsx("div",{className:"flex-shrink-0",children:e.jsx(o,{className:"w-6 h-6 text-teal-600"})}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-semibold text-gray-800",children:s.name}),e.jsx("p",{className:"text-gray-600 text-sm mt-1",children:s.address})]})]})},s.id)),e.jsxs("div",{className:"space-y-4 mt-8",children:[e.jsxs("div",{className:"flex items-center space-x-4",children:[e.jsx(c,{className:"w-5 h-5 text-teal-600"}),e.jsx("span",{className:"text-gray-600",children:"01 23 45 67 89"})]}),e.jsxs("div",{className:"flex items-center space-x-4",children:[e.jsx(d,{className:"w-5 h-5 text-teal-600"}),e.jsx("span",{className:"text-gray-600",children:"contact@distritherm.fr"})]}),e.jsxs("div",{className:"flex items-center space-x-4",children:[e.jsx(x,{className:"w-5 h-5 text-teal-600"}),e.jsx("span",{className:"text-gray-600",children:"Lun-Ven: 6h30-17h"})]})]})]})}),e.jsx("div",{className:"lg:col-span-2",children:e.jsxs("div",{className:"bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold text-gray-800 mb-6",children:"Formulaire de contact"}),e.jsxs("form",{className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Votre Magasin"}),e.jsxs("select",{value:n,onChange:s=>i(s.target.value),className:"w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70",children:[e.jsx("option",{value:"",children:"Choisissez votre Magasin"}),t.map(s=>e.jsx("option",{value:s.id,children:s.name},s.id))]})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:["Civilité",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsxs("div",{className:"flex space-x-4",children:[e.jsxs("label",{className:"flex items-center",children:[e.jsx("input",{type:"radio",value:"M.",checked:a==="M.",onChange:s=>l(s.target.value),className:"w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"}),e.jsx("span",{className:"ml-2 text-gray-700",children:"M."})]}),e.jsxs("label",{className:"flex items-center",children:[e.jsx("input",{type:"radio",value:"Mme",checked:a==="Mme",onChange:s=>l(s.target.value),className:"w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"}),e.jsx("span",{className:"ml-2 text-gray-700",children:"Mme"})]}),e.jsxs("label",{className:"flex items-center",children:[e.jsx("input",{type:"radio",value:"Non précisé",checked:a==="Non précisé",onChange:s=>l(s.target.value),className:"w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"}),e.jsx("span",{className:"ml-2 text-gray-700",children:"Non précisé"})]})]})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[e.jsxs("div",{children:[e.jsxs("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:["Nom",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx("input",{type:"text",className:"w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70",placeholder:"Nom"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:["Prénom",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx("input",{type:"text",className:"w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70",placeholder:"Prénom"})]})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[e.jsxs("div",{children:[e.jsxs("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:["Adresse e-mail",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx("input",{type:"email",className:"w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70",placeholder:"Adresse e-mail"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:["Téléphone",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx("input",{type:"tel",className:"w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70",placeholder:"Téléphone"})]})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:["Adresse",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx("textarea",{rows:2,className:"w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70",placeholder:"Adresse"})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[e.jsxs("div",{children:[e.jsxs("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:["Code Postal",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx("input",{type:"text",className:"w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70",placeholder:"Code Postal"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:["Ville",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx("input",{type:"text",className:"w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70",placeholder:"Ville"})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Activité Principale"}),e.jsx("input",{type:"text",className:"w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70",placeholder:"Activité Principale"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Message"}),e.jsx("textarea",{rows:4,className:"w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/70",placeholder:"Message"})]}),e.jsx("div",{children:e.jsx("button",{type:"submit",className:"w-full px-6 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-medium rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02]",children:"Envoyer"})})]})]})})]})]})]})})};export{p as default};
