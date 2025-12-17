import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { ProjectsGrid } from "@/components/dashboard/projects-grid"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const projects = await prisma.project.findMany({
    where: {
      userId: session.user.id,
      deletedAt: null,
    },
    orderBy: {
      lastEditedAt: "desc",
    },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Projects</h1>
          <p className="text-muted-foreground">
            Create and manage your real estate social media posts
          </p>
        </div>
        <Link href="/projects/new">
          <Button size="lg">
            <Plus className="w-5 h-5 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Plus className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">No projects yet</h2>
            <p className="text-muted-foreground mb-6">
              Create your first project to start designing amazing real estate social media posts
            </p>
            <Link href="/projects/new">
              <Button size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Project
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <ProjectsGrid projects={projects} />
      )}
    </div>
  )
}
