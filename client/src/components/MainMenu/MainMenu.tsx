import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import './mainMenu.scss';

import { BiHomeSmile, BiCoffeeTogo } from 'react-icons/bi';
import { MdRestaurantMenu } from 'react-icons/md';
import { FaPhoneSquareAlt } from 'react-icons/fa';
import { GiFullPizza, GiChipsBag, GiCupcake} from 'react-icons/gi';

interface menuProps {
    header?: string;
    menuItems: string[];
    active: boolean;
    setActive: (active: boolean) => void,
    children: React.ReactNode
}

const MainMenu: FC<menuProps> = ({/* header , */menuItems, active, setActive, children}) => {
    return (
        <div className={active ? 'menu activeMenu' : 'menu'} onClick={()=>setActive(false)}>
            <div className='blur'>
                <div className="menu__content" onClick={(e)=>e.stopPropagation()}>
                    <div className="menu__content__container">
                    {/* <div className="menu__header">{header}</div> */}
                    <div className='lists__container'>
                        <ul className='menu__burger'>
                            <li onClick={()=>setActive(false)}><NavLink to={`/home`}><BiHomeSmile size='1.5em'/><span>Home</span></NavLink></li>
                            <li onClick={()=>setActive(false)}><NavLink to={`/menu`}><MdRestaurantMenu size='1.5em'/><span>Menu</span></NavLink></li>
                            <li onClick={()=>setActive(false)}><NavLink to={`/about`}><FaPhoneSquareAlt size='1.5em'/><span>About</span></NavLink></li>
                        </ul>
                    </div>
                    
                    <div className='lists__container'>
                        <ul className='menu__list'>
                            <li onClick={()=>setActive(false)}>
                                <NavLink to={`/menu/pizza`}>
                                     <div>
                                        <GiFullPizza size='1.5em'/><span>Pizza</span>  
                                    </div>
                                </NavLink>
                            </li>
                            <li onClick={()=>setActive(false)}>
                                <NavLink to={`/menu/drinks`}>
                                    <div>
                                        <BiCoffeeTogo size='1.5em'/><span>Drinks</span>
                                    </div>
                                </NavLink>
                            </li>
                            <li onClick={()=>setActive(false)}>
                                <NavLink to={`/menu/sides`}>
                                    <div>
                                        <GiChipsBag size='1.5em'/><span>Sides</span>
                                    </div>
                                </NavLink>
                            </li>
                            <li onClick={()=>setActive(false)}>
                                <NavLink to={`/menu/dessert`}>
                                    <div>
                                        <GiCupcake size='1.5em'/><span>Dessert</span>
                                    </div>
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainMenu;