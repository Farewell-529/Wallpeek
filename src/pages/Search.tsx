import { useEffect, useState, useRef, useCallback } from "react";
import { getSearchWallhavenApi } from "../api/wallhaven/search";
import { getSearchKonachanApi } from "../api/konachan/search";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSource } from "../context/SourceContext";
import LazyImage from "../components/LazyImage";
import SwitchSource from "../components/SwitchSource";
import type { Image } from "../types/images";

function Search() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("keyword");
    const [images, setImages] = useState<Image[]>([]);
    const [page, setPage] = useState(1);
    const loadingRef = useRef(false);
    const { currentSource } = useSource();
    const [showText, setShowText] = useState("搜索中....");

    const getProxyUrl = useCallback((originalUrl: string) => {
        const baseURL =
            import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";
        return `${baseURL}/image?url=${encodeURIComponent(originalUrl)}`;
    }, []);

    const handleImageClick = useCallback((id: string, source: string) => {
        navigate(`/${source}/${id}`);
    }, [navigate]);

    const handleScroll = () => {
        if (
            window.innerHeight + window.scrollY >= document.body.scrollHeight - 2 &&
            !loadingRef.current
        ) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const getSource = useCallback(() => {
        setPage(1);
        setImages([]);
        loadingRef.current = false;
    }, []);

    const searchImages = useCallback(async () => {
        if (loadingRef.current) return;
        loadingRef.current = true;
        let res: Image[] = [];

        try {
            if (currentSource === "wallhaven") {
                res = await getSearchWallhavenApi({ keyword: keyword || "", page: 1 });
            }
            if (currentSource === "konachan") {
                res = await getSearchKonachanApi({ keyword: keyword || "", page: 1 });
            }

            if (res.length === 0) {
                setShowText("没找到图片~");
                return;
            }

            setImages(res);
        } catch (error) {
            console.error("搜索失败:", error);
            setShowText("搜索失败，请重试");
        } finally {
            loadingRef.current = false;
        }
    }, [currentSource, keyword]);

    useEffect(() => {
        setPage(1);
        setImages([]);
        setShowText("搜索中....");
        searchImages();
    }, [searchImages]);


    useEffect(() => {
        if (page <= 1) return;

        const loadMoreImages = async () => {
            if (loadingRef.current) return;

            loadingRef.current = true;
            let res: Image[] = [];

            try {
                if (currentSource === "wallhaven") {
                    res = await getSearchWallhavenApi({ keyword: keyword || "", page });
                }
                if (currentSource === "konachan") {
                    res = await getSearchKonachanApi({ keyword: keyword || "", page });
                }

                if (res.length > 0) {
                    setImages((prev) => {
                        const existingIds = new Set(prev.map((img) => img.id));
                        const newImages = res.filter((img) => !existingIds.has(img.id));
                        return [...prev, ...newImages];
                    });
                }
            } catch (error) {
                console.error("加载更多失败:", error);
            } finally {
                loadingRef.current = false;
            }
        };

        loadMoreImages();
    }, [page, currentSource, keyword]); // 依赖页码和搜索参数

    // 滚动监听
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="w-[80rem] mx-auto">
            <SwitchSource switchSource={getSource} />
            {images.length !== 0 ? (
                <div className="mb-10 grid grid-cols-4 gap-5 ">
                    {images.map((img) => (
                        <div
                            key={img.id}
                            className="cursor-pointer"
                            onClick={() => handleImageClick(img.id, img.source)}
                        >
                            <LazyImage
                                src={getProxyUrl(img.sample)}
                                resolution={img.resolution}
                                source={img.source}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 text-gray-500 text-2xl">
                    {showText}
                </div>
            )}
        </div>
    );
}

export default Search;
