export interface AuditLogEntry {
  id: string;
  action: string;
  entity: string;
  details: string;
  changes?: {
    status?: { old: string; new: string };
    [key: string]: any;
  };
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}