import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Select, Typography,
} from '@material-ui/core';
import { customTheme } from 'configurations/theme.configuration';
import { GetDisciplineResponse } from 'services/models/discipline.model';
import { ToastVariant } from 'components/toast/toast';
import { Participation } from 'services/models/challenge.model';
import InfoIcon from '@material-ui/icons/Info';

export type DisciplineParticipation = {
  definition: GetDisciplineResponse;
  alreadyRanked: boolean;
}

type ChallengeDisciplineParticipationDialogProps = {
  disciplines: DisciplineParticipation[];
  callbackValidateFn: (newParticipation: Participation) => any
  callbackCloseFn: () => any
  actions: {
    error: (message: string) => any;
    openToast: (message: string, variant: ToastVariant) => any;
    push: (path: string, state?: any | undefined) => any;
  };
};

const ChallengeDisciplineParticipationDialog = (props: ChallengeDisciplineParticipationDialogProps) => {
  const [newParticipationDiscipline, setNewParticipationDiscipline] = useState<string>('');
  const [newParticipationElectronic, setNewParticipationElectronic] = useState(false);
  const [newParticipationOutrank, setNewParticipationOutrank] = useState(false);
  const [newParticipationPaid, setNewParticipationPaid] = useState(false);
  const [outrankLocked, setOutrankLocked] = useState(false);
  const participationDialogFormValid = !!newParticipationDiscipline;

  const handleNewParticipationDisciplineChange = (event: any) => {
    const newValue = event.target.value;
    setNewParticipationDiscipline(newValue);
    const outrankLocked = newValue !== ''
      && (props.disciplines.find(discipline => discipline.definition.label === newValue)?.alreadyRanked ?? false);
    setNewParticipationOutrank(outrankLocked);
    setOutrankLocked(outrankLocked);
  };

  const handleClose = () => {
    props.callbackCloseFn();
  };

  const handleCallback = () => {
    props.callbackValidateFn({
      discipline: newParticipationDiscipline,
      useElectronicTarget: newParticipationElectronic,
      outrank: newParticipationOutrank,
      paid: newParticipationPaid,
    });
    props.callbackCloseFn();
  }

  const alreadyRankedWarningMessage = outrankLocked ?
    <Box fontStyle="italic">
      <Typography variant="body2">
        <InfoIcon color="secondary" fontSize="small"/> Il y a déjà une participation classée pour cette discipline
      </Typography>
    </Box> : null;

  if (props.disciplines.length === 0) {
    // TODO spinner (with message ?)
    return null;
  } else {
    return (
      <Dialog fullWidth maxWidth="md" open={true} onClose={handleClose}>
        <DialogTitle>AJOUTER UNE PARTICIPATION</DialogTitle>
        <DialogContent>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12}>
              {alreadyRankedWarningMessage}
            </Grid>
            <Grid item xs={12}/>
            <Grid item xs={12}>
              <FormControl required fullWidth>
                <InputLabel>Discipline</InputLabel>
                <Select
                  value={newParticipationDiscipline}
                  onChange={handleNewParticipationDisciplineChange}
                  renderValue={customTheme.selectSimpleRender}
                >
                  {props.disciplines.map(discipline => (
                    <MenuItem key={discipline.definition.id} value={discipline.definition.label}>
                      {discipline.definition.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newParticipationElectronic}
                      onChange={() =>
                        setNewParticipationElectronic(!newParticipationElectronic)
                      }
                      color="primary"
                    />
                  }
                  label="CIBLE ÉLECTRONIQUE"
                />
              </FormGroup>
            </Grid>
            <Grid item xs={4}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={outrankLocked ? true : newParticipationOutrank}
                      onChange={() =>
                        setNewParticipationOutrank(!newParticipationOutrank)
                      }
                      color="primary"
                    />
                  }
                  label="HORS CLASSEMENT"
                />
              </FormGroup>
            </Grid>
            <Grid item xs={4}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newParticipationPaid}
                      onChange={() => setNewParticipationPaid(!newParticipationPaid)}
                      color="primary"
                    />
                  }
                  label="A PAYÉ"
                />
              </FormGroup>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            ANNULER
          </Button>
          <Button
            disabled={!participationDialogFormValid}
            onClick={handleCallback}
            variant="contained"
            color="secondary"
          >
            AJOUTER
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
};

export default ChallengeDisciplineParticipationDialog;
