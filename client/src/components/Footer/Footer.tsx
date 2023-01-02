import React from 'react';
import classes from './footer.module.scss'

const Footer = () => {
    return (
        <div className={classes.footer}>
            <div className={classes.footer__content}>
                <div>© 2022 PIZZAnna Ukraine</div>
                <div>Contacts example: +380(99)-000-00-00</div>
            </div>
        </div>
    );
};

export default Footer;