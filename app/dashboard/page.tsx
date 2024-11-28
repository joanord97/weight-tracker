import { WeightForm } from '@/components/WeightForm'
import { WeightChart } from '@/components/WeightChart'
import { MeasurementsForm } from '@/components/MeasurementsForm'

export default function Dashboard() {
  return (
    <main className="flex flex-col items-center justify-start min-h-screen p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Weight Tracker</h1>
      <div className="w-full space-y-8">
        <WeightForm />
        <WeightChart />
        <MeasurementsForm />
      </div>
    </main>
  )
}

