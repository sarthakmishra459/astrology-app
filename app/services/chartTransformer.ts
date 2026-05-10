export default function transformChart(chart: any) {
  const normalize = (s: string) => s?.toLowerCase().trim();

  const planetsByRashi: Record<string, any[]> = {};

  Object.entries(chart.planets).forEach(([name, p]: any) => {
    const rashi = normalize(p.sign);

    if (!planetsByRashi[rashi]) {
      planetsByRashi[rashi] = [];
    }

    planetsByRashi[rashi].push({
      name,
      isRetrograde: p.is_retrograde || false,
      isCombust: p.is_combust || false,
    });
  });

  return {
    lagna: normalize(chart.lagna.sign), // 🔥 CRITICAL
    planetsByRashi,
  };
}
