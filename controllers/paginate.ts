// import { NSEntity } from "../@types/entity.js";
import { entities } from "../@types/entity.js";
import { GetAll } from "../@types/page.js";
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

export { paginate };
