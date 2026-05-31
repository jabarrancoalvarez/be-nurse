declare module 'vanta/dist/vanta.net.min' {
  const VantaNet: (options: Record<string, unknown>) => { destroy(): void };
  export default VantaNet;
}

declare module 'vanta/dist/vanta.waves.min' {
  const VantaWaves: (options: Record<string, unknown>) => { destroy(): void };
  export default VantaWaves;
}

declare module 'vanta/dist/vanta.birds.min' {
  const VantaBirds: (options: Record<string, unknown>) => { destroy(): void };
  export default VantaBirds;
}
