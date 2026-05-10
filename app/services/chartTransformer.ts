export default function transformChart(chart: any) {
  const normalize = (s: string) => s?.toLowerCase().trim();

  const planetsByRashi: Record<string, any[]> = {};
  const planetsByHouse: Record<number, any[]> = {};

  Object.entries(chart.planets).forEach(([name, p]: any) => {
    const rashi = normalize(p.sign);
    const house = p.house;

    const planetData = {
      name,
      sign: rashi,
      house,
      isRetrograde: p.is_retrograde || false,
      isCombust: p.is_combust || false,
    };

    // 🔥 BY RASHI
    if (!planetsByRashi[rashi]) {
      planetsByRashi[rashi] = [];
    }

    planetsByRashi[rashi].push(planetData);

    // 🔥 BY HOUSE
    if (!planetsByHouse[house]) {
      planetsByHouse[house] = [];
    }

    planetsByHouse[house].push(planetData);
  });

  return {
    lagna: normalize(chart.lagna.sign),
    planetsByRashi,
    planetsByHouse,
  };
}