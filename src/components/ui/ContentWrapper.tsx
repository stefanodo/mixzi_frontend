interface ContentWrapperProps {
    children: React.ReactNode;
}


export const ContentWrapper = ({ children }: ContentWrapperProps) => {
    return(
        <div className="flex min-h-[calc(100vh-76px)] overflow-y-auto pt-19 sm:pt-0">
            {children}
        </div>
    )
};