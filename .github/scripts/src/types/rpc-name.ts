type Role = "swe_new_grad" | "swe_intern";
type Region = "usa" | "intl";
export type BaseRpcName = `get_${Role}_${Region}`;

type RpcNameFaang = `${BaseRpcName}_faang`;
type RpcNameQuant = `${BaseRpcName}_quant`;
export type RpcName = BaseRpcName | RpcNameFaang | RpcNameQuant;
