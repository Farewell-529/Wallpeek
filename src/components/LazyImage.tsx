import { useRef, useEffect, useState } from "react";

// 定义组件的 props 类型
interface LazyImageProps {
    src: string;
    resolution: string;
    source: string;
}

function LazyImage(props: LazyImageProps) {
    const { src, resolution, source } = props;
    const imgRef = useRef<HTMLImageElement>(null);
    const [show, setShow] = useState(false);
    const [showInfo, setShowInfo] = useState(true);
    useEffect(() => {
        const observer = new window.IntersectionObserver(
            entries => {
                //判断是否交叉
                if (entries[0].isIntersecting) {
                    setShow(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 } //可见时加载
        );
        if (imgRef.current) observer.observe(imgRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div className="relative cursor-pointer hover:-translate-y-3 shadow-xl transition-all rounded-2xl
            border w-full h-[12.5rem] overflow-hidden"
            style={{ borderColor: show ? "transparent" : "#DCDCDC" }}
            onMouseEnter={() => setShowInfo(false)}
            onMouseLeave={() => setShowInfo(true)}
        >
            {
                !show && <span className="absolute left-1/2 top-1/2 -translate-x-1/2 
                -translate-y-1/2 text-gray-700 font-bold">
                    加载中...
                </span>
            }

            <div className="w-full h-full flex justify-center">
                <img
                    className="w-full h-full rounded-2xl object-cover"
                    ref={imgRef}
                    src={show ? src : "null"}
                    style={{ opacity: show ? 1 : 0, transition: "opacity 0.3s" }}
                />
            </div>
            <div
                className={`absolute bottom-2 px-2 font-mono text-sm flex justify-between 
                    w-full transition-opacity duration-400 ${showInfo ? 'opacity-100' : 'opacity-0'
                    }`}
            >
                <div className="px-1 py-0.5 bg-white/50 rounded-xl">🖼{resolution}</div>
                <div className="px-1 py-0.5 bg-white/50 rounded-xl">🎨{source}</div>
            </div>
        </div>
    );
};

export default LazyImage;
