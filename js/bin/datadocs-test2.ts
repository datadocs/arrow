#! /usr/bin/env -S node --no-warnings --loader ts-node/esm/transpile-only

import { RecordBatchReader, Table, makeData, IntervalMonthDayNano, Vector, tableFromArrays, tableToIPC, tableFromIPC } from '../index.ts';

const jsonIPC = {
  schema: {
    fields: [
      {
        name: "f1",
        type: {
          name: "interval",
          unit: "MONTH_DAY_NANO",
        },
        nullable: true,
        children: [],
      },
    ],
  },
  batches: [
    {
      count: 3,
      columns: [
        {
          name: "f1",
          count: 3,
          VALIDITY: [0, 1, 1],
          DATA: [
            {
              months: 1658191469,
              days: -1613411737,
              nanoseconds: -1498898689767660715,
            },
            {
              months: 173047379,
              days: 1107380529,
              nanoseconds: 6108823420204370606,
            },
            {
              months: 173047379,
              days: 1107380529,
              nanoseconds: 6108823420204370606,
            },
          ],
        },
      ],
    },
  ],
};

const reader = RecordBatchReader.from(jsonIPC);
const table = new Table(reader);
console.log(table.schema)
console.log(table.getChildAt(0)?.data)
// console.log(!!table.getChildAt(1))
// console.log(!!table.getChildAt(2))
