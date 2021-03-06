import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText, Paper,
  Typography,
} from '@material-ui/core';
import { GetChallengeListElementResponse } from 'services/models/challenge.model';
import ChallengeService from 'services/challenge.service';
// @ts-ignore
import useInfiniteScroll from '@closeio/use-infinite-scroll';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import { formatString } from '../../../utils/date.utils';
import { makeStyles } from '@material-ui/core/styles';
import { ROUTES } from '../../../configurations/server.configuration';
import LogoIcon from '../../svg/logo-icon';

type ResultsProps = {
  actions: {
    error: (message: string) => any;
    push: (path: string, state?: any | undefined) => any;
  };
};

const ResultsListMobile = (props: ResultsProps) => {
  const useStyles = makeStyles(theme => ({
    scroller: {
      "max-height": "90vh",
      "overflow-y": "auto"
    },
    alternateColor: {
      "background": "white"
    }
  }));
  const classes = useStyles();

  const [infiniteItems, setInfiniteItems] = useState<GetChallengeListElementResponse[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [page, loaderRef, scrollerRef] = useInfiniteScroll({ hasMore, distance: 20 });

  useEffect(() => {
    ChallengeService.getChallenges(5, page)
      .then(response => {
        if (response.status === 200) {
          const realPage = page + 1;
          setHasMore(realPage * 5 <= response.data.totalElements);
          setInfiniteItems([...infiniteItems, ...response.data.content]);
        }
      })
      .catch(() => {
        props.actions.error('Impossible de récupérer la liste des challenges');
      });
  }, [page]);

  return (
    <>
      <Box display="flex" flexDirection="column" width={1}>
        <Paper elevation={2}>
          <Box display="flex" pt={1} pb={1}>
            <Box display="flex" flexShrink={1} pl={1}>
              <LogoIcon height="3rem" width="3rem" />
            </Box>
            <Box display="flex" width={1} justifyContent="center" alignItems="center" flexDirection="column">
              <Typography variant="subtitle1">
                Résultats
              </Typography>
              <Typography variant="body2">
                Liste des challenges
              </Typography>
            </Box>
          </Box>
        </Paper>
        <List ref={scrollerRef} className={classes.scroller}>
          {infiniteItems.map((infiniteItemChallenge, index) => (
            <ListItem key={infiniteItemChallenge.id} className={index % 2 === 0 ?  classes.alternateColor : ""}>
              <ListItemText
                primary={
                  <Typography variant="body1" noWrap>
                    {infiniteItemChallenge.name}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2">
                    {formatString(infiniteItemChallenge.startDate, "dd MMMM yyyy")}
                  </Typography>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => props.actions.push(`${ROUTES.RESULTS.LIST}/${infiniteItemChallenge.id}`)}
                >
                  <FormatListNumberedIcon fontSize="large" />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
          {hasMore && <div ref={loaderRef}>
            <Box display="flex" justifyContent="center">
              <CircularProgress color="secondary"/>
            </Box>
          </div>}
        </List>
      </Box>
    </>
  );
};

export default ResultsListMobile;
