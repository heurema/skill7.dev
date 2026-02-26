export interface EmporiumPlugin {
  name: string;
  description: string;
  category: string;
  source: {
    source: string;
    url: string;
  };
  homepage: string;
}

export interface Marketplace {
  plugins: EmporiumPlugin[];
}

export interface PluginMeta {
  name: string;
  description: string;
  category: string;
  homepage: string;
  source: { source: string; url: string };
  version?: string;
  license?: string;
  status: "active" | "beta" | "deprecated";
  tags: string[];
  verified: boolean;
}

export interface Category {
  name: string;
  displayName: string;
  description: string;
}
