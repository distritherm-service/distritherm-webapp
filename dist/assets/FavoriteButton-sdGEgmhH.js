import{o as v,j as t,K as d}from"./index-2311aXp4.js";const p=({item:r,type:a,className:s=""})=>{const{isFavorite:i,addToFavorites:n,removeFromFavorites:l}=v(),e=i(r.id),u=o=>{o.preventDefault(),o.stopPropagation(),e?l(r.id):n(r,a)};return t.jsx("button",{onClick:u,className:`group ${s}`,"aria-label":e?"Retirer des favoris":"Ajouter aux favoris",children:t.jsx(d,{className:`w-5 h-5 transition-all duration-200 group-hover:scale-110 ${e?"text-red-500 group-hover:text-red-600":"text-gray-400 group-hover:text-red-500"}`})})};export{p as F};
