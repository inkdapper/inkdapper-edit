import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'


const slides = [
    { slideNo: 1, image: assets.banner_one },
    { slideNo: 2, image: assets.banner_two },
    { slideNo: 3, image: assets.banner_three },
];

const Slider = () => {

    const [currentIndex, setCurrentIndex] = useState(0);

    const sliderLoading = () => {
      const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
          prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
      }, 3000);

      return () => clearInterval(interval);
    }

    useEffect(() => {
      sliderLoading()
    }, []);

  return (
    <div>

    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-1000"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide) => (
          <img
            key={slide.slideNo}
            src={slide.image}
            alt={`Slide ${slide.slideNo}`}
            className="w-full object-cover"
          />
        ))}
      </div>
    </div>
    </div>
  )
}

export default Slider