"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"

type TabKey = "flights" | "runways" | "cancellations" | "routes"

export function Tabs({
  defaultTab = "flights",
  onChange,
}: {
  defaultTab?: TabKey
  onChange?: (tab: TabKey) => void
}) {
  const [active, setActive] = useState<TabKey>(defaultTab)
  function setTab(tab: TabKey) {
    setActive(tab)
    onChange?.(tab)
  }
  return (
    <div className="flex items-center justify-center">
      <ButtonGroup>
        <Button
          variant={active === "flights" ? "default" : "outline"}
          onClick={() => setTab("flights")}
          className={active === "flights" ? "bg-primary text-primary-foreground" : ""}
        >
          Flights
        </Button>
        <Button
          variant={active === "runways" ? "default" : "outline"}
          onClick={() => setTab("runways")}
          className={active === "runways" ? "bg-primary text-primary-foreground" : ""}
        >
          Runways
        </Button>
        <Button
          variant={active === "cancellations" ? "default" : "outline"}
          onClick={() => setTab("cancellations")}
          className={active === "cancellations" ? "bg-primary text-primary-foreground" : ""}
        >
          Cancellations
        </Button>
        <Button
          variant={active === "routes" ? "default" : "outline"}
          onClick={() => setTab("routes")}
          className={active === "routes" ? "bg-primary text-primary-foreground" : ""}
        >
          Routes
        </Button>
      </ButtonGroup>
    </div>
  )
}
