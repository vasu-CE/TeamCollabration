"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { LineChart } from "@/components/ui/lineChart"

const teamMembers = [
  {
    name: "Maitrik",
    avatar: "/placeholder.svg",
    role: "Member",
    canRemove: true,
  },
  {
    name: "Oscar Davis",
    avatar: "/placeholder.svg",
    role: "Member",
    canRemove: true,
  },
  {
    name: "Leader",
    avatar: "/placeholder.svg",
    role: "Leader",
    canRemove: false,
  },
]

const githubData = {
  labels: ["23 Nov", "24", "25", "26", "27", "28", "29", "30"],
  datasets: [
    {
      label: "Contributions",
      data: [25000, 25000, 27000, 28000, 32000, 35000, 37000, 45000],
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
    },
  ],
}

export default function TeamDetailPage() {
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Team 1</h1>
          <Button>ADD MEMBERS</Button>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.map((member, i) => (
                    <div key={i} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.role}</div>
                        </div>
                      </div>
                      {member.canRemove && (
                        <Button variant="destructive" size="sm">
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>GITHUB GRAPH</CardTitle>
              </CardHeader>
              <CardContent>
                {/* <div className="h-[300px]">
                  <LineChart data={githubData} />
                </div> */}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { sessions: 4321, change: "+84%" },
                  { sessions: 4033, change: "-8%" },
                  { sessions: 3128, change: "+2%" },
                  { sessions: 2104, change: "+33%" },
                  { sessions: 2003, change: "+30%" },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div>
                      <div className="text-sm font-medium">website.net</div>
                      <div className="text-sm text-muted-foreground">{stat.sessions} sessions</div>
                    </div>
                    <div className={stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}>{stat.change}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

