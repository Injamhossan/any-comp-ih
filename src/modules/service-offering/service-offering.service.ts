import { getDataSource } from "@/lib/data-source";
import { ServiceOfferingMasterList } from "@/entities/ServiceOfferingMasterList";

export const getMasterList = async () => {
  const dataSource = await getDataSource();
  const repo = dataSource.getRepository("ServiceOfferingMasterList");
  return await repo.find();
};
