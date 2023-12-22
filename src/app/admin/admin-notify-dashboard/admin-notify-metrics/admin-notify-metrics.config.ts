import { AdminNotifyMetricsRow } from './admin-notify-metrics.model';

export const AdminNotifyMetricsRowsConfig: AdminNotifyMetricsRow[] = [
  {
    title: 'Number of received LDN',
    boxes: [
      {
        color: '#B8DAFF',
        title: 'Accepted',
      },
      {
        color: '#D4EDDA',
        title: 'Processed LDN',
      },
      {
        color: '#FDBBC7',
        title: 'Failure',
      },
      {
        color: '#FDBBC7',
        title: 'Untrusted',
      },
      {
        color: '#43515F',
        title: 'Incoming LDM messages',
        textColor: '#fff'
      },
    ]
  },
  {
    title: 'Number of generated LDN',
    boxes: [
      {
        color: '#D4EDDA',
        title: 'Delivered',
      },
      {
        color: '#B8DAFF',
        title: 'Queued',
      },
      {
        color: '#FDEEBB',
        title: 'Queued for retry',
      },
      {
        color: '#FDBBC7',
        title: 'Failure',
      },
      {
        color: '#43515F',
        title: 'Outgoing LDM messages',
        textColor: '#fff'
      },
    ]
  }
];
