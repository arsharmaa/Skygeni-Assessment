// Import reusable UI components and charting libraries
import { Card, CardContent } from "@/components/ui/card"
import { Typography } from "@mui/material"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts"
import { motion } from "framer-motion"
import { industryData } from "@/data/industryData"

// Animation variant for subtle entrance effect
const chartCardVariants = {
  hidden: { opacity: 0, y: 20 }, // Starts slightly lower with 0 opacity
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } } // Animates into view
}

// ChartCard component displays a responsive line chart for ACV or Deal Count
const ChartCard = ({
  data,
  tab
}: {
  data: typeof industryData, // Incoming dataset
  tab: string // Either "acv" or "count", controls chart type
}) => {
  // Prepare chart data by sorting and mapping it into desired format
  const chartData = [...data]
    .sort((a, b) => tab === "acv" ? b.acv - a.acv : b.count - a.count) // Sort descending
    .map(item => ({
      name: item.industry, // X-axis label
      value: tab === "acv" ? item.acv : item.count // Y-axis value based on tab
    }))

  return (
    <motion.div
      variants={chartCardVariants}
      initial="hidden"
      animate="visible"
      className="mt-10"
    >
      {/* Card wrapper with padding and shadow */}
      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-6 space-y-4">
          {/* Dynamic heading based on tab */}
          <Typography variant="h6" fontWeight={600}>
            {tab === "acv" ? "ACV Trends" : "Deal Count Trends"}
          </Typography>

          {/* Responsive chart container */}
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              {/* Grid lines for better readability */}
              <CartesianGrid strokeDasharray="3 3" />
              {/* X and Y axes */}
              <XAxis dataKey="name" />
              <YAxis />
              {/* Tooltip on hover */}
              <Tooltip />
              {/* Main line */}
              <Line
                type="monotone"
                dataKey="value"
                stroke={tab === "acv" ? "#22c55e" : "#3b82f6"} // Green for ACV, blue for count
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default ChartCard
