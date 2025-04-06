"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { motion } from "framer-motion"
import { useState } from "react"
import { industryData } from "@/data/industryData"
import ChartCard from "../components/ChartCard"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"

// Animation variants for chart cards
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07 }
  })
}

// Pie chart color palette
const pieColors = ["#34d399", "#60a5fa", "#fbbf24", "#f87171", "#c084fc", "#38bdf8", "#f472b6"]

export default function DashboardPage() {
  // Track selected tab: 'acv' or 'count'
  const [selectedTab, setSelectedTab] = useState("acv")
  // Track selected industry from dropdown
  const [selectedIndustry, setSelectedIndustry] = useState("all")

  // Filter data based on industry selection
  const filteredData =
    selectedIndustry === "all"
      ? industryData
      : industryData.filter(d => d.industry === selectedIndustry)

  // Derive unique industry names for filter dropdown
  const uniqueIndustries = [...new Set(industryData.map(d => d.industry))]

  // Prepare data for pie chart: value varies based on tab selection
  const pieData = filteredData.map(d => ({
    name: d.industry,
    value: selectedTab === "acv" ? d.acv : d.count
  }))

  // Format numbers with commas and max 2 decimal places
  const formatNumber = (num: number) =>
    Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(num);  

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left main section with charts and filters */}
      <div className="lg:col-span-3 space-y-10">
        
        {/* Header and industry dropdown */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 text-center">📊 Industry Insights</h1>
          
          {/* Industry filter dropdown */}
          <Select onValueChange={setSelectedIndustry} defaultValue="all">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {uniqueIndustries.map(ind => (
                <SelectItem key={ind} value={ind}>
                  {ind}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tabs for toggling between ACV and Count views */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="bg-white p-1 rounded-lg shadow-sm">
            <TabsTrigger value="acv">Highest ACV</TabsTrigger>
            <TabsTrigger value="count">Most Deals</TabsTrigger>
          </TabsList>

          {/* Tab content for each metric */}
          {["acv", "count"].map(tab => (
            <TabsContent key={tab} value={tab}>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
                {/* Sort and render cards dynamically */}
                {filteredData
                  .sort((a, b) =>
                    tab === "acv" ? b.acv - a.acv : b.count - a.count
                  )
                  .map((item, i) => (
                    <motion.div
                      key={item.industry}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      custom={i}
                    >
                      <Card className="rounded-2xl bg-gradient-to-br from-white to-slate-50 border shadow-lg hover:shadow-2xl transition-shadow">
                        <CardContent className="p-6 space-y-3">
                          <div className="flex justify-between items-center">
                            <p className="text-lg font-semibold text-gray-700">{item.industry}</p>
                            <Badge className="bg-blue-100 text-blue-700 border-none">
                              {item.count} Deals
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">ACV Total</p>
                          <p className="text-xl font-bold text-green-600">
                            ₹ {formatNumber(item.acv)}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Line/area chart based on tab and filtered data */}
        <ChartCard data={filteredData} tab={selectedTab} />

        {/* Bar and Pie charts for visual trends */}
        <div className="grid md:grid-cols-2 gap-8 mt-10">
          
          {/* Vertical Bar Chart */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              📈 {selectedTab === "acv" ? "ACV" : "Deals"} by Industry
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={filteredData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <XAxis type="number" />
                <YAxis dataKey="industry" type="category" />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey={selectedTab}
                  fill="#22c55e"
                  name={selectedTab === "acv" ? "ACV (₹)" : "Deals"}
                  radius={[0, 10, 10, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart with share distribution */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              🍩 {selectedTab === "acv" ? "ACV Distribution" : "Deal Share"}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Right sidebar with summary data */}
      <div className="lg:col-span-1 p-4 bg-white rounded-2xl shadow-sm space-y-4 h-fit">
        <h3 className="text-lg font-semibold text-gray-700">🧾 Summary</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>Total Industries: {filteredData.length}</li>
          <li>
            Total Deals:{" "}
            {filteredData.reduce((sum, d) => sum + d.count, 0)}
          </li>
          <li>
            Total ACV: ₹{" "}
            {formatNumber(filteredData
              .reduce((sum, d) => sum + d.acv, 0)
              )}
          </li>
        </ul>
      </div>
    </div>
  )
}
