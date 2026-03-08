"use client"
import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import type {BarraProps, ChartConfig} from "@/types/estadisticas/interfaces"


function ChartPie({ 
  data, 
  title = "Pie Chart",
  description = "Data visualization",
  footerText,
  footerSubtext
}: BarraProps) {
  const chartData = data.map((item) => ({
    name: item.name,
    value: item.value,
    fill: item.color,
  }))

  
  const chartConfig = data.reduce((config, item) => {
    config[item.name.toLowerCase()] = {
      label: item.name,
      color: item.color,
    }
    return config
  }, {} as ChartConfig)

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="value" label nameKey="name" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      {(footerText || footerSubtext) && (
        <CardFooter className="flex-col gap-2 text-sm">
          {footerText && (
            <div className="flex items-center gap-2 leading-none font-medium">
              {footerText}
            </div>
          )}
          {footerSubtext && (
            <div className="leading-none text-muted-foreground">
              {footerSubtext}
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  )
}

export default ChartPie