import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { Image } from "../types/images";
import { getLatestWallhavenApi } from "../api/wallhaven/latest";
import Carousel from "../components/Carousel";
import LazyImage from "../components/LazyImage";
import SwitchSource from "../components/SwitchSource";
import { getLatestKonachanApi } from "../api/konachan/latest";
import { useSource } from "../context/SourceContext";

function Home() {
  const navigate = useNavigate();
  const [images, setImages] = useState<Image[]>([]);
  const [page, setPage] = useState(1);
  const loadingRef = useRef(false);
  const [carouselImages, setCarouselImages] = useState<Image[]>([]);
  const { currentSource, setCurrentSource } = useSource();
  const [searchParams] = useSearchParams();
  const [carouselSet, setCarouselSet] = useState(false);
  const hasInitialized = useRef(false); // 添加初始化标记

  // 控制首次加载
  // 获取代理URL的辅助函数
  const getProxyUrl = useCallback((originalUrl: string) => {
    const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";
    return `${baseURL}/image?url=${encodeURIComponent(originalUrl)}`;
  }, []);

  const handleImageClick = (id: string, source: string) => {
    navigate(`/${source}/${id}`);
  };

  // 随机选取数组中的 n 个元素
  function getRandomItems<T>(arr: T[], n: number): T[] {
    const result = [];
    const used = new Set<number>();
    while (result.length < n && arr.length > 0) {
      const idx = Math.floor(Math.random() * arr.length);
      if (!used.has(idx)) {
        result.push(arr[idx]);
        used.add(idx);
      }
    }
    return result;
  }

  const getLatesImage = useCallback(async () => {
    if (loadingRef.current) {
      return; // 防止重复调用
    }
    loadingRef.current = true;
    let res: Image[] = [];
    switch (currentSource) {
      case 'wallhaven':
        res = await getLatestWallhavenApi({ page });
        break;
      case 'konachan':
        res = await getLatestKonachanApi({ page });
        break;
      default:
        console.warn('未知源', currentSource);
        res = [];
        break;
    }
    setImages(prev => {
      const newImages = [...prev, ...res];
      if (!carouselSet) {
        const randomImages = getRandomItems(newImages, 4).map(img => ({
          ...img,
          url: getProxyUrl(img.url),
          sample: getProxyUrl(img.sample)
        }));
        setCarouselImages(randomImages);
        setCarouselSet(true);
      }
      return newImages;
    });
    loadingRef.current = false;
  }, [currentSource, page, carouselSet, getProxyUrl]);

  const handleScroll = () => {
    // 判断是否滑到底部，并且没有在加载中
    if (
      window.innerHeight + window.scrollY >= document.body.scrollHeight - 2 &&
      !loadingRef.current
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };
  const getSource = () => {
    setPage(1);        // 重置页码
    setImages([]);     // 清空图片列表
  }
  // 初始化数据
  useEffect(() => {
    const source = searchParams.get('source') || 'wallhaven';
    setCurrentSource(source);
    setPage(1);
    setImages([]);
    setCarouselSet(false);
    hasInitialized.current = false; // 重置初始化标记
  }, [searchParams, setCurrentSource])

  // 加载图片数据
  useEffect(() => {
    // 防止重复调用：只在初始化完成且未加载时执行
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      getLatesImage();
    }
  }, [getLatesImage])

  // 监听页码变化加载更多数据
  useEffect(() => {
    // 跳过初始的 page=1，因为上面已经处理了
    if (page > 1) {
      getLatesImage();
    }
  }, [page, getLatesImage])

  // 滚动事件监听
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // 只在组件挂载时添加监听器
  return (
    <div className="w-[80rem]  mx-auto">
      <Carousel images={carouselImages} />
      <SwitchSource switchSource={getSource} />
      <div className="mt-5 grid grid-cols-4 gap-8 ">
        {images.map((img) => (
          <div
            key={img.id}
            className="cursor-pointer"
            onClick={() => handleImageClick(img.id, img.source)}
          >
            <LazyImage src={getProxyUrl(img.sample)} resolution={img.resolution} source={img.source} />

          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;