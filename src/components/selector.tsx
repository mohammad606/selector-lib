import {useState} from "react";
import {useInfiniteQuery} from "@tanstack/react-query";


interface SelectorProps {
    name: string,
    value: string,
    selectorColor?: string,
    borderWidth?: string,
    borderStyle?: string,
    borderRadius?: string,
    px?: string,
    py?: string,
    search?: boolean,
    searchColor?: string,
    optionsSize?: string,
    containerOptionsRadius?: string,
    ColorHovered?: string,
    label?: string
}


const Selector = (
    {
        name, value, selectorColor = '#000', borderWidth = '2px', borderStyle = "solid", borderRadius = "10px",
        px = "10px", py = "12px", search = true, searchColor = '#000',
        optionsSize = '50px', containerOptionsRadius = '5px', ColorHovered = '#f0f0f0', label = 'Select ...'
    }
        : SelectorProps
) => {
    let [open, setOpen] = useState<boolean>(false);
    let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    let [searchInput, setSearchInput] = useState<string>('');


    const dataa: string[] = [
        'hi',
        'hello',
        'bye',
        'goodbye',
        'goodnight',
        'goodmorning',
        'goodafternoon',
        'goodnight',
        'goodmorning',
        'goodafternoon',
        'goodnight',
        'goodmorning',
        'goodafternoon',
        'goodnight',
        'goodmorning',
        'goodafternoon',
        'goodnight',
        'goodmorning',
        'goodafternoon',
        'goodnight',
        'goodmorning',
    ]

    const fetchProjects = async (page: number) => {
        const response = await fetch(`https://reqres.in/api/users?page=${page}`);
        const data = await response.json();
        return {data};
    };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch
    } = useInfiniteQuery({
        queryKey: ['projects'],
        queryFn: async ({pageParam }) => {
            return await fetchProjects(pageParam);
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            const nextPage = lastPage.data.page + 1;
            return nextPage <= lastPage.data.total_pages ? nextPage : undefined;
        },
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        retry: 10,
        retryDelay: 100,
    })
    const flattenedData = data?.pages.flatMap(page => page.data.data) || [];

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop === clientHeight && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };


    return (
        <div style={{width: '40%', margin: '50px'}}>
            <div className={'containerS'} onClick={() => {
                setOpen(!open)
            }}>
                <div className={'selectOne'}
                     style={{
                         display: `${search ? "none" : ""}`,
                         border: `${borderWidth} ${selectorColor} ${borderStyle}`,
                         borderRadius: `${borderRadius}`,
                         padding: `${py} ${px}`
                     }}>
                    <p className={'labelSelectorOne'} style={{color: `${selectorColor}`}}>{label}</p>
                    <svg xmlns="http://www.w3.org/2000/svg" style={{rotate: `${open ? "90deg" : ""}`}}
                         className={'arrowSelectorOne'} viewBox="0 0 12 24">
                        <defs>
                            <path id="weuiArrowOutlined0" fill={selectorColor}
                                  d="m7.588 12.43l-1.061 1.06L.748 7.713a.996.996 0 0 1 0-1.413L6.527.52l1.06 1.06l-5.424 5.425z"/>
                        </defs>
                        <use fillRule="evenodd" href="#weuiArrowOutlined0" transform="rotate(-180 5.02 9.505)"/>
                    </svg>
                </div>
                <div className={'selectTwo'}
                     style={{
                         display: `${search ? "" : "none"}`,
                         border: `${borderWidth} ${selectorColor} ${borderStyle}`,
                         borderRadius: `${borderRadius}`
                     }}
                >
                    <input type={'text'} onChange={(e) => setSearchInput(e.target.value)}
                           style={{padding: `${py} ${px}`, borderRadius: `${borderRadius}`, color: `${searchColor}`}}/>
                    <p className={'labelSelectorTwo'}
                       style={{color: `${selectorColor}`, left: `${px}`}}>{searchInput ? "" : label}</p>
                    <svg xmlns="http://www.w3.org/2000/svg" style={{
                        rotate: `${open ? "90deg" : ""}`,
                        transform: `${open ? 'translateX(-50%)' : ""}`,
                        right: `${px}`
                    }} className={'arrowSelectorTow'} viewBox="0 0 12 24">
                        <defs>
                            <path id="weuiArrowOutlined0" fill={selectorColor}
                                  d="m7.588 12.43l-1.061 1.06L.748 7.713a.996.996 0 0 1 0-1.413L6.527.52l1.06 1.06l-5.424 5.425z"/>
                        </defs>
                        <use fillRule="evenodd" href="#weuiArrowOutlined0" transform="rotate(-180 5.02 9.505)"/>
                    </svg>
                </div>
                <div className={'containerOptions'} onScroll={(e)=>handleScroll(e)}
                     style={{borderRadius: `${containerOptionsRadius}`, display: `${open ? "" : "none"}`}}>
                    {flattenedData.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                height: `${optionsSize}`,
                                backgroundColor: `${hoveredIndex === index ? ColorHovered : ""}`
                            }}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <p>{item[name]}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}

export default Selector;