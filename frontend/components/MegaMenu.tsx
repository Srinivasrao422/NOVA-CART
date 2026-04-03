import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface MenuCategory {
  title: string;
  items: string[];
}

interface MegaMenuData {
  label: string;
  categories: MenuCategory[];
}

const megaMenuData: MegaMenuData[] = [
  {
    label: 'Men',
    categories: [
      { title: 'Topwear', items: ['T-Shirts', 'Casual Shirts', 'Formal Shirts', 'Sweatshirts', 'Sweaters', 'Jackets', 'Blazers & Coats', 'Suits', 'Rain Jackets'] },
      { title: 'Bottomwear', items: ['Jeans', 'Casual Trousers', 'Formal Trousers', 'Shorts', 'Track Pants & Joggers'] },
      { title: 'Footwear', items: ['Casual Shoes', 'Sports Shoes', 'Formal Shoes', 'Sneakers', 'Sandals & Floaters', 'Flip Flops', 'Socks'] },
      { title: 'Sports & Active Wear', items: ['Sports Shoes', 'Sports Sandals', 'Active T-Shirts', 'Track Pants & Shorts', 'Tracksuits', 'Jackets & Sweatshirts', 'Sports Accessories', 'Swimwear'] },
      { title: 'Fashion Accessories', items: ['Wallets', 'Belts', 'Perfumes & Body Mists', 'Trimmers', 'Deodorants', 'Ties & Cufflinks', 'Caps & Hats', 'Phone Cases', 'Rings & Wristwear'] },
    ],
  },
  {
    label: 'Women',
    categories: [
      { title: 'Indian & Fusion Wear', items: ['Kurtas & Suits', 'Kurtis & Tops', 'Sarees', 'Ethnic Wear', 'Leggings & Churidars', 'Skirts & Palazzos', 'Dress Materials', 'Dupattas & Shawls', 'Jackets'] },
      { title: 'Western Wear', items: ['Dresses', 'Tops', 'Tshirts', 'Jeans', 'Trousers & Capris', 'Shorts & Skirts', 'Co-ords', 'Playsuits', 'Jumpsuits'] },
      { title: 'Footwear', items: ['Flats', 'Casual Shoes', 'Heels', 'Boots', 'Sports Shoes & Floaters'] },
      { title: 'Lingerie & Sleepwear', items: ['Bra', 'Briefs', 'Shapewear', 'Sleepwear & Loungewear', 'Swimwear', 'Camisoles & Thermals'] },
      { title: 'Beauty & Personal Care', items: ['Makeup', 'Skincare', 'Premium Beauty', 'Lipsticks', 'Fragrances'] },
    ],
  },
  {
    label: 'Kids',
    categories: [
      { title: 'Boys Clothing', items: ['T-Shirts', 'Shirts', 'Shorts', 'Jeans', 'Trousers', 'Clothing Sets', 'Ethnic Wear', 'Track Pants & Pyjamas', 'Party Wear'] },
      { title: 'Girls Clothing', items: ['Dresses', 'Tops', 'Tshirts', 'Clothing Sets', 'Lehenga Choli', 'Kurta Sets', 'Party Wear', 'Skirts & Shorts'] },
      { title: 'Footwear', items: ['Casual Shoes', 'Flipflops', 'Sports Shoes', 'Flats', 'Sandals', 'Heels', 'School Shoes', 'Socks'] },
      { title: 'Infants', items: ['Bodysuits', 'Rompers & Sleepsuits', 'Clothing Sets', 'Tshirts & Tops', 'Dresses', 'Bottom Wear', 'Winter Wear', 'Infant Care'] },
      { title: 'Kids Accessories', items: ['Bags & Backpacks', 'Watches', 'Jewellery & Hair Accessory', 'Sunglasses', 'Caps & Hats'] },
    ],
  },
  {
    label: 'Beauty',
    categories: [
      { title: 'Makeup', items: ['Lipstick', 'Lip Gloss', 'Lip Liner', 'Mascara', 'Eyeliner', 'Kajal', 'Eyeshadow', 'Foundation', 'Primer', 'Concealer', 'Nail Polish'] },
      { title: 'Skincare, Bath & Body', items: ['Face Moisturiser', 'Cleanser', 'Masks & Peel', 'Sunscreen', 'Serum', 'Face Wash', 'Eye Cream', 'Lip Balm', 'Body Lotion', 'Body Wash'] },
      { title: 'Haircare', items: ['Shampoo', 'Conditioner', 'Hair Cream', 'Hair Oil', 'Hair Gel', 'Hair Color', 'Hair Serum', 'Hair Accessory'] },
      { title: 'Fragrances', items: ['Perfume', 'Deodorant', 'Body Mist'] },
      { title: "Men's Grooming", items: ['Trimmers', 'Beard Oil', 'Hair Wax'] },
    ],
  },
  {
    label: 'GenZ',
    categories: [
      { title: "Women's Western Wear", items: ['Dresses Under ₹599', 'Tops Under ₹399', 'Jeans Under ₹599', 'Trousers Under ₹699', 'T-shirts Under ₹299'] },
      { title: "Women's Ethnic Wear", items: ['Kurtas Under ₹399', 'Kurtis Under ₹499', 'Kurta Sets Under ₹499', 'Ethnic Dresses Under ₹999'] },
      { title: "Men's Casual Wear", items: ['T-shirts Under ₹299', 'Shirts Under ₹499', 'Jeans Under ₹599', 'Trousers Under ₹699', 'Shorts Under ₹599'] },
      { title: "Women's Footwear", items: ['Heels Under ₹599', 'Flats Under ₹499', 'Casual Shoes Under ₹699', 'Sports Shoes Under ₹999'] },
      { title: 'Beauty & Grooming', items: ['Skincare Under ₹299', 'Haircare Under ₹399', 'Bath & Body Under ₹399', 'MakeUp Under ₹299', 'Fragrances Under ₹399'] },
    ],
  },
  {
    label: 'Studio',
    categories: [
      { title: 'Trending Now', items: ['Street Style', 'Minimalist Looks', 'Athleisure', 'Boho Chic', 'Power Dressing'] },
      { title: 'Style Guides', items: ['Office Wear', 'Weekend Casual', 'Date Night', 'Festival Ready', 'Travel Essentials'] },
      { title: 'Celebrity Style', items: ['Bollywood Inspired', 'K-Pop Fashion', 'Hollywood Glam', 'Red Carpet Looks'] },
      { title: 'New Collections', items: ['Summer \'26', 'Monsoon Edit', 'Festive Collection', 'Resort Wear', 'Sustainable Fashion'] },
    ],
  },
];

