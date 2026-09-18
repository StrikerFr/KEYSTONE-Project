import { assets, customers, inventory, requests, technicians, workOrders } from "@/data/mock";
const wait = (ms=220) => new Promise((resolve)=>setTimeout(resolve,ms));
export const workOrderService={async list(){await wait();return workOrders},async get(id:string){await wait();return workOrders.find(x=>x.id===id)}};
export const technicianService={async list(){await wait();return technicians},async get(id:string){await wait();return technicians.find(x=>x.id===id)}};
export const customerService={async list(){await wait();return customers},async get(id:string){await wait();return customers.find(x=>x.id===id)}};
export const assetService={async list(){await wait();return assets},async get(id:string){await wait();return assets.find(x=>x.id===id)}};
export const inventoryService={async list(){await wait();return inventory}};
export const requestService={async list(){await wait();return requests}};
