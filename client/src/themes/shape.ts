//设置组件形状（边界弧度）

declare module "@mui/system" {
  interface Shape {
    borderRadiusSm: number | string;
    borderRadiusMd: number | string;
  }
}

const shape = {
  borderRadius: 8,
  borderRadiusSm: 12,
  borderRadiusMd: 16,
};

export default shape;
