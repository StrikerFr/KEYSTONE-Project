export type WorkOrderStatus = "New" | "Assigned" | "Scheduled" | "In Progress" | "On Hold" | "Completed" | "Closed";
export type Priority = "Low" | "Medium" | "High" | "Critical";
export type TechnicianStatus = "Available" | "On Job" | "Offline" | "On Leave";
export interface Technician { id:string; name:string; initials:string; specialization:string; status:TechnicianStatus; activeJobs:number; completedJobs:number; slaScore:number; }
export interface WorkOrder { id:string; issue:string; customer:string; location:string; priority:Priority; technician:string; status:WorkOrderStatus; sla:string; created:string; progress:number; asset:string; description:string; }
export interface ServiceRequest { id:string; customer:string; issue:string; location:string; priority:Priority; submitted:string; status:"New"|"Under Review"|"Converted"|"Rejected"; }
export interface Customer { id:string; name:string; organization:string; locations:number; openOrders:number; lastService:string; status:"Active"|"Review"; }
export interface Asset { id:string; name:string; type:string; customer:string; location:string; status:"Operational"|"Service Due"|"Offline"; lastService:string; nextMaintenance:string; }
export interface InventoryItem { id:string; name:string; sku:string; category:string; stock:number; minimum:number; unitCost:number; status:"In Stock"|"Low Stock"|"Out of Stock"; }
export interface Notification { id:string; title:string; body:string; time:string; kind:"critical"|"warning"|"info"|"success"; unread:boolean; }
