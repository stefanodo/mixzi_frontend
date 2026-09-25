import { DashboardWizard } from "./DashboardWizard";
import { InventoryCharts } from "./InventoryCharts";

export const Dashboard = () => {
  return (
    <div className="space-y-8 pb-12">
      <DashboardWizard />
      <InventoryCharts />
    </div>
  );
};
