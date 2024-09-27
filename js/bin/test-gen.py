#!/usr/bin/env python3

import pyarrow as pa
import os

script_dir = os.path.dirname(os.path.realpath(__file__))
output_file = os.path.join(script_dir, 'interval-mdn.bin')

it = pa.scalar((1, 15, 5 * 1000 * 1000), type=pa.month_day_nano_interval())

col_names = ['interval']
col_1 = pa.array([it])
cols = [col_1]
batch = pa.record_batch(cols, names=col_names)

sink = pa.BufferOutputStream()
with pa.ipc.new_file(sink, batch.schema) as writer:
    writer.write_batch(batch)

buff = sink.getvalue()
print(buff)

with open(output_file, "wb") as f:
    f.write(buff.to_pybytes())
    print(f'generated {output_file}')