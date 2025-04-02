import{a2 as G,A as J,r as x,j as e,a7 as q,a8 as Q,a5 as z,y as X,x as Y,w as Z,a6 as _,a9 as ee,a1 as v,a4 as P}from"./index-D4J_UHvf.js";import{L as se}from"./Layout-DeyqX9Rk.js";import"./Breadcrumb-Bhm49qf3.js";const ne=()=>{const{user:r,isAuthenticated:C,updateUser:S}=G(),k=J(),[s,N]=x.useState({firstName:"",lastName:"",email:"",phoneNumber:"",companyName:"",siretNumber:""}),[d,F]=x.useState({currentPassword:"",newPassword:"",confirmPassword:""}),[a,b]=x.useState(!1),[h,p]=x.useState(!1),[E,t]=x.useState(""),[D,u]=x.useState(""),[y,B]=x.useState("informations");x.useEffect(()=>{C?r&&N({firstName:r.firstName||"",lastName:r.lastName||"",email:r.email||"",phoneNumber:r.phoneNumber||"",companyName:r.companyName||"",siretNumber:r.siretNumber||""}):k("/connexion")},[C,k,r]);const g=n=>{const{name:o,value:i}=n.target;if(o==="siretNumber"){const f=i.replace(/\D/g,"").slice(0,14);N(j=>({...j,[o]:f}))}else N(c=>({...c,[o]:i}))},w=n=>{const{name:o,value:i}=n.target;F(c=>({...c,[o]:i}))},H=()=>s.siretNumber&&s.siretNumber.replace(/\D/g,"").length!==14?(t("Le numéro SIRET doit contenir exactement 14 chiffres."),!1):!0,W=async n=>{var o,i,c,f,j,M,A,I,U,V,$,T;if(n.preventDefault(),p(!0),t(""),u(""),!H()){p(!1);return}try{const m={firstName:s.firstName,lastName:s.lastName,phoneNumber:s.phoneNumber,companyName:s.companyName,siretNumber:s.siretNumber.replace(/\D/g,"")};console.log("Envoi des données de mise à jour:",m);const l=await P.updateProfile(m);if(console.log("Réponse complète de mise à jour du profil:",l),console.log("Structure de la réponse:",Object.keys(l)),l.user)console.log("Données utilisateur reçues:",l.user),S(l.user),u("Votre profil a été mis à jour avec succès."),b(!1);else{console.log("Aucune donnée utilisateur dans la réponse");const R=P.getCurrentUser();if(R){const O={...R,firstName:s.firstName,lastName:s.lastName,phoneNumber:s.phoneNumber,companyName:s.companyName,siretNumber:s.siretNumber};S(O),u("Votre profil a été mis à jour avec succès."),b(!1)}}}catch(m){console.error("Erreur de mise à jour du profil:",m);let l="Une erreur est survenue lors de la mise à jour du profil.";((o=m.response)==null?void 0:o.status)===400&&((f=(c=(i=m.response)==null?void 0:i.data)==null?void 0:c.message)!=null&&f.includes("téléphone")?l="Le format du numéro de téléphone n'est pas valide.":(A=(M=(j=m.response)==null?void 0:j.data)==null?void 0:M.message)!=null&&A.includes("SIRET")||(V=(U=(I=m.response)==null?void 0:I.data)==null?void 0:U.message)!=null&&V.includes("numeric")?l="Le format du numéro SIRET n'est pas valide. Il doit contenir exactement 14 chiffres.":l=((T=($=m.response)==null?void 0:$.data)==null?void 0:T.message)||l),t(l)}finally{p(!1)}},K=async n=>{var o,i,c;if(n.preventDefault(),p(!0),t(""),u(""),d.newPassword!==d.confirmPassword){t("Les nouveaux mots de passe ne correspondent pas."),p(!1);return}if(d.newPassword.length<8){t("Le nouveau mot de passe doit comporter au moins 8 caractères."),p(!1);return}try{await P.updatePassword(d.currentPassword,d.newPassword),u("Votre mot de passe a été mis à jour avec succès."),F({currentPassword:"",newPassword:"",confirmPassword:""})}catch(f){((o=f.response)==null?void 0:o.status)===401?t("Le mot de passe actuel est incorrect."):t(((c=(i=f.response)==null?void 0:i.data)==null?void 0:c.message)||"Une erreur est survenue lors de la mise à jour du mot de passe.")}finally{p(!1)}},L=n=>{B(n),t(""),u(""),n==="informations"&&b(!1)};return e.jsx(se,{children:e.jsx("div",{className:"container mx-auto px-4 py-12",children:e.jsxs("div",{className:"max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden",children:[e.jsx("div",{className:"bg-gradient-to-r from-teal-500 to-blue-500 px-6 py-4",children:e.jsx("h1",{className:"text-2xl font-bold text-white",children:"Mon Profil"})}),e.jsxs("div",{className:"flex border-b",children:[e.jsxs("button",{className:`flex items-center px-6 py-4 text-sm font-medium ${y==="informations"?"border-b-2 border-teal-500 text-teal-600":"text-gray-500 hover:text-gray-700"}`,onClick:()=>L("informations"),children:[e.jsx(q,{className:"mr-2"}),"Informations personnelles"]}),e.jsxs("button",{className:`flex items-center px-6 py-4 text-sm font-medium ${y==="motDePasse"?"border-b-2 border-teal-500 text-teal-600":"text-gray-500 hover:text-gray-700"}`,onClick:()=>L("motDePasse"),children:[e.jsx(Q,{className:"mr-2"}),"Changer de mot de passe"]})]}),e.jsxs("div",{className:"p-6",children:[E&&e.jsx("div",{className:"mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded",children:e.jsx("p",{children:E})}),D&&e.jsx("div",{className:"mb-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded",children:e.jsx("p",{children:D})}),y==="informations"&&e.jsxs("form",{onSubmit:W,children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6 mb-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Prénom"}),e.jsxs("div",{className:"relative",children:[e.jsx("div",{className:"absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",children:e.jsx(z,{className:"h-5 w-5 text-gray-400"})}),e.jsx("input",{type:"text",name:"firstName",value:s.firstName,onChange:g,disabled:!a,className:`w-full pl-10 px-4 py-3 rounded-lg border ${a?"border-gray-200 bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent":"border-gray-200 bg-gray-100 cursor-not-allowed"}`,placeholder:"Prénom"})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Nom"}),e.jsxs("div",{className:"relative",children:[e.jsx("div",{className:"absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",children:e.jsx(z,{className:"h-5 w-5 text-gray-400"})}),e.jsx("input",{type:"text",name:"lastName",value:s.lastName,onChange:g,disabled:!a,className:`w-full pl-10 px-4 py-3 rounded-lg border ${a?"border-gray-200 bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent":"border-gray-200 bg-gray-100 cursor-not-allowed"}`,placeholder:"Nom"})]})]})]}),e.jsxs("div",{className:"mb-6",children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Adresse e-mail"}),e.jsxs("div",{className:"relative",children:[e.jsx("div",{className:"absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",children:e.jsx(X,{className:"h-5 w-5 text-gray-400"})}),e.jsx("input",{type:"email",name:"email",value:s.email,onChange:g,disabled:!0,className:"w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-100",placeholder:"email@exemple.com"})]}),e.jsx("p",{className:"mt-1 text-xs text-gray-500",children:"L'adresse e-mail ne peut pas être modifiée."})]}),e.jsxs("div",{className:"mb-6",children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Numéro de téléphone"}),e.jsxs("div",{className:"relative",children:[e.jsx("div",{className:"absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",children:e.jsx(Y,{className:"h-5 w-5 text-gray-400"})}),e.jsx("input",{type:"tel",name:"phoneNumber",value:s.phoneNumber,onChange:g,disabled:!a,className:`w-full pl-10 px-4 py-3 rounded-lg border ${a?"border-gray-200 bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent":"border-gray-200 bg-gray-100 cursor-not-allowed"}`,placeholder:"06 12 34 56 78"})]}),e.jsx("p",{className:"mt-1 text-xs text-gray-500",children:"Format: 06 12 34 56 78 (sera automatiquement converti au format international)"})]}),e.jsxs("div",{className:"mb-6",children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Nom de l'entreprise"}),e.jsxs("div",{className:"relative",children:[e.jsx("div",{className:"absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",children:e.jsx(Z,{className:"h-5 w-5 text-gray-400"})}),e.jsx("input",{type:"text",name:"companyName",value:s.companyName,onChange:g,disabled:!a,className:`w-full pl-10 px-4 py-3 rounded-lg border ${a?"border-gray-200 bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent":"border-gray-200 bg-gray-100 cursor-not-allowed"}`,placeholder:"Nom de l'entreprise"})]})]}),e.jsxs("div",{className:"mb-6",children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Numéro SIRET"}),e.jsxs("div",{className:"relative",children:[e.jsx("div",{className:"absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",children:e.jsx(_,{className:"h-5 w-5 text-gray-400"})}),e.jsx("input",{type:"text",name:"siretNumber",value:s.siretNumber,onChange:g,disabled:!a,pattern:"[0-9]*",inputMode:"numeric",className:`w-full pl-10 px-4 py-3 rounded-lg border ${a?"border-gray-200 bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent":"border-gray-200 bg-gray-100 cursor-not-allowed"}`,placeholder:"12345678901234"})]}),e.jsx("p",{className:"mt-1 text-xs text-gray-500",children:"Format: 14 chiffres uniquement, sans espaces ni caractères spéciaux"})]}),e.jsx("div",{className:"mt-8 flex justify-end space-x-4",children:a?e.jsxs(e.Fragment,{children:[e.jsx("button",{type:"button",onClick:()=>{b(!1),r&&N({firstName:r.firstName||"",lastName:r.lastName||"",email:r.email||"",phoneNumber:r.phoneNumber||"",companyName:r.companyName||"",siretNumber:r.siretNumber||""}),t(""),u("")},className:"px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",children:"Annuler"}),e.jsx("button",{type:"submit",disabled:h,className:`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${h?"bg-teal-400 cursor-not-allowed":"bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"}`,children:h?e.jsxs(e.Fragment,{children:[e.jsxs("svg",{className:"animate-spin -ml-1 mr-2 h-4 w-4 text-white",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Enregistrement..."]}):e.jsxs(e.Fragment,{children:[e.jsx(ee,{className:"mr-2"}),"Enregistrer"]})})]}):e.jsxs("button",{type:"button",onClick:()=>{b(!0),t(""),u("")},className:"flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500",children:[e.jsx(q,{className:"mr-2"}),"Modifier"]})})]}),y==="motDePasse"&&e.jsx("form",{onSubmit:K,className:"mt-4",children:e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{children:[e.jsxs("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:["Mot de passe actuel",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsxs("div",{className:"relative",children:[e.jsx("div",{className:"absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",children:e.jsx(v,{className:"h-5 w-5 text-gray-400"})}),e.jsx("input",{type:"password",name:"currentPassword",value:d.currentPassword,onChange:w,required:!0,className:"w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent",placeholder:"********"})]})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:["Nouveau mot de passe",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsxs("div",{className:"relative",children:[e.jsx("div",{className:"absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",children:e.jsx(v,{className:"h-5 w-5 text-gray-400"})}),e.jsx("input",{type:"password",name:"newPassword",value:d.newPassword,onChange:w,required:!0,minLength:8,className:"w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent",placeholder:"********"})]}),e.jsx("p",{className:"mt-1 text-xs text-gray-500",children:"Le mot de passe doit contenir au moins 8 caractères."})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:["Confirmer le nouveau mot de passe",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsxs("div",{className:"relative",children:[e.jsx("div",{className:"absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",children:e.jsx(v,{className:"h-5 w-5 text-gray-400"})}),e.jsx("input",{type:"password",name:"confirmPassword",value:d.confirmPassword,onChange:w,required:!0,className:"w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent",placeholder:"********"})]})]}),e.jsx("div",{className:"flex justify-end",children:e.jsx("button",{type:"submit",disabled:h,className:"flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500",children:h?e.jsxs(e.Fragment,{children:[e.jsxs("svg",{className:"animate-spin -ml-1 mr-2 h-4 w-4 text-white",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Enregistrement..."]}):e.jsxs(e.Fragment,{children:[e.jsx(v,{className:"mr-2"}),"Changer le mot de passe"]})})})]})})]})]})})})};export{ne as default};
