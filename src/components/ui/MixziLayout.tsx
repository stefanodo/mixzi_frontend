import { MainContent } from "./MainContent";
import { NavigationComponent } from "./NavigationComponent"
import { useDeviceType } from "../../hooks/useDeviceType"
interface MixziLayoutProps {
  children: React.ReactNode;
}

export const MixziLayout = ({ children }: MixziLayoutProps) => {
  const deviceType = useDeviceType()

  return (
    <div className="mixzi-layout min-h-screen bg-background text-foreground" data-device={deviceType}>
      <a href="#main-content" className="sr-only fixed left-4 top-4 z-50 rounded-lg bg-background p-3 text-foreground focus:not-sr-only focus:outline-2 focus:outline-offset-2 focus:outline-primary">
        Saltar al contenido principal
      </a>
      <NavigationComponent />
      <MainContent>{children}</MainContent>
    </div>
  )
}