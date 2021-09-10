type ValueType = "1B" | "2B" | "4B" | "4BSigned";

class BufferBuilder {
  private buffer: ArrayBuffer;
  private dataView: DataView;
  private offset = 0;

  static create(size: number) {
    return new BufferBuilder(size);
  }

  private static SETTER_MAP = {
    "1B": "setUint8",
    "2B": "setUint16",
    "4B": "setUint32",
    "4BSigned": "setInt32",
  } as const;

  private static BYTE_MAP = {
    "1B": 1,
    "2B": 2,
    "4B": 4,
    "4BSigned": 4,
  } as const;

  private constructor(size: number) {
    this.buffer = new ArrayBuffer(size);
    this.dataView = new DataView(this.buffer);
    this.offset = 0;
  }

  add(valueType: ValueType, value: number) {
    const littleEndian = valueType === "1B" ? undefined : true;
    this.dataView[BufferBuilder.SETTER_MAP[valueType]](
      this.offset,
      value,
      littleEndian
    );
    this.offset += BufferBuilder.BYTE_MAP[valueType];
    return this;
  }

  build() {
    return this.buffer;
  }
}

export default BufferBuilder;
