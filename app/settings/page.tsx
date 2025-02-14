import DashboardLayout from "../../components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Settings() {
  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Settings options will be implemented here.</p>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}

