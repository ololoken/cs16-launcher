import useYSDK from '../hooks/useYSDK';
import { Module } from '../types/Module';
import { Stack, TextField } from '@mui/material';
import { dispatch, useSelector } from '../store';
import { name } from '../store/reducers/game';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export type Props = {
  instance?: Module
  mainRunning: boolean
}

export default ({ instance, mainRunning }: Props) => {
  const { t } = useTranslation();

  const { playerName } = useSelector(state => state.game);

  const { sdk } = useYSDK();

  useEffect(() => {
    if (!instance || !mainRunning) return;
    instance.getCVar('name')
      .then((name: string) => {
        if (name === 'Player') {
          return sdk.getPlayer().then(player => player.getName() ?? name);
        }
        return name
      })
      .then((playerName: string) => dispatch(name(playerName)))

  }, [instance, mainRunning]);

  useEffect(() => {
    instance?.executeString(`name "${playerName}"`)
    instance?.executeString(`hostname "${playerName}"`)
  }, [playerName]);

  const getModelURL = (name: string) => {
    try {
      return URL.createObjectURL(new Blob([(instance?.FS.readFile(`${instance?.ENV.HOME}/rodir/valve/models/player/${name}/${name}.bmp`, { encoding: 'binary' })) ?? '']));
    }
    catch (ignore) {}
    return 'data:image/gif;base64,R0lGODlhAQABAIAAAP7//wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==';
  }

  return (!mainRunning ? <></> :
    <Stack direction="column" sx={{minWidth: 400}}>
      <TextField
        slotProps={{
          htmlInput: {
            onKeyPress: (e: KeyboardEvent) => e.stopPropagation(),
            onKeyUp: (e: KeyboardEvent) => e.stopPropagation(),
            onKeyDown: (e: KeyboardEvent) => e.stopPropagation(),
          }
        }}
        value={playerName}
        onChange={e => dispatch(name(e.target.value))}
        label={t('input.Player name')} variant="standard" />
    </Stack>
  )
}
