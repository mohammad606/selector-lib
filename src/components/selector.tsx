import {useEffect, useRef, useState} from "react";
import {useInfiniteQuery} from "@tanstack/react-query";


interface SelectorProps {
    value: string,
    labelColor?: string,
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
    closeOnSelect?: boolean;
}


const Selector = (
    {
        value,
        labelColor = '#000',
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
        multiSelect = false,
        closeOnSelect = true
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
        getNextPageParam: (lastPage) => {
            console.log(lastPage.data.page)
            return lastPage.data.page + 1;
        },

        staleTime: Infinity,
        refetchOnWindowFocus: false,
        retry: 10,
        retryDelay: 100,
    })
    console.log(data)
    const handleSearchArray = (searchInput: string) => {
        if (array && search) {
            return array.filter((item) => {
                return KeyShowFn(item).includes(searchInput)
            })
        } else {
            return array
        }
    }

    const flattenedData = array ? handleSearchArray(searchInput) : data?.pages.flatMap(page =>{
        if(Array.isArray(page.data)){
           return page.data
        }else {
            return  page.data.data
        }
    }) || [];

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight + 5 && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const selectRef = useRef<HTMLDivElement>(null); // 🔹 مرجع لعناصر القائمة

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current && dropdownRef.current.contains(event.target as Node) ||
                selectRef.current && selectRef.current.contains(event.target as Node) // 🔹 إضافة `selectRef`
            ) {
                return;
            }
            setOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        getValue(valueStore.value)
    }, [valueStore]);

    const handleShowValue = () => {
        return (
            <div className={'showValue'} style={{display: `${Array.isArray(valueStore.key) && valueStore.key.length || (String(valueStore.key) && valueStore.key) ? 'flex' : 'none'}`}}>
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
    const handleLabel = (className:string) => {
        return (
            <p className={className}
               style={{
                   color: `${labelColor}`,
                   left: `${px}`,
                   display: `${Array.isArray(valueStore.key) && valueStore.key.length || (String(valueStore.key) && valueStore.key) ? 'none' : ""}`
               }}>{label}</p>
        )
    }

    return (
        <div style={{width: '40%', margin: '50px'}}>
            <div className={'containerS'}>
                {/*------------------------------------------------------------------------------------------------------------------Selector*/}
                <div className={'selectOne'}  ref={selectRef}    onClick={() => setOpen(prev => !prev)}
                     style={{
                         border: `${borderWidth} ${selectorColor} ${borderStyle}`,
                         borderRadius: `${borderRadius}`,
                         padding: `${py} ${px}`
                     }}>
                    {handleShowValue()}
                    {handleLabel("labelSelectorOne")}
                    <svg xmlns="http://www.w3.org/2000/svg" style={{rotate: `${open ? "90deg" : ""}`}}
                         className={'arrowSelectorOne'} viewBox="0 0 12 24">
                        <defs>
                            <path id="weuiArrowOutlined0" fill={selectorColor}
                                  d="m7.588 12.43l-1.061 1.06L.748 7.713a.996.996 0 0 1 0-1.413L6.527.52l1.06 1.06l-5.424 5.425z"/>
                        </defs>
                        <use fillRule="evenodd" href="#weuiArrowOutlined0" transform="rotate(-180 5.02 9.505)"/>
                    </svg>
                </div>
                {/*------------------------------------------------------------------------------------------------------------------Options*/}
                <div ref={dropdownRef} className={'containerOptions'} onScroll={(e) => handleScroll(e)}
                     style={{borderRadius: `${containerOptionsRadius}`, display: `${open ? "" : "none"}`}}>
                        {/*-----------------------------------------------------------------------------------------------------------search*/}
                        <input className={'searchInput'} type={'text'}
                               onChange={(e) => {
                                   setSearchInput(e.target.value);
                               }}
                               style={{ color: `${searchColor}`,border: `${borderWidth} ${selectorColor} ${borderStyle}`,display: `${search ? "" : "none"}`,
                               }}/>

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
                                    if(!multiSelect && closeOnSelect){
                                        setOpen(false)
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
                    {isFetchingNextPage && <div className={'loadingOptions'}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeDasharray="16" strokeDashoffset="16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3c4.97 0 9 4.03 9 9"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="16;0"/><animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg></div>}
                </div>
            </div>

        </div>
    )
}

export default Selector;