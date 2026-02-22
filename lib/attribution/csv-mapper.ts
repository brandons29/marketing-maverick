import Papa from 'papaparse';

export interface AdSpendRow {
  date: string;
  campaign_id: string;
  campaign_name?: string;
  spend: number;
  impressions: number;
  clicks: number;
}

export interface InternalConversionRow {
  date: string;
  campaign_id: string;
  revenue: number;
  conversions: number;
}

export const mapAdSpendCSV = (csvData: string): AdSpendRow[] => {
  const parsed = Papa.parse(csvData, { header: true, skipEmptyLines: true });
  return parsed.data.map((row: any) => ({
    date: row.date || row.Date || row['Day'],
    campaign_id: row.campaign_id || row['Campaign ID'] || row['Campaign id'],
    campaign_name: row.campaign_name || row['Campaign Name'] || row['Campaign name'],
    spend: parseFloat(String(row.spend || row.Amount || row['Amount spent (USD)'] || '0').replace(/[^0-9.-]+/g,"")),
    impressions: parseInt(String(row.impressions || row.Impressions || '0').replace(/[^0-9.-]+/g,"")),
    clicks: parseInt(String(row.clicks || row.Clicks || '0').replace(/[^0-9.-]+/g,"")),
  }));
};

export const joinAdData = (adSpend: AdSpendRow[], conversions: InternalConversionRow[]) => {
  // Aggregate ad spend by campaign_id and date
  const adMap = new Map<string, AdSpendRow>();
  adSpend.forEach(row => {
    const key = `${row.date}_${row.campaign_id}`;
    if (adMap.has(key)) {
      const existing = adMap.get(key)!;
      existing.spend += row.spend;
      existing.clicks += row.clicks;
      existing.impressions += row.impressions;
    } else {
      adMap.set(key, { ...row });
    }
  });

  // Aggregate conversions by campaign_id and date
  const convMap = new Map<string, InternalConversionRow>();
  conversions.forEach(row => {
    const key = `${row.date}_${row.campaign_id}`;
    if (convMap.has(key)) {
      const existing = convMap.get(key)!;
      existing.revenue += row.revenue;
      existing.conversions += row.conversions;
    } else {
      convMap.set(key, { ...row });
    }
  });

  // Join them
  const results: any[] = [];
  adMap.forEach((ad, key) => {
    const match = convMap.get(key);
    const revenue = match?.revenue || 0;
    const conversionsCount = match?.conversions || 0;
    
    results.push({
      ...ad,
      revenue,
      conversions: conversionsCount,
      roas: ad.spend > 0 ? revenue / ad.spend : 0,
      cpa: conversionsCount > 0 ? ad.spend / conversionsCount : 0,
      tracking_gap: match ? 0 : 1 // Logic to be refined
    });
  });

  return results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
