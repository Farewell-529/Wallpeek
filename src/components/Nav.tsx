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
    <div className="flex justify-center mt-3">
      <nav className="w-[75rem] font-bold text-2xl flex justify-between ">
        <span className="cursor-pointer" onClick={toHomeClick}>
          👻wallpaper👌🏻
        </span>
        <div className="flex gap-5">
          <div className="flex gap-1">
            <input type="text" placeholder="Search..."
              onKeyDown={keyDownHandle}
              onChange={enterValueHandle}
              value={inputValue}
              className="border border-gray-300 rounded-lg font-medium px-2 text-lg w-70 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-gray-800" />
            <span className="text-lg cursor-pointer" onClick={searchClick}>🔍</span>
          </div>
          <span className="cursor-pointer">
            Favorites❤️
          </span>
        </div>
      </nav>
    </div>
  );
}

export default Nav;
