export interface AdminNotifyMetricsBox {
  color: string;
  textColor?: string;
  title: string;
  count?: number
}

export interface AdminNotifyMetricsRow {
  title: string;
  boxes: AdminNotifyMetricsBox[]
}
