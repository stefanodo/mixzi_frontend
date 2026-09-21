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
      <NavigationComponent />
      <MainContent>{children}</MainContent>
    </div>
  )
}