// src/types.ts
export type SpotifyTokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
};

export type SpotifyTrack = {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  duration_ms: number;
  preview_url: string | null;
  external_urls: { spotify: string };
};

export type MoodData = {
  emotion: string;
  confidence: number;
  color: string;
};

export type FaceMeshModel = {
  estimateFaces: (input: HTMLVideoElement) => Promise<{
    scaledMesh: number[][];
  }[]>;
};