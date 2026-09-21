import { ContentWrapper } from "./ContentWrapper";
import { MainContentLayout } from "./MainContentLayout";

interface MainContentProps {
    children: React.ReactNode;
}

export const MainContent = ({ children }: MainContentProps) => {
    return (
        <MainContentLayout>
            <ContentWrapper>
                <div className="w-full px-4 py-6 sm:px-6">
                    {children}
                </div>
            </ContentWrapper>
        </MainContentLayout>
    )
}