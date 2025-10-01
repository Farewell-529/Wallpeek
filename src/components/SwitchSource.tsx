import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSource } from "../context/SourceContext";

// 定义数据源类型
interface SourceItem {
    id: number;
    name: string;
}

// 定义组件 props 类型
interface SwitchSourceProps {
    switchSource: () => void;
}

function SwitchSource({ switchSource }: SwitchSourceProps) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams()
    const keyword = searchParams.get('keyword')
    const [source] = useState<SourceItem[]>([
        { id: 1, name: 'wallhaven' },
        { id: 2, name: 'konachan' },
    ]);
    const { setCurrentSource, currentSource } = useSource();
    const clickHandle = (source: SourceItem) => {
        if (keyword) {
            navigate(`/search?keyword=${keyword}&source=${source.name}`);
        } else {
            navigate(`?source=${source.name}`);
        }
        setCurrentSource(source.name);
        switchSource();
    }
    return (
        <div className="my-6 flex gap-3">
            {
                source.map((item) => (
                    <button
                        className={`bg-gray-200 cursor-pointer rounded-md lg:px-4 lg:py-2 px-2 py-1   
                        ${currentSource === item.name ? 'bg-gray-300' : ''}`}
                        key={item.id}
                        onClick={() => clickHandle(item)}
                    >
                        {item.name}
                    </button>
                ))
            }
        </div>
    );
}
export default SwitchSource;