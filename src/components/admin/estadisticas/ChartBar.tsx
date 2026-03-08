import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
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
    type ChartConfig,
} from "@/components/ui/chart"

interface BarChartDataItem {
    label: string
    value: number
}

interface ChartBarLabelCustomProps {
    data: BarChartDataItem[]
    color?: string
    title?: string
    description?: string
    footerText?: string
    footerSubtext?: string
    dataLabel?: string
    showTrendingIcon?: boolean
    height?: number
}

function ChartBar({
    data,
    color = "#3b82f6",
    title = "Bar Chart - Custom Label",
    description = "Data visualization",
    footerText,
    footerSubtext,
    dataLabel = "Value",
    showTrendingIcon = false,
    height = 300
}: ChartBarLabelCustomProps) {

    const chartData = data.map((item) => ({
        label: item.label,
        value: item.value,
    }))

    const chartConfig = {
        value: {
            label: dataLabel,
            color: color,
        },
        label: {
            color: "hsl(var(--background))",
        },
    } satisfies ChartConfig

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="w-full" style={{ height: `${height}px` }}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{
                            right: 16,
                        }}
                    >
                        <CartesianGrid horizontal={false} />
                        <YAxis
                            dataKey="label"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                            hide
                        />
                        <XAxis dataKey="value" type="number" hide />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Bar
                            dataKey="value"
                            layout="vertical"
                            fill={color}
                            radius={4}
                        >
                            <LabelList
                                dataKey="label"
                                position="insideLeft"
                                offset={8}
                                className="fill-[--color-label]"
                                fontSize={12}
                            />
                            <LabelList
                                dataKey="value"
                                position="right"
                                offset={8}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            {(footerText || footerSubtext) && (
                <CardFooter className="flex-col items-start gap-2 text-sm">
                    {footerText && (
                        <div className="flex gap-2 leading-none font-medium">
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

export default ChartBar