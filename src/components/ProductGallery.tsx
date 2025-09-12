import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn, Heart, Share2, ShoppingBag } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Thumbs, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

interface ProductGalleryProps {
  animationConfig: any;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ animationConfig }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const galleryImages = [
    {
      id: 1,
      src: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Samsung Galaxy S24 Ultra',
      category: 'Smartphones',
      price: '₹1,29,999'
    },
    {
      id: 2,
      src: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'iPhone 15 Pro Max',
      category: 'Smartphones',
      price: '₹1,59,900'
    },
    {
      id: 3,
      src: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'OnePlus 12',
      category: 'Smartphones',
      price: '₹64,999'
    },
    {
      id: 4,
      src: 'https://images.pexels.com/photos/1275229/pexels-photo-1275229.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Premium Phone Cases',
      category: 'Accessories',
      price: '₹1,999'
    },
    {
      id: 5,
      src: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Premium Earbuds',
      category: 'Audio',
      price: '₹8,999'
    },
    {
      id: 6,
      src: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Bluetooth Speakers',
      category: 'Audio',
      price: '₹4,999'
    },
    {
      id: 7,
      src: 'https://images.pexels.com/photos/4498456/pexels-photo-4498456.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Wireless Chargers',
      category: 'Gadgets',
      price: '₹2,499'
    },
    {
      id: 8,
      src: 'https://images.pexels.com/photos/1482476/pexels-photo-1482476.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Xiaomi 14 Ultra',
      category: 'Smartphones',
      price: '₹99,999'
    }
  ];

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  const handleFavorite = (id: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const handleShare = async (image: any) => {
    const shareData = {
      title: `Check out ${image.title} at Harvinder Telecom`,
      text: `${image.title} - ${image.price}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(`Check out ${image.title} - ${image.price} at Harvinder Telecom! ${window.location.href}`)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleContact = (productName: string) => {
    const message = `Hi! I'm interested in ${productName} from your gallery. Please share more details.`;
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            duration: animationConfig.motionDuration,
            ease: animationConfig.motionEasing
          }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-blue-900 mb-4">Product Gallery</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our complete collection of premium products with detailed views and specifications.
          </p>
        </motion.div>

        {/* Main Gallery Slider */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay, Thumbs]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={true}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            className="main-gallery-swiper rounded-3xl overflow-hidden shadow-2xl"
            style={{ height: '500px' }}
          >
            {galleryImages.map((image) => (
              <SwiperSlide key={image.id}>
                <div className="relative h-full group cursor-pointer" onClick={() => handleImageClick(image.src)}>
                  <img
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Image Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{image.title}</h3>
                        <p className="text-lg text-blue-200">{image.category}</p>
                        <p className="text-2xl font-bold text-green-400">{image.price}</p>
                      </div>
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFavorite(image.id);
                          }}
                          className={`p-3 rounded-full transition-colors duration-200 ${
                            favorites.has(image.id) 
                              ? 'bg-red-500 text-white' 
                              : 'bg-white/20 text-white hover:bg-white/30'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${favorites.has(image.id) ? 'fill-current' : ''}`} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(image);
                          }}
                          className="p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors duration-200"
                        >
                          <Share2 className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContact(image.title);
                          }}
                          className="p-3 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors duration-200"
                        >
                          <ShoppingBag className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Zoom Icon */}
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ZoomIn className="w-6 h-6 text-white" />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* Thumbnail Slider */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Swiper
            modules={[FreeMode, Navigation, Thumbs]}
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={4}
            freeMode={true}
            watchSlidesProgress={true}
            navigation={true}
            breakpoints={{
              640: {
                slidesPerView: 6,
                spaceBetween: 15,
              },
              768: {
                slidesPerView: 8,
                spaceBetween: 20,
              },
            }}
            className="thumbnail-swiper"
          >
            {galleryImages.map((image) => (
              <SwiperSlide key={`thumb-${image.id}`}>
                <div className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group">
                  <img
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* Mobile Grid View */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 md:hidden"
        >
          <h3 className="text-2xl font-bold text-blue-900 mb-6 text-center">Quick Browse</h3>
          <div className="grid grid-cols-2 gap-4">
            {galleryImages.slice(0, 6).map((image, index) => (
              <motion.div
                key={`mobile-${image.id}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative aspect-square rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
                onClick={() => handleImageClick(image.src)}
              >
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h4 className="font-bold text-sm truncate">{image.title}</h4>
                  <p className="text-xs text-green-300">{image.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative max-w-4xl max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedImage}
                  alt="Gallery Image"
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ProductGallery;