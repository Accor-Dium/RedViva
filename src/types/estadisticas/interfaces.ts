
export interface BarChartDataItem {
    label: string
    value: number
}

export interface ChartBarLabelCustomProps {
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

export interface PieChartDataItem {
  name: string
  value: number
  color: string
}

export interface BarraProps {
  data: PieChartDataItem[]
  title?: string
  description?: string
  footerText?: string
  footerSubtext?: string
}

export const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

export type ChartContextProps = {
  config: ChartConfig
}