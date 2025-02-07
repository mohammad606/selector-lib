import {useEffect, useRef, useState} from "react";
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
    selectedColor?: string,
    selectedColorArray?: string,
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
    getValue: (item: any) => any;
    multiSelect?: boolean;
}


const Selector = (
    {
        value,
        selectorColor = '#000',
        borderWidth = '2px',
        borderStyle = "solid",
        borderRadius = "10px",
        px = "10px",
        py = "12px",
        selectedColor = '#a2e1e1',
        selectedColorArray = '#92e0f9',
        search = false,
        searchColor = '#000',
        optionsSize = '50px',
        containerOptionsRadius = '5px',
        ColorHovered = '#f0f0f0',
        label = 'Select ...',
        apiFn,
        apiUrl,
        array,
        KeyShowFn = (item: any) => item,
        getValue,
        multiSelect
    }
        : SelectorProps
) => {
    let [open, setOpen] = useState<boolean>(false);
    let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    let [searchInput, setSearchInput] = useState<string>('');
    let [valueStore, setValueStore] = useState<{
        key: string | number | any[],
        value: string | number | any[]
    }>({key: [], value: []});

    const fetchData = async (url: string, page: number, search: string) => {
        const response = await fetch(`${url}?page=${page}&search=${search}`);
        const data = await response.json();
        return {data};
    };
    const handleGetApi = async (pageParam: number, searchInput: string) => {
        return apiFn ? apiFn(pageParam, searchInput) : apiUrl ? fetchData(apiUrl, pageParam, searchInput) : {data: []};
    };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ['projects', searchInput],
        queryFn: async ({pageParam = 1}) => {
            return await handleGetApi(pageParam, searchInput);
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
        if (array && search) {
            return array.filter((item) => {
                return KeyShowFn(item).includes(searchInput)
            })
        } else {
            return array
        }
    }

    const flattenedData = array ? handleSearchArray(searchInput) : data?.pages.flatMap(page => page.data.data) || [];

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const {scrollTop, scrollHeight, clientHeight} = e.currentTarget;
        if (scrollHeight - scrollTop === clientHeight && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && dropdownRef.current.contains(event.target as Node)) {
                return;
            } else {
                setOpen(false);
            }

        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        getValue(valueStore.value)
    }, [valueStore]);
    console.log(valueStore)

    const handleShowValue = () => {
        return (
            <div className={'showValue'} style={{display: `${valueStore.key ? 'flex' : 'none'}`}}>
                {multiSelect && Array.isArray(valueStore.key) ? (
                    valueStore.key.map((e, index) => <span style={{backgroundColor:selectedColor}} key={index}
                                                           onClick={() => {
                                                               if (Array.isArray(valueStore.key) && Array.isArray(valueStore.value)) {
                                                                   const newKeys = valueStore.key.filter((_, i) => i !== index);
                                                                   const newValues = valueStore.value.filter((_, i) => i !== index);
                                                                   setValueStore({key: newKeys, value: newValues})
                                                               }
                                                           }}
                    >{e}</span>)
                ) : (
                    <span style={{backgroundColor:selectedColor}} onClick={() => setValueStore({key: '', value: ''})}>{valueStore.key}</span>
                )}
            </div>
        )
    }

    return (
        <div style={{width: '40%', margin: '50px'}}>
            <div className={'containerS'}>
                <div className={'selectOne'} onClick={() => setOpen(!open)}
                     style={{
                         display: `${search ? "none" : ""}`,
                         border: `${borderWidth} ${selectorColor} ${borderStyle}`,
                         borderRadius: `${borderRadius}`,
                         padding: `${py} ${px}`
                     }}>
                    {handleShowValue()}
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
                <div className={'selectTwo'} onClick={() => setOpen(!open)}
                     style={{
                         display: `${search ? "" : "none"}`,
                         border: `${borderWidth} ${selectorColor} ${borderStyle}`,
                         borderRadius: `${borderRadius}`
                     }}
                >
                    {handleShowValue()}
                    <input type={'text'}
                           onChange={(e) => {
                        setSearchInput(e.target.value);
                    }}
                           style={{padding: `${py} ${px}`, borderRadius: `${borderRadius}`, color: `${searchColor}`}}/>
                    <p className={'labelSelectorTwo'}
                       style={{
                           color: `${selectorColor}`,
                           left: `${px}`,
                           display: `${Array.isArray(valueStore.key) && valueStore.key.length ? 'none' : ""}`
                       }}>{searchInput ? "" : label}</p>
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
                <div ref={dropdownRef} className={'containerOptions'} onScroll={(e) => handleScroll(e)}
                     style={{borderRadius: `${containerOptionsRadius}`, display: `${open ? "" : "none"}`}}>
                    {flattenedData?.map((item, index) => {
                        const isSelected = multiSelect
                            ? Array.isArray(valueStore.value) && valueStore.value.includes(item[value as keyof typeof item])
                            : valueStore.key === KeyShowFn(item);

                        return (
                            <div
                                onClick={() => {
                                    if (multiSelect) {
                                        if (Array.isArray(valueStore.key) && Array.isArray(valueStore.value) && !isSelected) {
                                            setValueStore({
                                                key: [...valueStore.key, KeyShowFn(item)],
                                                value: [...valueStore?.value, item[value as keyof typeof item]]
                                            });
                                        }
                                    } else {
                                        setValueStore({
                                            key: KeyShowFn(item),
                                            value: item[value as keyof typeof item]
                                        });
                                    }
                                }}
                                key={index}
                                style={{
                                    height: `${optionsSize}`,
                                    backgroundColor: isSelected ? selectedColorArray : hoveredIndex === index ? ColorHovered : "",
                                    transition: "background-color 0.3s ease"
                                }}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <p>{KeyShowFn(item)}</p>
                            </div>
                        );
                    })}
                    {isFetchingNextPage && <p>جاري التحميل...</p>}

                </div>
            </div>

        </div>
    )
}

export default Selector;