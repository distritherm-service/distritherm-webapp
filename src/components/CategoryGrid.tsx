import React from 'react';

interface Category {
  title: string;
  image: string;
  icon: React.ReactNode;
}

interface CategoryGridProps {
  categories: Category[];
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {categories.map((category, index) => (
          <div key={index} className="relative group overflow-hidden rounded-xl aspect-[4/3] cursor-pointer">
            <img 
              src={category.image}
              alt={category.title} 
              className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 group-hover:from-black/80 group-hover:to-black/30 transition-all duration-300"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-3">
              <div className="w-12 h-12 mb-2 flex items-center justify-center">
                {category.icon}
              </div>
              <h3 className="text-lg font-bold transform group-hover:-translate-y-1 transition-transform duration-300">
                {category.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid; 