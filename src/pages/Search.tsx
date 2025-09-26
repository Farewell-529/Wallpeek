import { useEffect, useState, useRef } from "react";
import { getSearchWallhavenApi } from "../api/wallhaven/search"
import { getSearchKonachanApi } from "../api/konachan/search"
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { useSource } from "../context/SourceContext";
import LazyImage from "../components/LazyImage";
import SwitchSource from "../components/SwitchSource";
import type { Image} from "../types/images";
function Search() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("keyword");
    const [images, setImages] = useState<Image[]>([]);
    const [page, setPage] = useState(1);
    const loadingRef = useRef(false);
    const { currentSource } = useSource();
    const [showText, setShowText] = useState('搜索中....')
    const handleImageClick = (id: string, source: string) => {
        navigate(`/${source}/${id}`);
    };
    const getSearcImage = async () => {
        let res: Image[] = [];
        if (currentSource === 'wallhaven') {
            res = await getSearchWallhavenApi({ keyword: keyword || '', page });
        }
        if (currentSource === 'konachan') {
            res = await getSearchKonachanApi({ keyword: keyword || '', page })
        }
        if (res.length === 0) setShowText("没找到图片~")
        // 判断是否有已经存在的图片
        if (!res.some((img: Image) => img?.id === images[0]?.id)) {
            loadingRef.current = true;
            setImages(res);
            return
        }
        setImages(prev => ([...prev, ...res]));
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
    // useEffect(() => {
    //     const sourceParam = searchParams.get("source") as Source || 'wallhaven';
    //     setSource(sourceParam);
    // }, [searchParams]);
    useEffect(() => {
        setPage(1);
        setImages([]);
        getSearcImage();
    }, [location.pathname, location.search]) 


    // 处理滚动加载更多
    useEffect(() => {
        if (page > 1) {
            getSearcImage();
        }
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [page])
    return (
        <div className="w-[80rem]   mx-auto">
            <SwitchSource switchSource={getSource} />
            {
                images.length !== 0 ? (
                    <div className="mb-10 grid grid-cols-4 gap-5 ">
                        {images.map((img) => (
                            <div
                                key={img.id}
                                className="cursor-pointer"
                                onClick={() => handleImageClick(img.id, img.source)}
                            >
                                <LazyImage src={img.sample} alt="" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-gray-500 text-2xl">{showText}</div>
                )
            }
        </div>
    )
}
export default Search;