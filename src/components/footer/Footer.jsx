import cn from 'classnames'
import s from "./styles.module.scss"

export const Footer = () => {
    const socials = ['iconTelegram', 'iconWhatsapp', 'iconVkontakte', 'iconPinterest', 'iconYoutube']

    return (
        <footer className={s.footer}>
            <div className={s.socials}>
                {socials.map((social) => <a href="#" key={social} className={cn(s.social, social)} />)}
            </div>
            <div>© {new Date().getFullYear()} Valantis Jewelry</div>
        </footer>
    )
}
