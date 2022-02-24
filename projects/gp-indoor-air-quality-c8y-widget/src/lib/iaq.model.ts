export interface IndoorAirQualityLevel {
  label: string;
  recommendation: string;
  threshold: {
    min: number;
    max: number;
  };
  cssColor: string;
}

export interface WidgetConfiguration {
  device: {
    id: string;
  };
  dataPoint: {
    fragment: string;
    series: string;
  };
}
