interface MainContentLayoutProps {
    children: React.ReactNode;
}

export const MainContentLayout = ({ children }: MainContentLayoutProps) => {
    return <main className="w-full flex flex-1 flex-col overflow-hidden">{children}</main>
};