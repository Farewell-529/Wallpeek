import { useParams, useNavigate } from 'react-router-dom';
import { getWallhavenDetailApi } from '../api/wallhaven/detail';
import { useEffect, useState, useCallback } from 'react';
import { getKonachanDetailApi } from "../api/konachan/detail";
import type { ImageDetail } from "../../src/types/images";
import mediumZoom from 'medium-zoom'
function Detail() {
  const { id, source } = useParams();
  const [imageDetail, setImageDetail] = useState<ImageDetail | null>(null);
  const [progress, setProgress] = useState(0)
  const [isLoading, setLoading] = useState(false)
  const [proxyImageUrl, setProxyImageUrl] = useState<string>('')
  const navigate = useNavigate();

  // 获取代理URL的辅助函数
  const getProxyUrl = useCallback((originalUrl: string) => {
    const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";
    return `${baseURL}/image?url=${encodeURIComponent(originalUrl)}`;
  }, []);

  const loadImageWithProgress = useCallback((url: string) => {
    const proxyUrl = getProxyUrl(url);
    
    const xhr = new XMLHttpRequest();
    xhr.open('GET', proxyUrl, true);
    xhr.responseType = 'blob';
    // 重置进度和加载状态
    setProgress(0);
    setLoading(false);

    xhr.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };
    xhr.onload = () => {
      if (xhr.status === 200) {
        setProgress(100);
        setLoading(true);
        // 等待 DOM 更新后再初始化
        setTimeout(() => {
          mediumZoom('[data-zoomable]', {
            background: '#000000d1',
            margin: 20
          });
        }, 100);
      } else {
        console.error('Failed to load image:', xhr.status);
        setLoading(false);
      }
    };
    xhr.onerror = () => {
      console.error('Image loading error');
      setLoading(false);
      setProgress(0);
    };

    xhr.send();
  }, [getProxyUrl]);

  const showDetailList = [
    {
      id: 1,
      titile: 'Source',
      text: imageDetail?.source
    },
    {
      id: 2,
      titile: 'Resolution',
      text: imageDetail?.resolution
    },
    {
      id: 3,
      titile: 'FileSize',
      text: imageDetail?.fileSize
    },]

  const getImageDetail = useCallback(async () => {
    let res: ImageDetail | null = null;
    if (source === 'wallhaven') {
      res = await getWallhavenDetailApi(id!);
    }
    if (source === 'konachan') {
      res = await getKonachanDetailApi(id!);
    }
    if (res) {
      setImageDetail(res);
      if (res.url) {
        // 设置代理图片URL
        setProxyImageUrl(getProxyUrl(res.url));
        loadImageWithProgress(res.url);
      }
    }
  }, [id, source, getProxyUrl, loadImageWithProgress]);

  const handleDownload = async () => {
    if (!imageDetail?.url) return;
    try {
      const response = await fetch(getProxyUrl(imageDetail.url));
      const blob = await response.blob(); // 转换成二进制blob对象
      const blobUrl = window.URL.createObjectURL(blob); // 创建临时URL供下载用
      const link = document.createElement('a'); // 创建隐藏a链接
      link.href = blobUrl; // 设置a链接指向blob地址
      link.download = imageDetail.url.split('/').pop() || 'download.jpg'; // 设置默认文件名
      document.body.appendChild(link); // 添加a标签到DOM中
      link.click(); // 自动点击a触发下载
      document.body.removeChild(link); // 下载后移除a标签
      window.URL.revokeObjectURL(blobUrl); // 释放blob占用的内存
    } catch (error) {
      console.error('Download failed:', error); // 打印错误
    }
  };
  const toSearchHandle = (keyword: string) => {
    navigate(`/search?keyword=${keyword}&source=${source}`);
  };
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    getImageDetail()
  }, [getImageDetail])

  return (
    <div className="container mx-auto p-5">
      <div className='flex justify-center items-center min-w-[90rem] min-h-[50rem]'>
        {
          isLoading && proxyImageUrl ? (
            <img 
              data-zoomable 
              className='rounded-2xl cursor-pointer' 
              src={proxyImageUrl}
              alt="" 
              onError={() => {
                console.error('Image failed to load:', proxyImageUrl);
                setLoading(false);
              }}
            />
          ) : (
            <span className="text-xl font-semibold">🤔加载中：{progress}%</span>
          )
        }
      </div>
      
      <div className='mt-5'>
        <button onClick={handleDownload} className='cursor-pointer p-2  shadow-md border border-gray-300 rounded-lg'>
          💾
        </button>
      </div>
      <div className='mt-2'>
        <h1 className='text-4xl font-semibold'>Tags</h1>
        <ul className='flex gap-5 mt-3 flex-wrap'>
          {
            imageDetail?.tags.map((tag, idx) => (
              <li onClick={() => toSearchHandle(tag)} className='p-1.5 border-2 rounded-lg cursor-pointer hover:bg-gray-300 transition-colors duration-200 ' key={idx}>#{tag}</li>
            ))
          }
        </ul>
      </div>
      {showDetailList.map((showDatail) => (
        <div className='mt-6' key={showDatail.id}>
          <h1 className='text-4xl font-semibold'>{showDatail.titile}</h1>
          <span className='font-bold text-xl'>{showDatail.text}</span>
        </div>
      ))

      }
    </div>
  );
};

export default Detail;
