import Papa from 'papaparse';

export interface AdSpendRow {
  date: string;
  campaign_id: string;
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
    date: row.date || row.Date,
    campaign_id: row.campaign_id || row['Campaign ID'],
    spend: parseFloat(row.spend || row.Amount || '0'),
    impressions: parseInt(row.impressions || row.Impressions || '0'),
    clicks: parseInt(row.clicks || row.Clicks || '0'),
  }));
};

export const joinAdData = (adSpend: AdSpendRow[], conversions: InternalConversionRow[]) => {
  return adSpend.map(ad => {
    const match = conversions.find(c => c.date === ad.date && c.campaign_id === ad.campaign_id);
    return {
      ...ad,
      revenue: match?.revenue || 0,
      conversions: match?.conversions || 0,
      roas: match ? (match.revenue / ad.spend) : 0
    };
  });
};
