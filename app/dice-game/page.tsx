import DashboardLayout from "../../components/DashboardLayout"
import DiceRoller from "../../components/DiceRoller"

export default function DiceGame() {
  return (
    <DashboardLayout>
      <div className="w-full mx-auto">
        <DiceRoller />
      </div>
    </DashboardLayout>
  )
}

