import React, { FC, useRef, useState, useCallback} from 'react';
import classes from './search.module.scss';
import debounce from 'lodash.debounce';
import {BsSearch} from 'react-icons/bs';
import { IoMdClose } from 'react-icons/io';


interface searchProps {
  searchValue: string,
  setSearchValue: (searchValue: string) => void,
  children?: React.ReactNode //Понадобится ли
}

const Search: FC<searchProps> = ({searchValue, setSearchValue}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState<string>('');

    const onClickClear = () => {
        setValue('');
        setSearchValue('')
        inputRef.current?.focus();
    }
    
    const updateSearchValue = useCallback(
        debounce((str: string) => {
            setSearchValue(str)
        }, /* 150 */500),
        [],
    )
    
    const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
        updateSearchValue(event.target.value);
    }
    
    return (
        <div className={classes.search__wrapper}>
            <BsSearch className={classes.icon}/>
            <input
                ref={inputRef}
                value={value}
                onChange={onChangeInput}
                className={classes.input}
                placeholder="Search product..."/>
            {value && ( <IoMdClose onClick={onClickClear} className={classes.clearIcon}/>)}
        </div>
    );
};

export default Search;