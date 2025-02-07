import {useEffect, useState} from "react";
import {useInfiniteQuery} from "@tanstack/react-query";


interface SelectorProps {
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
    apiFn?: (
        page: number,
        search: string,
    ) => Promise<any>;
    apiUrl?: string;
    array?: any[];
    KeyShowFn: (item: any) => string;
}


const Selector = (
    {
         value, selectorColor = '#000', borderWidth = '2px', borderStyle = "solid", borderRadius = "10px",
        px = "10px", py = "12px", search = false, searchColor = '#000',
        optionsSize = '50px', containerOptionsRadius = '5px', ColorHovered = '#f0f0f0', label = 'Select ...',apiFn,apiUrl,array,KeyShowFn = (item: any) => item
    }
        : SelectorProps
) => {
    let [open, setOpen] = useState<boolean>(false);
    let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    let [searchInput, setSearchInput] = useState<string>('');
    let [valueStore, setValueStore] = useState<string|number>('');



    const fetchData = async (url:string,page: number,search:string) => {
        const response = await fetch(`${url}?page=${page}&search=${search}`);
        const data = await response.json();
        return {data};
    };
    const handleGetApi = async (pageParam: number, searchInput: string) => {
        return apiFn ? apiFn(pageParam, searchInput) : apiUrl ? fetchData(apiUrl, pageParam, searchInput) : { data: [] };
    };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ['projects',searchInput],
        queryFn: async ({ pageParam = 1 }) => {
            return await handleGetApi(pageParam,searchInput);
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage?.data?.length ? allPages.length + 1 : undefined;
        },
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        retry: 10,
        retryDelay: 100,
    })

    const handleSearchArray = (searchInput: string) => {
        if(array && search){
            return array.filter((item) => {
                return KeyShowFn(item).includes(searchInput)
            })
        }else {
            return array
        }
    }

    const flattenedData = array?handleSearchArray(searchInput):data?.pages.flatMap(page => page.data.data) || [];

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop === clientHeight && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (target.closest(".selector-container")) return;
            setOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    console.log(valueStore)
    return (
        <div style={{width: '40%', margin: '50px'}}>
            <div className={'containerS'} >
                <div className={'selectOne'} onClick={() => {
                    setOpen(!open)
                }}
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
                    <input onFocus={()=> setOpen(true)} type={'text'} onChange={(e) => {
                        setSearchInput(e.target.value);
                    }}
                           style={{padding: `${py} ${px}`, borderRadius: `${borderRadius}`, color: `${searchColor}`}}/>
                    <p className={'labelSelectorTwo'}
                       style={{color: `${selectorColor}`, left: `${px}`}}>{searchInput ? "" : label}</p>
                    <svg xmlns="http://www.w3.org/2000/svg" style={{
                        rotate: `${open ? "90deg" : ""}`,
                        transform: `${open ? 'translateX(-50%)' : ""}`,
                        right: `${px}`
                    }} className={'arrowSelectorTow'}  viewBox="0 0 12 24">
                        <defs>
                            <path id="weuiArrowOutlined0" fill={selectorColor}
                                  d="m7.588 12.43l-1.061 1.06L.748 7.713a.996.996 0 0 1 0-1.413L6.527.52l1.06 1.06l-5.424 5.425z"/>
                        </defs>
                        <use fillRule="evenodd" href="#weuiArrowOutlined0" transform="rotate(-180 5.02 9.505)"/>
                    </svg>
                </div>
                <div className={'containerOptions'} onScroll={(e)=>handleScroll(e)}
                     style={{borderRadius: `${containerOptionsRadius}`, display: `${open ? "" : "none"}`}}>
                    {flattenedData?.map((item, index) => {
                        return (
                            <div onChange={()=>setValueStore(item[value])}
                                key={index}
                                style={{
                                    height: `${optionsSize}`,
                                    backgroundColor: `${hoveredIndex === index ? ColorHovered : ""}`
                                }}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <p>{KeyShowFn(item)}</p>
                            </div>
                        )
                    })}
                    {isFetchingNextPage && <p>جاري التحميل...</p>}

                </div>
            </div>

        </div>
    )
}

export default Selector;