const MegaMenu = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <div className="hidden md:flex items-center gap-1">
      {megaMenuData.map((menu) => (
        <div
          key={menu.label}
          className="relative"
          onMouseEnter={() => setActiveMenu(menu.label)}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <button className="px-3 py-5 text-sm font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground">
            {menu.label}
            {menu.label === 'Studio' && (
              <span className="ml-1 rounded bg-accent px-1.5 py-0.5 text-[9px] font-bold text-accent-foreground">NEW</span>
            )}
          </button>

          {activeMenu === menu.label && (
            <div className="absolute left-1/2 top-full -translate-x-1/2 z-50">
              <div className="mt-0 min-w-[700px] max-w-[900px] rounded-b-lg border border-t-2 border-t-accent border-border bg-background p-6 shadow-xl">
                <div className="grid grid-cols-5 gap-6">
                  {menu.categories.map((cat) => (
                    <div key={cat.title}>
                      <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-accent">
                        {cat.title}
                      </h4>
                      <ul className="space-y-1.5">
                        {cat.items.map((item) => (
                          <li key={item}>
                            <Link
                              to={`/shop?megaCategory=${encodeURIComponent(menu.label)}`}
                              className="block text-xs text-muted-foreground transition-colors hover:text-foreground hover:font-medium"
                              onClick={() => setActiveMenu(null)}
                            >
                              {item}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MegaMenu;
