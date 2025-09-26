import { useState, useRef, useEffect } from 'react';
import type { Image } from "../types/images";
import { useNavigate } from 'react-router-dom';

function Carousel({ images }: { images: Image[] }) {
  const navigate = useNavigate();
  // currentIndex初始为1，指向真正的第一张
  const [currentIndex, setCurrentIndex] = useState(1);
  const [showInfo, setShowInfo] = useState(true);
  const transitionRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isImmediate, setIsImmediate] = useState(false); // 是否无动画跳转
  const [showArrow, setShowArrow] = useState(false);
  //  组装带首尾哨兵的图片数组
  const extendedImages = images.length > 0 ? [images[images.length - 1], ...images, images[0]] : [];

  const handleImageClick = () => {
    if (images.length === 0) return;
    // currentIndex-1才是原始images的索引
    navigate(`/${images[currentIndex - 1].source}/${images[currentIndex - 1].id}`);
  };

  const handlePrev = () => {
    if (isTransitioning || images.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (isTransitioning || images.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  // 优化后的动画结束处理
  useEffect(() => {
    if (!isImmediate) return;
    // 动画结束后立即关闭无动画标记
    const timer = setTimeout(() => setIsImmediate(false), 20);
    return () => clearTimeout(timer);
  }, [isImmediate]);

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (currentIndex === 0) {
      // 跳到倒数第二张（真实最后一张），无动画
      setIsImmediate(true);
      setCurrentIndex(images.length);
    } else if (currentIndex === images.length + 1) {
      // 跳到第一张，无动画
      setIsImmediate(true);
      setCurrentIndex(1);
    }
  };

  // 计算transform和transition
  const getTransform = () => `translateX(-${currentIndex * 100}%)`;
  const getTransition = () => isImmediate ? 'none' : 'transform 0.5s ease-in-out';

  useEffect(() => {
    if (images.length === 0) return;
    const timer = setInterval(() => {
      if (!isTransitioning) {
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev + 1);
      }
    }, 3000); // 每3秒切换一次
    return () => clearInterval(timer);
  }, [images.length, isTransitioning]);

  return (
    <div
      className="relative w-[80rem] h-[30rem] mx-auto mt-6"
      onMouseEnter={() => {
        setShowInfo(false);
        setShowArrow(true);
      }}
      onMouseLeave={() => {
        setShowInfo(true);
        setShowArrow(false);
      }}
    >
      {/* 图片滑动区域 */}
      <div className="overflow-hidden w-full h-full rounded-2xl">
        <div
          ref={transitionRef}
          className="flex"
          style={{ transform: getTransform(), transition: getTransition() }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedImages.length > 0 ? (
            extendedImages.map((img, idx) => (
              <img
                key={img.id + '-' + idx}
                onClick={handleImageClick}
                className="w-[80rem] h-[30rem] object-cover flex-shrink-0 cursor-pointer"
                src={img.url}
                alt=""
              />
            ))
          ) : (
            <div className="w-[80rem] h-[25rem] bg-gray-200 flex items-center justify-center">
              暂无图片
            </div>
          )}
        </div>
      </div>

      {/* 左右切换按钮 */}
      <div
        className={`transition-opacity duration-200 ${showArrow ? 'opacity-100' : 'opacity-0'}`}>
        <button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 cursor-pointer duration-200
        text-xl bg-white/50 hover:bg-white/80 rounded-full px-3 py-1 z-10 font-mono font-bold"
          onClick={handlePrev}
          disabled={isTransitioning}
        >
          {"<"}
        </button>
        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2  cursor-pointer duration-200
        text-xl bg-white/50 hover:bg-white/80 rounded-full px-3 py-1 z-10 font-mono font-bold"
          onClick={handleNext}
          disabled={isTransitioning}
        >
          {">"}
        </button>
      </div>

      {/* 底部信息栏 */}
      {images.length > 0 && (
        <div
          className={`absolute bottom-2 left-0 right-0 px-4 font-mono text-sm flex justify-between
                      transition-opacity duration-500 ${showInfo ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="px-2 py-1 bg-white/50 rounded-xl">
            🖼 {images[(currentIndex - 1 + images.length) % images.length]?.resolution}
          </div>
          <div className="px-2 py-1 bg-white/50 rounded-xl">
            🎨 {images[(currentIndex - 1 + images.length) % images.length]?.source}
          </div>
        </div>
      )}
    </div>
  );
}

export default Carousel;
