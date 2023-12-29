export interface AdminNotifyMetricsBox {
  color: string;
  textColor?: string;
  title: string;
  config: string;
  count?: number;
  isRowAggregateCount?: boolean;
}

export interface AdminNotifyMetricsRow {
  title: string;
  boxes: AdminNotifyMetricsBox[]
}
