import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSource } from "../context/SourceContext";
function Nav() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [searchParams] = useSearchParams();
  const { currentSource, setCurrentSource } = useSource();
  // 组件加载时从 URL 获取初始值'
  useEffect(() => {
    const keywordParam = searchParams.get('keyword') || '';
    setInputValue(keywordParam);
  }, [searchParams]);
  const toHomeClick = () => {
    setInputValue('');
    navigate(`/?source=${currentSource}`);
  };
  useEffect(() => {
    setCurrentSource(searchParams.get('source') || 'wallhaven')
  },[])
  const toSearchRouter = () => {
    if (inputValue !== '') {
      navigate(`/search?keyword=${inputValue}&source=${currentSource}`);
    }
  };

  const enterValueHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  const keyDownHandle = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputValue) {
      toSearchRouter();
    }
  };

  const searchClick = () => {
    if (inputValue) {
      toSearchRouter();
    }
  }

  return (
    <div className="flex justify-center mt-3 px-4">
      <nav className="w-full max-w-[20rem] sm:max-w-[40rem] lg:max-w-[60rem] xl:max-w-[75rem] font-bold text-lg sm:text-xl lg:text-2xl">
        {/* 移动端：第一层 - 标题和收藏在两边 */}
        <div className="flex justify-between items-center mb-3 sm:mb-0 sm:hidden">
          <span className="cursor-pointer" onClick={toHomeClick}>
            👻wallpaper👌🏻
          </span>
          <span className="cursor-pointer text-sm sm:text-base lg:text-lg sm:hidden">
            Favorites❤️
          </span>
        </div>
        
        {/* 桌面端：整体布局 */}
        <div className="hidden sm:flex justify-between items-center">
          <span className="cursor-pointer" onClick={toHomeClick}>
            👻wallpaper👌🏻
          </span>
          <div className="flex gap-5 items-center">
            <div className="flex gap-1">
              <input type="text" placeholder="Search..."
                onKeyDown={keyDownHandle}
                onChange={enterValueHandle}
                value={inputValue}
                className="border border-gray-300 rounded-lg font-medium px-2 text-base lg:text-lg w-48 lg:w-70 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-gray-800" />
              <span className="text-base lg:text-lg cursor-pointer" onClick={searchClick}>🔍</span>
            </div>
            <span className="cursor-pointer text-base lg:text-lg">
              Favorites❤️
            </span>
          </div>
        </div>

        {/* 移动端：第二层 - 搜索框占满整行 */}
        <div className="flex gap-1 w-full sm:hidden items-center">
          <input type="text" placeholder="Search..."
            onKeyDown={keyDownHandle}
            onChange={enterValueHandle}
            value={inputValue}
            className="border border-gray-300 rounded-xl font-medium p-2 text-sm flex-1 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-gray-800" />
          <span className="text-xl cursor-pointer" onClick={searchClick}>🔍</span>
        </div>
      </nav>
    </div>
  );
}

export default Nav;
