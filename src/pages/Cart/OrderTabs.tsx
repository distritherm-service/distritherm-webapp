import React, { useState } from 'react';
//import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

interface TabProps {
  number: string;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ number, title, isActive, isCompleted, isDisabled, onClick }) => {
  const baseClasses = "relative flex-1 py-3 sm:py-4 px-2 sm:px-4 text-center transition-all duration-300 text-xs sm:text-sm md:text-base";
  let classes = baseClasses;
  let indicatorClasses = "absolute bottom-0 left-0 w-full h-0.5 transition-all duration-300 ease-in-out";
  
  if (isActive) {
    classes += " bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 font-medium shadow-sm";
    indicatorClasses += " bg-blue-600 scale-x-105";
  } else if (isCompleted) {
    classes += " bg-gradient-to-br from-green-50 to-green-100 text-gray-800 font-medium cursor-pointer hover:from-green-100 hover:to-green-200 hover:scale-105";
    indicatorClasses += " bg-green-500";
  } else if (isDisabled) {
    classes += " bg-gray-50 text-gray-400 cursor-not-allowed";
    indicatorClasses += " bg-gray-200";
  } else {
    classes += " bg-white text-gray-700 cursor-pointer hover:bg-blue-50 hover:text-blue-600 hover:scale-105";
    indicatorClasses += " bg-gray-200";
  }

  // Pour les écrans mobiles, utiliser des titres plus courts
  const mobileTitle = title === "Récapitulatif" ? "Panier" : 
                     title === "Connexion" ? "Connexion" : 
                     title === "Demande de devis" ? "Devis" : title;

  return (
    <button 
      className={classes}
      onClick={onClick}
      disabled={isDisabled}
    >
      <div className="relative z-10">
        <span className="hidden md:inline font-medium text-inherit">{number}. </span>
        <span className="hidden sm:inline">{title}</span>
        <span className="sm:hidden">{mobileTitle}</span>
      </div>
      <div className={indicatorClasses}></div>
    </button>
  );
};

const OrderTabs: React.FC<{ activeTab: number; onChangeTab: (tab: number) => void }> = ({ 
  activeTab, 
  onChangeTab 
}) => {
  const { cart } = useCart();
  const isEmpty = cart.length === 0;

  const tabs = [
    { number: "01", title: "Récapitulatif", path: "recap" },
    { number: "02", title: "Connexion", path: "login" },
    { number: "03", title: "Demande de devis", path: "devis" }
  ];

  const isTabDisabled = (tabIndex: number) => {
    if (isEmpty && tabIndex > 0) return true;
    return tabIndex > activeTab + 1;
  };

  const isTabCompleted = (tabIndex: number) => {
    return tabIndex < activeTab;
  };

  return (
    <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
      <div className="flex divide-x divide-gray-100">
        {tabs.map((tab, index) => (
          <Tab
            key={tab.number}
            number={tab.number}
            title={tab.title}
            isActive={activeTab === index}
            isCompleted={isTabCompleted(index)}
            isDisabled={isTabDisabled(index)}
            onClick={() => {
              if (!isTabDisabled(index)) {
                onChangeTab(index);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default OrderTabs; 