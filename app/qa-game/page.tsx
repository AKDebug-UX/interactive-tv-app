import DashboardLayout from "@/components/DashboardLayout"
import QuestionCategories from "@/components/Question/QuestionCategories"

export default function QAGame() {
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <QuestionCategories />
      </div>
    </DashboardLayout>
  )
}

