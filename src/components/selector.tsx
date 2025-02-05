import {useState} from "react";


const Selector = (
    {selectorColor = '#000',borderWidth = '2px',borderStyle = "solid",borderRadius="25px",px="10px",py="15px",search = true,searchColor = '#000'}
        :
    {selectorColor?:string,borderWidth?:string,borderStyle?:string,borderRadius?:string,px?:string,py?:string,search?:boolean,searchColor?:string}
)=>{

    let [open,setOpen] = useState<boolean>(false);

    return (
        <div style={{width:'30%',margin:'50px'}}>
            <div className={'containerS'} onClick={()=>{setOpen(!open)}}>
                <div className={'selectOne'}
                     style={{display:`${search?"none":""}`,border:`${borderWidth} ${selectorColor} ${borderStyle}`,borderRadius:`${borderRadius}`,padding:`${py} ${px}`}}>
                    <p className={'labelSelectorOne'} style={{color:`${selectorColor}`}}>hi</p>
                    <svg xmlns="http://www.w3.org/2000/svg" style={{rotate:`${open?"90deg":""}`}} className={'arrowSelectorOne'} viewBox="0 0 12 24"><defs><path id="weuiArrowOutlined0" fill={selectorColor} d="m7.588 12.43l-1.061 1.06L.748 7.713a.996.996 0 0 1 0-1.413L6.527.52l1.06 1.06l-5.424 5.425z"/></defs><use fillRule="evenodd" href="#weuiArrowOutlined0" transform="rotate(-180 5.02 9.505)"/></svg>
                </div>
                <div className={'selectTwo'}
                     style={{display:`${search?"":"none"}`,border:`${borderWidth} ${selectorColor} ${borderStyle}`,borderRadius:`${borderRadius}`}}
                >
                    <input type={'text'} style={{padding:`${py} ${px}`,borderRadius:`${borderRadius}`,color:`${searchColor}`}}/>
                    <p  className={'labelSelectorTwo'} style={{color:`${selectorColor}`,left:`${px}`}}>hi</p>
                    <svg xmlns="http://www.w3.org/2000/svg" style={{rotate:`${open?"90deg":""}`,transform:`${open?'translateX(-50%)':""}`,right:`${px}`}} className={'arrowSelectorOne'} viewBox="0 0 12 24"><defs><path id="weuiArrowOutlined0" fill={selectorColor} d="m7.588 12.43l-1.061 1.06L.748 7.713a.996.996 0 0 1 0-1.413L6.527.52l1.06 1.06l-5.424 5.425z"/></defs><use fillRule="evenodd" href="#weuiArrowOutlined0" transform="rotate(-180 5.02 9.505)"/></svg>
                </div>
            </div>



        </div>
    )
}

export default Selector;