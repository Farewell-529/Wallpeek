import { useEffect, useState, useRef } from "react";
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
  const [carouselSet, setCarouselSet] = useState(false); // 新增

  // 控制首次加载
  const [ready, setReady] = useState(false);
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

  const getLatesImage = async () => {
    loadingRef.current = true;
    let res: Image[];
    switch (currentSource) {
      case 'wallhaven':
        res = await getLatestWallhavenApi({ page });
        break;
      case 'konachan':
        res = await getLatestKonachanApi({ page });
        break;
      default:
        console.warn('未知源', currentSource);
        break;
    }
    setImages(prev => {
      const newImages = [...prev, ...res];
      if (!carouselSet) {
        setCarouselImages(getRandomItems(newImages, 4));
        setCarouselSet(true);
      }
      return newImages;
    });
    loadingRef.current = false;
  }

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
  useEffect(() => {
    const source = searchParams.get('source') || 'wallhaven';
    setCurrentSource(source);
    setPage(1);
    setImages([]);
    setReady(true)
  }, [])
  useEffect(() => {
    if (!ready) return;
    getLatesImage();
    window.addEventListener('scroll', handleScroll);
    // 返回清理函数
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentSource, page, ready]);
  return (
    <div className="w-[80rem]  mx-auto">
      <Carousel images={carouselImages} />
      <SwitchSource switchSource={getSource} />
      <div className="mt-5 grid grid-cols-4 gap-5 ">
        {images.map((img) => (
          <div
            key={img.id}
            className="cursor-pointer"
            onClick={() => handleImageClick(img.id, img.source)}
          >
            <LazyImage src={img.sample} resolution={img.resolution} source={img.source} alt="" />

          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;