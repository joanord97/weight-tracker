import WaistList from "@/components/WaistList";
import WeightList from "@/components/WeightList";

export default function HistoryPage() {
  return (
    <div className="container mx-auto p-4 h-screen">
      <h1 className="text-2xl font-bold mb-4">History</h1>

      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 h-[80vh]">
        <div className="flex-1 overflow-auto">
          <WeightList />
        </div>
        <div className="flex-1 overflow-auto">
          <WaistList />
        </div>
      </div>
    </div>
  );
}
