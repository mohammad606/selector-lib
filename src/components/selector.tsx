import {useState} from "react";


const Selector = (
    {selectorColor = 'red',borderWidth = '2px',borderStyle = "solid",borderRadius="25px",px="10px",py="5px",search = false}
        :
    {selectorColor?:string,borderWidth?:string,borderStyle?:string,borderRadius?:string,px?:string,py?:string,search?:boolean}
)=>{

    let [open,setOpen] = useState<boolean>(false);

    return (
        <div style={{width:'30%',margin:'50px'}}>
            <div className={'containerS'} onClick={()=>{setOpen(!open)}}>
                <div className={'selectOne'}
                     style={{display:`${search?"none":""}`,border:`${borderWidth} ${selectorColor} ${borderStyle}`,borderRadius:`${borderRadius}`,padding:`${py} ${px}`}}>
                    <p className={'labelSelector'} style={{color:`${selectorColor}`}}>hi</p>
                    <svg xmlns="http://www.w3.org/2000/svg" style={{rotate:`${open?"90deg":""}`}} className={'arrowSelectorOne'} viewBox="0 0 12 24"><defs><path id="weuiArrowOutlined0" fill={selectorColor} d="m7.588 12.43l-1.061 1.06L.748 7.713a.996.996 0 0 1 0-1.413L6.527.52l1.06 1.06l-5.424 5.425z"/></defs><use fillRule="evenodd" href="#weuiArrowOutlined0" transform="rotate(-180 5.02 9.505)"/></svg>
                </div>
            </div>



        </div>
    )
}

export default Selector;