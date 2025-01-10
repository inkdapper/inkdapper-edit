import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import RelatedProducts from '../components/RelatedProducts'
import { toast } from "react-toastify";
import { Flip } from 'react-toastify';
import ProductReviewSection from '../components/ProductReviewSection'
import ListReviews from '../components/ListReviews'
import { FaStar } from 'react-icons/fa';

const Product = () => {

  const { productId } = useParams()
  const { products, currency, addToCart, token, getCartCount, addToWishlist, getWishlistCount, reviewList } = useContext(ShopContext)
  const [productData, setProductData] = useState(false)
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')
  const [buyNow, setBuyNow] = useState('hidden')
  const [wishlistCta, setWishlistCta] = useState('hidden')
  const [wishlistCount, setWishlistCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0)
  const [averageRating, setAverageRating] = useState(0);
  const [changeText, setChangeText] = useState('')

  useEffect(() => {
    const fetchCounts = async () => {
      const wishlistCount = await getWishlistCount();
      setWishlistCount(wishlistCount);
    }
    fetchCounts();
  }, [getWishlistCount]);

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item)
        setImage(item.image[0])
        return null
      }
    })
  }

  const addCartPageDetails = () => {
    if (!token) {
      toast.error('Please login to add product to cart', { autoClose: 1000, })
    } else if (!size) {
      toast.error('Select Product Size', {
        autoClose: 2000, pauseOnHover: false,
        transition: Flip
      })
    } else {
      addToCart(productData._id, size)
      console.log(addToCart(productData._id, size))
      toast.success(`One Item Is Added To Cart`, {
        autoClose: 1000, pauseOnHover: false,
        transition: Flip
      })

      if (getCartCount() >= 0) {
        setBuyNow('block')
      }
    }
  }

  const addToWishlistPage = () => {
    if (!token) {
      toast.error('Please login to add product to cart', { autoClose: 1000, })
    } else {
      addToWishlist(productData._id)

      if (wishlistCount >= 0) {
        setWishlistCta('block')
      }
    }
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
    const newText = subCategoryMap[productData.subCategory];
    if (newText) {
      setChangeText(newText);
    }
  }

  const getProductReviewCount = () => {
    const productReviews = reviewList.filter(item => item.productId === productId);
    const reviewCount = productReviews.length
    setReviewCount(reviewCount)

    const totalRating = productReviews.reduce((acc, items) => {
      const rating = Number(items.rating);
      return acc + (isNaN(rating) ? 0 : rating);
    }, 0);

    const averageRating = productReviews.length > 0 ? totalRating / productReviews.length : 0;
    const getAverageRating = Math.floor(averageRating * 5) / 5
    setAverageRating(getAverageRating);
  }

  const stars = [1, 2, 3, 4, 5];

  useEffect(() => {
    fetchProductData()
    getProductReviewCount()
    createNew();
    console.log(products)
  }, [productId, products, size, getCartCount, getWishlistCount, reviewList])

  return productData ? (
    <div className='border-t-2 pt-6 md:pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/* product data */}
      <div className='flex gap-5 md:gap-12 sm:gap-12 flex-col md:flex-row'>

        {/* product image */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row w-[100%] sm:w-[605px]'>
          <div className='flex sm:flex-col md:overflow-x-auto sm:overflow-y-scroll justify-between w-[20%]'>
            {
              productData.image.map((item, index) => (
                <img onClick={() => setImage(item)} src={item} key={index} alt="product-image" className='w-[100%] h-[23%] flex-shrink-0 cursor-pointer shadow-lg' />
              ))
            }
          </div>
          <div className='w-[80%] h-[100%] flex justify-center'>
            <img src={image} className='h-[100%] shadow-lg' alt="product-image" />
          </div>
        </div>

        {/* product-info */}
        <div className='flex-1'>
          <h1 className='font-medium text-xl md:text-2xl lg:text-3xl'>{productData.name}</h1>
          <p className='text-gray-500 mt-1 text-sm md:text-base md:mt-2'>{changeText}</p>
          <div className='relative'>
            <div className='flex items-center gap-1 mt-2 absolute -top-8 right-0 md:static'>
              {stars.map((starValue) => (
                <FaStar
                  key={starValue}
                  className={`cursor-pointer md:static ${averageRating >= starValue ? 'text-red-500' : 'text-gray-300'}`}
                  size={15}
                />
              ))}
              <p className='pl-2'>( {reviewCount} )</p>
            </div>
          </div>
          <div className='flex items-center gap-6'>
            {
              productData.beforePrice && <p className='mt-2 md:mt-3 lg:mt-5 text-lg md:text-xl lg:text-2xl text-gray-500 font-medium relative'>
                <span className='w-12 md:w-16 lg:w-20 h-[1.5px] bg-red-500 absolute top-3 lg:top-4 -right-1 lg:-right-3 -rotate-12'></span>{currency} {productData.beforePrice}
              </p>
            }
            <p className='mt-2 md:mt-3 lg:mt-5 text-xl md:text-2xl lg:text-3xl font-medium'>{currency} {productData.price}</p>
          </div>
          <p className='mt-2 md:mt-3 lg:mt-5 text-sm md:text-base text-gray-500 w-4/5 '>{productData.description}</p>
          <div className='flex flex-col gap-4 my-2 md:my-4 lg:my-8'>
            <p>Select size</p>
            <div className='flex gap-2'>
              {
                productData.sizes.map((item, index) => {
                  return (
                    <button onClick={() => setSize(item)} key={index} className={`border text-sm md:text-base py-2 px-3 md:py-1 md:px-2 lg:py-2 lg:px-4 bg-gray-100 gap-4 ${item == size ? 'border-orange-500' : ''}`}>{item}</button>
                  )
                })
              }
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='flex flex-wrap gap-2 mt-2 md:mt-4'>
              <button onClick={() => addCartPageDetails()} className='bg-black text-white px-4 md:px-8 py-2 md:py-3 text-xs md:text-sm active:bg-gray-700'>ADD TO CART</button>
              <Link to='/cart'>
                <button className={`bg-black text-white  px-4 md:px-8 py-2 md:py-3 text-xs md:text-sm active:bg-gray-700 ${buyNow}`}>BUY NOW</button>
              </Link>
            </div>
            <div className='flex flex-wrap gap-2'>
              <button onClick={() => addToWishlistPage()} className={`bg-black text-white px-4 md:px-8 py-2 md:py-3 text-xs md:text-sm active:bg-gray-700`}>ADD TO WISHLIST</button>
              <Link to='/wishlist'>
                <button className={`bg-black text-white px-4 md:px-8 py-2 md:py-3 text-xs md:text-sm active:bg-gray-700 ${wishlistCta}`}>WISHLIST</button>
              </Link>
            </div>
          </div>
          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days</p>
          </div>
        </div>
      </div>
      {/* --------------Review Images------------------ */}
      {productData.reviewImage.length > 0 ? <h3 className='font-medium text-lg mt-8 mb-1'>Review Images</h3> : ''}

      <div className='gap-4 flex'>
        {
          productData.reviewImage.map((item, index) => (
            <div className='mt-5' key={index}>
              <div className='flex flex-col gap-4'>
                <img src={item} alt="product-image" className='w-40 h-48 object-contain' />
              </div>
            </div>
          ))
        }
      </div>

      <div className='flex flex-col lg:flex lg:flex-row w-auto justify-between items-start lg:items-center'>
        {/* -------------User Reviews-------------- */}
        <ProductReviewSection productId={productData._id} className="w-1/2" />

        {/* -------------User Reviews-------------- */}
        <ListReviews className="w-1/2" />
      </div>

      {/* ------Description and review sections */}
      {/* <div className='mt-20'>
        <div className='flex'>
          <p className='border px-5 py-3 text-sm'>Reviews (122)</p>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          <p>
            E-commercer websites Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsa voluptas esse aspernatur alias odit enim quidem perferendis placeat unde illo quod repudiandae pariatur officia, eum beatae odio atque quibusdam sit!
          </p>
        </div>
      </div> */}

      {/* ----------Display related products */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  ) : <div className='text-6xl font-semibold text-gray-400 flex items-center justify-center text-center pt-20'>Product Not Available<br /> Sorry!</div>
}

export default Product