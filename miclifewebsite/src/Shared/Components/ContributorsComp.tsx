 
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { ContributorContext } from "../context/ContributorContext";

// const data = [
//   { arName: "نقابة المهندسين", enName: "Engineers Syndicate", value: 33.2, color: "#179d5a" },
//   {
//     arName: "الشركة القابضة المصرية الكويتية",
//     enName: "Egyptian Kuwaiti Holding Company",
//     value: 24.99,
//     color: "#4c47cd",
//   },
//   { arName: "بيت الخبرة", enName: "House of Expertise", value: 22.13, color: "#f1c40f" },
//   { arName: "قناة السويس", enName: "Suez Canal", value: 9.99, color: "#3ba0a7" },
//   { arName: "اخرى", enName: "Others", value: 9.68, color: "#95a5a6" },
// ];

const RADIAN = Math.PI / 180;

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  direction: string;
}

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, direction }: LabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.65;
  const x = cx + radius * Math.cos(-midAngle * RADIAN) * 1.5;
  const y = cy + radius * Math.sin(-midAngle * RADIAN) * 1;

  return (
    <text
      className="font-bold"
      x={x}
      y={y}
      fill="black"
      textAnchor={x > cx === (direction === "ltr") ? "end" : "start"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(2)}%`}
    </text>
  );
};

const ContributorsComp = () => {
  const { t, i18n } = useTranslation();
  const contributorsData = useContext(ContributorContext) ?? [];
  const chartData = Array.isArray(contributorsData)
    ? contributorsData.map((contributor: any, index: number) => ({
        ...contributor,
        value: Number(contributor.share.replace("%", "") ?? 0),
        color: contributor.color ?? defaultColors[index % defaultColors.length],
      }))
    : [];
  return (
    <div className="container flex flex-col mt-5 lg:flex-row items-center justify-between p-8 rounded-lg shadow-lg mx-auto">
      {/* Shareholder List */}
      <div className="w-full lg:w-2/3 ">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("Ownership percentage")}</h2>
        <div className="grid grid-cols-2 gap-2 text-lg text-gray-700">
          <span className="font-semibold">{t("Contributor")}</span>
          <span className="text-center font-semibold">{t("Percentage owned")}</span>
          {chartData?.map((contributor: any, index: number) => (
            <React.Fragment key={index}>
              <span>{contributor.title ?? contributor.name}</span>
              <span className="text-center font-medium text-gray-900">{contributor.value}%</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Pie Chart */}
      <div className="w-full lg:w-1/3 flex justify-center">
        <PieChart width={300} height={300}>
          <Pie
            direction={i18n?.language === "ar" ? "rtl" : "ltr"}
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel as any}
            outerRadius={140}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData?.map((contributor: any, index: number) => (
              <Cell key={`cell-${index}`} fill={contributor.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
};

const defaultColors = ["#179d5a", "#4c47cd", "#f1c40f", "#3ba0a7", "#95a5a6", "#e67e22", "#9b59b6", "#2ecc71"];

export default ContributorsComp;
