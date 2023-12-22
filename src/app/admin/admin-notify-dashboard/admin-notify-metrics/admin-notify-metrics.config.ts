import { AdminNotifyMetricsRow } from "./admin-notify-metrics.model";

export const AdminNotifyMetricsRowsConfig: AdminNotifyMetricsRow[] = [
  {
    title: 'Number of received LDN',
    boxes: [
      {
        color: 'blue',
        title: 'Accepted',
        index: 0
      },
      {
        color: 'green',
        title: 'Processed LDN',
        index: 1
      },
      {
        color: 'red',
        title: 'Failure',
        index: 2
      },
      {
        color: 'red',
        title: 'Untrusted',
        index: 3
      },
      {
        color: 'grey',
        title: 'Incoming LDM messages',
        index: 4
      },
    ]
  },
  {
    title: 'Number of generated LDN',
    boxes: [
      {
        color: 'green',
        title: 'Delivered',
        index: 0
      },
      {
        color: 'blue',
        title: 'Queued',
        index: 1
      },
      {
        color: 'yellow',
        title: 'Queued for retry',
        index: 2
      },
      {
        color: 'red',
        title: 'Failure',
        index: 3
      },
      {
        color: 'grey',
        title: 'Outgoing LDM messages',
        index: 4
      },
    ]
  }
]
