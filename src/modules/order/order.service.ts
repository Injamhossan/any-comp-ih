import { Order } from "@/entities/Order";
import { getDataSource } from "@/lib/data-source";
import { Specialist } from "@/entities/Specialist";

export const createOrder = async (data: any) => {
  const dataSource = await getDataSource();
  
  // Robust lookup to handle class mismatch in dev mode
  const orderMetadata = dataSource.entityMetadatas.find(m => m.name === "Order");
  const specialistMetadata = dataSource.entityMetadatas.find(m => m.name === "Specialist");
  
  if (!orderMetadata) throw new Error("Order entity metadata not found. Check AppDataSource entities.");
  if (!specialistMetadata) throw new Error("Specialist entity metadata not found.");

  const orderRepo = dataSource.getRepository(orderMetadata.target);
  const specialistRepo = dataSource.getRepository(specialistMetadata.target);

  console.log("[Order-Service] Creating order with data:", data);

  // elCase from frontend to snake_case for DB
  // Use orderRepo.create to ensure we use the correct class instance from metadata
  const order = orderRepo.create({
      specialist_id: data.specialistId,
      amount: Number(data.amount),
      user_id: data.userId || null,
      customer_name: data.customerName || null,
      customer_email: data.customerEmail || null,
      customer_phone: data.customerPhone || null,
      requirements: data.requirements || null,
  });

  console.log("[Order-Service] Order object prepared to save:", order);

  // 2. Save Order
  const savedOrder = await orderRepo.save(order);

  // 3. Increment purchase_count on Specialist (Manual update for reliability/debugging)
  try {
      const specialist = await specialistRepo.findOneBy({ id: data.specialistId });
      if (specialist) {
          console.log(`[Order-Service] Previous count for ${specialist.title}: ${specialist.purchase_count}`);
          specialist.purchase_count = (specialist.purchase_count || 0) + 1;
          await specialistRepo.save(specialist);
          console.log(`[Order-Service] New count: ${specialist.purchase_count}`);
      } else {
          console.error("[Order-Service] Specialist not found for incrementing count");
      }
  } catch (incError) {
      console.error("[Order-Service] Failed to increment purchase count:", incError);
      // Don't fail the order just because count failed, but log it
  }

  return savedOrder;
};

export const getOrders = async (userId?: string, specialistId?: string) => {
  const dataSource = await getDataSource();
  const orderMetadata = dataSource.entityMetadatas.find(m => m.name === "Order");
  if (!orderMetadata) throw new Error("Order metadata not found");
  const orderRepo = dataSource.getRepository(orderMetadata.target);

  const where: any = {};
  if (userId) where.user_id = userId;
  if (specialistId) where.specialist_id = specialistId;

  console.log("[Order-Service] Fetching orders with filter:", where);

  const orders = await orderRepo.find({
    where,
    relations: ["specialist", "user"],
    order: { created_at: "DESC" }
  });
  
  console.log(`[Order-Service] Found ${orders.length} orders`);
  return orders;
};

export const updateOrder = async (id: string, data: any) => {
  const dataSource = await getDataSource();
  const orderRepo = dataSource.getRepository(Order); // Use class directly if clean, or metadata if paranoid
  
  // We can just use the name for robustness in this context since we imported it
  const order = await orderRepo.findOneBy({ id });
  
  if (!order) throw new Error("Order not found");

  if (data.status) order.status = data.status;
  
  return await orderRepo.save(order);
};
