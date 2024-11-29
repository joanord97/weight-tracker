import { MeasurementsForm } from "@/components/MeasurementsForm";
import { WaistChart } from "@/components/WaistChart";

export default function MeasurementsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Measurements</h1>
      <WaistChart />

      <MeasurementsForm />
    </div>
  );
}
