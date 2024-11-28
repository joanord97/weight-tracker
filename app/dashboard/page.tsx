import { WeightForm } from "@/components/WeightForm";
import WeightList from "@/components/WeightList";

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4 h-screen flex flex-col">
      <div className="flex-grow flex flex-col space-y-4 overflow-hidden max-h-[80vh]">
        <div className="flex-grow overflow-auto">
          <WeightList />
        </div>
        <div className="w-full max-w-md mx-auto">
          <WeightForm />
        </div>
      </div>
    </div>
  );
}
