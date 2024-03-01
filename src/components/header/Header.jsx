import s from "./styles.module.scss"

export const Header = () => {
    return (
        <header>
            <div className={s.banner}>
                <h1 className={s.title}>Valantis Jewelry</h1>
            </div>
        </header>
    )
}

