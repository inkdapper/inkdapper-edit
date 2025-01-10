import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { assets } from '../assets/assets';

const ProductItem = ({ id, image, name, price, beforePrice, subCategory }) => {

  const { currency, scrollToTop, addToWishlist, token, wishlist } = useContext(ShopContext)
  const [favWishlist, setFavWishlist] = useState([])
  const [changeText, setChangeText] = useState('')

  const addToWishlistPage = () => {
    if (!token) {
      toast.error('Please login to add product to cart', { autoClose: 1000, })
    } else {
      addToWishlist(id)
    }
  }
  const funcFavWishlist = () => {
    const obj = wishlist;
    const keys = Object.keys(obj);
    setFavWishlist(keys)
  }

  const createNew = () => {
    const subCategoryMap = {
      'Customtshirt': 'Custom T-shirt',
      'Oversizedtshirt': 'Oversized T-shirt',
      'Quotesdesigns': 'Quotes Designs',
      'Plaintshirt': 'Plain T-shirt',
      'Acidwash': 'Acid Wash',
      'Polotshirt': 'Polo T-shirt',
      'Hoddies': 'Hoodies', // Fixed spelling
      'Sweattshirts': 'Sweat T-shirt' // Fixed spelling
    };

    // Use the mapping object to set the change text
    const newText = subCategoryMap[subCategory];
    if (newText) {
      setChangeText(newText);
    }
  }

  useEffect(() => {
    funcFavWishlist();
    createNew();
  }, [wishlist]);

  return (
    <div className='relative'>
      {favWishlist.includes(id) ? <FavoriteIcon onClick={() => addToWishlistPage()} className={`absolute right-3 top-2 z-20 cursor-pointer`} /> : <FavoriteBorderIcon onClick={() => addToWishlistPage()} className={`absolute right-3 top-2 z-20 cursor-pointer`} />}

      <Link onClick={() => scrollToTop()} className={`text-gray-700 cursor-pointer`} to={`/product/${id}`}>
        <div className='transition-shadow shadow-[3px_3px_rgba(0,0,0,_0.4),_6px_6px_rgba(0,0,0,_0.3),_9px_9px_rgba(0,0,0,_0.2),_12px_12px_rgba(0,0,0,_0.1),_15px_15px_rgba(0,0,0,_0.05)] rounded-md object-contain bg-white hover:shadow-[1px_1px_rgba(0,0,0,_0.4),_2px_2px_rgba(0,0,0,_0.3),_3px_3px_rgba(0,0,0,_0.2),_4px_4px_rgba(0,0,0,_0.1),_5px_5px_rgba(0,0,0,_0.05)]'>
          <div className="overflow-hidden h-48 sm:h-64 bg-gray-200 flex justify-center items-center rounded-t-md relative product-image">
            <img src={image[0]} alt={name} className="transition-all ease-in-out h-[100%] object-cover relative z-10" />
            {/* <img src={assets.inkdapper_logo} alt="logo" className='w-full p-12 rotate-12 opacity-10 absolute'/> */}
          </div>
          <div className='border-l-2 border-l-gray-950 border-t-2 border-t-gray-950 rounded-b-md relative'>
            <p className='pt-2 pb-2 pl-3 pr-1 text-sm md:text-base font-medium md:font-semibold truncate'>{name}</p>
            {
              changeText &&
              <p className='py-1 px-2 mx-0 text-sm text-white truncate -left-[2px] z-10 absolute -top-7 bg-gray-900'>{changeText}</p>
            }
            <div className='flex items-center pt-2 bg-gray-950'>
              {
                beforePrice && <p className='text-sm pl-4 pb-2 text-gray-300 font-medium relative'>
                  <span className='w-11 h-[2px] bg-red-500 absolute top-[10px] -right-2 -rotate-12'></span>{currency} {beforePrice}</p>
              }
              <p className=' text-sm md:text-lg text-white pl-4 pb-2 font-semibold'>{currency} {price}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductItem