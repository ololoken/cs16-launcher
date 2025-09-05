import { createSlice } from '@reduxjs/toolkit';

export type GameProps = {
  playerName: string

  selectedMap: string

  servers: Record<number, Record<string, string | number>>

  connecting: boolean
  connected: boolean
  showSettings: boolean
  serverStarting: boolean
  serverRunning: boolean
}

const initialState: GameProps = {
  playerName: '',

  selectedMap: 'de_dust2.bsp',

  servers: {},

  connecting: false,
  connected: false,
  showSettings: true,
  serverStarting: false,
  serverRunning: false,
}


const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    name: (state, action) => {
      state.playerName = action.payload ?? initialState.playerName
    },
    map: (state, action) => {
      state.selectedMap = action.payload ?? initialState.selectedMap;
    },
    publicServers: (state, action) => {
      state.servers = action.payload ?? initialState.servers
    },
    addServer: (state, action) => {
      state.servers = {...state.servers, ...action.payload}
    },
    removeServer: (state, action) => {
      delete state.servers[action.payload];
    },
    flow: (state, action) => {
      state.connecting = action.payload.connecting ?? state.connecting;
      state.connected = action.payload.connected ?? state.connected;
      state.showSettings = action.payload.showSettings ?? state.showSettings;
      state.serverStarting = action.payload.serverStarting ?? state.serverStarting;
      state.serverRunning = action.payload.serverRunning ?? state.serverRunning;
    }
  }
});

export default gameSlice.reducer;

export const { name, map, publicServers, addServer, removeServer, flow } = gameSlice.actions;
