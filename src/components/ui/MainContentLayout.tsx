interface MainContentLayoutProps {
    children: React.ReactNode;
}

export const MainContentLayout = ({ children }: MainContentLayoutProps) => {
    return <main id="main-content" tabIndex={-1} className="w-full flex flex-1 flex-col overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">{children}</main>
};