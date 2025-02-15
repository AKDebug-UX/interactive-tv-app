import DashboardLayout from "@/components/DashboardLayout"
import UploadQuestionModal from "@/components/Question/UploadQuestionModal"

export default function QAGame() {
  return (
    <DashboardLayout>
      <div className="w-full mx-auto">
        <UploadQuestionModal />
      </div>
    </DashboardLayout>
  )
}

