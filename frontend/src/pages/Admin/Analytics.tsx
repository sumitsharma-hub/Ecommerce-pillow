import { useGetDashboardStatsQuery } from "../../features/admin/adminApi";

export default function Analytics() {
  const { data } = useGetDashboardStatsQuery();

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Analytics</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
