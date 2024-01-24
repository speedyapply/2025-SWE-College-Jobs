import { RpcName } from "./rpc-name";

export type Table = {
  path: string;
  query: RpcName;
  faangSalary: boolean;
  interval?: string;
};
