"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

// Type workaround for React version conflicts
const AreaChartComp = AreaChart as any;
const AreaComp = Area as any;
const CartesianGridComp = CartesianGrid as any;
const XAxisComp = XAxis as any;

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { getJson } from "@/lib/api"

export const description = "Revenue series"

type SeriesResp = { series: { date: string; value: number }[]; days: number }

// 改为会话端点，无需 MERCHANT_ID

const chartConfig = {
  visitors: { label: "Revenue" },
  desktop: { label: "Revenue", color: "var(--primary)" },
  mobile: { label: "Revenue", color: "var(--primary)" },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("30d")
  const [series, setSeries] = React.useState<{ date: string; value: number }[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  React.useEffect(() => {
    let cancelled = false
    ;(async () => {
      try{
        setLoading(true)
        setError(null) // 重置错误状态
        const days = timeRange === '7d' ? 7 : 30
        const resp = await getJson<SeriesResp>(`/me/dashboard/revenue-series?days=${days}`)
        if(!cancelled){ setSeries(resp.series || []) }
      }catch(e){ 
        // 如果 API 端点不可用，静默失败（这是可选的）
        if(!cancelled){ 
          const errorMsg = e instanceof Error ? e.message : String(e)
          // 只在控制台记录，不显示错误给用户
          console.log('Revenue series endpoint not available:', errorMsg)
          setSeries([]) // 设置为空数组，不显示错误
        }
      }
      finally{ if(!cancelled){ setLoading(false) } }
    })()
    return () => { cancelled = true }
  }, [timeRange])

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Revenue Trend</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Daily net revenue
          </span>
          <span className="@[540px]/card:hidden">Revenue</span>
        </CardDescription>
        <div>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="30d" className="rounded-lg">Last 30 days</SelectItem>
              <SelectItem value="7d" className="rounded-lg">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <div className="h-[250px] w-full flex items-center justify-center">
            <div className="text-sm text-muted-foreground">Loading chart data...</div>
          </div>
        ) : series.length === 0 ? (
          <div className="h-[250px] w-full flex items-center justify-center border border-dashed rounded-lg">
            <div className="text-sm text-muted-foreground text-center">
              <p>No revenue data available</p>
              <p className="text-xs mt-1">Chart will appear when data is available</p>
            </div>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="h-[250px] w-full min-h-[250px]"
          >
            <AreaChartComp data={series}>
              <defs>
                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={1.0}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGridComp vertical={false} />
              <XAxisComp
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value: any) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value: any) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              <AreaComp
                dataKey="value"
                type="natural"
                fill="url(#fillMobile)"
                stroke="var(--color-mobile)"
                stackId="a"
              />
            </AreaChartComp>
          </ChartContainer>
        )}
        {error && (
          <div className="text-xs text-red-500 mt-2">{error}</div>
        )}
      </CardContent>
    </Card>
  )
}
