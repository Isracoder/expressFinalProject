// import { NSEntity } from "../@types/entity.js";
import { entities } from "../@types/entity.js";
import { GetAll, PaginateEntityList } from "../@types/page.js";
import { Repository } from "typeorm";
import dataSource from "../db/index.js";

const paginate = async (payload: GetAll) => {
  const page: number = parseInt(payload.page);
  const pageSize: number = parseInt(payload.pageSize);
  if (page != page || pageSize != pageSize) {
    throw "valid numbers are needed for pagination";
  }
  const repository: Repository<any> = dataSource.getRepository(
    entities[payload.dbName]
  );
  const [info, total] = await repository.findAndCount({
    skip: pageSize * (page - 1),
    take: pageSize,
    order: {
      //   name: "ASC", // alphabetical ordering
      id: "ASC", // id ordering
    },
  });

  return {
    page,
    pageSize: info.length,
    total,
    info,
  };
};
// try to get it to take an entity list in general and then paginate it
const paginateList = async <T>(payload: PaginateEntityList<T>) => {
  const page: number = parseInt(payload.page);
  const pageSize: number = parseInt(payload.pageSize);

  if (page != page || pageSize != pageSize) {
    throw "valid numbers are needed for pagination";
  }
  const info = payload.list.slice((page - 1) * pageSize, page * pageSize);

  return {
    page,
    pageSize: info.length,
    total: payload.list.length,
    info,
  };
};
export { paginate, paginateList };
