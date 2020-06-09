import React, { useEffect, useState } from 'react';
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
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { ROUTES } from 'configurations/server.configuration';
import { booleanToText, customTheme } from 'configurations/theme.configuration';
import { GetDisciplineResponse } from 'services/models/discipline.model';
import { ToastVariant } from 'components/toast/toast';
import TableContainer from '@material-ui/core/TableContainer';
import {
  CreateDisciplineParticipationRequest,
  CreateParticipationsRequest,
  Participation,
} from 'services/models/challenge.model';
import ChallengeService from 'services/challenge.service';

type ChallengeDisciplineParticipationProps = {
  challengeId: number;
  disciplines: GetDisciplineResponse[];
  callbackShooterFn: () => Promise<number>
  actions: {
    error: (message: string) => any;
    openToast: (message: string, variant: ToastVariant) => any;
    push: (path: string, state?: any | undefined) => any;
  };
};

const ChallengeDisciplineParticipation = (props: ChallengeDisciplineParticipationProps) => {
  const [formSent, setFormSent] = useState(false);

  const [availableDisciplines, setAvailableDisciplines] = useState(props.disciplines);
  const [participations, setParticipations] = useState<Participation[]>([]);

  useEffect(() => {
    if (formSent) {
      const participationsPayload: CreateDisciplineParticipationRequest[] = participations.map(
        participation => ({
          // FIXME -1 -> Select properly
          disciplineId: props.disciplines.find(discipline => discipline.label === participation.discipline)?.id ?? -1,
          useElectronicTarget: participation.useElectronicTarget,
          paid: participation.paid,
          outrank: participation.outrank,
        }));
      props.callbackShooterFn().then(shooterId => {
        const createParticipationsPayload: CreateParticipationsRequest = {
          shooterId: shooterId,
          disciplinesInformation: participationsPayload,
        };
        return ChallengeService.createParticipations(
          props.challengeId,
          createParticipationsPayload
        )
      }).then(response => {
        if (response.status === 201) {
          props.actions.openToast('La tireur a été inscrit au challenge', 'success');
          props.actions.push(`${ROUTES.CHALLENGE.LIST}/${props.challengeId}`);
        } else {
          throw new Error();
        }
      }).catch(() => {
        // TODO Reset full form in case of error
        // FIXME one route for participation + create ?
        props.actions.error("Impossible d'inscrire le tireur");
        setFormSent(false);
      });
    }
  }, [formSent]);

  const [disciplinesValid, setDisciplinesValid] = useState(true);
  const disciplinesFormValid = participations.length > 0;

  const [newParticipationDiscipline, setNewParticipationDiscipline] = useState<string>('');
  const [newParticipationElectronic, setNewParticipationElectronic] = useState(false);
  const [newParticipationOutrank, setNewParticipationOutrank] = useState(false);
  const [newParticipationPaid, setNewParticipationPaid] = useState(false);
  const participationDialogFormValid = !!newParticipationDiscipline;

  const handleNewParticipationDisciplineChange = (event: any) => {
    const newValue = event.target.value;
    setNewParticipationDiscipline(newValue);
  };

  const handleNewParticipationCreation = () => {
    if (newParticipationDiscipline) {
      const newParticipation: Participation = {
        discipline: newParticipationDiscipline,
        useElectronicTarget: newParticipationElectronic,
        outrank: newParticipationOutrank,
        paid: newParticipationPaid,
      };
      setDisciplinesValid(true);
      setParticipations([...participations, newParticipation]);
      if (!newParticipationOutrank) {
        setAvailableDisciplines(
          availableDisciplines.filter(
            availableDiscipline => availableDiscipline.label !== newParticipationDiscipline
          )
        );
      }
      setNewParticipationDiscipline('');
      setNewParticipationElectronic(false);
      setNewParticipationOutrank(false);
      setNewParticipationPaid(false);
    }
    setOpen(false);
  };

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  if (props.disciplines.length === 0) {
    // TODO spinner (with message ?)
    return null;
  } else {
    return (
      <Box display="flex" justifyContent="center" pt={2}>
        <Box display="flex" width={0.6}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12}>
              <Typography variant="h6">
                AJOUTER LES DISCIPLINES À L'INSCRIPTION DU TIREUR
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Button
                disabled={availableDisciplines.length === 0}
                variant="contained"
                color="secondary"
                onClick={handleClickOpen}
              >
                AJOUTER
              </Button>

              <Dialog fullWidth maxWidth="md" open={open} onClose={handleClose}>
                <DialogTitle>AJOUTER UNE DISCIPLINE</DialogTitle>
                <DialogContent>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12}>
                      <FormControl required fullWidth error={!disciplinesValid}>
                        <InputLabel>Discipline</InputLabel>
                        <Select
                          value={newParticipationDiscipline}
                          onChange={handleNewParticipationDisciplineChange}
                          renderValue={customTheme.selectSimpleRender}
                        >
                          {availableDisciplines.map(discipline => (
                            <MenuItem key={discipline.id} value={discipline.label}>
                              {discipline.label}
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
                              checked={newParticipationOutrank}
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
                    onClick={handleNewParticipationCreation}
                    variant="contained"
                    color="secondary"
                  >
                    AJOUTER
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>
            <Grid item xs={10}>
              <Box fontStyle="italic">
                <Typography variant="body2" hidden={availableDisciplines.length > 0}>
                  * Le tireur est inscrit et classé à toutes les disciplines proposées par le challenge
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table stickyHeader>
                  <colgroup>
                    <col width={0.3} />
                    <col width={0.2} />
                    <col width={0.2} />
                    <col width={0.2} />
                    <col width={0.1} />
                  </colgroup>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">DISCIPLINE</TableCell>
                      <TableCell align="center">CIBLE ÉLECTRONIQUE</TableCell>
                      <TableCell align="center">HORS CLASSEMENT</TableCell>
                      <TableCell align="center">A PAYÉ</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {participations.map(participation => (
                      <TableRow key={participation.discipline}>
                        <TableCell align="center">{participation.discipline}</TableCell>
                        <TableCell align="center">
                          {booleanToText(participation.useElectronicTarget)}
                        </TableCell>
                        <TableCell align="center">
                          {booleanToText(participation.outrank)}
                        </TableCell>
                        <TableCell align="center">
                          {booleanToText(participation.paid)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item container spacing={2} justify="flex-end" alignItems="center">
              <Grid item>
                <Button
                  variant="outlined"
                  component={Link}
                  to={`${ROUTES.CHALLENGE.LIST}/${props.challengeId}`}
                >
                  ANNULER
                </Button>
              </Grid>
              <Grid>
                <Button
                  disabled={!disciplinesFormValid}
                  variant="contained"
                  color="secondary"
                  type="button"
                  onClick={() => setFormSent(true)}
                >
                  VALIDER L'INSCRIPTION
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  }
};

export default ChallengeDisciplineParticipation;
