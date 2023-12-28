export interface AdminNotifyMetricsBox {
  color: string;
  textColor?: string;
  title: string;
  config: string;
  count?: number
}

export interface AdminNotifyMetricsRow {
  title: string;
  boxes: AdminNotifyMetricsBox[]
}
