
import { Area, AreaChart, ResponsiveContainer } from "recharts";
const data = [
  {
    x: 1,
    y: 0
  },
  {
    x: 2,
    y: 107
  },
  {
    x: 3,
    y: 159
  },
  {
    x: 4,
    y: 123
  },
  {
    x: 5,
    y: 188
  },
  {
    x: 6,
    y: 291
  },
  {
    x: 7,
    y: 62
  },
  {
    x: 8,
    y: 398
  },
  {
    x: 9,
    y: 305
  },
  {
    x: 10,
    y: 450
  },
  {
    x: 11,
    y: 421
  },
  {
    x: 12,
    y: 687
  },
  {
    x: 13,
    y: 554
  },
  {
    x: 14,
    y: 157
  },
  {
    x: 15,
    y: 642
  },
  {
    x: 16,
    y: 516
  },
  {
    x: 17,
    y: 724
  },
  {
    x: 18,
    y: 827
  },
  {
    x: 19,
    y: 799
  },
  {
    x: 20,
    y: 1000
  }
];
const assistedRevenue = [
  { x: 1, y: 59 },
  { x: 2, y: 45 },
  { x: 3, y: 50 },
  { x: 4, y: 59 },
  { x: 5, y: 40 },
  { x: 6, y: 59 },
  { x: 7, y: 54 },
  { x: 8, y: 52 },
  { x: 9, y: 43 },
  { x: 10, y: 57 },
  { x: 11, y: 49 },
  { x: 12, y: 65 },
  { x: 13, y: 70 },
  { x: 14, y: 56 },
  { x: 15, y: 71 },
  { x: 16, y: 62 },
  { x: 17, y: 63 },
  { x: 18, y: 87 },
  { x: 19, y: 69 },
  { x: 20, y: 72 },
  { x: 21, y: 88 },
  { x: 22, y: 80 },
  { x: 23, y: 96 },
  { x: 24, y: 83 },
  { x: 25, y: 97 },
  { x: 26, y: 97 },
  { x: 27, y: 93 },
  { x: 28, y: 72 },
  { x: 29, y: 82 },
  { x: 30, y: 111 },
  { x: 31, y: 104 }
];
 
const averageOrderValue = [
  { x: 1, y: 56 },
  { x: 2, y: 43 },
  { x: 3, y: 41 },
  { x: 4, y: 47 },
  { x: 5, y: 41 },
  { x: 6, y: 55 },
  { x: 7, y: 45 },
  { x: 8, y: 41 },
  { x: 9, y: 51 },
  { x: 10, y: 53 },
  { x: 11, y: 56 },
  { x: 12, y: 50 },
  { x: 13, y: 67 },
  { x: 14, y: 63 },
  { x: 15, y: 80 },
  { x: 16, y: 85 },
  { x: 17, y: 90 },
  { x: 18, y: 64 },
  { x: 19, y: 84 },
  { x: 20, y: 88 },
  { x: 21, y: 73 },
  { x: 22, y: 105 },
  { x: 23, y: 93 },
  { x: 24, y: 76 },
  { x: 25, y: 73 },
  { x: 26, y: 78 },
  { x: 27, y: 89 },
  { x: 28, y: 83 },
  { x: 29, y: 90 },
  { x: 30, y: 111 },
  { x: 31, y: 104 }
];

const conversionRate = [
  { x: 1, y: 56 },
  { x: 2, y: 53 },
  { x: 3, y: 56 },
  { x: 4, y: 56 },
  { x: 5, y: 53 },
  { x: 6, y: 53 },
  { x: 7, y: 56 },
  { x: 8, y: 47 },
  { x: 9, y: 56 },
  { x: 10, y: 56 },
  { x: 11, y: 43 },
  { x: 12, y: 66 },
  { x: 13, y: 64 },
  { x: 14, y: 56 },
  { x: 15, y: 69 },
  { x: 16, y: 57 },
  { x: 17, y: 60 },
  { x: 18, y: 62 },
  { x: 19, y: 60 },
  { x: 20, y: 50 },
  { x: 21, y: 75 },
  { x: 22, y: 63 },
  { x: 23, y: 89 },
  { x: 24, y: 82 },
  { x: 25, y: 60 },
  { x: 26, y: 85 },
  { x: 27, y: 78 },
  { x: 28, y: 72 },
  { x: 29, y: 78 },
  { x: 30, y: 74 },
  { x: 31, y: 62 }
];

const conversion = [
  { x: 1, y: 48 },
  { x: 2, y: 60 },
  { x: 3, y: 51 },
  { x: 4, y: 59 },
  { x: 5, y: 43 },
  { x: 6, y: 60 },
  { x: 7, y: 53 },
  { x: 8, y: 40 },
  { x: 9, y: 51 },
  { x: 10, y: 60 },
  { x: 11, y: 43 },
  { x: 12, y: 51 },
  { x: 13, y: 58 },
  { x: 14, y: 54 },
  { x: 15, y: 83 },
  { x: 16, y: 68 },
  { x: 17, y: 81 },
  { x: 18, y: 93 },
  { x: 19, y: 102 },
  { x: 20, y: 103 },
  { x: 21, y: 82 },
  { x: 22, y: 120 },
  { x: 23, y: 117 },
  { x: 24, y: 98 },
  { x: 25, y: 116 },
  { x: 26, y: 98 },
  { x: 27, y: 119 },
  { x: 28, y: 138 },
  { x: 29, y: 137 },
  { x: 30, y: 130 },
  { x: 31, y: 140 }
]



const Chart = ({graphData } : any) => {
  const strokeColor = "var(--color--success-standard)";
  const fillcolor  = "var(--color--success-faint)";
 
  return (
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={graphData }>
          <Area
            type="monotone"
            dot={false}
            dataKey="y"
            stroke={strokeColor}
            fill={fillcolor}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
  );
};

export default Chart;

