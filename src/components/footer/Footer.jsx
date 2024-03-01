import s from "./styles.module.scss"
import cn from 'classnames'

export const Footer = () => {
    const socials = ['iconTelegram', 'iconWhatsapp', 'iconVkontakte', 'iconPinterest', 'iconYoutube']

    return (
        <footer className={s.footer}>
            <div className={s.socials}>
                {socials.map((social) => <a href="#" key={social} className={cn(s.social, social)} />)}
            </div>
            <div>© 2024 Valantis Jewelry</div>
        </footer>
    )
}
