#! /usr/bin/env -S node --no-warnings --loader ts-node/esm/transpile-only

import { readFileSync, writeFileSync } from 'node:fs';
import { RecordBatchReader, Table, makeData, IntervalMonthDayNano, Vector, tableFromArrays, tableToIPC, tableFromIPC } from '../index.ts';
import { resolve } from "node:path";

// const mdn: IntervalMonthDayNano[] = [new IntervalMonthDayNanoBuilder()];
// tableFromArrays({ mdn });
console.log(import.meta.dirname);
const binFile = resolve(import.meta.dirname, 'interval-mdn.bin');
const binFile2 = resolve(import.meta.dirname, 'interval-mdn-js.bin');
const binData = readFileSync(binFile);
const reader = RecordBatchReader.from(binData)

const table = new Table(reader);
console.log(table.data[0].children)

type IntervalValue = {
  months: number;
  days: number;
  nanoseconds: bigint;
};
function convertIntervalValueToIntArray(value: IntervalValue): Int32Array {
  const int64s = new BigInt64Array(2);
  int64s[0] = BigInt(value.months ?? 0) + BigInt(value.days ?? 0) * (BigInt(1) << BigInt(32));
  int64s[1] = value.nanoseconds ?? BigInt(0);
  return new Int32Array(int64s.buffer);
}
function makeIntervalMonthDayNanoVector(intervalArray: IntervalValue[]) {
  const type = new IntervalMonthDayNano();
  const length = intervalArray.length;
  const data = new Int32Array(length * 4);
  const intervalLength = intervalArray.length;
  for (let i = 0; i < intervalLength; i++) {
      const intValue = convertIntervalValueToIntArray(intervalArray[i]);
      const intLength = intValue.length;
      for (let j = 0; j < intLength; j++) {
          data[i * 4 + j] = intValue[j];
      }
  }
  const vec = new Vector([makeData({ type, length, data })]);
  return vec;
}

const intervals = makeIntervalMonthDayNanoVector([
  { months: 1, days: 15, nanoseconds: 5_000_000n }
]);
const table2 = tableFromArrays({
  interval: intervals as any,
})
const binData2 = tableToIPC(table2);
writeFileSync(binFile2, binData2);
console.log(table2.data[0].children)

const table3 = tableFromIPC(binData2);
console.log(table3.data[0].children)

// for (const batch of reader) {
//   console.log(batch.schema.fields)
//   console.log(batch.data.children);
// }