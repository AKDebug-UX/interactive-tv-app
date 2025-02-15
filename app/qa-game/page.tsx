import DashboardLayout from "@/components/DashboardLayout"
import QuePerDice from "@/components/Question/QuePerDice"

export default function QAGame() {
  return (
    <DashboardLayout>
      <div className="w-full mx-auto">
        <QuePerDice />
      </div>
    </DashboardLayout>
  )
}

