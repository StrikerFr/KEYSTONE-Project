import type { Asset, Customer, InventoryItem, Notification, ServiceRequest, Technician, WorkOrder } from "@/types/domain";
export const workOrders: WorkOrder[] = [
{id:"WO-1042",issue:"HVAC cooling failure",customer:"XYZ Mall",location:"Building A · Floor 3",priority:"High",technician:"Rahul Sharma",status:"In Progress",sla:"42m remaining",created:"Today, 08:14",progress:72,asset:"AHU-04",description:"Cooling output has dropped across the east retail wing. Supply air temperature is 7°C above target."},
{id:"WO-1043",issue:"Generator inspection",customer:"Orion Business Park",location:"Tower 2 · Plant 01",priority:"Medium",technician:"Amit Verma",status:"Scheduled",sla:"Today, 14:30",created:"Today, 08:48",progress:28,asset:"GEN-12",description:"Quarterly load-bank inspection and fuel system integrity check."},
{id:"WO-1044",issue:"Electrical distribution fault",customer:"Metro Plaza",location:"Block C · Electrical Room",priority:"Critical",technician:"Neha Singh",status:"Assigned",sla:"18m remaining",created:"Today, 09:02",progress:88,asset:"PANEL-LV7",description:"Intermittent trip events reported on the west distribution panel."},
{id:"WO-1045",issue:"Elevator door sensor alert",customer:"Northstar Facilities",location:"Tower 1 · Lobby",priority:"High",technician:"Arjun Mehta",status:"On Hold",sla:"2h 10m remaining",created:"Yesterday, 17:21",progress:51,asset:"LIFT-03",description:"Door obstruction sensor is returning false-positive alerts."},
{id:"WO-1046",issue:"Chiller vibration analysis",customer:"Apex Industrial Systems",location:"Plant 01 · Utility Bay",priority:"Medium",technician:"Kavya Iyer",status:"Completed",sla:"Resolved in 3h 24m",created:"Yesterday, 12:06",progress:100,asset:"CHLR-08",description:"Investigate abnormal vibration readings on compressor stage two."}
];
export const technicians: Technician[] = [
{id:"rahul-sharma",name:"Rahul Sharma",initials:"RS",specialization:"HVAC Specialist",status:"On Job",activeJobs:3,completedJobs:184,slaScore:96},
{id:"amit-verma",name:"Amit Verma",initials:"AV",specialization:"Power Systems",status:"Available",activeJobs:1,completedJobs:152,slaScore:98},
{id:"neha-singh",name:"Neha Singh",initials:"NS",specialization:"Electrical Systems",status:"On Job",activeJobs:2,completedJobs:211,slaScore:94},
{id:"arjun-mehta",name:"Arjun Mehta",initials:"AM",specialization:"Vertical Transport",status:"On Leave",activeJobs:0,completedJobs:139,slaScore:97},
{id:"kavya-iyer",name:"Kavya Iyer",initials:"KI",specialization:"Industrial Cooling",status:"Available",activeJobs:1,completedJobs:176,slaScore:99}
];
export const requests: ServiceRequest[] = [
{id:"SR-2081",customer:"Orion Business Park",issue:"Water pressure fluctuation",location:"Tower 3 · Floor 8",priority:"High",submitted:"12m ago",status:"New"},
{id:"SR-2080",customer:"XYZ Mall",issue:"Escalator vibration",location:"Atrium · Level 2",priority:"Medium",submitted:"48m ago",status:"Under Review"},
{id:"SR-2079",customer:"Apex Industrial Systems",issue:"Compressor temperature alarm",location:"Plant 01",priority:"Critical",submitted:"2h ago",status:"Converted"},
{id:"SR-2078",customer:"Metro Plaza",issue:"Lighting control offline",location:"Block B",priority:"Low",submitted:"Yesterday",status:"Rejected"}
];
export const customers: Customer[] = [
{id:"xyz-mall",name:"XYZ Mall",organization:"Zenith Retail Properties",locations:4,openOrders:7,lastService:"Today, 10:24",status:"Active"},
{id:"orion-business-park",name:"Orion Business Park",organization:"Orion Commercial Estates",locations:6,openOrders:4,lastService:"Yesterday",status:"Active"},
{id:"metro-plaza",name:"Metro Plaza",organization:"Metro Urban Assets",locations:3,openOrders:3,lastService:"Sep 13, 2026",status:"Active"},
{id:"apex-industrial",name:"Apex Industrial Systems",organization:"Apex Manufacturing Group",locations:8,openOrders:5,lastService:"Sep 12, 2026",status:"Review"}
];
export const assets: Asset[] = [
{id:"AHU-04",name:"East Wing Air Handler",type:"HVAC Unit",customer:"XYZ Mall",location:"Building A · Roof",status:"Service Due",lastService:"Jun 18, 2026",nextMaintenance:"Sep 20, 2026"},
{id:"GEN-12",name:"Emergency Generator 12",type:"Generator",customer:"Orion Business Park",location:"Tower 2 · Plant 01",status:"Operational",lastService:"Jul 04, 2026",nextMaintenance:"Oct 04, 2026"},
{id:"LIFT-03",name:"Passenger Elevator 03",type:"Elevator",customer:"Northstar Facilities",location:"Tower 1",status:"Offline",lastService:"Aug 21, 2026",nextMaintenance:"Sep 18, 2026"},
{id:"CHLR-08",name:"Centrifugal Chiller 08",type:"Chiller",customer:"Apex Industrial Systems",location:"Utility Bay",status:"Operational",lastService:"Sep 17, 2026",nextMaintenance:"Dec 17, 2026"}
];
export const inventory: InventoryItem[] = [
{id:"P-301",name:"Pleated HVAC Filter 24×24",sku:"HV-FLT-2424",category:"Filtration",stock:42,minimum:20,unitCost:1850,status:"In Stock"},
{id:"P-302",name:"Contactor 32A 3P",sku:"EL-CTR-032",category:"Electrical",stock:6,minimum:10,unitCost:3250,status:"Low Stock"},
{id:"P-303",name:"V-Belt BX52",sku:"ME-BLT-BX52",category:"Mechanical",stock:0,minimum:8,unitCost:980,status:"Out of Stock"},
{id:"P-304",name:"Refrigerant R410A 10kg",sku:"HV-REF-R410",category:"HVAC",stock:14,minimum:6,unitCost:8900,status:"In Stock"}
];
export const notifications: Notification[] = [
{id:"n1",title:"SLA warning",body:"WO-1044 is approaching its SLA deadline.",time:"8 minutes ago",kind:"critical",unread:true},
{id:"n2",title:"New service request",body:"Orion Business Park reported a water pressure issue.",time:"12 minutes ago",kind:"info",unread:true},
{id:"n3",title:"Work completed",body:"Kavya Iyer completed WO-1046 within SLA.",time:"42 minutes ago",kind:"success",unread:false},
{id:"n4",title:"Low inventory",body:"Contactor 32A 3P is below minimum stock.",time:"1 hour ago",kind:"warning",unread:false}
];
export const activityData=[{d:"Sep 12",created:31,completed:24},{d:"Sep 13",created:38,completed:29},{d:"Sep 14",created:35,completed:32},{d:"Sep 15",created:48,completed:36},{d:"Sep 16",created:44,completed:39},{d:"Sep 17",created:55,completed:43},{d:"Sep 18",created:47,completed:41}];
