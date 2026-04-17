/**
 * The properties for each Box to be displayed in rows in the AdminNotifyMetricsComponent
 */

export interface AdminNotifyMetricsBox {
  color: string;
  textColor?: string;
  title: string;
  description: string;
  config: string;
  count?: number;
}
/**
 * The properties for each Row containing a list of AdminNotifyMetricsBox to be displayed in the AdminNotifyMetricsComponent
 */
export interface AdminNotifyMetricsRow {
  title: string;
  boxes: AdminNotifyMetricsBox[]
}
