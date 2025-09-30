import { useRef, useEffect, useState, useCallback } from "react";

// 定义组件的 props 类型
interface LazyImageProps {
    src: string;
    resolution: string;
    source: string;
}

function LazyImage(props: LazyImageProps) {
    const { src, resolution, source } = props;
    const imgRef = useRef<HTMLImageElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false); 
    const [showInfo, setShowInfo] = useState(true);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const animationFrameRef = useRef<number | null>(null);
    const cardBoundsRef = useRef<DOMRect | null>(null);

    useEffect(() => {
        const observer = new window.IntersectionObserver(
            entries => {
                //判断是否交叉
                if (entries[0].isIntersecting) {
                    setShow(true);
                    setIsLoading(true); 
                    observer.disconnect();
                }
            },
            { threshold: 0.3 } //可见时加载
        );
        if (imgRef.current) observer.observe(imgRef.current);
        return () => observer.disconnect();
    }, []);

    // 缓存卡片边界信息
    const updateCardBounds = useCallback(() => {
        if (cardRef.current) {
            cardBoundsRef.current = cardRef.current.getBoundingClientRect();
        }
    }, []);

    // 优化的鼠标移动处理，使用 requestAnimationFrame
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardBoundsRef.current) return;
        
        // 取消之前的动画帧
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        
        animationFrameRef.current = requestAnimationFrame(() => {
            const rect = cardBoundsRef.current!;
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // 计算鼠标相对于卡片中心的位置
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;
            
            // 归一化到 -1 到 1 的范围，减少旋转角度使动画更自然
            const rotateX = (mouseY / (rect.height / 2)) * -15; // 减少到8度
            const rotateY = (mouseX / (rect.width / 2)) * 15;
            
            setMousePosition({ x: rotateY, y: rotateX });
        });
    }, []);

    const handleMouseEnter = useCallback(() => {
        updateCardBounds(); // 进入时更新边界信息
        setShowInfo(false);
        setIsHovered(true);
    }, [updateCardBounds]);

    const handleMouseLeave = useCallback(() => {
        // 取消未完成的动画帧
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        
        setShowInfo(true);
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 }); // 重置旋转
    }, []);

    // 优化的变换样式计算
    const getTransformStyle = useCallback(() => {
        if (!isHovered) {
            return {
                transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)',
                transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                willChange: 'auto'
            };
        }
        
        return {
            transform: `perspective(1000px) rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg) translate3d(0, -10px, 25px)`,
            transition: 'transform 0.1s ease-out',
            willChange: 'transform'
        };
    }, [isHovered, mousePosition.x, mousePosition.y]);

    // 图片加载完成处理
    const handleImageLoad = useCallback(() => {
        setIsLoading(false);
    }, []);

    // 图片加载失败处理
    const handleImageError = useCallback(() => {
        setIsLoading(false);
    }, []);

    // 清理动画帧
    useEffect(() => {
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return (
        <div 
            ref={cardRef}
            className="relative cursor-pointer shadow-xl rounded-2xl
                border w-full h-[12.5rem] overflow-hidden transform-gpu card-3d"
            style={{ 
                borderColor: show ? "transparent" : "#DCDCDC",
                backfaceVisibility: 'hidden',
                transformStyle: 'preserve-3d',
                ...getTransformStyle()
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* 修改后的加载提示逻辑 */}
            {isLoading && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                    text-gray-700 font-mono text-sm font-bold">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        <span>加载中...🤔</span>
                    </div>
                </div>
            )}

            <div className="w-full h-full flex justify-center">
                <img
                    className="w-full h-full rounded-2xl object-cover"
                    ref={imgRef}
                    src={show ? src : ""}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    style={{ 
                        opacity: show && !isLoading ? 1 : 0, 
                        transition: "opacity 0.3s ease-in-out"
                    }}
                />
            </div>
            
            <div
                className={`absolute bottom-2 px-2 font-mono text-sm flex justify-between 
                    w-full transition-opacity duration-400 ${showInfo ? 'opacity-100' : 'opacity-0'
                    }`}
                style={{
                    transform: isHovered ? `translate3d(0, 0, 30px)` : 'translate3d(0, 0, 0)',
                    transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    willChange: isHovered ? 'transform' : 'auto'
                }}
            >
                <div className="px-1 py-0.5 bg-white/50 rounded-xl">🖼{resolution}</div>
                <div className="px-1 py-0.5 bg-white/50 rounded-xl">🎨{source}</div>
            </div>
        </div>
    );
};

export default LazyImage;