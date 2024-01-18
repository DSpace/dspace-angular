export interface AdminNotifyMetricsBox {
  color: string;
  textColor?: string;
  title: string;
  description: string;
  config: string;
  count?: number;
}

export interface AdminNotifyMetricsRow {
  title: string;
  boxes: AdminNotifyMetricsBox[]
}
