import Header from "../../components/layouts/Header";

export default function MainLayout({ children }) {
    return (
        <div className="layout-wrapper">
            <Header />
            <main className="layout-main">{children}</main>
            {/**  푸터 */}
        </div>

    )
}