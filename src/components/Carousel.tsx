import { useState, useRef, useEffect, useCallback } from "react";
import type { Image } from "../types/images";
import { useNavigate } from "react-router-dom";

function Carousel({ images }: { images: Image[] }) {
  const navigate = useNavigate();
  // currentIndex初始为1，指向真正的第一张
  const [currentIndex, setCurrentIndex] = useState(1);
  const [showInfo, setShowInfo] = useState(true);
  const transitionRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isImmediate, setIsImmediate] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  
  // 3D效果相关状态
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const carouselBoundsRef = useRef<DOMRect | null>(null);

  const isMobile = window.innerWidth < 768;

  const extendedImages =
    images.length > 0 ? [images[images.length - 1], ...images, images[0]] : [];

  // 缓存轮播图边界信息
  const updateCarouselBounds = useCallback(() => {
    if (carouselRef.current) {
      carouselBoundsRef.current = carouselRef.current.getBoundingClientRect();
    }
  }, []);

  // 3D鼠标移动处理
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return; // 移动端不处理鼠标移动
    if (!carouselBoundsRef.current) return;

    // 取消之前的动画帧
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const rect = carouselBoundsRef.current!;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // 计算鼠标相对于轮播图中心的位置
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      // 由于轮播图较大，减少旋转幅度使效果更自然
      const rotateX = (mouseY / (rect.height / 2)) * -8; // 较小的旋转角度
      const rotateY = (mouseX / (rect.width / 2)) * 8;

      setMousePosition({ x: rotateY, y: rotateX });
    });
  }, [isMobile]);

  const handleMouseEnter = useCallback(() => {
    if (isMobile) {
      setShowArrow(true);
      setIsHovered(true);
      return;
    }
    updateCarouselBounds();
    setShowInfo(false);
    setShowArrow(true);
    setIsHovered(true);
  }, [updateCarouselBounds, isMobile]);

  const handleMouseLeave = useCallback(() => {
    // 取消未完成的动画帧
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    setShowInfo(true);
    setShowArrow(false);
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  }, []);

  // 3D变换样式计算 - 移动端使用简单缩放
  const get3DTransformStyle = useCallback(() => {
    if (isMobile) {
      return {
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
        transition: 'transform 0.2s ease-out',
        willChange: 'transform'
      };
    }

    // 在切换过程中禁用3D效果避免冲突
    if (isTransitioning) {
      return {
        transform:
          "perspective(1200px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)",
        transition: "none",
        willChange: "auto",
      };
    }

    if (!isHovered) {
      return {
        transform:
          "perspective(1200px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)",
        transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        willChange: "auto",
      };
    }

    return {
      transform: `perspective(1200px) rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg) translate3d(0, -5px, 15px)`,
      transition: "transform 0.1s ease-out",
      willChange: "transform",
    };
  }, [isHovered, mousePosition.x, mousePosition.y, isTransitioning, isMobile]);

  // 清理动画帧
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleImageClick = () => {
    if (images.length === 0) return;
    navigate(
      `/${images[currentIndex - 1].source}/${images[currentIndex - 1].id}`
    );
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

  useEffect(() => {
    if (!isImmediate) return;
    // 使用requestAnimationFrame确保在下一帧执行
    const frame = requestAnimationFrame(() => {
      const timer = setTimeout(() => setIsImmediate(false), 16);
      return timer;
    });
    return () => cancelAnimationFrame(frame);
  }, [isImmediate]);

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (currentIndex === 0) {
      setIsImmediate(true);
      setCurrentIndex(images.length);
    } else if (currentIndex === images.length + 1) {
      setIsImmediate(true);
      setCurrentIndex(1);
    }
  };

  const getTransform = () => `translateX(-${currentIndex * 100}%)`;
  const getTransition = () => {
    if (isImmediate) return "none";
    // 在3D变换时使用更流畅的缓动函数
    return "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
  };

  useEffect(() => {
    if (images.length === 0) return;
    const timer = setInterval(() => {
      if (!isTransitioning && !isHovered) {
        // 悬停时暂停自动播放
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev + 1);
      }
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length, isTransitioning, isHovered]);

  return (
    <div
      ref={carouselRef}
      className="relative w-full  h-[15rem] sm:h-[20rem] lg:h-[25rem] xl:h-[30rem] mx-auto mt-6 transform-gpu card-3d contain-layout-paint rounded-2xl"
      style={{
        // 动态阴影效果
        boxShadow: isHovered
          ? "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)"
          : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        ...get3DTransformStyle(),
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 图片滑动区域 */}
      <div className="overflow-hidden w-full h-full rounded-2xl">
        <div
          ref={transitionRef}
          className="flex transform-gpu"
          style={{
            transform: getTransform(),
            transition: getTransition(),
            willChange: isTransitioning ? "transform" : "auto",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedImages.length > 0 ? (
            extendedImages.map((img, idx) => (
              <img
                key={img.id + "-" + idx}
                onClick={handleImageClick}
                className="w-full h-[15rem] sm:h-[20rem] lg:h-[25rem] xl:h-[30rem] object-cover flex-shrink-0 cursor-pointer transform-gpu image-crisp"
                src={img.url}
                alt=""
                loading="eager"
                decoding="async"
                style={{
                  willChange: isTransitioning ? "transform" : "auto",
                }}
              />
            ))
          ) : (
            <div className="w-full h-[15rem] sm:h-[20rem] lg:h-[25rem] xl:h-[30rem] bg-gray-200 flex items-center justify-center">
              暂无图片
            </div>
          )}
        </div>
      </div>

      {/* 左右切换按钮 */}
      <div
        className={`transition-opacity duration-200 ${
          showArrow ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          className="absolute left-2 sm:left-4 lg:left-10 top-1/2 transform -translate-y-1/2 cursor-pointer duration-200
        text-sm sm:text-lg xl:text-xl bg-white/50 hover:bg-white/80 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 z-10 font-mono font-bold"
          onClick={handlePrev}
          disabled={isTransitioning}
          style={{
            transform: isHovered
              ? `translate(-50%, -50%) translate3d(0, 0, 10px)`
              : "translate(-50%, -50%)",
            transition: "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          {"<"}
        </button>
        <button
          className="absolute right-2 sm:right-4 lg:right-10 top-1/2 transform -translate-y-1/2  cursor-pointer duration-200
        text-sm sm:text-lg xl:text-xl bg-white/50 hover:bg-white/80 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 z-10 font-mono font-bold"
          onClick={handleNext}
          disabled={isTransitioning}
          style={{
            transform: isHovered
              ? `translate(50%, -50%) translate3d(0, 0, 10px)`
              : "translate(50%, -50%)",
            transition: "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          {">"}
        </button>
      </div>

      {/* 底部信息栏 */}
      {images.length > 0 && (
        <div
          className={`absolute bottom-2 left-0 right-0 px-2 sm:px-4 font-mono text-xs sm:text-sm flex justify-between
                      transition-opacity duration-500 ${
                        showInfo ? "opacity-100" : "opacity-0"
                      }`}
          style={{
            transform: isHovered
              ? `translate3d(0, 0, 20px)`
              : "translate3d(0, 0, 0)",
            transition: "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            willChange: isHovered ? "transform" : "auto",
          }}
        >
          <div className="px-2 py-1 bg-white/50 rounded-xl">
            🖼{" "}
            {
              images[(currentIndex - 1 + images.length) % images.length]
                ?.resolution
            }
          </div>
          <div className="px-2 py-1 bg-white/50 rounded-xl">
            🎨{" "}
            {images[(currentIndex - 1 + images.length) % images.length]?.source}
          </div>
        </div>
      )}
    </div>
  );
}

export default Carousel;
