import DashboardLayout from "../../components/DashboardLayout"
import DiceRoller from "../../components/DiceRoller"

export default function DiceGame() {
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <DiceRoller />
      </div>
    </DashboardLayout>
  )
}

