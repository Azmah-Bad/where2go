import { Relationship } from "./relationship";

export interface QueryResult {
  model: string;
  pk: number;
  fields: Relationship;
}

