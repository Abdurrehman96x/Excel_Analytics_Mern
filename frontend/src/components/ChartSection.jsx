import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

const ChartSection = ({ data }) => {
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-center">📊 Data Visualizations</h2>

      {/* Bar Chart */}
      <div className="w-full h-80">
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="Category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Total" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="w-full h-80">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="Total"
              nameKey="Category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartSection;
